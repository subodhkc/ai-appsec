/**
 * Tests for normalizer.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFindings } from '../../src/engines/ai-security/normalizer.js';
import type { NormalizedFinding } from '../../src/engines/ai-security/types.js';

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    securityCheckId: 'TEST-1',
    canonicalName: 'Test',
    findingKind: 'VULNERABILITY',
    canonicalSeverity: 'HIGH',
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

describe('Normalizer', () => {
  it('collapses same securityCheck + same location + same evidence', () => {
    const findings = [
      makeFinding({ detectorIds: ['det-1'] }),
      makeFinding({ detectorIds: ['det-2'] }),
    ];
    const result = normalizeFindings(findings);
    assert.equal(result.normalizedCount, 1);
    assert.equal(result.duplicatesCollapsed, 1);
    assert.deepEqual(result.normalized[0].detectorIds, ['det-1', 'det-2']);
  });

  it('keeps different securityChecks on same line separate', () => {
    const findings = [
      makeFinding({ securityCheckId: 'TEST-1', detectorIds: ['det-1'] }),
      makeFinding({ securityCheckId: 'TEST-2', detectorIds: ['det-2'] }),
    ];
    const result = normalizeFindings(findings);
    assert.equal(result.normalizedCount, 2);
    assert.equal(result.duplicatesCollapsed, 0);
  });

  it('keeps same securityCheck on different lines separate', () => {
    const findings = [
      makeFinding({ startLine: 10 }),
      makeFinding({ startLine: 20 }),
    ];
    const result = normalizeFindings(findings);
    assert.equal(result.normalizedCount, 2);
  });

  it('keeps same securityCheck + same line + different evidence separate', () => {
    const findings = [
      makeFinding({ evidenceHash: 'hash-a' }),
      makeFinding({ evidenceHash: 'hash-b' }),
    ];
    const result = normalizeFindings(findings);
    assert.equal(result.normalizedCount, 2);
  });

  it('handles empty input', () => {
    const result = normalizeFindings([]);
    assert.equal(result.normalizedCount, 0);
    assert.equal(result.rawCount, 0);
    assert.equal(result.duplicatesCollapsed, 0);
  });

  it('preserves raw count', () => {
    const findings = [
      makeFinding({ detectorIds: ['a'] }),
      makeFinding({ detectorIds: ['b'] }),
      makeFinding({ securityCheckId: 'OTHER', detectorIds: ['c'] }),
    ];
    const result = normalizeFindings(findings);
    assert.equal(result.rawCount, 3);
    assert.equal(result.normalizedCount, 2);
  });
});
