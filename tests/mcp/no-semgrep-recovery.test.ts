/**
 * Test: MCP server works without Semgrep (Part 6 — AI agent self-recovery).
 *
 * Verifies:
 * 1. MCP server starts and tools/list works without Semgrep
 * 2. scan_ai_security returns structured error with remediation metadata
 * 3. remediationCode is RUN_HAIEC_SETUP (or INSTALL_SEMGREP_1_173_0)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../../src/mcp/server-factory.js';
import { AbsentSemgrepResolver } from '../fixtures/test-resolvers.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

describe('MCP without Semgrep (self-recovery)', () => {
  it('tools/list works without Semgrep', { timeout: 15000 }, async () => {
    // Use absent resolver — no Semgrep available regardless of PATH
    const server = createServer({ semgrepResolver: new AbsentSemgrepResolver() });
    const client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: {} });
    const [ct, st] = InMemoryTransport.createLinkedPair();
    await server.connect(st);
    await client.connect(ct);

    const tools = await client.listTools();
    assert.ok(tools.tools.find((t) => t.name === 'scan_ai_security'),
      'scan_ai_security must be listed even without Semgrep');

    await client.close();
  });

  it('scan returns structured error with remediation when Semgrep missing', { timeout: 15000 }, async () => {
    // Use synthetic rulepack so we don't depend on bundled Public Core path resolution
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const { SyntheticTestRulepackProvider } = await import('../../src/engines/ai-security/rulepack-provider.js');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );

    // Use absent resolver — explicitly controls Semgrep absence regardless of PATH
    const server = createServer({
      rulepackProvider: provider,
      semgrepResolver: new AbsentSemgrepResolver(),
    });
    const client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: {} });
    const [ct, st] = InMemoryTransport.createLinkedPair();
    await server.connect(st);
    await client.connect(ct);

    const result = await client.callTool({
      name: 'scan_ai_security',
      arguments: { targetPath: path.resolve(__dirname, '..', 'fixtures', 'synthetic-target'), timeout: 10 },
    });

    assert.strictEqual((result as any).isError, true, 'isError must be true');
    const sc = (result as any).structuredContent;
    assert.ok(sc, 'structuredContent must be present');
    assert.strictEqual(sc.verdict, 'ERROR');
    assert.strictEqual(sc.completeness, 'ERROR');
    assert.ok(sc.errors.length > 0, 'Must have errors');

    const error = sc.errors[0];
    assert.ok(['SEMGREP_MISSING', 'SEMGREP_EXECUTION_ERROR', 'SEMGREP_UNSUPPORTED_VERSION'].includes(error.code),
      `Error code should be a Semgrep error, got: ${error.code}`);

    // Remediation metadata must be present
    assert.ok(error.remediation, 'Error must have remediation metadata');
    assert.ok(error.remediation.dependency, 'Remediation must have dependency');
    assert.ok(error.remediation.requiredVersion, 'Remediation must have requiredVersion');
    assert.ok(error.remediation.remediationCode, 'Remediation must have remediationCode');
    assert.ok(['RUN_HAIEC_SETUP', 'INSTALL_SEMGREP_1_173_0'].includes(error.remediation.remediationCode),
      `remediationCode should be RUN_HAIEC_SETUP or INSTALL_SEMGREP_1_173_0, got: ${error.remediation.remediationCode}`);

    await client.close();
  });
});
