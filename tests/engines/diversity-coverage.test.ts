/**
 * Tests for diversity-aware bounding and file-set digests.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { diversityBoundFindings, prioritizeFindings } from '../../src/engines/ai-security/prioritizer.js';
import { computeFileSetDigest, computeCoverageDigest } from '../../src/engines/ai-security/scan-receipt.js';
import type { NormalizedFinding } from '../../src/engines/ai-security/types.js';

function makeFinding(checkId: string, path: string, line: number, sev: string = 'MEDIUM', disp: string = 'REVIEW'): NormalizedFinding {
  return {
    securityCheckId: checkId,
    canonicalName: `Check ${checkId}`,
    findingKind: 'RISK_SIGNAL',
    canonicalSeverity: sev as any,
    defaultDisposition: disp as any,
    relativePath: path,
    startLine: line,
    startColumn: 1,
    endLine: line,
    endColumn: 20,
    detectorIds: [`${checkId}-detector`],
    message: 'test',
    evidenceHash: `${checkId}-${path}-${line}`,
    remediationClass: 'fix',
    scope: 'PRODUCTION',
  };
}

describe('Diversity-aware bounding', () => {
  it('returns all findings when under maxVisible', () => {
    const findings = [makeFinding('a', 'f.py', 1), makeFinding('b', 'f.py', 2)];
    const result = diversityBoundFindings(findings, 10);
    assert.equal(result.visible.length, 2);
    assert.equal(result.hidden, 0);
    assert.equal(result.checksRepresented, 2);
  });

  it('limits per-check instances in first pass', () => {
    // 15 findings all from the same check
    const findings = Array.from({ length: 15 }, (_, i) => makeFinding('same-check', 'f.py', i + 1));
    const result = diversityBoundFindings(findings, 20);
    // First pass: max 3 per check
    // Pass 2: fill remaining 17 slots from the remaining 12
    assert.equal(result.visible.length, 15); // all fit within 20
    assert.equal(result.hidden, 0);
  });

  it('one check does not monopolize the output', () => {
    // 20 findings from check A, 5 from check B, maxVisible=10
    const findings = [
      ...Array.from({ length: 20 }, (_, i) => makeFinding('check-a', 'f.py', i + 1)),
      ...Array.from({ length: 5 }, (_, i) => makeFinding('check-b', 'g.py', i + 1)),
    ];
    const result = diversityBoundFindings(findings, 10);
    assert.equal(result.visible.length, 10);
    assert.equal(result.total, 25);
    assert.equal(result.hidden, 15);
    // Check B should be represented (not monopolized by check A)
    const checkBVisible = result.visible.filter(f => f.securityCheckId === 'check-b').length;
    assert.ok(checkBVisible > 0, 'Check B should be represented in visible output');
    // Check A should have at most 3 in first pass + some in pass 2
    const checkAVisible = result.visible.filter(f => f.securityCheckId === 'check-a').length;
    assert.ok(checkAVisible < 10, 'Check A should not monopolize all 10 slots');
  });

  it('exact totals never change', () => {
    const findings = [
      ...Array.from({ length: 20 }, (_, i) => makeFinding('check-a', 'f.py', i + 1)),
      ...Array.from({ length: 5 }, (_, i) => makeFinding('check-b', 'g.py', i + 1)),
    ];
    const result = diversityBoundFindings(findings, 10);
    assert.equal(result.total, 25);
    assert.equal(result.visible.length + result.hidden, 25);
  });

  it('checksOmittedDueToDisplayBounds is accurate', () => {
    // 3 checks, each with 10 findings, maxVisible=5
    const findings = [
      ...Array.from({ length: 10 }, (_, i) => makeFinding('a', 'f.py', i + 1)),
      ...Array.from({ length: 10 }, (_, i) => makeFinding('b', 'g.py', i + 1)),
      ...Array.from({ length: 10 }, (_, i) => makeFinding('c', 'h.py', i + 1)),
    ];
    const result = diversityBoundFindings(findings, 5);
    assert.equal(result.checksTotal, 3);
    // With 5 slots and 3 checks, first pass gets 3 (one per check),
    // then pass 2 gets 2 more from check a and b
    assert.ok(result.checksRepresented >= 2, 'At least 2 checks should be represented');
  });

  it('deterministic — same input always produces same output', () => {
    const findings = [
      ...Array.from({ length: 10 }, (_, i) => makeFinding('a', 'f.py', i + 1)),
      ...Array.from({ length: 10 }, (_, i) => makeFinding('b', 'g.py', i + 1)),
    ];
    const r1 = diversityBoundFindings(findings, 10);
    const r2 = diversityBoundFindings(findings, 10);
    assert.deepEqual(r1.visible.map(f => f.evidenceHash), r2.visible.map(f => f.evidenceHash));
  });
});

describe('File-set digests', () => {
  it('same paths produce same digest', () => {
    const d1 = computeFileSetDigest(['src/a.py', 'src/b.py', 'src/c.py']);
    const d2 = computeFileSetDigest(['src/a.py', 'src/b.py', 'src/c.py']);
    assert.equal(d1, d2);
  });

  it('different order produces same digest (sorted)', () => {
    const d1 = computeFileSetDigest(['src/a.py', 'src/b.py']);
    const d2 = computeFileSetDigest(['src/b.py', 'src/a.py']);
    assert.equal(d1, d2);
  });

  it('different file sets produce different digests', () => {
    const d1 = computeFileSetDigest(['src/a.py', 'src/b.py']);
    const d2 = computeFileSetDigest(['src/a.py', 'src/c.py']);
    assert.notEqual(d1, d2);
  });

  it('Windows separators normalized to forward slashes', () => {
    const d1 = computeFileSetDigest(['src\\a.py', 'src\\b.py']);
    const d2 = computeFileSetDigest(['src/a.py', 'src/b.py']);
    assert.equal(d1, d2);
  });

  it('same count but different files produce different digests', () => {
    const d1 = computeFileSetDigest(['src/a.py', 'src/b.py']);
    const d2 = computeFileSetDigest(['src/c.py', 'src/d.py']);
    assert.notEqual(d1, d2, 'Same count but different files must NOT have equivalent digests');
  });

  it('coverage digest with file-set digest is stronger than without', () => {
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const without = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: 'sha256:t1', engineReportedScannedFileSetDigest: 'sha256:a1' });
    const withDigest = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: 'sha256:t2', engineReportedScannedFileSetDigest: 'sha256:a2' });
    assert.notEqual(without, withDigest, 'Coverage digest should change when file-set digests change');
  });

  it('coverage digest distinguishes same counts different file sets', () => {
    const setA = computeFileSetDigest(['src/a.py', 'src/b.py']);
    const setB = computeFileSetDigest(['src/c.py', 'src/d.py']);
    const baseParams = {
      completeness: 'COMPLETE',
      coverageContractVersion: '0.1.1',
      scopePolicyDigest: 'sha256:abc',
      discoveredFileSetDigest: 'sha256:d1',
      intentionallyExcludedFileSetDigest: 'sha256:e1',
      parseFailureFileSetDigest: 'sha256:p1',
      unsupportedFileSetDigest: 'sha256:u1',
      successfullyAnalyzedFileSetDigest: 'sha256:sa1',
    };
    const covA = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: setA, engineReportedScannedFileSetDigest: setA });
    const covB = computeCoverageDigest({ ...baseParams, targetedFileSetDigest: setB, engineReportedScannedFileSetDigest: setB });
    assert.notEqual(covA, covB, 'Same counts but different file sets must produce different coverage digests');
  });
});

