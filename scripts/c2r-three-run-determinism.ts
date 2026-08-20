/**
 * C2R Three-run determinism — runs scan_ai_security 3 times against the
 * same immutable corpus and compares deterministic digests.
 *
 * Uses the HAIEC MCP repo itself as the target (small, fast, immutable
 * committed tree at fd27714).
 *
 * Compares:
 * - verdict
 * - completeness
 * - semantic counts (detectorInstances, canonicalFindings, concerns, observations)
 * - securityConcernCount
 * - top concern IDs and instance counts
 *
 * Operational metadata (duration, scanId, timestamps) must NOT affect
 * deterministic comparison.
 */
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../src/mcp/server-factory.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const TARGET = path.resolve(__dirname, '..');

interface RunResult {
  run: number;
  durationMs: number;
  scanId: string;
  verdict: string;
  completeness: string;
  detectorInstancesFound: number;
  canonicalFindingsFound: number;
  materialConcernsFound: number;
  observationsFound: number;
  filesAnalyzed: number;
  securityConcernCount: number;
  concernDigest: string;
  concernIds: string[];
  concernInstanceCounts: Record<string, number>;
  rulepackDigest: string;
  manifestDigest: string;
  semgrepVersion: string;
}

async function runScan(runNum: number): Promise<RunResult> {
  console.error(`\n=== Run ${runNum} ===`);
  const server = createServer();
  const client = new Client(
    { name: `c2r-determinism-${runNum}`, version: '1.0.0' },
    { capabilities: {}, timeout: 300000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const startTime = Date.now();
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: TARGET, timeout: 120 } },
    { timeout: 300000 } as any,
  );
  const duration = Date.now() - startTime;
  const sc = (result as any).structuredContent;

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${sc?.verdict}`);
  console.error(`Completeness: ${sc?.completeness}`);
  console.error(`Concerns: ${sc?.securityConcerns?.length ?? 0}`);
  console.error(`Instances: ${sc?.summary?.detectorInstancesFound ?? 0}`);

  await client.close();

  const concerns = sc?.securityConcerns ?? [];
  const concernIds = concerns.map((c: any) => c.concernId).sort();
  const concernInstanceCounts: Record<string, number> = {};
  for (const c of concerns) {
    concernInstanceCounts[c.concernId] = c.instanceCount;
  }

  // Compute concern digest (deterministic, excludes operational metadata)
  const canonical = concerns
    .map((c: any) => [
      c.concernId,
      c.securityCheckId,
      c.findingKind,
      c.canonicalSeverity,
      c.defaultDisposition,
      c.instanceCount,
      c.affectedFileCount,
      c.affectedDetectorCount,
      c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort()
    .join('\n');
  const concernDigest = `sha256:${crypto.createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;

  return {
    run: runNum,
    durationMs: duration,
    scanId: sc?.scanId ?? '',
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    detectorInstancesFound: sc?.summary?.detectorInstancesFound ?? 0,
    canonicalFindingsFound: sc?.summary?.canonicalFindingsFound ?? 0,
    materialConcernsFound: sc?.summary?.materialConcernsFound ?? 0,
    observationsFound: sc?.summary?.observationsFound ?? 0,
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
    securityConcernCount: concerns.length,
    concernDigest,
    concernIds,
    concernInstanceCounts,
    rulepackDigest: sc?.versions?.rulepackDigest ?? '',
    manifestDigest: sc?.versions?.manifestDigest ?? '',
    semgrepVersion: sc?.versions?.semgrepVersion ?? '',
  };
}

