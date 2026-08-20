/**
 * Golden corpus export — deterministically copies the canonical source corpus
 * to an isolated temporary directory outside repository context.
 * Verifies goldenCorpusSourceDigest == goldenCorpusExportDigest.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { createHash } from 'node:crypto';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SOURCE_CORPUS = path.resolve(__dirname, '..', 'tests', 'fixtures', 'complete-golden-corpus');

function walkAndHash(root: string): { files: string[]; digest: string } {
  const files: string[] = [];
  const stack: string[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(root, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(relPath);
      }
    }
  }
  files.sort();
  // Hash: concatenation of relative path + file content for each file
  const hash = createHash('sha256');
  for (const rel of files) {
    const content = fs.readFileSync(path.join(root, rel));
    hash.update(rel + '\0' + content.length + '\0');
    hash.update(content);
  }
  return { files, digest: `sha256:${hash.digest('hex')}` };
}

function copyDir(src: string, dst: string) {
  fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function main() {
  const sourceResult = walkAndHash(SOURCE_CORPUS);
  console.error(`Source corpus: ${sourceResult.files.length} files`);
  console.error(`Source digest: ${sourceResult.digest}`);

  // Export to temp dir outside repo
  const exportDir = path.join(os.tmpdir(), `haiec-golden-corpus-${Date.now()}`);
  fs.mkdirSync(exportDir, { recursive: true });
  copyDir(SOURCE_CORPUS, exportDir);

  const exportResult = walkAndHash(exportDir);
  console.error(`Export corpus: ${exportResult.files.length} files`);
  console.error(`Export digest: ${exportResult.digest}`);

  const match = sourceResult.digest === exportResult.digest;
  console.error(`Digests match: ${match}`);

  if (!match) {
    console.error('FATAL: Source and export digests differ!');
    fs.rmSync(exportDir, { recursive: true, force: true });
    process.exit(1);
  }

  // Write export path to stdout for the session script to pick up
  console.log(exportDir);
}

main();
