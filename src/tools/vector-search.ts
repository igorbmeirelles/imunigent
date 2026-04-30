import { Pinecone } from "@pinecone-database/pinecone";
import { GLOBALS } from "../globals";
import * as z from "zod";
import { tool } from "langchain";

const pc = new Pinecone({
  apiKey: GLOBALS.PINECONE_API_KEY,
});

async function search({ query }: { query: string }) {
  const namespace = pc
    .index(GLOBALS.PINECONE_INDEX_NAME)
    .namespace("__default__");

  const result = await namespace.searchRecords({
    query: {
      topK: 5,
      inputs: { text: query },
    },
    fields: ["chunk_text"],
  });

  return result.result.hits.map((c) =>
    JSON.stringify({
      score: c._score,
      text: (c.fields as Record<string, string>).chunk_text,
    }),
  );
}

search({ query: "o que são vacinas" });
export const vec_search = tool(search, {
  name: "vec_search",
  description: "Queries a vector database with possible answers for questions.",
  schema: z.object({ query: z.string() }),
});
