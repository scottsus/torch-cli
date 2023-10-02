import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import walkDir from './dirWalker';

export default async function loadContext() {
  const start = performance.now();

  const rawTextArr = walkDir(process.cwd());
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 400,
  });
  const docs = await textSplitter.createDocuments(rawTextArr);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      modelName: `code-search-ada-code-001`,
    })
  );

  const end = performance.now();
  console.log(
    `Embedded ${rawTextArr.length} documents in ${(
      (end - start) /
      1000
    ).toFixed(3)}s`
  );

  return vectorStore.asRetriever();
}
