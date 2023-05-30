//TODO make proper import_map.json
import { serve } from "https://deno.land/std/http/server.ts"
import { OpenAIEmbeddings } from "https://esm.sh/langchain/embeddings/openai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";
import { SupabaseHybridSearch } from "https://esm.sh/langchain/retrievers/supabase";
import { OpenAI } from "https://esm.sh/langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain, loadQARefineChain, VectorDBQAChain } from "https://esm.sh/langchain/chains";
import { ChatOpenAI } from "https://esm.sh/langchain/chat_models/openai";
import { PlanAndExecuteAgentExecutor } from "https://esm.sh/langchain/experimental/plan_and_execute";
import { initializeAgentExecutorWithOptions } from "https://esm.sh/langchain/agents";


import { corsHeaders } from "../_shared/cors.ts";

const openaikey = "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";

serve(async (req) => {

  const client = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  if (!client) throw new Error('supabase client was not created as expected')


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
  });

  const embeddings = new OpenAIEmbeddings({openAIApiKey: openaikey});
  console.log("embeddings is created")
  const rulesRetriever = new SupabaseHybridSearch(embeddings, {
    client,
    similarityK: 2,
    keywordK: 2,
    tableName: "rules",
    similarityQueryName: "match_rules",
    keywordQueryName: "kw_match_rules",
  });
  const cardsRetriever = new SupabaseHybridSearch(embeddings, {
    client,
    similarityK: 2,
    keywordK: 2,
    tableName: "cards",
    similarityQueryName: "match_cards",
    keywordQueryName: "kw_match_cards",
  });
  console.log("retrievers is created")
  console.log(JSON.stringify({ input }))

//   const cardsDocs = await cardsRetriever.getRelevantDocuments(JSON.stringify({ input }));
//   const rulesDocs = await rulesRetriever.getRelevantDocuments(JSON.stringify({ input }));
//   console.log("docs are found")
//   console.log(cardsDocs)
//   console.log(rulesDocs)

//   const finalDocs = {...cardsDocs, ...rulesDocs}
//   const model = new OpenAI({openAIApiKey: openaikey, maxConcurrency: 10 });
//   const chain = loadQAMapReduceChain(model);
//   const res = await chain.call({
//     input_documents: finalDocs,
//     question: JSON.stringify({input}),
// });

const rulesChain = new ChainTool({
  name: "rules",
  description:
    "Rules QA - useful for when you need to ask questions about the rules of magic the gathering",
  chain: rulesRetriever,
});

const cardsChain = new ChainTool({
  name: "cards",
  description:
    "Cards QA - useful for when you need to ask questions about specific cards in magic the gathering",
  chain: cardsRetriever,
});

const tools = [
  rulesChain,
  cardsChain
];

const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: model,
  tools,
});

const res = await executor.call({
  input: JSON.stringify({input}),
});

return new Response(JSON.stringify(res), {
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});
} catch (e) {
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