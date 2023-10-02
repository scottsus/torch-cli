import { ChatOpenAI } from 'langchain/chat_models/openai';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import loadContext from './context';
import getPrompt from './prompt';

export default async function useChat() {
  const chat = new ChatOpenAI({
    modelName: `gpt-3.5-turbo-16k`,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
    streaming: true,
    maxTokens: 2048,
  });

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(chat, {
      prompt: getPrompt(),
      // verbose: true,
    }),
    retriever: await loadContext(),
    // returnSourceDocuments: true,
  });

  const runQuery = async (query: string) => {
    await chain.call(
      {
        query: query,
      },
      [
        {
          handleLLMNewToken(token: string) {
            process.stdout.write(token);
          },
        },
      ]
    );
    console.log();
  };

  return runQuery;
}
