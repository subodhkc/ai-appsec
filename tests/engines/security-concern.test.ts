/**
 * Tests for Security Concern grouping, Concern Priority v0.1, and accounting invariants.
 *
 * P9-13: Verifies that:
 * - grouping is deterministic and conservative (never merges across securityCheckId)
 * - instance counts are preserved exactly (grouping is a VIEW, not deletion)
 * - Concern Priority v0.1 orders deterministically without fuzzy numeric scoring
 * - BLOCK/CRITICAL never gets outranked by volume of lower-priority instances
 * - accounting invariants hold across edge cases
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  groupFindingsIntoConcerns,
  computeConcernSetDigest,
  ISSUE_AGGREGATION_VERSION,
  MAX_REPRESENTATIVE_FINDINGS_PER_CONCERN,
} from '../../src/engines/ai-security/security-concern.js';
import {
  prioritizeConcerns,
  CONCERN_PRIORITY_VERSION,
} from '../../src/engines/ai-security/concern-priority.js';
import type { NormalizedFinding } from '../../src/engines/ai-security/types.js';

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    securityCheckId: 'TEST-1',
    canonicalName: 'Test check',
    findingKind: 'RISK_SIGNAL',
    canonicalSeverity: 'MEDIUM',
    defaultDisposition: 'REVIEW',
    relativePath: 'src/app.py',
    startLine: 10,
    startColumn: 5,
    endLine: 10,
    endColumn: 20,
    detectorIds: ['det-1'],
    message: 'test',
    evidenceHash: 'hash123',
    remediationClass: 'test-remediation',
    scope: 'PRODUCTION',
    ...overrides,
  };
}

describe('Security Concern grouping (P9)', () => {
  it('groups findings with same securityCheckId+kind+disposition+severity into one concern', () => {
    const findings = [
      makeFinding({ relativePath: 'src/a.py', startLine: 1, evidenceHash: 'h1' }),
      makeFinding({ relativePath: 'src/b.py', startLine: 2, evidenceHash: 'h2' }),
      makeFinding({ relativePath: 'src/c.py', startLine: 3, evidenceHash: 'h3' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 1);
    assert.equal(concerns[0].instanceCount, 3);
    assert.equal(concerns[0].affectedFileCount, 3);
  });

  it('never merges across different securityCheckId', () => {
    const findings = [
      makeFinding({ securityCheckId: 'CHECK-A' }),
      makeFinding({ securityCheckId: 'CHECK-B' }),
      makeFinding({ securityCheckId: 'CHECK-A' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 2);
    const ids = concerns.map((c) => c.securityCheckId).sort();
    assert.deepEqual(ids, ['CHECK-A', 'CHECK-B']);
  });

  it('never merges across different findingKind even with same securityCheckId', () => {
    const findings = [
      makeFinding({ findingKind: 'VULNERABILITY' }),
      makeFinding({ findingKind: 'CONTROL_GAP' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 2);
  });

  it('never merges across different disposition even with same securityCheckId', () => {
    const findings = [
      makeFinding({ defaultDisposition: 'BLOCK' }),
      makeFinding({ defaultDisposition: 'REVIEW' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 2);
  });

  it('never merges across different severity even with same securityCheckId', () => {
    const findings = [
      makeFinding({ canonicalSeverity: 'HIGH' }),
      makeFinding({ canonicalSeverity: 'MEDIUM' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 2);
  });

  it('preserves exact instance counts (grouping is a VIEW, not deletion)', () => {
    const findings = [
      makeFinding({ securityCheckId: 'A', relativePath: 'f1.py', evidenceHash: 'h1' }),
      makeFinding({ securityCheckId: 'A', relativePath: 'f2.py', evidenceHash: 'h2' }),
      makeFinding({ securityCheckId: 'B', relativePath: 'f3.py', evidenceHash: 'h3' }),
      makeFinding({ securityCheckId: 'B', relativePath: 'f4.py', evidenceHash: 'h4' }),
      makeFinding({ securityCheckId: 'B', relativePath: 'f5.py', evidenceHash: 'h5' }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    const totalInstances = concerns.reduce((sum, c) => sum + c.instanceCount, 0);
    assert.equal(totalInstances, findings.length);
  });

  it('caps representative findings per concern', () => {
    const findings = Array.from({ length: 10 }, (_, i) =>
      makeFinding({ relativePath: `src/f${i}.py`, startLine: i, evidenceHash: `h${i}` }),
    );
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns[0].representativeFindings.length, MAX_REPRESENTATIVE_FINDINGS_PER_CONCERN);
    assert.equal(concerns[0].instanceCount, 10);
  });

  it('tracks affected detectors', () => {
    const findings = [
      makeFinding({ detectorIds: ['det-1'] }),
      makeFinding({ detectorIds: ['det-2'] }),
      makeFinding({ detectorIds: ['det-1', 'det-3'] }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns[0].affectedDetectorCount, 3);
    assert.deepEqual([...concerns[0].affectedDetectors], ['det-1', 'det-2', 'det-3']);
  });

  it('is deterministic — same input produces same output and digest', () => {
    const findings = [
      makeFinding({ securityCheckId: 'B', relativePath: 'f1.py', evidenceHash: 'h1' }),
      makeFinding({ securityCheckId: 'A', relativePath: 'f2.py', evidenceHash: 'h2' }),
    ];
    const c1 = groupFindingsIntoConcerns(findings);
    const c2 = groupFindingsIntoConcerns([...findings].reverse());
    const d1 = computeConcernSetDigest(c1);
    const d2 = computeConcernSetDigest(c2);
    // Digests must be identical regardless of input order
    assert.equal(d1, d2);
  });

  it('returns empty array for empty input', () => {
    const concerns = groupFindingsIntoConcerns([]);
    assert.equal(concerns.length, 0);
  });

  it('handles single finding', () => {
    const concerns = groupFindingsIntoConcerns([makeFinding()]);
    assert.equal(concerns.length, 1);
    assert.equal(concerns[0].instanceCount, 1);
    assert.equal(concerns[0].affectedFileCount, 1);
  });

  it('exposes ISSUE_AGGREGATION_VERSION', () => {
    assert.ok(ISSUE_AGGREGATION_VERSION, 'ISSUE_AGGREGATION_VERSION must be defined');
  });
});

describe('Concern Priority v0.1 (P10)', () => {
  it('exposes CONCERN_PRIORITY_VERSION', () => {
    assert.ok(CONCERN_PRIORITY_VERSION, 'CONCERN_PRIORITY_VERSION must be defined');
  });

  it('orders BLOCK before REVIEW before INFORMATIONAL', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'INFO', defaultDisposition: 'INFORMATIONAL' }),
      makeFinding({ securityCheckId: 'REV', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'BLK', defaultDisposition: 'BLOCK' }),
    ]);
    assert.equal(concerns[0].defaultDisposition, 'BLOCK');
    assert.equal(concerns[1].defaultDisposition, 'REVIEW');
    assert.equal(concerns[2].defaultDisposition, 'INFORMATIONAL');
  });

  it('orders CRITICAL > HIGH > MEDIUM > LOW > INFO within same disposition', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'LOW', canonicalSeverity: 'LOW' }),
      makeFinding({ securityCheckId: 'INFO', canonicalSeverity: 'INFO' }),
      makeFinding({ securityCheckId: 'HIGH', canonicalSeverity: 'HIGH' }),
      makeFinding({ securityCheckId: 'CRIT', canonicalSeverity: 'CRITICAL' }),
      makeFinding({ securityCheckId: 'MED', canonicalSeverity: 'MEDIUM' }),
    ]);
    const sevs = concerns.map((c) => c.canonicalSeverity);
    assert.deepEqual(sevs, ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
  });

  it('orders VULNERABILITY > CONTROL_GAP > RISK_SIGNAL > PRESENCE within same disposition+severity', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'PRES', findingKind: 'PRESENCE' }),
      makeFinding({ securityCheckId: 'RS', findingKind: 'RISK_SIGNAL' }),
      makeFinding({ securityCheckId: 'CG', findingKind: 'CONTROL_GAP' }),
      makeFinding({ securityCheckId: 'VULN', findingKind: 'VULNERABILITY' }),
    ]);
    const kinds = concerns.map((c) => c.findingKind);
    assert.deepEqual(kinds, ['VULNERABILITY', 'CONTROL_GAP', 'RISK_SIGNAL', 'PRESENCE']);
  });

  it('NEVER lets 500 low-priority instances outrank a BLOCK/CRITICAL concern', () => {
    const blockFinding = makeFinding({
      securityCheckId: 'CRITICAL-BLOCK',
      findingKind: 'VULNERABILITY',
      canonicalSeverity: 'CRITICAL',
      defaultDisposition: 'BLOCK',
    });
    const manyReviewFindings = Array.from({ length: 500 }, (_, i) =>
      makeFinding({
        securityCheckId: 'NOISY-REVIEW',
        findingKind: 'RISK_SIGNAL',
        canonicalSeverity: 'LOW',
        defaultDisposition: 'REVIEW',
        relativePath: `src/f${i}.py`,
        evidenceHash: `rh${i}`,
      }),
    );
    const concerns = groupFindingsIntoConcerns([blockFinding, ...manyReviewFindings]);
    assert.equal(concerns[0].defaultDisposition, 'BLOCK');
    assert.equal(concerns[0].canonicalSeverity, 'CRITICAL');
    assert.equal(concerns[0].securityCheckId, 'CRITICAL-BLOCK');
  });

  it('broader file coverage ranks higher within same disposition/severity/kind', () => {
    const narrow = Array.from({ length: 1 }, (_, i) =>
      makeFinding({ securityCheckId: 'NARROW', relativePath: `src/n${i}.py`, evidenceHash: `n${i}` }),
    );
    const broad = Array.from({ length: 20 }, (_, i) =>
      makeFinding({ securityCheckId: 'BROAD', relativePath: `src/b${i}.py`, evidenceHash: `b${i}` }),
    );
    const concerns = groupFindingsIntoConcerns([...narrow, ...broad]);
    // Both are REVIEW/MEDIUM/RISK_SIGNAL — broader should rank higher
    assert.equal(concerns[0].securityCheckId, 'BROAD');
    assert.equal(concerns[0].affectedFileCount, 20);
  });

  it('is deterministic — same concerns produce same order', () => {
    const findings = [
      makeFinding({ securityCheckId: 'B', relativePath: 'f1.py', evidenceHash: 'h1' }),
      makeFinding({ securityCheckId: 'A', relativePath: 'f2.py', evidenceHash: 'h2' }),
      makeFinding({ securityCheckId: 'C', relativePath: 'f3.py', evidenceHash: 'h3' }),
    ];
    const c1 = prioritizeConcerns(groupFindingsIntoConcerns(findings));
    const c2 = prioritizeConcerns(groupFindingsIntoConcerns([...findings].reverse()));
    assert.deepEqual(
      c1.map((c) => c.concernId),
      c2.map((c) => c.concernId),
    );
  });
});

describe('Accounting invariants (P12)', () => {
  it('0 findings → 0 concerns, 0 instances', () => {
    const concerns = groupFindingsIntoConcerns([]);
    assert.equal(concerns.length, 0);
    assert.equal(concerns.reduce((s, c) => s + c.instanceCount, 0), 0);
  });

  it('1 finding → 1 concern, 1 instance', () => {
    const concerns = groupFindingsIntoConcerns([makeFinding()]);
    assert.equal(concerns.length, 1);
    assert.equal(concerns[0].instanceCount, 1);
  });

  it('many findings same check → 1 concern, N instances', () => {
    const findings = Array.from({ length: 100 }, (_, i) =>
      makeFinding({ relativePath: `src/f${i}.py`, evidenceHash: `h${i}` }),
    );
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 1);
    assert.equal(concerns[0].instanceCount, 100);
  });

  it('multiple detector variants same check → 1 concern, tracks all detectors', () => {
    const findings = [
      makeFinding({ detectorIds: ['det-a'] }),
      makeFinding({ detectorIds: ['det-b'] }),
      makeFinding({ detectorIds: ['det-a', 'det-c'] }),
    ];
    const concerns = groupFindingsIntoConcerns(findings);
    assert.equal(concerns.length, 1);
    assert.equal(concerns[0].affectedDetectorCount, 3);
  });

  it('BLOCK + REVIEW → 2 concerns, BLOCK ranks first', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'REV', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'BLK', defaultDisposition: 'BLOCK' }),
    ]);
    assert.equal(concerns.length, 2);
    assert.equal(concerns[0].defaultDisposition, 'BLOCK');
  });

  it('different severities same check → separate concerns', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ canonicalSeverity: 'HIGH' }),
      makeFinding({ canonicalSeverity: 'LOW' }),
    ]);
    assert.equal(concerns.length, 2);
  });

  it('observations only (PRESENCE) → concerns still computed', () => {
    const concerns = groupFindingsIntoConcerns([
      makeFinding({ findingKind: 'PRESENCE', defaultDisposition: 'INFORMATIONAL' }),
    ]);
    assert.equal(concerns.length, 1);
  });

  it('10,000 synthetic instances → exact count preserved', () => {
    const findings = Array.from({ length: 10000 }, (_, i) =>
      makeFinding({ relativePath: `src/f${i}.py`, evidenceHash: `h${i}` }),
    );
    const concerns = groupFindingsIntoConcerns(findings);
    const total = concerns.reduce((s, c) => s + c.instanceCount, 0);
    assert.equal(total, 10000);
  });

  it('concernSetDigest is content-sensitive', () => {
    const d1 = computeConcernSetDigest(groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'A' }),
    ]));
    const d2 = computeConcernSetDigest(groupFindingsIntoConcerns([
      makeFinding({ securityCheckId: 'B' }),
    ]));
    assert.notEqual(d1, d2);
  });
});
