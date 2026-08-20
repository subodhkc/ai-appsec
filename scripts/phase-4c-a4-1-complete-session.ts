/**
 * COMPLETE_GOLDEN_CORPUS single-session scan script for Phase 4C-A4.1.
 * Uses deterministically exported corpus.
 * Run: npx tsx scripts/phase-4c-a4-1-complete-session.ts <N>
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

const sessionNum = parseInt(process.argv[2] || '1', 10);

function walkAndHash(root: string): { files: string[]; digest: string } {
  const files: string[] = [];
  const stack: string[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(root, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) { stack.push(fullPath); }
      else if (entry.isFile()) { files.push(relPath); }
    }
  }
  files.sort();
  const hash = createHash('sha256');
  for (const rel of files) {
    const content = fs.readFileSync(path.join(root, rel));
    hash.update(rel + '\0' + content.length + '\0');
    hash.update(content);
  }
  return { files, digest: `sha256:${hash.digest('hex')}` };
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

async function main() {
  console.error(`=== COMPLETE Session ${sessionNum} (PID ${process.pid}) ===`);

  // Compute source digest
  const sourceResult = walkAndHash(SOURCE_CORPUS);
  console.error(`Source digest: ${sourceResult.digest}`);

  // Export to isolated temp dir
  const exportDir = path.join(os.tmpdir(), `haiec-golden-${sessionNum}-${Date.now()}`);
  fs.mkdirSync(exportDir, { recursive: true });
  copyDir(SOURCE_CORPUS, exportDir);

  // Verify export digest
  const exportResult = walkAndHash(exportDir);
  console.error(`Export digest: ${exportResult.digest}`);
  const digestsMatch = sourceResult.digest === exportResult.digest;
  console.error(`Digests match: ${digestsMatch}`);
  if (!digestsMatch) {
    console.error('FATAL: digest mismatch');
    process.exit(1);
  }

  const server = createServer();
  const client = new Client(
    { name: `complete-session-${sessionNum}`, version: '1.0.0' },
    { capabilities: {}, timeout: 120000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const startTime = Date.now();
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: exportDir, timeout: 60 } },
    { timeout: 120000 } as any,
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

  const sessionResult = {
    session: sessionNum,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    durationMs: duration,
    goldenCorpusSourceDigest: sourceResult.digest,
    goldenCorpusExportDigest: exportResult.digest,
    goldenCorpusDigestsMatch: digestsMatch,
    scanId: sc?.scanId ?? '',
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    rawEngineMatches: sc?.summary?.rawEngineMatches ?? 0,
    actionableFindingInstances: sc?.summary?.actionableFindingInstances ?? 0,
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
    receipt: receipt ? {
      findingSetDigest: receipt.findingSetDigest,
      concernFamilySetDigest: receipt.concernFamilySetDigest,
      discoveredFileSetDigest: receipt.discoveredFileSetDigest,
      targetedFileSetDigest: receipt.targetedFileSetDigest,
      intentionallyExcludedFileSetDigest: receipt.intentionallyExcludedFileSetDigest,
      unsupportedFileSetDigest: receipt.unsupportedFileSetDigest,
      engineReportedScannedFileSetDigest: receipt.engineReportedScannedFileSetDigest,
      parseFailureFileSetDigest: receipt.parseFailureFileSetDigest,
      successfullyAnalyzedFileSetDigest: receipt.successfullyAnalyzedFileSetDigest,
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
  };

  const sessionPath = path.join(EVIDENCE_DIR, `complete-session-${sessionNum}.json`);
  fs.writeFileSync(sessionPath, JSON.stringify(sessionResult, null, 2));
  console.error(`Evidence: ${sessionPath}`);

  // Cleanup export dir
  fs.rmSync(exportDir, { recursive: true, force: true });
}

main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
