/**
 * Tests for prioritizer.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { prioritizeFindings } from '../../src/engines/ai-security/prioritizer.js';
import type { NormalizedFinding } from '../../src/engines/ai-security/types.js';

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    securityCheckId: 'TEST-1',
    canonicalName: 'Test',
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
    remediationClass: 'test',
    scope: 'PRODUCTION',
    ...overrides,
  };
}

describe('Prioritizer', () => {
  it('orders BLOCK before REVIEW before INFORMATIONAL', () => {
    const findings = [
      makeFinding({ securityCheckId: 'C', defaultDisposition: 'INFORMATIONAL' }),
      makeFinding({ securityCheckId: 'B', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'A', defaultDisposition: 'BLOCK' }),
    ];
    const sorted = prioritizeFindings(findings);
    assert.equal(sorted[0].defaultDisposition, 'BLOCK');
    assert.equal(sorted[1].defaultDisposition, 'REVIEW');
    assert.equal(sorted[2].defaultDisposition, 'INFORMATIONAL');
  });

  it('orders VULNERABILITY before CONTROL_GAP before RISK_SIGNAL before PRESENCE', () => {
    const findings = [
      makeFinding({ securityCheckId: 'D', findingKind: 'PRESENCE', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'C', findingKind: 'RISK_SIGNAL', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'B', findingKind: 'CONTROL_GAP', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'A', findingKind: 'VULNERABILITY', defaultDisposition: 'REVIEW' }),
    ];
    const sorted = prioritizeFindings(findings);
    assert.equal(sorted[0].findingKind, 'VULNERABILITY');
    assert.equal(sorted[1].findingKind, 'CONTROL_GAP');
    assert.equal(sorted[2].findingKind, 'RISK_SIGNAL');
    assert.equal(sorted[3].findingKind, 'PRESENCE');
  });

  it('orders CRITICAL before HIGH before MEDIUM before LOW before INFO', () => {
    const findings = [
      makeFinding({ securityCheckId: 'E', canonicalSeverity: 'INFO', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'D', canonicalSeverity: 'LOW', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'C', canonicalSeverity: 'MEDIUM', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'B', canonicalSeverity: 'HIGH', defaultDisposition: 'REVIEW' }),
      makeFinding({ securityCheckId: 'A', canonicalSeverity: 'CRITICAL', defaultDisposition: 'REVIEW' }),
    ];
    const sorted = prioritizeFindings(findings);
    assert.equal(sorted[0].canonicalSeverity, 'CRITICAL');
    assert.equal(sorted[1].canonicalSeverity, 'HIGH');
    assert.equal(sorted[2].canonicalSeverity, 'MEDIUM');
    assert.equal(sorted[3].canonicalSeverity, 'LOW');
    assert.equal(sorted[4].canonicalSeverity, 'INFO');
  });

  it('uses stable tie-breakers: securityCheckId, path, line, hash', () => {
    const findings = [
      makeFinding({ securityCheckId: 'Z', relativePath: 'z.py', startLine: 100, evidenceHash: 'h1' }),
      makeFinding({ securityCheckId: 'A', relativePath: 'a.py', startLine: 1, evidenceHash: 'h2' }),
      makeFinding({ securityCheckId: 'A', relativePath: 'a.py', startLine: 1, evidenceHash: 'h1' }),
    ];
    const sorted = prioritizeFindings(findings);
    assert.equal(sorted[0].securityCheckId, 'A');
    assert.equal(sorted[2].securityCheckId, 'Z');
    assert.equal(sorted[0].evidenceHash, 'h1');
    assert.equal(sorted[1].evidenceHash, 'h2');
  });

  it('is deterministic (same input → same output)', () => {
    const findings = [
      makeFinding({ securityCheckId: 'B', relativePath: 'b.py', startLine: 5 }),
      makeFinding({ securityCheckId: 'A', relativePath: 'a.py', startLine: 10 }),
      makeFinding({ securityCheckId: 'C', relativePath: 'c.py', startLine: 3 }),
    ];
    const sorted1 = prioritizeFindings(findings);
    const sorted2 = prioritizeFindings(findings);
    assert.deepEqual(
      sorted1.map((f) => f.securityCheckId),
      sorted2.map((f) => f.securityCheckId),
    );
  });
});
