/**
 * Tests for RulepackProvider.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import * as url from 'node:url';
import {
  PrivateLocalRulepackProvider,
  SyntheticTestRulepackProvider,
  RulepackProviderError,
  resolveRulepack,
} from '../../src/engines/ai-security/rulepack-provider.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '..', 'fixtures', 'synthetic-rulepack');

describe('RulepackProvider', () => {
  describe('SyntheticTestRulepackProvider', () => {
    it('resolves the synthetic test rulepack', async () => {
      const provider = new SyntheticTestRulepackProvider(
        path.join(FIXTURES, 'test-rules.yml'),
        path.join(FIXTURES, 'test-manifest.json'),
      );
      const resolved = await provider.resolve();
      assert.equal(resolved.rulepackVersion, 'test-0.1.0');
      assert.equal(resolved.manifestVersion, 'test-0.1.0');
      assert.match(resolved.rulepackDigest, /^sha256:[0-9a-f]{64}$/);
      assert.match(resolved.manifestDigest, /^sha256:[0-9a-f]{64}$/);
      assert.equal(resolved.manifest.securityChecks.length, 4);
      assert.equal(resolved.manifest.detectors.length, 4);
    });

    it('has name SyntheticTestRulepackProvider', () => {
      const provider = new SyntheticTestRulepackProvider('x', 'y');
      assert.equal(provider.name, 'SyntheticTestRulepackProvider');
    });
  });

  describe('PrivateLocalRulepackProvider', () => {
    it('throws RULEPACK_MISSING when rulepack path does not exist', async () => {
      const provider = new PrivateLocalRulepackProvider(
        '/nonexistent/rulepack.yml',
        path.join(FIXTURES, 'test-manifest.json'),
      );
      await assert.rejects(provider.resolve(), RulepackProviderError);
      try { await provider.resolve(); } catch (e) {
        assert.equal((e as RulepackProviderError).code, 'RULEPACK_MISSING');
      }
    });

    it('throws MANIFEST_MISSING when manifest path does not exist', async () => {
      const provider = new PrivateLocalRulepackProvider(
        path.join(FIXTURES, 'test-rules.yml'),
        '/nonexistent/manifest.json',
      );
      await assert.rejects(provider.resolve(), RulepackProviderError);
      try { await provider.resolve(); } catch (e) {
        assert.equal((e as RulepackProviderError).code, 'MANIFEST_MISSING');
      }
    });

    it('fromEnv returns null when env vars are not set', () => {
      const oldR = process.env.HAIEC_RULEPACK_PATH;
      const oldM = process.env.HAIEC_MANIFEST_PATH;
      delete process.env.HAIEC_RULEPACK_PATH;
      delete process.env.HAIEC_MANIFEST_PATH;
      try {
        assert.equal(PrivateLocalRulepackProvider.fromEnv(), null);
      } finally {
        if (oldR) process.env.HAIEC_RULEPACK_PATH = oldR;
        if (oldM) process.env.HAIEC_MANIFEST_PATH = oldM;
      }
    });

    it('fromEnv returns provider when env vars are set', () => {
      const oldR = process.env.HAIEC_RULEPACK_PATH;
      const oldM = process.env.HAIEC_MANIFEST_PATH;
      process.env.HAIEC_RULEPACK_PATH = '/tmp/test-rulepack.yml';
      process.env.HAIEC_MANIFEST_PATH = '/tmp/test-manifest.json';
      try {
        const result = PrivateLocalRulepackProvider.fromEnv();
        assert.ok(result !== null);
        assert.ok(result instanceof PrivateLocalRulepackProvider);
      } finally {
        if (oldR) process.env.HAIEC_RULEPACK_PATH = oldR;
        else delete process.env.HAIEC_RULEPACK_PATH;
        if (oldM) process.env.HAIEC_MANIFEST_PATH = oldM;
        else delete process.env.HAIEC_MANIFEST_PATH;
      }
    });
  });

  describe('resolveRulepack', () => {
    it('uses explicit provider when provided', async () => {
      const provider = new SyntheticTestRulepackProvider(
        path.join(FIXTURES, 'test-rules.yml'),
        path.join(FIXTURES, 'test-manifest.json'),
      );
      const resolved = await resolveRulepack(provider);
      assert.equal(resolved.rulepackVersion, 'test-0.1.0');
    });

    it('falls back to bundled Public Core when no provider and no env vars', async () => {
      const oldR = process.env.HAIEC_RULEPACK_PATH;
      const oldM = process.env.HAIEC_MANIFEST_PATH;
      delete process.env.HAIEC_RULEPACK_PATH;
      delete process.env.HAIEC_MANIFEST_PATH;
      try {
        // Now defaults to BundledPublicCoreRulepackProvider
        const resolved = await resolveRulepack();
        assert.ok(resolved.rulepackVersion, 'Should resolve a rulepack version');
        assert.ok(resolved.rulepackDigest.startsWith('sha256:'), 'Should have a digest');
      } finally {
        if (oldR) process.env.HAIEC_RULEPACK_PATH = oldR;
        if (oldM) process.env.HAIEC_MANIFEST_PATH = oldM;
      }
    });
  });
});
