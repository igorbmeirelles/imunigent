import * as z from "zod";
import * as dotenv from "dotenv";
dotenv.config();

const GLOBALS_SCHEME = z.object({
  PINECONE_API_KEY: z.string(),
  PINECONE_INDEX_NAME: z.string(),
  OPENAI_API_KEY: z.string(),
  DOCUMENT_SPLIT_SIZE: z.number(),
  DOCUMENT_SPLIT_OVERLAP: z.number(),
});

export const GLOBALS = GLOBALS_SCHEME.parse({
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DOCUMENT_SPLIT_SIZE: 500,
  DOCUMENT_SPLIT_OVERLAP: 80,
});
