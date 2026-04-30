import { Pinecone } from "@pinecone-database/pinecone";
import { GLOBALS } from "../globals";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { randomUUID } from "crypto";
// const pc = new Pinecone({
//   apiKey: GLOBALS.PINECONE_API_KEY,
// });

// const openai = new OpenAI({ apiKey: GLOBALS.OPENAI_API_KEY });
async function convert() {
  const pc = new Pinecone({
    apiKey: GLOBALS.PINECONE_API_KEY,
  });

  const openai = new OpenAI({ apiKey: GLOBALS.OPENAI_API_KEY });

  const chunks = await get_chunks();
  const index = pc.index(GLOBALS.PINECONE_INDEX_NAME).namespace("__default__");

  const mappedChunks = chunks.map((c) => ({
    id: randomUUID().toString(),
    chunk_text: c,
    text: c
  }));
  // const vectors = await Promise.all(
  //     chunks.map(async (chunk, i) => {
  //         const embedding = await openai.embeddings.create({
  //             model: "text-embedding-3-small",
  //             input: chunk,
  //         });

  //         return {
  //             id: `chunk-${i}`,
  //             chunk_text: embedding.data[0]?.embedding,
  //             metadata: { text: chunk },
  //         };
  //     })
  // );

  await index.upsertRecords({ records: mappedChunks });
  console.log(`Ingested ${mappedChunks.length} vectors into Pinecone`);

}
async function get_chunks() {
  const fs = await import("fs");
  const path = await import("path");

  const filePath = path.join(
    "/Users/igormeirelles/.pensu/imunigent/docs/imunizapp.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: GLOBALS.DOCUMENT_SPLIT_SIZE,
    chunkOverlap: GLOBALS.DOCUMENT_SPLIT_OVERLAP,
  });

  const chunks = await splitter.splitText(fileContent);
  console.log(`Split into ${chunks.length} chunks`);

  return chunks;
}
convert()