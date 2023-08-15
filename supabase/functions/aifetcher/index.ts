import { serve } from "http/server.ts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";
import { RetrievalQAChain } from "langchain/chains";
import { corsHeaders } from "../_shared/cors.ts";

const openaikey = Deno.env.get('openaikey');

serve(async (req) => {

  const client = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  if (!client) throw new Error('supabase client was not created as expected')
  console.log("client created")

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();

    const model4 = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-4",
      verbose: true,
      openAIApiKey: openaikey
    });
    const model35 = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      verbose: true,
      openAIApiKey: openaikey
    });

    const embeddings = new OpenAIEmbeddings({openAIApiKey: openaikey});
    console.log("embeddings is created")

    const rulesDocs = new SupabaseHybridSearch(embeddings, {
      client,
      similarityK: 2,
      keywordK: 2,
      tableName: "rules",
      similarityQueryName: "match_rules",
      keywordQueryName: "kw_match_rules",
    });
    const rulesChain = RetrievalQAChain.fromLLM(model4, rulesDocs);
  
    const cardsDocs = new SupabaseHybridSearch(embeddings, {
      client,
      similarityK: 2,
      keywordK: 2,
      tableName: "cards",
      similarityQueryName: "match_cards",
      keywordQueryName: "kw_match_cards",
    });
    const cardsChain = RetrievalQAChain.fromLLM(model4, cardsDocs);

    console.log("vectorstores are created")
    console.log(JSON.stringify({ input }))

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
    }
  );

  const res = await executor.call({
    input: JSON.stringify({input}),
  });
  console.log(JSON.stringify(res))

  return new Response(JSON.stringify(res), {
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