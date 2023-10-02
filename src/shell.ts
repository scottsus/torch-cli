import executor from 'child_process';
import promptSync from 'prompt-sync';
import useChat from './chat';

export default async function runShell() {
  const prompt = promptSync();
  const chat = await useChat();
  // const chat = (cmd: string) => {
  //   return new Promise<void>((resolve) => {
  //     console.log(cmd);
  //   });
  // };

  while (true) {
    const cmdLine = prompt(`🔥 `);
    if (cmdLine.toLowerCase() === `q`) {
      console.log(`\n👋 Goodbye!`);
      return;
    }

    await processCmd(cmdLine, chat);
  }
}

const nonBlockingCommands = [`cd`, `ls`, `cat`, `code`, `vim`, `echo`];
const captureStdout = `| tee -a conv.txt`;

async function processCmd(
  cmdLine: string,
  chat: (query: string) => Promise<void>
) {
  const args = cmdLine.split(` `);
  if (args.length == 0) {
    return;
  }

  const cmd = args[0] || '';

  const isHumanQuery = (cmd: string) => {
    if (/^[A-Z]/.test(cmd)) return true;
    return false;
  };

  if (isHumanQuery(cmd)) {
    const query = cmdLine;
    await chat(query);
    return;
  }

  if (nonBlockingCommands.includes(cmd)) {
    const stdout = executor.execSync(`${cmdLine} ${captureStdout}`);
    console.log(stdout.toString());
  } else {
    executor.exec(
      `tmux split-window -h "trap \'echo \n;
       echo Press ENTER to close.;
       read\' SIGINT SIGTERM;
       ${cmdLine} ${captureStdout}";
      `,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stderr) {
          console.error(stderr.toString());
          return;
        }

        const stdoutStr = stdout.toString();
        stdoutStr && console.log(stdoutStr);
      }
    );
  }
}
