import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC_DIR = path.resolve(import.meta.dirname, '../../src');
const ENGINES_DIR = path.join(SRC_DIR, 'engines');

const ENGINE_DIRS = ['ai-security', 'tenant-isolation', 'llmverify'];

/**
 * Extract import paths from a TypeScript file.
 */
function extractImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports: string[] = [];
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

/**
 * Recursively find all .ts files in a directory.
 */
function findTsFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Tool independence enforcement', () => {
  for (const engine of ENGINE_DIRS) {
    describe(`engine: ${engine}`, () => {
      it('does not import from other engines', () => {
        const engineDir = path.join(ENGINES_DIR, engine);
        const files = findTsFiles(engineDir);
        const otherEngines = ENGINE_DIRS.filter((e) => e !== engine);

        for (const file of files) {
          const imports = extractImports(file);
          for (const imp of imports) {
            for (const other of otherEngines) {
              assert.ok(
                !imp.includes(`/${other}/`),
                `${file} imports from sibling engine ${other}: ${imp} — tool independence violation`
              );
            }
          }
        }
      });

      it('does not import from deploy-security orchestration', () => {
        const engineDir = path.join(ENGINES_DIR, engine);
        const files = findTsFiles(engineDir);

        for (const file of files) {
          const imports = extractImports(file);
          for (const imp of imports) {
            assert.ok(
              !imp.includes('deploy-security'),
              `${file} imports from deploy-security orchestration — engines must not depend on orchestration`
            );
          }
        }
      });
    });
  }

  it('engines directory has exactly 3 engine subdirectories', () => {
    const dirs = fs.readdirSync(ENGINES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    assert.deepEqual(dirs.sort(), ['ai-security', 'llmverify', 'tenant-isolation']);
  });

  it('orchestration/deploy-security is the only orchestration directory', () => {
    const orchDir = path.join(SRC_DIR, 'orchestration');
    if (!fs.existsSync(orchDir)) return;
    const dirs = fs.readdirSync(orchDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    assert.deepEqual(dirs, ['deploy-security']);
  });
});
