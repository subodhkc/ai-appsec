import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const scenarios = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../evals/tool-selection/scenarios.json'), 'utf8')
);

describe('AI tool-selection eval corpus', () => {
  it('has at least 100 scenarios', () => {
    assert.ok(scenarios.length >= 100, `Expected >=100 scenarios, got ${scenarios.length}`);
  });

  it('has unique IDs', () => {
    const ids = scenarios.map((s: any) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('has all required fields for each scenario', () => {
    const required = ['id', 'naturalLanguagePrompt', 'projectContext', 'expectedTool', 'forbiddenTools', 'reason', 'riskIfWrong', 'hostApplicability', 'category'];
    for (const s of scenarios) {
      for (const field of required) {
        assert.ok(field in s, `Scenario ${s.id} missing field: ${field}`);
      }
    }
  });

  it('expectedTool is a valid value', () => {
    const valid = ['scan_ai_security', 'scan_tenant_isolation', 'verify_llm_content', 'check_deploy_security', 'NONE'];
    for (const s of scenarios) {
      assert.ok(valid.includes(s.expectedTool), `Scenario ${s.id} has invalid expectedTool: ${s.expectedTool}`);
    }
  });

  it('riskIfWrong is a valid value', () => {
    const valid = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    for (const s of scenarios) {
      assert.ok(valid.includes(s.riskIfWrong), `Scenario ${s.id} has invalid riskIfWrong: ${s.riskIfWrong}`);
    }
  });

  it('has NONE scenarios (negative tests)', () => {
    const noneCount = scenarios.filter((s: any) => s.expectedTool === 'NONE').length;
    assert.ok(noneCount >= 20, `Expected >=20 NONE scenarios, got ${noneCount}`);
  });

  it('has scenarios for each expected tool', () => {
    const tools = ['scan_ai_security', 'scan_tenant_isolation', 'verify_llm_content', 'check_deploy_security'];
    for (const tool of tools) {
      const count = scenarios.filter((s: any) => s.expectedTool === tool).length;
      assert.ok(count > 0, `No scenarios for expected tool: ${tool}`);
    }
  });

  it('forbidden tools do not include the expected tool', () => {
    for (const s of scenarios) {
      if (s.expectedTool !== 'NONE') {
        assert.ok(
          !s.forbiddenTools.includes(s.expectedTool),
          `Scenario ${s.id} forbids its own expected tool: ${s.expectedTool}`
        );
      }
    }
  });

  it('has 14 categories', () => {
    const categories = new Set(scenarios.map((s: any) => s.category));
    assert.ok(categories.size >= 14, `Expected >=14 categories, got ${categories.size}`);
  });

  it('"Run a security scan" → scan_ai_security only', () => {
    const s = scenarios.find((s: any) => s.naturalLanguagePrompt === 'Run a security scan');
    assert.ok(s, 'Missing "Run a security scan" scenario');
    assert.equal(s.expectedTool, 'scan_ai_security');
    assert.ok(s.forbiddenTools.includes('verify_llm_content'));
    assert.ok(s.forbiddenTools.includes('scan_tenant_isolation'));
  });

  it('"Check this LLM response for PII" → verify_llm_content only', () => {
    const s = scenarios.find((s: any) => s.naturalLanguagePrompt === 'Check this LLM response for PII');
    assert.ok(s, 'Missing "Check this LLM response for PII" scenario');
    assert.equal(s.expectedTool, 'verify_llm_content');
    assert.ok(s.forbiddenTools.includes('scan_ai_security'));
    assert.ok(s.forbiddenTools.includes('scan_tenant_isolation'));
  });

  it('"Fix the CSS padding on the login page" → NONE', () => {
    const s = scenarios.find((s: any) => s.naturalLanguagePrompt === 'Fix the CSS padding on the login page');
    assert.ok(s, 'Missing CSS padding scenario');
    assert.equal(s.expectedTool, 'NONE');
  });
});
