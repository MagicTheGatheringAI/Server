import { serve } from "http/server.ts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
//import { loadQAStuffChain, loadQAMapReduceChain, loadQARefineChain, VectorDBQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
//import { OpenAI } from "langchain/llms/openai";
//import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";
//import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { RetrievalQAChain } from "langchain/chains";
import { corsHeaders } from "../_shared/cors.ts";

const openaikey = Deno.env.get('openaikey');

serve(async (req) => {

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  if (!supabase) throw new Error('supabase client was not created as expected')
  console.log("client created")

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();

    const model = new ChatOpenAI({
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
    const rulesChain = RetrievalQAChain.fromLLM(model, rulesDocs);
  
    const cardsDocs = new SupabaseHybridSearch(embeddings, {
      client,
      similarityK: 1,
      keywordK: 1,
      tableName: "cards",
      similarityQueryName: "match_cards",
      keywordQueryName: "kw_match_cards",
    });
    const cardsChain = RetrievalQAChain.fromLLM(model, cardsDocs);

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

  const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
    llm: model,
    tools,
  });

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