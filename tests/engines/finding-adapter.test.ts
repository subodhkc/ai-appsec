/**
 * Tests for finding adapter.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import { adaptFindings } from '../../src/engines/ai-security/finding-adapter.js';
import type { RulepackManifest, RawSemgrepFinding } from '../../src/engines/ai-security/types.js';

const TEST_MANIFEST: RulepackManifest = {
  schemaVersion: '1.0.0',
  rulepackVersion: 'test-0.1.0',
  manifestVersion: 'test-0.1.0',
  analysisEngine: 'semgrep',
  semgrepCompatibility: {
    engine: 'semgrep', minVersion: '1.173.0', verifiedStable: '1.173.0',
    verifiedDigest: 'sha256:test', verifiedPlatform: 'test', githubRelease: 'v1.173.0', releaseDate: 'test',
  },
  securityChecks: [
    {
      securityCheckId: 'TEST-VULN', canonicalName: 'Test Vulnerability', securityProposition: 'test',
      findingKind: 'VULNERABILITY', canonicalSeverity: 'HIGH', defaultDisposition: 'BLOCK',
      detectorIds: ['test-vuln-detector'], applicability: 'test', limitations: [],
      remediationClass: 'test', primaryEngine: 'ai-security', legacyDisplayId: 'T1',
    },
    {
      securityCheckId: 'TEST-PRESENCE', canonicalName: 'Test Presence', securityProposition: 'test',
      findingKind: 'PRESENCE', canonicalSeverity: 'INFO', defaultDisposition: 'INFORMATIONAL',
      detectorIds: ['test-presence-detector'], applicability: 'test', limitations: [],
      remediationClass: 'test', primaryEngine: 'ai-security', legacyDisplayId: 'T2',
    },
  ],
  detectors: [
    {
      detectorId: 'test-vuln-detector', securityCheckId: 'TEST-VULN', languages: ['python'],
      rawSeverity: 'ERROR', revision: 'test', provenance: 'test', candidateStatus: 'test',
      publicStatus: 'test', enabledByDefault: true, limitations: [],
    },
    {
      detectorId: 'test-presence-detector', securityCheckId: 'TEST-PRESENCE', languages: ['python'],
      rawSeverity: 'INFO', revision: 'test', provenance: 'test', candidateStatus: 'test',
      publicStatus: 'test', enabledByDefault: true, limitations: [],
    },
  ],
};

const RAW_FINDINGS: RawSemgrepFinding[] = [
  { check_id: 'test-vuln-detector', path: '/target/src/app.py', start: { line: 10, col: 5 }, end: { line: 10, col: 20 }, extra: { message: 'AI output to eval', severity: 'ERROR' } },
  { check_id: 'test-presence-detector', path: '/target/src/app.py', start: { line: 1, col: 1 }, end: { line: 1, col: 20 }, extra: { message: 'AI SDK imported', severity: 'INFO' } },
  { check_id: 'unknown-detector-xyz', path: '/target/src/app.py', start: { line: 5, col: 1 }, end: { line: 5, col: 10 }, extra: { message: 'Unknown', severity: 'WARNING' } },
];

describe('FindingAdapter', () => {
  it('adapts known detectors to normalized findings', () => {
    const result = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.equal(result.findings.length, 2);
    assert.equal(result.findings[0].securityCheckId, 'TEST-VULN');
    assert.equal(result.findings[0].findingKind, 'VULNERABILITY');
    assert.equal(result.findings[0].canonicalSeverity, 'HIGH');
    assert.equal(result.findings[0].defaultDisposition, 'BLOCK');
    assert.deepEqual(result.findings[0].detectorIds, ['test-vuln-detector']);
  });

  it('classifies unknown detectors as manifest mismatch', () => {
    const result = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.equal(result.manifestMismatch, true);
    assert.ok(result.unknownDetectors.includes('unknown-detector-xyz'));
  });

  it('does not invent metadata for unknown detectors', () => {
    const result = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.equal(
      result.findings.find((f) => f.detectorIds.includes('unknown-detector-xyz')),
      undefined,
    );
  });

  it('converts absolute paths to repository-relative', () => {
    const result = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    // Path should be relative (not absolute)
    assert.ok(!path.isAbsolute(result.findings[0].relativePath));
    assert.ok(result.findings[0].relativePath.endsWith('app.py'));
  });

  it('computes evidence hash deterministically', () => {
    const r1 = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    const r2 = adaptFindings(RAW_FINDINGS, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.equal(r1.findings[0].evidenceHash, r2.findings[0].evidenceHash);
  });

  it('redacts secrets in messages', () => {
    const findings: RawSemgrepFinding[] = [
      { check_id: 'test-vuln-detector', path: '/target/src/app.py', start: { line: 1, col: 1 }, end: { line: 1, col: 50 }, extra: { message: 'Hardcoded key: sk-abcdefghijklmnopqrstuvwxyz123456', severity: 'ERROR' } },
    ];
    const result = adaptFindings(findings, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.ok(result.findings[0].message.includes('[REDACTED_API_KEY]'));
    assert.ok(!result.findings[0].message.includes('sk-abcdefghijklmnopqrstuvwxyz123456'));
  });

  it('strips config-name prefix from check_id (e.g., mvp-rc5., scan., absolute path prefix)', () => {
    const findings: RawSemgrepFinding[] = [
      { check_id: 'mvp-rc5.test-vuln-detector', path: '/target/src/app.py', start: { line: 1, col: 1 }, end: { line: 1, col: 10 }, extra: { message: 'test', severity: 'ERROR' } },
      { check_id: 'scan.test-presence-detector', path: '/target/src/app.py', start: { line: 2, col: 1 }, end: { line: 2, col: 10 }, extra: { message: 'test', severity: 'INFO' } },
      { check_id: 'C.Users.test-vuln-detector', path: '/target/src/app.py', start: { line: 3, col: 1 }, end: { line: 3, col: 10 }, extra: { message: 'test', severity: 'ERROR' } },
    ];
    const result = adaptFindings(findings, TEST_MANIFEST, '/target', () => 'PRODUCTION');
    assert.equal(result.findings.length, 3);
    assert.deepEqual(result.findings[0].detectorIds, ['test-vuln-detector']);
    assert.deepEqual(result.findings[1].detectorIds, ['test-presence-detector']);
    assert.deepEqual(result.findings[2].detectorIds, ['test-vuln-detector']);
  });
});
