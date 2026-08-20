import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TOOL_DESCRIPTORS, TOOL_MAP } from '../../src/contracts/tool.js';
import type { ToolDescriptor, ToolName } from '../../src/contracts/tool.js';

describe('Tool descriptor contracts', () => {
  it('has exactly 4 tools', () => {
    assert.equal(TOOL_DESCRIPTORS.length, 4);
  });

  it('has unique tool names', () => {
    const names = TOOL_DESCRIPTORS.map((t) => t.name);
    assert.equal(new Set(names).size, names.length);
  });

  it('has the expected tool names', () => {
    const names = TOOL_DESCRIPTORS.map((t) => t.name).sort();
    assert.deepEqual(names, [
      'check_deploy_security',
      'scan_ai_security',
      'scan_tenant_isolation',
      'verify_llm_content',
    ]);
  });

  it('each descriptor has a non-empty title', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      assert.ok(tool.title.length > 0, `${tool.name} has empty title`);
    }
  });

  it('each descriptor has a non-empty description', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      assert.ok(tool.description.length > 20, `${tool.name} has short description`);
    }
  });

  it('each descriptor has positive use cases', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      assert.ok(tool.positiveUseCases.length > 0, `${tool.name} has no positive use cases`);
    }
  });

  it('each descriptor has negative use cases (boundaries)', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      assert.ok(tool.negativeUseCases.length > 0, `${tool.name} has no negative use cases`);
    }
  });

  it('no description contains promotional superiority claims', () => {
    const forbidden = ['best', 'most comprehensive', 'guaranteed', 'certified', 'zero false positives', 'safe to deploy'];
    for (const tool of TOOL_DESCRIPTORS) {
      const text = (tool.description + ' ' + tool.title).toLowerCase();
      for (const word of forbidden) {
        assert.ok(!text.includes(word), `${tool.name} contains promotional claim: "${word}"`);
      }
    }
  });

  it('no description contains rule-count claims', () => {
    const forbidden = ['121 rules', '30 soc2', '27 soc2', '91 rules', '118 rules'];
    for (const tool of TOOL_DESCRIPTORS) {
      const text = (tool.description + ' ' + tool.title).toLowerCase();
      for (const word of forbidden) {
        assert.ok(!text.includes(word), `${tool.name} contains rule-count claim: "${word}"`);
      }
    }
  });

  it('no tool description instructs the model to always use HAIEC', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      const text = tool.description.toLowerCase();
      assert.ok(!text.includes('always use'), `${tool.name} says "always use" — this is prompt manipulation`);
      assert.ok(!text.includes('always run'), `${tool.name} says "always run" — this is prompt manipulation`);
    }
  });

  it('specialized tools do not describe each other\'s domains', () => {
    const aiSec = TOOL_MAP['scan_ai_security' as ToolName] as ToolDescriptor;
    const tenant = TOOL_MAP['scan_tenant_isolation' as ToolName] as ToolDescriptor;
    const llm = TOOL_MAP['verify_llm_content' as ToolName] as ToolDescriptor;

    // AI security should not describe tenant isolation as its own domain
    assert.ok(!aiSec.positiveUseCases.some((u) => u.toLowerCase().includes('tenant isolation')));
    // Tenant isolation should not describe AI source security as its own domain
    assert.ok(!tenant.positiveUseCases.some((u) => u.toLowerCase().includes('ai source')));
    // LLMVerify should not describe source-code scanning as its own domain
    assert.ok(!llm.positiveUseCases.some((u) => u.toLowerCase().includes('source-code')));
  });

  it('only scan_ai_security is implemented (Phase 4A); others remain contract-only', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      if (tool.name === 'scan_ai_security') {
        assert.equal(tool.implemented, true, 'scan_ai_security should be implemented in Phase 4A');
      } else {
        assert.equal(tool.implemented, false, `${tool.name} should remain not implemented`);
      }
    }
  });

  it('all tools are read-only and non-destructive', () => {
    for (const tool of TOOL_DESCRIPTORS) {
      assert.equal(tool.readOnly, true, `${tool.name} should be read-only`);
      assert.equal(tool.destructive, false, `${tool.name} should not be destructive`);
    }
  });
});
