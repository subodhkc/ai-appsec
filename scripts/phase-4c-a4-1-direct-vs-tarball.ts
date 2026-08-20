/**
 * Direct vs Final Tarball comparison for Phase 4C-A4.1.
 * Uses exported COMPLETE_GOLDEN_CORPUS.
 */
import { createServer } from '../src/mcp/server-factory.js';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { createHash } from 'node:crypto';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SOURCE_CORPUS = path.resolve(__dirname, '..', 'tests', 'fixtures', 'complete-golden-corpus');
const EVIDENCE_DIR = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4c-a4-1');

function walkAndHash(root: string): string {
  const files: string[] = [];
  const stack: string[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(root, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) files.push(relPath);
    }
  }
  files.sort();
  const hash = createHash('sha256');
  for (const rel of files) {
    const content = fs.readFileSync(path.join(root, rel));
    hash.update(rel + '\0' + content.length + '\0');
    hash.update(content);
  }
  return `sha256:${hash.digest('hex')}`;
}

function copyDir(src: string, dst: string) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, dstPath);
    else if (entry.isFile()) fs.copyFileSync(srcPath, dstPath);
  }
}

async function scanWithDirect(target: string) {
  const server = createServer();
  const client = new Client({ name: 'direct', version: '1.0.0' }, { capabilities: {}, timeout: 120000 } as any);
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);
  const result = await client.callTool({ name: 'scan_ai_security', arguments: { targetPath: target, timeout: 60 } }, { timeout: 120000 } as any);
  await client.close();
  await server.close();
  return (result as any).structuredContent;
}

async function scanWithTarball(target: string) {
  const tmpDir = process.env.HAIEC_TARBALL_TEST_DIR;
  if (!tmpDir) throw new Error('HAIEC_TARBALL_TEST_DIR not set');
  const tarballPath = path.resolve(tmpDir, 'node_modules', 'haiec-agent-security', 'dist', 'mcp', 'server-factory.js');
  const { createServer: createServerTarball } = await import(url.pathToFileURL(tarballPath).href);
  const server = createServerTarball();
  const client = new Client({ name: 'tarball', version: '1.0.0' }, { capabilities: {}, timeout: 120000 } as any);
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);
  const result = await client.callTool({ name: 'scan_ai_security', arguments: { targetPath: target, timeout: 60 } }, { timeout: 120000 } as any);
  await client.close();
  await server.close();
  return (result as any).structuredContent;
}

function extractSemantic(sc: any) {
  const r = sc?.receipt;
  return {
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    findingSetDigest: r?.findingSetDigest ?? '',
    concernFamilySetDigest: r?.concernFamilySetDigest ?? '',
    discoveredFileSetDigest: r?.discoveredFileSetDigest ?? '',
    targetedFileSetDigest: r?.targetedFileSetDigest ?? '',
    engineReportedScannedFileSetDigest: r?.engineReportedScannedFileSetDigest ?? '',
    parseFailureFileSetDigest: r?.parseFailureFileSetDigest ?? '',
    successfullyAnalyzedFileSetDigest: r?.successfullyAnalyzedFileSetDigest ?? '',
    coverageDigest: r?.coverageDigest ?? '',
    semanticReceiptDigest: r?.semanticReceiptDigest ?? '',
    envelopeDigest: sc?.evidenceEnvelope?.envelopeDigest ?? '',
  };
}

async function main() {
  // Export corpus
  const sourceDigest = walkAndHash(SOURCE_CORPUS);
  const exportDir = path.join(os.tmpdir(), `haiec-dvt-${Date.now()}`);
  fs.mkdirSync(exportDir, { recursive: true });
  copyDir(SOURCE_CORPUS, exportDir);
  const exportDigest = walkAndHash(exportDir);
  console.error('Source digest:', sourceDigest);
  console.error('Export digest:', exportDigest);
  console.error('Match:', sourceDigest === exportDigest);

  console.error('=== Direct vs Final Tarball ===');
  const directSc = await scanWithDirect(exportDir);
  const direct = extractSemantic(directSc);
  console.error('Direct:', direct.verdict, direct.completeness, direct.rawEngineMatches);

  const tarballSc = await scanWithTarball(exportDir);
  const tarball = extractSemantic(tarballSc);
  console.error('Tarball:', tarball.verdict, tarball.completeness, tarball.rawEngineMatches);

  const fields = ['verdict','completeness','rawEngineMatches','findingSetDigest','concernFamilySetDigest','discoveredFileSetDigest','targetedFileSetDigest','engineReportedScannedFileSetDigest','parseFailureFileSetDigest','successfullyAnalyzedFileSetDigest','coverageDigest','semanticReceiptDigest','envelopeDigest'];
  const comparison: any = {};
  for (const f of fields) {
    comparison[f] = (direct as any)[f] === (tarball as any)[f];
  }
  const allMatch = Object.values(comparison).every((v) => v === true);

  const result = {
    phase: '4C-A4.1',
    artifact: 'DIRECT-VS-FINAL-TARBALL',
    generatedAt: new Date().toISOString(),
    corpus: 'COMPLETE_GOLDEN_CORPUS',
    goldenCorpusSourceDigest: sourceDigest,
    goldenCorpusExportDigest: exportDigest,
    goldenCorpusDigestsMatch: sourceDigest === exportDigest,
    direct,
    tarball,
    comparison,
    EXACT_SEMANTIC_MATCH: allMatch,
  };

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'DIRECT-VS-FINAL-TARBALL.json'), JSON.stringify(result, null, 2));
  console.error(`EXACT_SEMANTIC_MATCH: ${allMatch}`);

  fs.rmSync(exportDir, { recursive: true, force: true });
}

main().catch(console.error);
