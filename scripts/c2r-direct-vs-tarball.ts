/**
 * C2R Direct vs Actual Tarball Equivalence — runs the ACTUAL INSTALLED
 * npm tarball MCP against the immutable Kestrel snapshot and compares
 * with the direct scanner output.
 *
 * Requires: npm pack + npm install in clean dir already done.
 */
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer as createDirectServer } from '../src/mcp/server-factory.js';
import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const KESTREL_TARGET = 'C:\\ks';
const TARBALL_INSTALL_DIR = 'C:\\haiec-tarball-test';

interface CanonicalScan {
  verdict: string;
  completeness: string;
  rawEngineMatches: number;
  detectorInstancesAccepted: number;
  canonicalFindingInstances: number;
  scopedFindingInstances: number;
  actionableFindingInstances: number;
  observationInstances: number;
  concernFamiliesFound: number;
  concernFamilySetDigest: string;
  evaluatedSecurityCheckSetDigest: string;
  evaluatedDetectorSetDigest: string;
  rulepackDigest: string;
  manifestDigest: string;
  filesAnalyzed: number;
}

function canonicalize(sc: any): CanonicalScan {
  const families = sc?.securityConcernFamilies ?? [];
  const familyCanonical = families
    .map((c: any) => [
      c.concernId, c.securityCheckId, c.findingKind, c.canonicalSeverity,
      c.defaultDisposition, c.instanceCount, c.affectedFileCount,
      c.affectedDetectorCount, c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort().join('\n');
  const concernFamilySetDigest = `sha256:${crypto.createHash('sha256').update(familyCanonical, 'utf-8').digest('hex')}`;

  const evaluatedSecurityCheckIds = (sc?.evaluatedSecurityCheckIds ?? []).slice().sort();
  const evaluatedDetectorIds = (sc?.evaluatedDetectorIds ?? []).slice().sort();
  const evaluatedSecurityCheckSetDigest = `sha256:${crypto.createHash('sha256').update(evaluatedSecurityCheckIds.join(','), 'utf-8').digest('hex')}`;
  const evaluatedDetectorSetDigest = `sha256:${crypto.createHash('sha256').update(evaluatedDetectorIds.join(','), 'utf-8').digest('hex')}`;

  return {
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    detectorInstancesAccepted: sc?.summary?.detectorInstancesAccepted ?? 0,
    canonicalFindingInstances: sc?.summary?.canonicalFindingInstances ?? 0,
    scopedFindingInstances: sc?.summary?.scopedFindingInstances ?? 0,
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    observationInstances: sc?.summary?.observationInstances ?? 0,
    concernFamiliesFound: families.length,
    concernFamilySetDigest,
    evaluatedSecurityCheckSetDigest,
    evaluatedDetectorSetDigest,
    rulepackDigest: sc?.versions?.rulepackDigest ?? '',
    manifestDigest: sc?.versions?.manifestDigest ?? '',
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
  };
}

async function runDirectScanner(): Promise<CanonicalScan> {
  console.error('=== Direct Scanner ===');
  const result = await scanAiSecurity({ targetPath: KESTREL_TARGET, timeout: 300 });
  // Need to get the structured content — use MCP server
  const server = createDirectServer();
  const client = new Client(
    { name: 'c2r-direct', version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);
  const result2 = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_TARGET, timeout: 300 } },
    { timeout: 600000 } as any,
  );
  await client.close();
  return canonicalize((result2 as any).structuredContent);
}

