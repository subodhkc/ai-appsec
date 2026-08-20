/**
 * Phase 4C-A: Receipt digest stability test.
 * Verifies that receiptDigest is now stable across runs despite
 * filesSkippedByEngine operational nondeterminism.
 */
import { createServer } from '../src/mcp/server-factory.js';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';

const KESTREL_TARGET = 'C:\\ks';

async function runScan(runNum: number): Promise<{ receiptDigest: string; filesSkipped: number; coverageDigest: string }> {
  console.error(`\n=== Receipt stability run ${runNum} ===`);
  const server = createServer();
  const client = new Client(
    { name: `receipt-stability-${runNum}`, version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_TARGET, timeout: 300 } },
    { timeout: 600000 } as any,
  );
  const sc = (result as any).structuredContent;
  await client.close();

  console.error(`  filesSkipped: ${sc?.summary?.filesSkippedByEngine}`);
  console.error(`  coverageDigest: ${sc?.receipt?.coverageDigest}`);
  console.error(`  receiptDigest: ${sc?.receipt?.receiptDigest}`);

  return {
    receiptDigest: sc?.receipt?.receiptDigest ?? '',
    filesSkipped: sc?.summary?.filesSkippedByEngine ?? 0,
    coverageDigest: sc?.receipt?.coverageDigest ?? '',
  };
}

async function main() {
  console.error('=== Phase 4C-A Receipt Digest Stability Test ===');
  const r1 = await runScan(1);
  const r2 = await runScan(2);

  console.error('\n=== Results ===');
  console.error(`filesSkipped: ${r1.filesSkipped} vs ${r2.filesSkipped} (expected to differ)`);
  console.error(`coverageDigest match: ${r1.coverageDigest === r2.coverageDigest}`);
  console.error(`receiptDigest match: ${r1.receiptDigest === r2.receiptDigest}`);

  if (r1.receiptDigest === r2.receiptDigest) {
    console.error('PASS: Receipt digest is stable despite filesSkippedByEngine nondeterminism');
  } else {
    console.error('FAIL: Receipt digest still varies — investigate remaining nondeterministic fields');
  }
}

main().catch(console.error);
