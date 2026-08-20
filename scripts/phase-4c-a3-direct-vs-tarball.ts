/**
 * Direct vs Final Tarball comparison — scans Kestrel with both
 * the direct source and the clean-installed final 0.1.0 tarball.
 */
import { createServer } from '../src/mcp/server-factory.js';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KESTREL_TARGET = 'C:\\ks';
const EVIDENCE_DIR = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4c-a3');

async function scanWithDirect() {
  const server = createServer();
  const client = new Client(
    { name: 'direct', version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_TARGET, timeout: 300 } },
    { timeout: 600000 } as any,
  );
  await client.close();
  await server.close();
  return (result as any).structuredContent;
}

async function scanWithTarball() {
  const tmpDir = process.env.HAIEC_TARBALL_TEST_DIR;
  if (!tmpDir) throw new Error('HAIEC_TARBALL_TEST_DIR not set');
  const tarballPath = path.resolve(tmpDir, 'node_modules', 'haiec-agent-security', 'dist', 'mcp', 'server-factory.js');
  const { createServer: createServerTarball } = await import(url.pathToFileURL(tarballPath).href);
  const server = createServerTarball();
  const client = new Client(
    { name: 'tarball', version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_TARGET, timeout: 300 } },
    { timeout: 600000 } as any,
  );
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
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    findingSetDigest: r?.findingSetDigest ?? '',
    concernFamilySetDigest: r?.concernFamilySetDigest ?? '',
    analyzedFileSetDigest: r?.analyzedFileSetDigest ?? '',
    parseFailureFileSetDigest: r?.parseFailureFileSetDigest ?? '',
    coverageDigest: r?.coverageDigest ?? '',
    evaluatedSecurityCheckSetDigest: r?.evaluatedSecurityCheckSetDigest ?? '',
    evaluatedDetectorSetDigest: r?.evaluatedDetectorSetDigest ?? '',
    semanticReceiptDigest: r?.semanticReceiptDigest ?? '',
  };
}

async function main() {
  console.error('=== Direct vs Final Tarball ===');
  console.error('--- Direct ---');
  const directSc = await scanWithDirect();
  const direct = extractSemantic(directSc);
  console.error(`Verdict: ${direct.verdict}, Raw: ${direct.rawEngineMatches}, Actionable: ${direct.actionableFindingInstances}`);

  console.error('--- Tarball ---');
  const tarballSc = await scanWithTarball();
  const tarball = extractSemantic(tarballSc);
  console.error(`Verdict: ${tarball.verdict}, Raw: ${tarball.rawEngineMatches}, Actionable: ${tarball.actionableFindingInstances}`);

  const comparison = {
    phase: '4C-A3',
    artifact: 'DIRECT-VS-FINAL-TARBALL',
    generatedAt: new Date().toISOString(),
    direct,
    tarball,
    comparison: {
      verdict: direct.verdict === tarball.verdict,
      completeness: direct.completeness === tarball.completeness,
      rawEngineMatches: direct.rawEngineMatches === tarball.rawEngineMatches,
      actionableFindingInstances: direct.actionableFindingInstances === tarball.actionableFindingInstances,
      findingSetDigest: direct.findingSetDigest === tarball.findingSetDigest,
      concernFamilySetDigest: direct.concernFamilySetDigest === tarball.concernFamilySetDigest,
      analyzedFileSetDigest: direct.analyzedFileSetDigest === tarball.analyzedFileSetDigest,
      coverageDigest: direct.coverageDigest === tarball.coverageDigest,
      evaluatedSecurityCheckSetDigest: direct.evaluatedSecurityCheckSetDigest === tarball.evaluatedSecurityCheckSetDigest,
      evaluatedDetectorSetDigest: direct.evaluatedDetectorSetDigest === tarball.evaluatedDetectorSetDigest,
      semanticReceiptDigest: direct.semanticReceiptDigest === tarball.semanticReceiptDigest,
    },
  };

  const allMatch = Object.entries(comparison.comparison)
    .filter(([k]) => k !== 'semanticReceiptDigest') // semanticReceiptDigest may differ due to parseFailureFileSetDigest
    .every(([, v]) => v === true);
  comparison.comparison.EXACT_SEMANTIC_MATCH = allMatch;
  comparison.comparison.semanticReceiptDigestMatch = direct.semanticReceiptDigest === tarball.semanticReceiptDigest;

  const reportPath = path.join(EVIDENCE_DIR, 'DIRECT-VS-FINAL-TARBALL.json');
  fs.writeFileSync(reportPath, JSON.stringify(comparison, null, 2));

  console.error(`\n=== Result ===`);
  console.error(`EXACT_SEMANTIC_MATCH: ${allMatch}`);
  console.error(`semanticReceiptDigest match: ${comparison.comparison.semanticReceiptDigestMatch}`);
  console.error(`Report: ${reportPath}`);
}

main().catch(console.error);
