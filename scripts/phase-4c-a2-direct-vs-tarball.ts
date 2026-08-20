/**
 * Direct vs Tarball comparison — scans Kestrel with both the direct source
 * and the clean-installed tarball, then compares semantic fields.
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
const EVIDENCE_DIR = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4c-a2');

async function scanWithDirect(): Promise<any> {
  const server = createServer();
  const client = new Client(
    { name: 'direct-test', version: '1.0.0' },
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

async function scanWithTarball(): Promise<any> {
  // Find the tarball installation
  const tmpBase = path.join(process.env.TEMP || '/tmp', 'haiec-tarball-test');
  // We need to find the tarball install dir — use the most recent one
  const tmpDir = process.env.HAIEC_TARBALL_TEST_DIR;
  if (!tmpDir) {
    throw new Error('HAIEC_TARBALL_TEST_DIR not set');
  }

  // Import from the tarball installation
  const tarballPath = path.resolve(tmpDir, 'node_modules', 'haiec-agent-security', 'dist', 'mcp', 'server-factory.js');
  const { createServer: createServerTarball } = await import(url.pathToFileURL(tarballPath).href);

  const server = createServerTarball();
  const client = new Client(
    { name: 'tarball-test', version: '1.0.0' },
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

function extractSemanticFields(sc: any) {
  const families = sc?.securityConcernFamilies ?? [];
  const familyCanonical = families
    .map((c: any) => [
      c.concernId, c.securityCheckId, c.findingKind, c.canonicalSeverity,
      c.defaultDisposition, c.instanceCount, c.affectedFileCount,
      c.affectedDetectorCount, c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort().join('\n');
  const concernFamilySetDigest = `sha256:${crypto.createHash('sha256').update(familyCanonical, 'utf-8').digest('hex')}`;

  const findings = sc?.actionableFindings ?? [];
  const findingCanonical = findings
    .map((f: any) => [
      f.securityCheckId, f.relativePath, f.startLine, f.evidenceHash,
      f.findingKind, f.canonicalSeverity, f.defaultDisposition, f.scope,
    ].join('|'))
    .sort().join('\n');
  const findingSetDigest = `sha256:${crypto.createHash('sha256').update(findingCanonical, 'utf-8').digest('hex')}`;

  return {
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    observationInstances: sc?.summary?.observationInstances ?? 0,
    concernFamiliesFound: families.length,
    findingSetDigest,
    concernFamilySetDigest,
    rulepackDigest: sc?.versions?.rulepackDigest ?? '',
    manifestDigest: sc?.versions?.manifestDigest ?? '',
    semgrepVersion: sc?.versions?.semgrepVersion ?? '',
  };
}

async function main() {
  console.error('=== Direct vs Tarball Comparison ===');

  console.error('\n--- Direct Source Scan ---');
  const directSc = await scanWithDirect();
  const direct = extractSemanticFields(directSc);
  console.error(`Verdict: ${direct.verdict}, Raw: ${direct.rawEngineMatches}, Actionable: ${direct.actionableFindingInstances}`);

  console.error('\n--- Tarball Scan ---');
  const tarballSc = await scanWithTarball();
  const tarball = extractSemanticFields(tarballSc);
  console.error(`Verdict: ${tarball.verdict}, Raw: ${tarball.rawEngineMatches}, Actionable: ${tarball.actionableFindingInstances}`);

  const comparison = {
    phase: '4C-A2',
    artifact: 'direct-vs-tarball-comparison',
    generatedAt: new Date().toISOString(),
    direct: direct,
    tarball: tarball,
    comparison: {
      verdict: direct.verdict === tarball.verdict,
      completeness: direct.completeness === tarball.completeness,
      rawEngineMatches: direct.rawEngineMatches === tarball.rawEngineMatches,
      actionableFindingInstances: direct.actionableFindingInstances === tarball.actionableFindingInstances,
      findingSetDigest: direct.findingSetDigest === tarball.findingSetDigest,
      concernFamilySetDigest: direct.concernFamilySetDigest === tarball.concernFamilySetDigest,
      rulepackDigest: direct.rulepackDigest === tarball.rulepackDigest,
      manifestDigest: direct.manifestDigest === tarball.manifestDigest,
    },
  };

  const allMatch = Object.values(comparison.comparison).every(v => v === true);
  comparison.comparison.EXACT_MATCH = allMatch;

  const reportPath = path.join(EVIDENCE_DIR, 'direct-vs-tarball-comparison.json');
  fs.writeFileSync(reportPath, JSON.stringify(comparison, null, 2));

  console.error(`\n=== Result ===`);
  console.error(`EXACT_MATCH: ${allMatch}`);
  console.error(`findingSetDigest match: ${comparison.comparison.findingSetDigest}`);
  console.error(`concernFamilySetDigest match: ${comparison.comparison.concernFamilySetDigest}`);
  console.error(`Report: ${reportPath}`);
}

main().catch(console.error);
