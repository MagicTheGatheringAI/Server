import { serve } from "http/server.ts";
import { OpenAIEmbeddings } from "https://esm.sh/langchain/embeddings/openai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22";
import { SupabaseHybridSearch } from "https://esm.sh/langchain/retrievers/supabase";
import { OpenAI } from "https://esm.sh/langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain, loadQARefineChain } from "https://esm.sh/langchain/chains";

import { corsHeaders } from "../_shared/cors.ts";

const openaikey = "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";

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
  const { input } = await req.json();

  const embeddings = new OpenAIEmbeddings({openAIApiKey: openaikey});
  console.log("embeddings is created")
  const rulesRetriever = new SupabaseHybridSearch(embeddings, {
    client: supabase,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: "rules",
    similarityQueryName: "match_rules",
    keywordQueryName: "kw_match_rules",
  });
  const cardsRetriever = new SupabaseHybridSearch(embeddings, {
    client: supabase,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: "cards",
    similarityQueryName: "match_cards",
    keywordQueryName: "kw_match_cards",
  });
  console.log("retriever is created")
  console.log(JSON.stringify({ input }))

  const cardsDocs = await cardsRetriever.getRelevantDocuments(JSON.stringify({ input }));
  const rulesDocs = await rulesRetriever.getRelevantDocuments(JSON.stringify({ input }));
  console.log("docs are found")
  console.log(cardsDocs)
  console.log(rulesDocs)

  const finalDocs = {...cardsDocs, ...rulesDocs}
  const model = new OpenAI({openAIApiKey: openaikey, maxConcurrency: 10 });
  const chain = loadQARefineChain(model);
  const res = await chain.call({
    input_documents: finalDocs,
    question: JSON.stringify({input}),
});

  return new Response(JSON.stringify(res), {
  headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});



// curl -i --location --request POST 'http://localhost:54321/functions/v1/aifetcher' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"input":"tell me how the attack phase works in magic the gathering"}'