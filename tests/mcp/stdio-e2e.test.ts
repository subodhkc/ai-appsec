/**
 * MCP stdio end-to-end test — validates the full MCP protocol path.
 *
 * Uses InMemoryTransport to connect a real MCP Client to our McpServer,
 * exercising: initialize → tools/list → tools/call.
 *
 * This is NOT a direct function call — it goes through the MCP protocol.
 *
 * The tools/call test uses an invalid target path to trigger the ERROR path,
 * which doesn't require Semgrep to be installed. This validates:
 * - MCP protocol negotiation works
 * - Tool registration is visible to clients
 * - structuredContent is returned
 * - isError semantics are correct
 * - Server remains healthy after calls
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../../src/mcp/server-factory.js';
import { SyntheticTestRulepackProvider } from '../../src/engines/ai-security/rulepack-provider.js';
import { AbsentSemgrepResolver } from '../fixtures/test-resolvers.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

describe('MCP stdio E2E (protocol validation)', () => {
  it('initialize → tools/list shows scan_ai_security with correct metadata', { timeout: 15000 }, async () => {
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );
    const server = createServer({ rulepackProvider: provider });

    const client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} },
    );

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    // Server must connect FIRST — client connect triggers initialize handshake
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    // tools/list
    const toolsResult = await client.listTools();
    assert.ok(toolsResult.tools, 'tools/list should return tools array');
    const toolNames = toolsResult.tools.map((t) => t.name);
    assert.ok(toolNames.includes('scan_ai_security'), 'scan_ai_security should be in tools/list');

    const scanTool = toolsResult.tools.find((t) => t.name === 'scan_ai_security');
    assert.ok(scanTool, 'scan_ai_security tool must exist');
    assert.ok(scanTool.description, 'Tool must have a description');
    assert.ok(scanTool.description!.length > 100, 'Description must be substantial');

    // Verify prompt-injection overstatement is removed
    assert.ok(!scanTool.description!.includes('prompt-injection exposure'),
      'Description must NOT contain "prompt-injection exposure" overstatement');

    // Verify description contains USE and DO NOT USE semantics
    assert.ok(scanTool.description!.includes('USE when'), 'Description must have USE section');
    assert.ok(scanTool.description!.includes('DO NOT use for:'), 'Description must have DO NOT USE section');

    // Verify annotations
    assert.ok(scanTool.annotations, 'Tool must have annotations');
    assert.strictEqual(scanTool.annotations!.readOnlyHint, true, 'readOnlyHint must be true');
    assert.strictEqual(scanTool.annotations!.openWorldHint, false, 'openWorldHint must be false');

    // Verify only truthful annotations are present (no destructiveHint/idempotentHint misuse)
    // The tool should NOT have destructiveHint or idempotentHint since they're not semantically relevant
    // to a read-only tool
    const annotationKeys = Object.keys(scanTool.annotations!);
    assert.ok(!annotationKeys.includes('destructiveHint'),
      'destructiveHint should not be set on a read-only tool');
    assert.ok(!annotationKeys.includes('idempotentHint'),
      'idempotentHint should not be set (not semantically relevant)');

    await client.close();
  });

  it('tools/call with invalid path returns isError=true with structuredContent', { timeout: 15000 }, async () => {
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );
    const server = createServer({ rulepackProvider: provider, semgrepResolver: new AbsentSemgrepResolver() });

    const client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} },
    );

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    // Server must connect FIRST — client connect triggers initialize handshake
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const callResult = await client.callTool({
      name: 'scan_ai_security',
      arguments: {
        targetPath: '/nonexistent/path/that/does/not/exist',
        timeout: 10,
      },
    });

    // Should have isError=true for invalid target
    assert.strictEqual((callResult as any).isError, true,
      'isError must be true for invalid target path');

    // Verify content is present
    assert.ok(callResult.content, 'Result must have content');
    assert.ok(Array.isArray(callResult.content), 'Content must be an array');
    assert.ok(callResult.content.length > 0, 'Content must not be empty');

    // Verify text content is present (compact summary)
    const textContent = callResult.content.find((c: any) => c.type === 'text');
    assert.ok(textContent, 'Text content must be present');
    assert.ok((textContent as any).text, 'Text content must have text');
    const text = (textContent as any).text as string;
    assert.ok(text.includes('scan_ai_security result'), 'Text must identify as scan_ai_security result');
    assert.ok(text.includes('Verdict: ERROR'), 'Text must show ERROR verdict');
    assert.ok(text.includes('Completeness: ERROR'), 'Text must show ERROR completeness');

    // Verify structured content is present
    const structured = (callResult as any).structuredContent;
    assert.ok(structured, 'structuredContent must be present even on error');
    assert.strictEqual(structured.verdict, 'ERROR', 'Verdict must be ERROR');
    assert.strictEqual(structured.completeness, 'ERROR', 'Completeness must be ERROR');
    assert.ok(structured.errors.length > 0, 'Must have error details');
    assert.ok(['SEMGREP_MISSING', 'INVALID_TARGET_PATH', 'PATH_BOUNDARY_VIOLATION', 'RULEPACK_MISSING'].includes(structured.errors[0].code),
      `Error code must be a known code, got: ${structured.errors[0].code}`);

    // Verify completeness is NOT TIMEOUT (canonical model)
    assert.ok(structured.completeness !== 'TIMEOUT',
      'Completeness must never be TIMEOUT — timeout is an error code, not a completeness type');

    await client.close();
  });

  it('server remains healthy after error result', { timeout: 15000 }, async () => {
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );
    const server = createServer({ rulepackProvider: provider, semgrepResolver: new AbsentSemgrepResolver() });

    const client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} },
    );

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    // Server must connect FIRST — client connect triggers initialize handshake
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    // First call with invalid path
    await client.callTool({
      name: 'scan_ai_security',
      arguments: { targetPath: '/nonexistent', timeout: 10 },
    });

    // Server must still respond
    const toolsResult = await client.listTools();
    assert.ok(toolsResult.tools.length > 0, 'Server must still respond after error call');

    await client.close();
  });

  it('only scan_ai_security is registered (other tools not implemented)', { timeout: 15000 }, async () => {
    const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'synthetic-rulepack');
    const provider = new SyntheticTestRulepackProvider(
      path.join(fixtureDir, 'test-rules.yml'),
      path.join(fixtureDir, 'test-manifest.json'),
    );
    const server = createServer({ rulepackProvider: provider });

    const client = new Client(
      { name: 'test-client', version: '1.0.0' },
      { capabilities: {} },
    );

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    // Server must connect FIRST — client connect triggers initialize handshake
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const toolsResult = await client.listTools();
    const toolNames = toolsResult.tools.map((t) => t.name);

    assert.ok(toolNames.includes('scan_ai_security'), 'scan_ai_security must be registered');
    assert.ok(!toolNames.includes('scan_tenant_isolation'), 'scan_tenant_isolation must NOT be registered');
    assert.ok(!toolNames.includes('verify_llm_content'), 'verify_llm_content must NOT be registered');
    assert.ok(!toolNames.includes('check_deploy_security'), 'check_deploy_security must NOT be registered');

    await client.close();
  });
});
