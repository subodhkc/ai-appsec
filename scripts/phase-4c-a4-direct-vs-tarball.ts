/**
 * Direct vs Final Tarball comparison for Phase 4C-A4.
 * Tests COMPLETE_GOLDEN_CORPUS and Kestrel.
 */
import { createServer } from '../src/mcp/server-factory.js';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPLETE_CORPUS = 'C:\\haiec-golden-corpus';
const EVIDENCE_DIR = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4c-a4');

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
    targetedFileSetDigest: r?.targetedFileSetDigest ?? '',
    analyzedFileSetDigest: r?.analyzedFileSetDigest ?? '',
    parseFailureFileSetDigest: r?.parseFailureFileSetDigest ?? '',
    coverageDigest: r?.coverageDigest ?? '',
    semanticReceiptDigest: r?.semanticReceiptDigest ?? '',
    envelopeDigest: sc?.evidenceEnvelope?.envelopeDigest ?? '',
  };
}

async function main() {
  console.error('=== Direct vs Final Tarball (COMPLETE corpus) ===');
  const directSc = await scanWithDirect(COMPLETE_CORPUS);
  const direct = extractSemantic(directSc);
  console.error('Direct:', direct.verdict, direct.completeness, direct.rawEngineMatches);

  const tarballSc = await scanWithTarball(COMPLETE_CORPUS);
  const tarball = extractSemantic(tarballSc);
  console.error('Tarball:', tarball.verdict, tarball.completeness, tarball.rawEngineMatches);

  const fields = ['verdict','completeness','rawEngineMatches','findingSetDigest','concernFamilySetDigest','targetedFileSetDigest','analyzedFileSetDigest','parseFailureFileSetDigest','coverageDigest','semanticReceiptDigest','envelopeDigest'];
  const comparison: any = {};
  for (const f of fields) {
    comparison[f] = (direct as any)[f] === (tarball as any)[f];
  }
  const allMatch = Object.values(comparison).every((v) => v === true);

  const result = {
    phase: '4C-A4',
    artifact: 'DIRECT-VS-FINAL-TARBALL',
    generatedAt: new Date().toISOString(),
    corpus: 'COMPLETE_GOLDEN_CORPUS',
    direct,
    tarball,
    comparison,
    EXACT_SEMANTIC_MATCH: allMatch,
  };

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'DIRECT-VS-FINAL-TARBALL.json'), JSON.stringify(result, null, 2));
  console.error(`EXACT_SEMANTIC_MATCH: ${allMatch}`);
}

main().catch(console.error);
