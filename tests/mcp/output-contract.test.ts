/**
 * MCP output contract tests — verify scan_ai_security output contains
 * receipt, evidenceEnvelope, and all required fields.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../../src/mcp/server-factory.js';
import { SyntheticTestRulepackProvider } from '../../src/engines/ai-security/rulepack-provider.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function scan(targetPath: string, timeout: number = 60) {
  const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
  const provider = new SyntheticTestRulepackProvider(
    path.join(fixtureDir, 'test-rules.yml'),
    path.join(fixtureDir, 'test-manifest.json'),
  );
  const server = createServer({ rulepackProvider: provider });
  const client = new Client({ name: 'contract-test', version: '1.0.0' }, { capabilities: {} });
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const result = await client.callTool({
    name: 'scan_ai_security',
    arguments: { targetPath, timeout },
  });

  await client.close();
  await server.close();
  return result as any;
}

describe('MCP output contract — scan_ai_security', () => {
  it('output contains summary', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.summary, 'summary must be present');
    assert.ok(typeof sc.summary.filesAnalyzed === 'number');
    assert.ok(typeof sc.summary.rawEngineMatches === 'number');
  });

  it('output contains findings (actionableFindings or observations)', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(Array.isArray(sc.actionableFindings), 'actionableFindings must be an array');
    assert.ok(Array.isArray(sc.observations), 'observations must be an array');
  });

  it('output contains securityConcernFamilies', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(Array.isArray(sc.securityConcernFamilies), 'securityConcernFamilies must be an array');
  });

  it('output contains truncation/accounting', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.truncation, 'truncation must be present');
    assert.ok(typeof sc.truncation.truncated === 'boolean');
  });

  it('output contains limitations', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(Array.isArray(sc.limitations), 'limitations must be an array');
  });

  it('output contains receipt', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.receipt, 'receipt must be present in scan output');
    assert.ok(sc.receipt.semanticReceiptDigest, 'receipt must have semanticReceiptDigest');
    assert.ok(sc.receipt.receiptDocumentDigest, 'receipt must have receiptDocumentDigest');
    assert.ok(sc.receipt.findingSetDigest, 'receipt must have findingSetDigest');
    assert.ok(sc.receipt.concernFamilySetDigest, 'receipt must have concernFamilySetDigest');
    assert.ok(sc.receipt.targetedFileSetDigest, 'receipt must have targetedFileSetDigest');
    assert.ok(sc.receipt.engineReportedScannedFileSetDigest, 'receipt must have engineReportedScannedFileSetDigest');
    assert.ok(sc.receipt.intentionallyExcludedFileSetDigest, 'receipt must have intentionallyExcludedFileSetDigest');
    assert.ok(sc.receipt.parseFailureFileSetDigest, 'receipt must have parseFailureFileSetDigest');
    assert.ok(sc.receipt.unsupportedFileSetDigest, 'receipt must have unsupportedFileSetDigest');
    assert.ok(sc.receipt.coverageDigest, 'receipt must have coverageDigest');
    assert.ok(sc.receipt.evaluatedSecurityCheckSetDigest, 'receipt must have evaluatedSecurityCheckSetDigest');
    assert.ok(sc.receipt.evaluatedDetectorSetDigest, 'receipt must have evaluatedDetectorSetDigest');
    assert.ok(Array.isArray(sc.receipt.evaluatedSecurityCheckIds), 'receipt must have evaluatedSecurityCheckIds array');
    assert.ok(Array.isArray(sc.receipt.evaluatedDetectorIds), 'receipt must have evaluatedDetectorIds array');
  });

  it('output contains evidenceEnvelope', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.evidenceEnvelope, 'evidenceEnvelope must be present');
    assert.ok(sc.evidenceEnvelope.schemaVersion, 'envelope must have schemaVersion');
    assert.ok(sc.evidenceEnvelope.producerId, 'envelope must have producerId');
    assert.strictEqual(sc.evidenceEnvelope.producerType, 'STATIC_SECURITY');
    assert.ok(sc.evidenceEnvelope.semanticReceiptDigest, 'envelope must have semanticReceiptDigest');
    assert.ok(sc.evidenceEnvelope.receiptDocumentDigest, 'envelope must have receiptDocumentDigest');
    assert.ok(sc.evidenceEnvelope.envelopeDigest, 'envelope must have envelopeDigest');
    assert.ok(sc.evidenceEnvelope.semanticReceiptDigest, 'envelope must have semanticReceiptDigest');
  });

  it('receipt values correspond to the SAME scan result (no lossy reconstruction)', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    // Receipt finding counts must match summary
    assert.strictEqual(sc.receipt.findingCounts.actionableTotal, sc.summary.actionableFindingInstances,
      'receipt findingCounts.actionableTotal must match summary.actionableFindingInstances');
    assert.strictEqual(sc.receipt.findingCounts.rawFindingCount, sc.summary.detectorInstancesAccepted,
      'receipt findingCounts.rawFindingCount must match summary.detectorInstancesAccepted');
    // Receipt verdict/completeness must match scan verdict/completeness
    assert.strictEqual(sc.receipt.verdict, sc.verdict, 'receipt verdict must match scan verdict');
    assert.strictEqual(sc.receipt.completeness, sc.completeness, 'receipt completeness must match scan completeness');
  });

  it('PARTIAL + zero visible findings does not imply absence', async () => {
    // Use a target with no matching rules but ensure completeness is not COMPLETE
    // if there are parse errors or other issues
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    // If there are zero findings, the receipt must still capture coverage
    if (sc.actionableFindings.length === 0 && sc.observations.length === 0) {
      assert.ok(sc.receipt.engineReportedScannedFileSetDigest, 'Even with 0 findings, receipt must have engineReportedScannedFileSetDigest');
      assert.ok(sc.receipt.coverageDigest, 'Even with 0 findings, receipt must have coverageDigest');
      // Completeness must not be COMPLETE if coverage is partial
      if (sc.completeness === 'PARTIAL') {
        assert.notStrictEqual(sc.verdict, 'PASS',
          'PARTIAL completeness with 0 findings must not imply PASS (absence is not proven)');
      }
    }
  });

  it('ERROR result still has structured content', async () => {
    // Use invalid path to trigger error
    const r = await scan('C:\\nonexistent-path-12345', 10);
    assert.ok(r.structuredContent, 'ERROR result must have structuredContent');
    assert.strictEqual(r.structuredContent.verdict, 'ERROR');
    assert.strictEqual(r.structuredContent.completeness, 'ERROR');
  });

  it('ERROR result has receipt with ERROR state', async () => {
    const r = await scan('C:\\nonexistent-path-12345', 10);
    const sc = r.structuredContent;
    assert.ok(sc.receipt, 'ERROR result must have a receipt');
    assert.strictEqual(sc.receipt.completeness, 'ERROR', 'Receipt completeness must be ERROR');
    assert.strictEqual(sc.receipt.verdict, 'ERROR', 'Receipt verdict must be ERROR');
    assert.ok(sc.receipt.semanticReceiptDigest, 'ERROR receipt must have semanticReceiptDigest');
    assert.ok(sc.receipt.receiptDocumentDigest, 'ERROR receipt must have receiptDocumentDigest');
    assert.ok(sc.receipt.errorCodes.length > 0, 'ERROR receipt must have error codes');
  });

  it('ERROR result evidence envelope shows NOT_PRODUCED', async () => {
    const r = await scan('C:\\nonexistent-path-12345', 10);
    const sc = r.structuredContent;
    // ERROR results may not have an evidence envelope, or it should show NOT_PRODUCED
    if (sc.evidenceEnvelope) {
      assert.strictEqual(sc.evidenceEnvelope.evidenceStatus, 'NOT_PRODUCED',
        'ERROR evidence envelope must show NOT_PRODUCED');
    }
    // Receipt must still be present even if envelope is not
    assert.ok(sc.receipt, 'ERROR result must have receipt even without envelope');
  });

  it('receipt has no legacy receiptDigest field', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.receipt, 'receipt must be present');
    assert.strictEqual(sc.receipt.receiptDigest, undefined,
      'receiptDigest legacy alias must be removed');
    assert.ok(sc.receipt.semanticReceiptDigest, 'semanticReceiptDigest must be present');
    assert.ok(sc.receipt.receiptDocumentDigest, 'receiptDocumentDigest must be present');
  });

  it('evidence envelope binds to exact receipt', async () => {
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');
    const r = await scan(targetPath);
    const sc = r.structuredContent;
    assert.ok(sc.evidenceEnvelope, 'envelope must be present');
    assert.strictEqual(sc.evidenceEnvelope.semanticReceiptDigest, sc.receipt.semanticReceiptDigest,
      'envelope semanticReceiptDigest must match receipt');
    assert.strictEqual(sc.evidenceEnvelope.receiptDocumentDigest, sc.receipt.receiptDocumentDigest,
      'envelope receiptDocumentDigest must match receipt');
    assert.ok(sc.evidenceEnvelope.envelopeDigest, 'envelope must have its own envelopeDigest');
  });
});

