import walkDir from './dirWalker';

console.log(`Hello there 👋`);

const processFile = (fullPath: string) => {
  console.log(fullPath);
};

walkDir(process.cwd(), processFile);
