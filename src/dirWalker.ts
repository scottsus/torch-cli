import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

export default function walkDir(
  rootDir: string,
  processFile: (filePath: string) => void
) {
  const filter = getGitIgnoreFilter(rootDir);
  if (!filter) {
    return;
  }

  walkDirRecursive(rootDir, processFile, filter);
}

function walkDirRecursive(
  rootDir: string,
  processFile: (filePath: string) => void,
  gitIgnores: (file: string) => boolean
) {
  fs.readdir(rootDir, (err, files) => {
    if (err) {
      console.log(`Unable to read directory ${rootDir}:`, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(rootDir, file);

      if (gitIgnores(fullPath)) {
        return;
      }

      fs.stat(fullPath, (err, stat) => {
        if (err) {
          console.error(`Unable to stat path ${fullPath}:`, err);
          return;
        }

        if (stat.isDirectory()) {
          // Don't include hidden folders like .git
          const folder = file;
          if (folder.startsWith(`.`)) {
            return;
          }
          walkDirRecursive(fullPath, processFile, gitIgnores);
        } else {
          // isFile()
          processFile(fullPath);
        }
      });
    });
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
