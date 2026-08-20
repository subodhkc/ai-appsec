import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { collectCoverageFileSets, COVERAGE_CONTRACT_VERSION, SUPPORTED_EXTENSIONS } from '../../src/engines/ai-security/coverage-collector.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'haiec-cov-test-'));
  return dir;
}

function writeFile(root: string, relPath: string, content: string) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

describe('Coverage ontology v0.1.1', () => {
  it('COVERAGE_CONTRACT_VERSION is 0.1.1', () => {
    assert.strictEqual(COVERAGE_CONTRACT_VERSION, '0.1.1');
  });

  it('DISCOVERED = INTENTIONALLY_EXCLUDED + UNSUPPORTED + TARGETED (mutually exclusive)', () => {
    const root = makeTempDir();
    writeFile(root, 'src/app.py', 'x = 1');
    writeFile(root, 'src/app.js', 'const x = 1');
    writeFile(root, 'src/app.ts', 'const x: number = 1');
    writeFile(root, 'src/app.tsx', 'const App = () => <div/>');
    writeFile(root, 'README.md', '# readme');
    writeFile(root, 'data.json', '{}');
    writeFile(root, 'node_modules/pkg/index.js', 'module.exports = 1');

    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');

    // DISCOVERED = all files
    assert.ok(sets.discoveredFilePaths.length >= 7, 'discovered should include all files');

    // Mutually exclusive: no file in two pre-engine categories
    const excludedSet = new Set(sets.intentionallyExcludedFilePaths);
    const unsupportedSet = new Set(sets.unsupportedFilePaths);
    const targetedSet = new Set(sets.targetedFilePaths);

    for (const f of sets.intentionallyExcludedFilePaths) {
      assert.ok(!unsupportedSet.has(f), `excluded file should not be in unsupported: ${f}`);
      assert.ok(!targetedSet.has(f), `excluded file should not be in targeted: ${f}`);
    }
    for (const f of sets.unsupportedFilePaths) {
      assert.ok(!excludedSet.has(f), `unsupported file should not be in excluded: ${f}`);
      assert.ok(!targetedSet.has(f), `unsupported file should not be in targeted: ${f}`);
    }
    for (const f of sets.targetedFilePaths) {
      assert.ok(!excludedSet.has(f), `targeted file should not be in excluded: ${f}`);
      assert.ok(!unsupportedSet.has(f), `targeted file should not be in unsupported: ${f}`);
    }

    // Union = DISCOVERED
    const union = new Set([...excludedSet, ...unsupportedSet, ...targetedSet]);
    assert.strictEqual(union.size, sets.discoveredFilePaths.length,
      'DISCOVERED must equal EXCLUDED + UNSUPPORTED + TARGETED');

    fs.rmSync(root, { recursive: true, force: true });
  });

  it('.py is supported', () => {
    const root = makeTempDir();
    writeFile(root, 'app.py', 'x = 1');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    assert.ok(sets.targetedFilePaths.includes('app.py'), '.py must be targeted');
    assert.ok(!sets.unsupportedFilePaths.includes('app.py'), '.py must not be unsupported');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('.js is supported', () => {
    const root = makeTempDir();
    writeFile(root, 'app.js', 'const x = 1');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    assert.ok(sets.targetedFilePaths.includes('app.js'), '.js must be targeted');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('.ts is supported', () => {
    const root = makeTempDir();
    writeFile(root, 'app.ts', 'const x: number = 1');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    assert.ok(sets.targetedFilePaths.includes('app.ts'), '.ts must be targeted');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('.tsx is supported', () => {
    const root = makeTempDir();
    writeFile(root, 'app.tsx', 'const App = () => <div/>');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    assert.ok(sets.targetedFilePaths.includes('app.tsx'), '.tsx must be targeted');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('unsupported extension is UNSUPPORTED not TARGETED', () => {
    const root = makeTempDir();
    writeFile(root, 'readme.md', '# readme');
    writeFile(root, 'data.json', '{}');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    assert.ok(sets.unsupportedFilePaths.includes('readme.md'), '.md must be unsupported');
    assert.ok(sets.unsupportedFilePaths.includes('data.json'), '.json must be unsupported');
    assert.ok(!sets.targetedFilePaths.includes('readme.md'), '.md must not be targeted');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('node_modules is INTENTIONALLY_EXCLUDED', () => {
    const root = makeTempDir();
    writeFile(root, 'node_modules/pkg/index.js', 'module.exports = 1');
    writeFile(root, 'app.py', 'x = 1');
    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');
    const excludedPaths = sets.intentionallyExcludedFilePaths.map(p => p.replace(/\\/g, '/'));
    assert.ok(excludedPaths.some(p => p.includes('node_modules')), 'node_modules must be excluded');
    assert.ok(!sets.targetedFilePaths.some(p => p.includes('node_modules')), 'node_modules must not be targeted');
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('mixed directory: supported + unsupported + excluded', () => {
    const root = makeTempDir();
    writeFile(root, 'src/app.py', 'x = 1');
    writeFile(root, 'src/app.js', 'const x = 1');
    writeFile(root, 'docs/readme.md', '# readme');
    writeFile(root, 'node_modules/pkg/index.js', 'module.exports = 1');
    writeFile(root, 'config.yml', 'key: value');

    const sets = collectCoverageFileSets(root, [], [], 'PRODUCTION');

    // targeted: .py and .js in src/
    assert.ok(sets.targetedFilePaths.some(p => p.includes('app.py')), 'app.py must be targeted');
    assert.ok(sets.targetedFilePaths.some(p => p.includes('app.js')), 'app.js must be targeted');

    // unsupported: .md and .yml
    assert.ok(sets.unsupportedFilePaths.some(p => p.includes('readme.md')), 'readme.md must be unsupported');
    assert.ok(sets.unsupportedFilePaths.some(p => p.includes('config.yml')), 'config.yml must be unsupported');

    // excluded: node_modules
    assert.ok(sets.intentionallyExcludedFilePaths.some(p => p.includes('node_modules')), 'node_modules must be excluded');

    // unsupported is non-empty
    assert.ok(sets.unsupportedFilePaths.length > 0, 'unsupported must be non-empty for mixed dir');

    fs.rmSync(root, { recursive: true, force: true });
  });

  it('SUCCESSFULLY_ANALYZED = ENGINE_REPORTED_SCANNED - PARSE_FAILED', () => {
    const root = makeTempDir();
    writeFile(root, 'app.py', 'x = 1');
    writeFile(root, 'broken.py', 'def(');

    // Simulate: Semgrep scanned both, parse-failed on broken.py
    const sets = collectCoverageFileSets(
      root,
      ['app.py', 'broken.py'].map(f => path.join(root, f)),
      [path.join(root, 'broken.py')],
      'PRODUCTION',
    );

    assert.ok(sets.engineReportedScannedFilePaths.includes('app.py'), 'app.py must be in scanned');
    assert.ok(sets.engineReportedScannedFilePaths.includes('broken.py'), 'broken.py must be in scanned');
    assert.ok(sets.parseFailureFilePaths.includes('broken.py'), 'broken.py must be in parse failures');
    assert.ok(sets.successfullyAnalyzedFilePaths.includes('app.py'), 'app.py must be successfully analyzed');
    assert.ok(!sets.successfullyAnalyzedFilePaths.includes('broken.py'), 'broken.py must NOT be successfully analyzed');

    // PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED
    const scannedSet = new Set(sets.engineReportedScannedFilePaths);
    for (const f of sets.parseFailureFilePaths) {
      assert.ok(scannedSet.has(f), `parse-failed file must be in scanned: ${f}`);
    }

    fs.rmSync(root, { recursive: true, force: true });
  });

  it('engine sets may overlap (scanned AND parse_failed)', () => {
    const root = makeTempDir();
    writeFile(root, 'broken.js', 'const x = ;');

    const sets = collectCoverageFileSets(
      root,
      [path.join(root, 'broken.js')],
      [path.join(root, 'broken.js')],
      'PRODUCTION',
    );

    // broken.js is in BOTH scanned and parse_failed
    assert.ok(sets.engineReportedScannedFilePaths.includes('broken.js'), 'broken.js must be in scanned');
    assert.ok(sets.parseFailureFilePaths.includes('broken.js'), 'broken.js must be in parse failures');
    // successfully analyzed should be empty
    assert.strictEqual(sets.successfullyAnalyzedFilePaths.length, 0, 'no successfully analyzed files');

    fs.rmSync(root, { recursive: true, force: true });
  });
});
