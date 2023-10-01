import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import walkDir from './dirWalker';

export default async function loadContext() {
  const rawTextArr = walkDir(process.cwd());

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 400,
  });
  const docs = await textSplitter.createDocuments(rawTextArr);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      modelName: `code-search-ada-code-001`,
    })
  );

  return vectorStore.asRetriever();
}
