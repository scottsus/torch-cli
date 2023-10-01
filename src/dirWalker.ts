import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

export default function walkDir(rootDir: string) {
  const filter = getGitIgnoreFilter(rootDir);
  if (!filter) {
    return [];
  }

  const rawTextArr: string[] = [];
  walkDirRecursive(rootDir, rawTextArr, filter);

  return rawTextArr;
}

function walkDirRecursive(
  rootDir: string,
  rawTextArr: string[],
  gitIgnores: (file: string) => boolean
) {
  const files = fs.readdirSync(rootDir);
  files.forEach((file) => {
    const fullPath = path.join(rootDir, file);
    if (gitIgnores(fullPath)) {
      return;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const folder = file;
      if (folder.startsWith(`.`)) {
        return;
      }
      walkDirRecursive(fullPath, rawTextArr, gitIgnores);
    } else {
      if (file === `package-lock.json`) {
        return;
      }

      try {
        const data = fs.readFileSync(fullPath);
        rawTextArr.push(data.toString());
      } catch (err) {
        console.error(`Unable to read file ${fullPath}:`, err);
        return;
      }
    }
  });
}

function getGitIgnoreFilter(
  rootDir: string
): ((file: string) => boolean) | null {
  try {
    const gitIgnorePath = path.join(rootDir, '.gitignore');
    const gitIgnoreFile = fs.readFileSync(gitIgnorePath, `utf-8`);
    const ig = ignore();
    ig.add(gitIgnoreFile);

    return (file) => ig.ignores(path.relative(rootDir, file));
  } catch (err) {
    console.error(`Unable to get .gitignore:`, err);
    return null;
  }
}
