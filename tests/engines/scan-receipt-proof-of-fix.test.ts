/**
 * Tests for Scan Receipt determinism and proof-of-fix.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildScanReceipt,
  computeFindingSetDigest,
  computeScanInputDigest,
  computeCoverageDigest,
  RECEIPT_VERSION,
} from '../../src/engines/ai-security/scan-receipt.js';
import { compareScans } from '../../src/engines/ai-security/proof-of-fix.js';
import type { ScanResult, ScanVersions } from '../../src/engines/ai-security/scanner.js';
import type { NormalizedFinding } from '../../src/engines/ai-security/types.js';

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    securityCheckId: 'test-check',
    canonicalName: 'Test Check',
    findingKind: 'RISK_SIGNAL',
    canonicalSeverity: 'MEDIUM',
    defaultDisposition: 'REVIEW',
    relativePath: 'src/app.py',
    startLine: 10,
    startColumn: 1,
    endLine: 10,
    endColumn: 20,
    detectorIds: ['test-detector'],
    message: 'Test finding',
    evidenceHash: 'abc123',
    remediationClass: 'fix-it',
    scope: 'PRODUCTION',
    ...overrides,
  };
}

function makeScanResult(overrides: Partial<ScanResult> = {}): ScanResult {
  const versions: ScanVersions = {
    scanner: 'HAIEC Static AI Security',
    scannerVersion: '0.1.0',
    rulepack: 'haiec-ai-security',
    rulepackVersion: '0.1.0-rc.6-public-core',
    rulepackDigest: 'sha256:abc',
    manifest: 'haiec-ai-security-manifest',
    manifestVersion: '1.0.0',
    manifestDigest: 'sha256:def',
    semgrep: 'semgrep',
    semgrepVersion: '1.173.0',
  };
  return {
    schemaVersion: '1.0.0',
    scanId: 'test-scan',
    verdict: 'REVIEW',
    completeness: 'COMPLETE',
    completenessReasons: [],
    summary: {
      filesAnalyzed: 10,
      filesWithFindings: 3,
      filesSkippedByEngine: 0,
      filesUnscannedDueToTimeout: 0,
      findingsExcludedByReportingScope: 0,
      actionableTotal: 5,
      vulnerabilityTotal: 1,
      controlGapTotal: 0,
      riskSignalTotal: 4,
      presenceTotal: 2,
      blockTotal: 0,
      reviewTotal: 5,
      informationalTotal: 2,
      rawFindingCount: 7,
    },
    actionableFindings: [makeFinding()],
    observations: [makeFinding({ findingKind: 'PRESENCE', securityCheckId: 'presence-check' })],
    limitations: [],
    versions,
    truncation: {
      actionableReturned: 1,
      actionableTotal: 5,
      observationsReturned: 1,
      observationsTotal: 2,
      truncated: true,
    },
    errors: [],
    ...overrides,
  };
}

describe('Scan Receipt', () => {
  it('receipt version is 0.1.0', () => {
    assert.equal(RECEIPT_VERSION, '0.1.0');
  });

  it('builds a receipt with all required fields', () => {
    const result = makeScanResult();
    const receipt = buildScanReceipt(result, 'abc123', false, 'sha256:input');

    assert.equal(receipt.receiptVersion, '0.1.0');
    assert.equal(receipt.schemaVersion, '1.0.0');
    assert.equal(receipt.scannerName, 'HAIEC Static AI Security');
    assert.equal(receipt.scannerVersion, '0.1.0');
    assert.equal(receipt.semgrepVersion, '1.173.0');
    assert.equal(receipt.publicCoreVersion, '0.1.0-rc.6-public-core');
    assert.equal(receipt.gitCommit, 'abc123');
    assert.equal(receipt.dirtyState, false);
    assert.equal(receipt.scanInputDigest, 'sha256:input');
    assert.ok(receipt.coverageDigest.startsWith('sha256:'));
    assert.ok(receipt.findingSetDigest.startsWith('sha256:'));
    assert.ok(receipt.semanticReceiptDigest.startsWith('sha256:'));
  });

  it('receipt digest is deterministic (same input = same digest)', () => {
    const result = makeScanResult();
    const r1 = buildScanReceipt(result, 'abc123', false, 'sha256:input');
    const r2 = buildScanReceipt(result, 'abc123', false, 'sha256:input');
    assert.equal(r1.semanticReceiptDigest, r2.semanticReceiptDigest);
  });

  it('receipt digest changes when findings change', () => {
    const result1 = makeScanResult({ actionableFindings: [makeFinding()] });
    const result2 = makeScanResult({ actionableFindings: [makeFinding({ securityCheckId: 'different' })] });
    const r1 = buildScanReceipt(result1, 'abc123', false, 'sha256:input');
    const r2 = buildScanReceipt(result2, 'abc123', false, 'sha256:input');
    assert.notEqual(r1.semanticReceiptDigest, r2.semanticReceiptDigest);
  });

  it('receipt digest excludes operational metadata (same result different scanId = same digest)', () => {
    const result1 = makeScanResult({ scanId: 'scan-1' });
    const result2 = makeScanResult({ scanId: 'scan-2' });
    const r1 = buildScanReceipt(result1, 'abc123', false, 'sha256:input');
    const r2 = buildScanReceipt(result2, 'abc123', false, 'sha256:input');
    assert.equal(r1.semanticReceiptDigest, r2.semanticReceiptDigest, 'scanId should not affect receipt digest');
  });

  it('findingSetDigest is deterministic', () => {
    const f1 = [makeFinding()];
    const f2 = [makeFinding()];
    const d1 = computeFindingSetDigest(f1, []);
    const d2 = computeFindingSetDigest(f2, []);
    assert.equal(d1, d2);
  });

  it('scanInputDigest is deterministic', () => {
    const files = [
      { relativePath: 'src/a.py', contentSha256: 'sha256:aaa' },
      { relativePath: 'src/b.py', contentSha256: 'sha256:bbb' },
    ];
    const d1 = computeScanInputDigest(files);
    const d2 = computeScanInputDigest([...files].reverse()); // different order
    assert.equal(d1, d2, 'order should not matter');
  });

  it('coverageDigest distinguishes COMPLETE from PARTIAL', () => {
    const baseParams = {
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      targetedFileSetDigest: 'sha256:t1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const complete = computeCoverageDigest({ ...baseParams, completeness: 'COMPLETE' });
    const partial = computeCoverageDigest({ ...baseParams, completeness: 'PARTIAL' });
    assert.notEqual(complete, partial);
  });

  it('coverageDigest changes when parseFailureFileSetDigest changes', () => {
    const baseParams = {
      completeness: 'PARTIAL',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      targetedFileSetDigest: 'sha256:t1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const d1 = computeCoverageDigest({ ...baseParams, parseFailureFileSetDigest: 'sha256:pf1' });
    const d2 = computeCoverageDigest({ ...baseParams, parseFailureFileSetDigest: 'sha256:pf2' });
    assert.notEqual(d1, d2, 'different parse-failure sets must produce different coverageDigest');
  });

  it('coverageDigest changes when targetedFileSetDigest changes', () => {
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const d1 = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: 'sha256:t1' });
    const d2 = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: 'sha256:t2' });
    assert.notEqual(d1, d2, 'different target sets must produce different coverageDigest');
  });

  it('coverageDigest changes when unsupportedFileSetDigest changes', () => {
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      targetedFileSetDigest: 'sha256:t1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const d1 = computeCoverageDigest({ ...baseParams, unsupportedFileSetDigest: 'sha256:u1' });
    const d2 = computeCoverageDigest({ ...baseParams, unsupportedFileSetDigest: 'sha256:u2' });
    assert.notEqual(d1, d2, 'different unsupported sets must produce different coverageDigest');
  });

  it('coverageDigest changes when discoveredFileSetDigest changes', () => {
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      targetedFileSetDigest: 'sha256:t1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const d1 = computeCoverageDigest({ ...baseParams, discoveredFileSetDigest: 'sha256:d1' });
    const d2 = computeCoverageDigest({ ...baseParams, discoveredFileSetDigest: 'sha256:d2' });
    assert.notEqual(d1, d2, 'different discovered sets must produce different coverageDigest');
  });

  it('coverageDigest changes when successfullyAnalyzedFileSetDigest changes', () => {
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      targetedFileSetDigest: 'sha256:t1',
      engineReportedScannedFileSetDigest: 'sha256:a1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
    };
    const d1 = computeCoverageDigest({ ...baseParams, successfullyAnalyzedFileSetDigest: 'sha256:sa1' });
    const d2 = computeCoverageDigest({ ...baseParams, successfullyAnalyzedFileSetDigest: 'sha256:sa2' });
    assert.notEqual(d1, d2, 'different successfully-analyzed sets must produce different coverageDigest');
  });
});

describe('Proof-of-fix', () => {
  it('returns RESOLVED_CONFIRMED when finding disappears from valid rescan', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.resolvedConfirmed, 1);
    assert.equal(result.trustworthy, true);
  });

  it('returns NOT_VERIFIABLE when rescan is ERROR', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'ERROR',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.trustworthy, false);
  });

  it('returns NOT_VERIFIABLE when rescan is PARTIAL (v0.1 safety)', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'PARTIAL',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.trustworthy, false);
    assert.equal(result.summary.resolvedConfirmed, 0,
      'PARTIAL rescan must NEVER produce RESOLVED_CONFIRMED in v0.1');
  });

  it('returns NOT_VERIFIABLE when rescan is UNSUPPORTED', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'UNSUPPORTED',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.trustworthy, false);
  });

  it('returns NOT_VERIFIABLE when rulepack digest mismatches', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:different',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.trustworthy, false);
  });

  it('returns NOT_VERIFIABLE when file was not analyzed in rescan', () => {
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(), // empty — file not analyzed
      new Set(['test-check']), // check was evaluated, but file wasn't analyzed
    );
    assert.equal(result.summary.notVerifiable, 1);
  });

  it('returns STILL_PRESENT when finding exists in both', () => {
    const f = makeFinding();
    const result = compareScans(
      [f], [f],
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.stillPresent, 1);
  });

  it('returns NEW for findings only in rescan', () => {
    const f = makeFinding();
    const result = compareScans(
      [], [f],
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.new, 1);
  });

  // C2R P16: Additional mandatory proof-of-fix scenarios

  it('scenario 3: line movement — same evidenceHash → STILL_PRESENT (identity by hash, not line)', () => {
    // Finding moved from line 10 to line 20, but same evidenceHash = same finding
    const baseline = [makeFinding({ startLine: 10, evidenceHash: 'hash-X' })];
    const rescan = [makeFinding({ startLine: 20, evidenceHash: 'hash-X' })];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.stillPresent, 1);
    assert.equal(result.comparisons[0].baselineLine, 10);
    assert.equal(result.comparisons[0].rescanLine, 20);
  });

  it('scenario 4: move within file — different evidenceHash → NOT resolved (new identity)', () => {
    // Finding at a different location with different hash = different finding identity
    const baseline = [makeFinding({ startLine: 10, evidenceHash: 'hash-A' })];
    const rescan = [makeFinding({ startLine: 50, evidenceHash: 'hash-B' })];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    // baseline finding is gone (hash-A not in rescan) → resolved
    // rescan finding is new (hash-B not in baseline) → new
    assert.equal(result.summary.resolvedConfirmed, 1);
    assert.equal(result.summary.new, 1);
  });

  it('scenario 5: variable rename same issue — different evidenceHash → treated as resolved+new', () => {
    // Same security issue but variable renamed → different code context → different hash
    // This is conservative: we cannot prove the issue is the same one
    const baseline = [makeFinding({ evidenceHash: 'hash-before-rename' })];
    const rescan = [makeFinding({ evidenceHash: 'hash-after-rename' })];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.resolvedConfirmed, 1);
    assert.equal(result.summary.new, 1);
  });

  it('scenario 8: timeout — rescan PARTIAL due to timeout → NOT_VERIFIABLE', () => {
    // Timeout produces PARTIAL completeness → untrustworthy
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'PARTIAL',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.summary.resolvedConfirmed, 0);
    assert.equal(result.trustworthy, false);
  });

  it('scenario 9: parser error — rescan PARTIAL due to parse errors → NOT_VERIFIABLE', () => {
    // Parser errors produce PARTIAL completeness → untrustworthy
    const baseline = [makeFinding()];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'PARTIAL',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']),
      new Set(['test-check']), // evaluated security checks
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.trustReason, 'Rescan completeness is PARTIAL — RESOLVED_CONFIRMED requires COMPLETE');
  });

  it('scenario 10: excluded file — file not in rescanAnalyzedPaths → NOT_VERIFIABLE', () => {
    const baseline = [makeFinding({ relativePath: 'src/excluded.py' })];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/other.py']), // src/excluded.py not in analyzed set
      new Set(['test-check']), // check was evaluated
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.comparisons[0].reason, 'File was not analyzed in rescan (excluded or not reached)');
  });

  it('scenario 14: relevant security check not evaluated — finding absent but check not in rescan', () => {
    // If the security check was NOT evaluated in rescan, we cannot confirm resolution.
    // The finding's absence does not prove it was fixed — the check simply didn't run.
    // v0.1 safety: fail closed to NOT_VERIFIABLE.
    const baseline = [makeFinding({ securityCheckId: 'SC-SPECIAL-CHECK' })];
    const rescan: typeof baseline = [];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py']), // file WAS analyzed
      new Set(['test-check']), // but SC-SPECIAL-CHECK was NOT evaluated
    );
    assert.equal(result.summary.notVerifiable, 1);
    assert.equal(result.summary.resolvedConfirmed, 0,
      'A check that was not evaluated must NEVER produce RESOLVED_CONFIRMED');
    assert.equal(result.comparisons[0].reason, 'Security check SC-SPECIAL-CHECK was not evaluated in rescan');
  });

  it('summary counts are consistent (accounting invariant)', () => {
    const baseline = [
      makeFinding({ evidenceHash: 'h1' }),
      makeFinding({ evidenceHash: 'h2', relativePath: 'src/other.py' }),
    ];
    const rescan = [
      makeFinding({ evidenceHash: 'h1' }), // still present
      makeFinding({ evidenceHash: 'h3' }), // new
    ];
    const result = compareScans(
      baseline, rescan,
      'COMPLETE', 'COMPLETE',
      'sha256:abc', 'sha256:abc',
      new Set(['src/app.py', 'src/other.py']),
      new Set(['test-check']), // check was evaluated
    );
    const total = result.summary.stillPresent + result.summary.resolvedConfirmed +
      result.summary.new + result.summary.notVerifiable;
    // 2 baseline + 1 new = 3 comparisons
    assert.equal(total, 3);
    assert.equal(result.summary.stillPresent, 1);
    assert.equal(result.summary.resolvedConfirmed, 1);
    assert.equal(result.summary.new, 1);
  });
});


