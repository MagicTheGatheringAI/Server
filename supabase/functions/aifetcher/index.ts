import { serve } from "http/server.ts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { corsHeaders } from "../_shared/cors.ts";

const openaikey = Deno.env.get('openaikey');

const promptTemplate = `Use the following pieces of context to answer the question at the end. Make sure information about rulings are in the answer. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}`;

const prompt = PromptTemplate.fromTemplate(promptTemplate);

const prefix =
  "You are a helpful AI assistant. When receiving information from the cards tool, focus on the rulings info to help figure out how cards interact. Only use the information given to answer the questions.";

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const inputpayload = await req.json();
  const client = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  if (!client) throw new Error('supabase client was not created as expected')
  console.log("client created")

  try {
    let rulesDB = "";
    let cardsDB = "";
    let rulesSimilarity = 0;
    let rulesKeyword = 0;
    let cardSimilarity = 0;
    let cardKeyword = 0;
    if (inputpayload.game == "Magic the Gatherning") {
      rulesDB = "rules";
      cardsDB = "cards";
      rulesSimilarity = 2;
      rulesKeyword = 2;
      cardSimilarity = 2;
      cardKeyword = 2;
    } else if (inputpayload.game == "Lorcana") {
      rulesDB = "lorcana_rules";
      cardsDB = "lorcana_cards";
      rulesSimilarity = 2;
      rulesKeyword = 2;
      cardSimilarity = 2;
      cardKeyword = 2;
    } else {
      return new Response(JSON.stringify({ error: "game not defined in request" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const model4 = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-4",
      verbose: true,
      openAIApiKey: openaikey
    });

    const embeddings = new OpenAIEmbeddings({openAIApiKey: openaikey});
    console.log("embeddings is created")

    const rulesDocs = new SupabaseHybridSearch(embeddings, {
      client,
      similarityK: rulesSimilarity,
      keywordK: rulesKeyword,
      tableName: rulesDB,
      similarityQueryName: "match_rules",
      keywordQueryName: "kw_match_rules",
    });
    const rulesChain = RetrievalQAChain.fromLLM(model4, rulesDocs);
  
    const cardsDocs = new SupabaseHybridSearch(embeddings, {
      client,
      similarityK: cardSimilarity,
      keywordK: cardKeyword,
      tableName: cardsDB,
      similarityQueryName: "match_cards",
      keywordQueryName: "kw_match_cards",
    });
    const cardsChain = new RetrievalQAChain({
      combineDocumentsChain: loadQAStuffChain(model4, { prompt }),
      retriever: cardsDocs,
    });

    console.log("vectorstores are created")
    console.log(inputpayload.prompt)

  const rulesChainTool = new ChainTool({
    name: "rules",
    description:
      "Rules QA - useful for when you need to ask questions about the rules of magic the gathering",
    chain: rulesChain,
  });

  const cardsChainTool = new ChainTool({
    name: "cards",
    description:
      "Cards QA - useful for when you need to ask questions about specific cards in magic the gathering",
    chain: cardsChain
  });

  const tools = [
    rulesChainTool,
    cardsChainTool
  ];

  const executor = await initializeAgentExecutorWithOptions(
    tools, model4, {
      agentType: "openai-functions",
      verbose: true,
      agentArgs: {
        prefix,
      },
    }
  );
  const res = await executor.call({
    input: inputpayload.prompt,
    metadata: { referid: inputpayload.referid },
    tags: [inputpayload.referid, inputpayload.game]
  });
  console.log(JSON.stringify(res.output))

  return new Response(JSON.stringify(res.output), {
    status:200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
  } catch (e) {
    console.log(JSON.stringify({ error: e.message }));
    console.trace();
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});



// curl -i --location --request POST 'http://localhost:54321/functions/v1/aifetcher' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"input":"tell me how the attack phase works in magic the gathering"}'