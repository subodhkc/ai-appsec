/**
 * Kestrel PARTIAL single-session scan script for Phase 4C-A4.
 * Run: npx tsx scripts/phase-4c-a4-kestrel-session.ts <N>
 */
import { createServer } from '../src/mcp/server-factory.js';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KESTREL_TARGET = 'C:\\ks';
const EVIDENCE_DIR = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4c-a4');

const sessionNum = parseInt(process.argv[2] || '1', 10);

async function main() {
  console.error(`=== Kestrel Session ${sessionNum} (PID ${process.pid}) ===`);
  console.error(`Started at: ${new Date().toISOString()}`);

  const server = createServer();
  const client = new Client(
    { name: `kestrel-session-${sessionNum}`, version: '1.0.0' },
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
  const receipt = sc?.receipt;
  const envelope = sc?.evidenceEnvelope;

  await client.close();
  await server.close();

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${sc?.verdict}`);
  console.error(`Completeness: ${sc?.completeness}`);
  console.error(`Raw matches: ${sc?.summary?.rawEngineMatches ?? 0}`);
  console.error(`Actionable: ${sc?.summary?.actionableFindingInstances ?? 0}`);
  console.error(`Files skipped: ${sc?.summary?.filesSkippedByEngine ?? 0}`);

  const sessionResult = {
    session: sessionNum,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    durationMs: duration,
    scanId: sc?.scanId ?? '',
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    observationInstances: sc?.summary?.observationInstances ?? 0,
    concernFamiliesFound: sc?.securityConcernFamilies?.length ?? 0,
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
    filesSkippedByEngine: sc?.summary?.filesSkippedByEngine ?? 0,
    receipt: receipt ? {
      findingSetDigest: receipt.findingSetDigest,
      concernFamilySetDigest: receipt.concernFamilySetDigest,
      targetedFileSetDigest: receipt.targetedFileSetDigest,
      analyzedFileSetDigest: receipt.analyzedFileSetDigest,
      intentionallyExcludedFileSetDigest: receipt.intentionallyExcludedFileSetDigest,
      parseFailureFileSetDigest: receipt.parseFailureFileSetDigest,
      unsupportedFileSetDigest: receipt.unsupportedFileSetDigest,
      coverageDigest: receipt.coverageDigest,
      evaluatedSecurityCheckSetDigest: receipt.evaluatedSecurityCheckSetDigest,
      evaluatedDetectorSetDigest: receipt.evaluatedDetectorSetDigest,
      semanticReceiptDigest: receipt.semanticReceiptDigest,
      receiptDocumentDigest: receipt.receiptDocumentDigest,
      completeness: receipt.completeness,
      verdict: receipt.verdict,
    } : null,
    evidenceEnvelope: envelope ? {
      schemaVersion: envelope.schemaVersion,
      evidenceStatus: envelope.evidenceStatus,
      semanticReceiptDigest: envelope.semanticReceiptDigest,
      receiptDocumentDigest: envelope.receiptDocumentDigest,
      envelopeDigest: envelope.envelopeDigest,
    } : null,
    rulepackDigest: sc?.versions?.rulepackDigest ?? '',
    manifestDigest: sc?.versions?.manifestDigest ?? '',
    semgrepVersion: sc?.versions?.semgrepVersion ?? '',
  };

  const sessionPath = path.join(EVIDENCE_DIR, `kestrel-session-${sessionNum}.json`);
  fs.writeFileSync(sessionPath, JSON.stringify(sessionResult, null, 2));
  console.error(`Evidence: ${sessionPath}`);
}

main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
