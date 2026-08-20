/**
 * Tests for MCP tool registration and execution.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../../src/mcp/server-factory.js';
import { SCAN_AI_SECURITY, SCAN_TENANT_ISOLATION, VERIFY_LLM_CONTENT, CHECK_DEPLOY_SECURITY } from '../../src/contracts/tool.js';

describe('MCP tool registration', () => {
  it('creates server without throwing', () => {
    assert.doesNotThrow(() => createServer());
  });

  it('scan_ai_security is marked as implemented', () => {
    assert.equal(SCAN_AI_SECURITY.implemented, true);
  });

  it('scan_ai_security has correct name', () => {
    assert.equal(SCAN_AI_SECURITY.name, 'scan_ai_security');
  });

  it('scan_ai_security is read-only', () => {
    assert.equal(SCAN_AI_SECURITY.readOnly, true);
  });

  it('scan_ai_security is non-destructive', () => {
    assert.equal(SCAN_AI_SECURITY.destructive, false);
  });

  it('tool description includes positive use cases', () => {
    assert.ok(SCAN_AI_SECURITY.description.includes('AI/LLM/agent'));
    assert.ok(SCAN_AI_SECURITY.description.includes('security'));
  });

  it('tool description includes negative boundaries (DO NOT use for)', () => {
    const lower = SCAN_AI_SECURITY.description.toLowerCase();
    assert.ok(lower.includes('do not use'));
    // negativeUseCases should mention the competing tools
    const negText = SCAN_AI_SECURITY.negativeUseCases.join(' ');
    assert.ok(negText.includes('scan_tenant_isolation') || negText.includes('tenant'));
    assert.ok(negText.includes('verify_llm_content') || negText.includes('LLM response'));
  });
});

describe('MCP tool independence', () => {
  it('other tools remain unimplemented', () => {
    assert.equal(SCAN_TENANT_ISOLATION.implemented, false);
    assert.equal(VERIFY_LLM_CONTENT.implemented, false);
    assert.equal(CHECK_DEPLOY_SECURITY.implemented, false);
  });
});
