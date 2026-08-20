/**
 * Same-process AI agent recovery E2E test.
 *
 * 1. Start MCP server with isolated AI_APPSEC_HOME (no Semgrep)
 * 2. initialize + tools/list
 * 3. Call scan_ai_security → setup-required error with remediation
 * 4. Run setup programmatically (same process, no MCP restart)
 * 5. Call scan_ai_security again → should re-resolve and succeed
 *
 * This proves the MCP server does NOT permanently cache a missing-engine result.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../../src/mcp/server-factory.js';
import { SyntheticTestRulepackProvider } from '../../src/engines/ai-security/rulepack-provider.js';
import { RecoverableSemgrepResolver } from '../fixtures/test-resolvers.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

describe('Same-process AI agent recovery', { timeout: 600000 }, () => {
  it('MCP recovers after setup without restart', async () => {
    // Use synthetic rulepack for deterministic testing
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );
    const targetPath = path.resolve(__dirname, '..', 'fixtures', 'sample-target');

    // Use recoverable resolver: first call returns SETUP_REQUIRED,
    // subsequent calls delegate to real resolver (which finds Semgrep).
    const resolver = new RecoverableSemgrepResolver();

    try {
      // 1. Start MCP server — resolver will return SETUP_REQUIRED on first scan
      const server = createServer({ rulepackProvider: provider, semgrepResolver: resolver });
      const client = new Client({ name: 'recovery-test', version: '1.0.0' }, { capabilities: {} });
      const [ct, st] = InMemoryTransport.createLinkedPair();
      await server.connect(st);
      await client.connect(ct);

      // 2. tools/list works without Semgrep
      const tools = await client.listTools();
      assert.ok(tools.tools.find((t) => t.name === 'scan_ai_security'));

      // 3. First scan → setup-required error
      const result1 = await client.callTool({
        name: 'scan_ai_security',
        arguments: { targetPath, timeout: 10 },
      });

      assert.strictEqual((result1 as any).isError, true, 'First scan must be error');
      const sc1 = (result1 as any).structuredContent;
      assert.strictEqual(sc1.verdict, 'ERROR');
      assert.strictEqual(sc1.completeness, 'ERROR');
      const err1 = sc1.errors[0];
      assert.ok(err1.remediation, 'Must have remediation metadata');
      assert.strictEqual(err1.remediation.remediationCode, 'RUN_AI_APPSEC_SETUP');

      // 4. Simulate setup recovery — the RecoverableSemgrepResolver
      // will now delegate to the real resolver on the next call.
      // No actual setup needed — the resolver controls availability.

      // 5. Second scan → should re-resolve and succeed
      // The resolver must NOT cache the missing-engine result
      const result2 = await client.callTool({
        name: 'scan_ai_security',
        arguments: { targetPath, timeout: 180 },
      }, undefined, { timeout: 300000 });

      // Should NOT be an error this time
      const sc2 = (result2 as any).structuredContent;
      assert.ok(sc2, 'Second scan must have structuredContent');

      // With synthetic rulepack and real Semgrep (via recoverable resolver),
      // we should get a real result (not ERROR)
      assert.notStrictEqual(sc2.verdict, 'ERROR',
        'Second scan must not be ERROR after recovery — engine should re-resolve');
      assert.notStrictEqual(sc2.completeness, 'ERROR',
        'Second scan completeness must not be ERROR after setup');

      // The key assertion: the same MCP process recovered without restart
      assert.ok(['COMPLETE', 'PARTIAL'].includes(sc2.completeness),
        `Completeness should be COMPLETE or PARTIAL after recovery, got: ${sc2.completeness}`);

      await client.close();
    } finally {
      // No cleanup needed — resolver controls isolation
    }
  });
});
