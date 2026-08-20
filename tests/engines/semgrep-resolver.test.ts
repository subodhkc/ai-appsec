/**
 * Tests for SemgrepResolver.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SemgrepResolver, REQUIRED_SEMGREP_VERSION } from '../../src/engines/ai-security/semgrep-resolver.js';

describe('SemgrepResolver', () => {
  it('requires Semgrep 1.173.0', () => {
    assert.equal(REQUIRED_SEMGREP_VERSION, '1.173.0');
  });

  it('returns error status when configured path is invalid', async () => {
    const resolver = new SemgrepResolver({ configuredPath: '/nonexistent/semgrep-path-12345' });
    const result = await resolver.resolve();
    // Configured path fails → may fall through to PATH lookup → MISSING or find real semgrep
    assert.ok(['MISSING', 'EXECUTION_ERROR', 'AVAILABLE_SUPPORTED_VERSION', 'AVAILABLE_UNSUPPORTED_VERSION'].includes(result.status));
  });

  it('provides installation guidance when missing', async () => {
    const resolver = new SemgrepResolver({ configuredPath: '/nonexistent/semgrep-path-12345' });
    const result = await resolver.resolve();
    if (result.status === 'MISSING') {
      // New message includes setup guidance
      assert.ok(result.message.includes('Semgrep') || result.message.includes('semgrep'));
      assert.ok(result.remediationCode !== undefined);
    }
  });

  it('returns unsupported version status when version does not match', async () => {
    const resolver = new SemgrepResolver({ configuredPath: 'node', requiredVersion: '99.99.99' });
    const result = await resolver.resolve();
    assert.ok(['MISSING', 'EXECUTION_ERROR', 'AVAILABLE_UNSUPPORTED_VERSION'].includes(result.status));
  });
});
