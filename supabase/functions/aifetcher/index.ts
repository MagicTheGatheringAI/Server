// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "http/server.ts";
import { ChatOpenAI } from "https://esm.sh/langchain/chat_models/openai";
import { OpenAIEmbeddings } from "https://esm.sh/langchain/embeddings/openai";
import { LLMChain } from "https://esm.sh/langchain/chains";
import { CallbackManager } from "https://esm.sh/langchain/callbacks";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "https://esm.sh/langchain/prompts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21";
import { SupabaseHybridSearch } from "https://esm.sh/langchain/retrievers/supabase";
import { SupabaseVectorStore } from "https://esm.sh/langchain/vectorstores/supabase";
import { OpenAI } from "https://esm.sh/langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain } from "https://esm.sh/langchain/chains";
import { Document } from "https://esm.sh/langchain/document";

import { corsHeaders } from "../_shared/cors.ts";

const openaikey = "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";
const prompt = ChatPromptTemplate.fromPromptMessages([
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

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
  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabase,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
  });
  console.log("retriever is created")
  console.log(JSON.stringify({ input }))
  
  const docs = await retriever.getRelevantDocuments(JSON.stringify({ input }));
  console.log("response is created")

  const llmB = new OpenAI({openAIApiKey: openaikey, maxConcurrency: 10 });
  const chainB = loadQAMapReduceChain(llmB);
  const resB = await chainB.call({
    input_documents: docs,
    question: JSON.stringify({ input }),
});
  return new Response(JSON.stringify(resB), {
  headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});



// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
