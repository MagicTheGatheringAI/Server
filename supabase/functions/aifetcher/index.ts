import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createClient } from "@supabase/supabase-js";
import { PromptTemplate } from "langchain/prompts";
import { corsHeaders } from "../_shared/cors.ts";
import { Database } from '../database.types.ts'
import { ChainTool } from "langchain/tools";
import { serve } from "std/server";

const openaikey = Deno.env.get('openaikey');

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const inputpayload = await req.json();
  const client = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  if (!client) throw new Error('supabase client was not created as expected')
  console.log(inputpayload.game)

  const { data, error } = await client
    .from('games')
    .select()
  if (error) throw new Error('unable to pull games db: ' + error)
  console.log(data)
  const gameData = data.find(item => item.game === inputpayload.game)
  console.log(gameData)
  if (!gameData) throw new Error ('game data not able to be parsed')

  try {
    const prompt = PromptTemplate.fromTemplate(gameData.promptTemplate);

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
      similarityK: gameData.rulesSimilarity,
      keywordK: gameData.rulesKeyword,
      tableName: gameData.rules_db,
      similarityQueryName: gameData.rulesSimilarityQueryName,
      keywordQueryName: gameData.rulesKeywordQueryName,
    });
    const rulesChain = RetrievalQAChain.fromLLM(model4, rulesDocs);
  
    const rulesChainTool = new ChainTool({
      name: "rules",
      description:
        "Rules QA - useful for when you need to ask questions about the rules of the game you are asked about",
      chain: rulesChain,
    });

    // PIECES
    let tools: Array<ChainTool>
    if (gameData.pieces_db != null && gameData.piecesSimilarityQueryName != null && gameData.piecesKeywordQueryName != null) {
      const piecesDocs = new SupabaseHybridSearch(embeddings, {
        client,
        similarityK: gameData.piecesSimilarity,
        keywordK: gameData.piecesKeyword,
        tableName: gameData.pieces_db,
        similarityQueryName: gameData.piecesSimilarityQueryName,
        keywordQueryName: gameData.piecesKeywordQueryName,
      });
      const piecesChain = new RetrievalQAChain({
        combineDocumentsChain: loadQAStuffChain(model4, { prompt }),
        retriever: piecesDocs,
      })
      const piecesChainTool = new ChainTool({
        name: "cards",
        description:
          "Cards QA - useful for when you need to ask questions about specific cards or game pieces in the game you are asked about it",
        chain: piecesChain
      });

      tools = [
        rulesChainTool,
        piecesChainTool
      ];
    } else {
      tools = [
        rulesChainTool
      ];
    }

  const prefix = gameData.prefix  
  const executor = await initializeAgentExecutorWithOptions(
    tools, model4, {
      agentType: "openai-functions",
      verbose: true,
      agentArgs: {
        prefix,
      },
    }
  );
  console.log(inputpayload.prompt)
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
  // --data '{"prompt":"tell me how the attack phase works in magic the gathering",
  //          "game":"magic the gathering",}'