async function runTarballScanner(): Promise<CanonicalScan> {
  console.error('=== Tarball Scanner ===');
  // Import the ACTUAL INSTALLED tarball's server factory
  const tarballPath = path.join(TARBALL_INSTALL_DIR, 'node_modules', 'haiec-agent-security', 'dist', 'mcp', 'server-factory.js');
  const tarballModule = await import(url.pathToFileURL(tarballPath).href);
  const createTarballServer = tarballModule.createServer;

  const server = createTarballServer();
  const client = new Client(
    { name: 'c2r-tarball', version: '1.0.0' },
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

  return canonicalize((result as any).structuredContent);
}

async function main(): Promise<void> {
  console.error('=== C2R Direct vs Actual Tarball Equivalence ===');
  console.error(`Target: ${KESTREL_TARGET}`);

  const direct = await runDirectScanner();
  console.error(`Direct: verdict=${direct.verdict}, actionable=${direct.actionableFindingInstances}, families=${direct.concernFamiliesFound}`);

  const tarball = await runTarballScanner();
  console.error(`Tarball: verdict=${tarball.verdict}, actionable=${tarball.actionableFindingInstances}, families=${tarball.concernFamiliesFound}`);

  // Compare all fields
  const fields: Array<{ name: string; direct: any; tarball: any; match: boolean }> = [
    { name: 'verdict', direct: direct.verdict, tarball: tarball.verdict, match: direct.verdict === tarball.verdict },
    { name: 'completeness', direct: direct.completeness, tarball: tarball.completeness, match: direct.completeness === tarball.completeness },
    { name: 'rawEngineMatches', direct: direct.rawEngineMatches, tarball: tarball.rawEngineMatches, match: direct.rawEngineMatches === tarball.rawEngineMatches },
    { name: 'detectorInstancesAccepted', direct: direct.detectorInstancesAccepted, tarball: tarball.detectorInstancesAccepted, match: direct.detectorInstancesAccepted === tarball.detectorInstancesAccepted },
    { name: 'canonicalFindingInstances', direct: direct.canonicalFindingInstances, tarball: tarball.canonicalFindingInstances, match: direct.canonicalFindingInstances === tarball.canonicalFindingInstances },
    { name: 'scopedFindingInstances', direct: direct.scopedFindingInstances, tarball: tarball.scopedFindingInstances, match: direct.scopedFindingInstances === tarball.scopedFindingInstances },
    { name: 'actionableFindingInstances', direct: direct.actionableFindingInstances, tarball: tarball.actionableFindingInstances, match: direct.actionableFindingInstances === tarball.actionableFindingInstances },
    { name: 'observationInstances', direct: direct.observationInstances, tarball: tarball.observationInstances, match: direct.observationInstances === tarball.observationInstances },
    { name: 'concernFamiliesFound', direct: direct.concernFamiliesFound, tarball: tarball.concernFamiliesFound, match: direct.concernFamiliesFound === tarball.concernFamiliesFound },
    { name: 'concernFamilySetDigest', direct: direct.concernFamilySetDigest, tarball: tarball.concernFamilySetDigest, match: direct.concernFamilySetDigest === tarball.concernFamilySetDigest },
    { name: 'evaluatedSecurityCheckSetDigest', direct: direct.evaluatedSecurityCheckSetDigest, tarball: tarball.evaluatedSecurityCheckSetDigest, match: direct.evaluatedSecurityCheckSetDigest === tarball.evaluatedSecurityCheckSetDigest },
    { name: 'evaluatedDetectorSetDigest', direct: direct.evaluatedDetectorSetDigest, tarball: tarball.evaluatedDetectorSetDigest, match: direct.evaluatedDetectorSetDigest === tarball.evaluatedDetectorSetDigest },
    { name: 'rulepackDigest', direct: direct.rulepackDigest, tarball: tarball.rulepackDigest, match: direct.rulepackDigest === tarball.rulepackDigest },
    { name: 'manifestDigest', direct: direct.manifestDigest, tarball: tarball.manifestDigest, match: direct.manifestDigest === tarball.manifestDigest },
    { name: 'filesAnalyzed', direct: direct.filesAnalyzed, tarball: tarball.filesAnalyzed, match: direct.filesAnalyzed === tarball.filesAnalyzed },
  ];

  const allMatch = fields.every(f => f.match);

  // Tarball SHA-256
  const tarballPath = path.resolve(__dirname, '..', 'haiec-agent-security-0.0.0.tgz');
  const tarballHash = fs.existsSync(tarballPath)
    ? `sha256:${crypto.createHash('sha256').update(fs.readFileSync(tarballPath)).digest('hex')}`
    : 'unknown';

  const report = {
    target: '<KESTREL_EXPORT>',
    corpus: {
      commit: '0f131ea63c477e1da5fee318095c3aee761eb628',
      exportMethod: 'git worktree add --detach C:\\ks',
    },
    tarball: {
      path: 'haiec-agent-security-0.0.0.tgz',
      sha256: tarballHash,
      installDir: TARBALL_INSTALL_DIR,
    },
    direct: direct,
    tarball: tarball,
    comparison: {
      allFieldsMatch: allMatch,
      fieldResults: fields,
    },
    conclusion: allMatch
      ? 'EXACT_MATCH — direct scanner and actual installed npm tarball produce identical semantic output'
      : 'MISMATCH — direct scanner and tarball differ',
  };

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'direct-vs-tarball-equivalence.json');
  fs.writeFileSync(evidencePath, JSON.stringify(report, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`\n=== Direct vs Tarball Equivalence ===`);
  console.error(`All fields match: ${allMatch}`);
  console.error(`Tarball SHA-256: ${tarballHash}`);
  if (!allMatch) {
    console.error(`Non-matching fields:`);
    for (const f of fields.filter(f => !f.match)) {
      console.error(`  ${f.name}: direct=${f.direct} tarball=${f.tarball}`);
    }
  }
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