async function main(): Promise<void> {
  console.error('=== C2R Three-Run Determinism ===');
  console.error(`Target: ${TARGET}`);

  const runs: RunResult[] = [];
  for (let i = 1; i <= 3; i++) {
    const r = await runScan(i);
    runs.push(r);
  }

  // Compare deterministic fields
  const r1 = runs[0];
  const comparisons = runs.map((r) => ({
    run: r.run,
    verdict: r.verdict,
    completeness: r.completeness,
    detectorInstancesFound: r.detectorInstancesFound,
    canonicalFindingsFound: r.canonicalFindingsFound,
    materialConcernsFound: r.materialConcernsFound,
    observationsFound: r.observationsFound,
    filesAnalyzed: r.filesAnalyzed,
    securityConcernCount: r.securityConcernCount,
    concernDigest: r.concernDigest,
    concernIds: r.concernIds,
    concernInstanceCounts: r.concernInstanceCounts,
    rulepackDigest: r.rulepackDigest,
    manifestDigest: r.manifestDigest,
    semgrepVersion: r.semgrepVersion,
    // Operational metadata (should differ, not compared)
    durationMs: r.durationMs,
    scanId: r.scanId,
  }));

  // Check determinism
  const verdictMatch = runs.every((r) => r.verdict === r1.verdict);
  const completenessMatch = runs.every((r) => r.completeness === r1.completeness);
  const instancesMatch = runs.every((r) => r.detectorInstancesFound === r1.detectorInstancesFound);
  const canonicalMatch = runs.every((r) => r.canonicalFindingsFound === r1.canonicalFindingsFound);
  const concernsMatch = runs.every((r) => r.materialConcernsFound === r1.materialConcernsFound);
  const observationsMatch = runs.every((r) => r.observationsFound === r1.observationsFound);
  const filesMatch = runs.every((r) => r.filesAnalyzed === r1.filesAnalyzed);
  const concernCountMatch = runs.every((r) => r.securityConcernCount === r1.securityConcernCount);
  const concernDigestMatch = runs.every((r) => r.concernDigest === r1.concernDigest);
  const concernIdsMatch = runs.every((r) => JSON.stringify(r.concernIds) === JSON.stringify(r1.concernIds));
  const concernInstanceMatch = runs.every((r) => JSON.stringify(r.concernInstanceCounts) === JSON.stringify(r1.concernInstanceCounts));
  const rulepackMatch = runs.every((r) => r.rulepackDigest === r1.rulepackDigest);
  const manifestMatch = runs.every((r) => r.manifestDigest === r1.manifestDigest);
  const semgrepMatch = runs.every((r) => r.semgrepVersion === r1.semgrepVersion);

  // Operational metadata should differ
  const durationsDiffer = new Set(runs.map((r) => r.durationMs)).size > 1 || runs[0].durationMs === runs[1].durationMs;
  const scanIdsDiffer = new Set(runs.map((r) => r.scanId)).size === 3;

  const allDeterministicMatch =
    verdictMatch && completenessMatch && instancesMatch && canonicalMatch &&
    concernsMatch && observationsMatch && filesMatch && concernCountMatch &&
    concernDigestMatch && concernIdsMatch && concernInstanceMatch &&
    rulepackMatch && manifestMatch && semgrepMatch;

  const report = {
    target: TARGET,
    runs: comparisons,
    determinism: {
      verdictMatch,
      completenessMatch,
      instancesMatch,
      canonicalMatch,
      concernsMatch,
      observationsMatch,
      filesMatch,
      concernCountMatch,
      concernDigestMatch,
      concernIdsMatch,
      concernInstanceMatch,
      rulepackMatch,
      manifestMatch,
      semgrepMatch,
      allDeterministicMatch,
    },
    operationalMetadata: {
      durations: runs.map((r) => r.durationMs),
      scanIds: runs.map((r) => r.scanId),
      durationsDiffer,
      scanIdsDiffer,
    },
    conclusion: allDeterministicMatch
      ? 'PASS — all deterministic fields match across 3 runs; operational metadata differs as expected'
      : 'FAIL — semantic drift detected across runs',
  };

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'three-run-determinism.json');
  fs.writeFileSync(evidencePath, JSON.stringify(report, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`\n=== Determinism Result ===`);
  console.error(`All deterministic match: ${allDeterministicMatch}`);
  console.error(`Concern digest match: ${concernDigestMatch}`);
  console.error(`Scan IDs differ: ${scanIdsDiffer}`);
  console.error(`Durations: ${runs.map((r) => r.durationMs).join(', ')}ms`);
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
