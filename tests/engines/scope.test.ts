/**
 * Tests for scope classification and filtering.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getExcludePatterns,
  classifyPath,
  shouldIncludeFinding,
  getFindingScope,
} from '../../src/engines/ai-security/scope.js';

describe('Scope', () => {
  describe('classifyPath', () => {
    it('classifies production source as PRODUCTION', () => {
      assert.equal(classifyPath('src/app.py').scope, 'PRODUCTION');
      assert.equal(classifyPath('server/index.ts').scope, 'PRODUCTION');
      assert.equal(classifyPath('api/routes.js').scope, 'PRODUCTION');
    });

    it('classifies test files as NON_PRODUCTION', () => {
      assert.equal(classifyPath('tests/app.test.ts').scope, 'NON_PRODUCTION');
      assert.equal(classifyPath('test/test_app.py').scope, 'NON_PRODUCTION');
      assert.equal(classifyPath('src/app.test.ts').scope, 'NON_PRODUCTION');
      assert.equal(classifyPath('src/app.spec.js').scope, 'NON_PRODUCTION');
    });

    it('classifies examples and docs as NON_PRODUCTION', () => {
      assert.equal(classifyPath('examples/demo.py').scope, 'NON_PRODUCTION');
      assert.equal(classifyPath('docs/sample.js').scope, 'NON_PRODUCTION');
    });

    it('classifies node_modules as PRODUCTION (always-excluded)', () => {
      assert.equal(classifyPath('node_modules/lib/index.js').scope, 'PRODUCTION');
    });

    it('classifies generated/vendor as PRODUCTION (always-excluded)', () => {
      assert.equal(classifyPath('dist/bundle.js').scope, 'PRODUCTION');
      assert.equal(classifyPath('build/output.js').scope, 'PRODUCTION');
      assert.equal(classifyPath('vendor/lib.js').scope, 'PRODUCTION');
    });
  });

  describe('getExcludePatterns', () => {
    it('returns both always-excluded and non-production patterns for DEFAULT_PRODUCTION', () => {
      const patterns = getExcludePatterns('DEFAULT_PRODUCTION');
      assert.ok(patterns.includes('node_modules/**'));
      assert.ok(patterns.some((p) => p.includes('tests/')));
      assert.ok(patterns.some((p) => p.includes('docs/')));
    });

    it('returns only always-excluded patterns for EXTENDED_SECURITY', () => {
      const patterns = getExcludePatterns('EXTENDED_SECURITY');
      assert.ok(patterns.includes('node_modules/**'));
      assert.ok(patterns.includes('dist/**'));
      assert.ok(!patterns.some((p) => p.includes('tests/')));
      assert.ok(!patterns.some((p) => p.includes('docs/')));
    });
  });

  describe('shouldIncludeFinding', () => {
    it('includes production path findings in DEFAULT_PRODUCTION', () => {
      assert.equal(shouldIncludeFinding('src/app.py', 'VULNERABILITY', 'DEFAULT_PRODUCTION'), true);
      assert.equal(shouldIncludeFinding('src/app.py', 'RISK_SIGNAL', 'DEFAULT_PRODUCTION'), true);
      assert.equal(shouldIncludeFinding('src/app.py', 'PRESENCE', 'DEFAULT_PRODUCTION'), true);
    });

    it('includes VULNERABILITY findings from non-production paths in DEFAULT_PRODUCTION', () => {
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'VULNERABILITY', 'DEFAULT_PRODUCTION'), true);
      assert.equal(shouldIncludeFinding('examples/demo.py', 'VULNERABILITY', 'DEFAULT_PRODUCTION'), true);
    });

    it('excludes non-VULNERABILITY findings from non-production paths in DEFAULT_PRODUCTION', () => {
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'RISK_SIGNAL', 'DEFAULT_PRODUCTION'), false);
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'CONTROL_GAP', 'DEFAULT_PRODUCTION'), false);
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'PRESENCE', 'DEFAULT_PRODUCTION'), false);
    });

    it('includes all findings in EXTENDED_SECURITY', () => {
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'VULNERABILITY', 'EXTENDED_SECURITY'), true);
      assert.equal(shouldIncludeFinding('tests/app.test.ts', 'RISK_SIGNAL', 'EXTENDED_SECURITY'), true);
      assert.equal(shouldIncludeFinding('examples/demo.py', 'PRESENCE', 'EXTENDED_SECURITY'), true);
    });
  });

  describe('getFindingScope', () => {
    it('returns PRODUCTION for production paths', () => {
      assert.equal(getFindingScope('src/app.py', 'DEFAULT_PRODUCTION'), 'PRODUCTION');
    });

    it('returns NON_PRODUCTION for test paths in DEFAULT_PRODUCTION', () => {
      assert.equal(getFindingScope('tests/app.test.ts', 'DEFAULT_PRODUCTION'), 'NON_PRODUCTION');
    });

    it('returns PRODUCTION for all paths in EXTENDED_SECURITY', () => {
      assert.equal(getFindingScope('tests/app.test.ts', 'EXTENDED_SECURITY'), 'PRODUCTION');
    });
  });
});
