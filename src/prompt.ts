import { ChatPromptTemplate } from 'langchain/prompts';

const systemTemplate = `You are an extremely powerful AI agent that can quickly understand code repositories and explain them to others.
In this conversation, you have context for an entire code repository and you're trying to summarize the purpose of the repo, together with debugging potential issues.
Here is are the files in the repo you are working with:
{context}

Respond with a one sentence introduction, then bullet points of implementation details, then a one sentence closing summary.
If the answer is not in the repo, make sure to explicitly say that you are referencing external sources. Do not break character.
Answer:
`;
const humanTemplate = `{query}`;

export default function getPrompt() {
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [`system`, systemTemplate],
    [`human`, humanTemplate],
  ]);

  return chatPrompt;
}
