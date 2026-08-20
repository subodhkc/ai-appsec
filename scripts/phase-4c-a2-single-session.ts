/**
 * Single-session scan script — run as a separate Node process for
 * cross-session reproducibility testing.
 *
 * Usage: npx tsx scripts/phase-4c-a2-single-session.ts <session-number>
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

const sessionNum = parseInt(process.argv[2] || '1', 10);

async function main() {
  console.error(`=== Single Session ${sessionNum} (PID ${process.pid}) ===`);
  console.error(`Started at: ${new Date().toISOString()}`);

  const server = createServer();
  const client = new Client(
    { name: `single-session-${sessionNum}`, version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const startTime = Date.now();
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_TARGET, timeout: 300 } },
    { timeout: 600000 } as any,
  );
  const duration = Date.now() - startTime;
  const sc = (result as any).structuredContent;

  await client.close();
  await server.close();

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${sc?.verdict}`);
  console.error(`Completeness: ${sc?.completeness}`);
  console.error(`Raw matches: ${sc?.summary?.rawEngineMatches}`);
  console.error(`Actionable: ${sc?.summary?.actionableFindingInstances}`);
  console.error(`Files skipped: ${sc?.summary?.filesSkippedByEngine}`);

  const families = sc?.securityConcernFamilies ?? [];
  const concernFamilyIds = families.map((c: any) => c.concernId).sort();
  const concernFamilyInstanceCounts: Record<string, number> = {};
  for (const c of families) {
    concernFamilyInstanceCounts[c.concernId] = c.instanceCount;
  }

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

  const findings = sc?.actionableFindings ?? [];
  const findingCanonical = findings
    .map((f: any) => [
      f.securityCheckId, f.relativePath, f.startLine, f.evidenceHash,
      f.findingKind, f.canonicalSeverity, f.defaultDisposition, f.scope,
    ].join('|'))
    .sort().join('\n');
  const findingSetDigest = `sha256:${crypto.createHash('sha256').update(findingCanonical, 'utf-8').digest('hex')}`;

  const sessionResult = {
    session: sessionNum,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    durationMs: duration,
    scanId: sc?.scanId ?? '',
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    detectorInstancesAccepted: sc?.summary?.detectorInstancesAccepted ?? 0,
    canonicalFindingInstances: sc?.summary?.canonicalFindingInstances ?? 0,
    suppressedInstances: sc?.summary?.suppressedInstances ?? 0,
    scopedFindingInstances: sc?.summary?.scopedFindingInstances ?? 0,
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    observationInstances: sc?.summary?.observationInstances ?? 0,
    concernFamiliesFound: families.length,
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
    filesSkippedByEngine: sc?.summary?.filesSkippedByEngine ?? 0,
    concernFamilySetDigest,
    findingSetDigest,
    concernFamilyIds,
    concernFamilyInstanceCounts,
    evaluatedSecurityCheckIds,
    evaluatedDetectorIds,
    rulepackDigest: sc?.versions?.rulepackDigest ?? '',
    manifestDigest: sc?.versions?.manifestDigest ?? '',
    semgrepVersion: sc?.versions?.semgrepVersion ?? '',
    completenessReasons: sc?.completenessReasons ?? [],
  };

  const sessionPath = path.join(EVIDENCE_DIR, `independent-process-session-${sessionNum}.json`);
  fs.writeFileSync(sessionPath, JSON.stringify(sessionResult, null, 2));
  console.error(`Evidence: ${sessionPath}`);
}

main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
