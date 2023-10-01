import promptSync from 'prompt-sync';
import useChat from './chat';

export default async function runShell() {
  const prompt = promptSync();
  const chat = await useChat();

  while (true) {
    const query = prompt(`🔥 `);
    if (query.toLowerCase() === `q`) {
      console.log(`👋 Goodbye!`);
      return;
    }

    await chat(query);
  }
}
