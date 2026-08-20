/**
 * Phase 4A selection evals — positive and negative agent-selection tests.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const scenarios = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../evals/tool-selection/scenarios.json'), 'utf8'),
) as readonly {
  id: string;
  naturalLanguagePrompt: string;
  expectedTool: string;
  forbiddenTools: readonly string[];
  category: string;
}[];

describe('Phase 4A selection evals', () => {
  const phase4a = scenarios.filter((s) => s.category.startsWith('phase4a_'));

  describe('positive cases (should select scan_ai_security)', () => {
    const positive = phase4a.filter((s) => s.category === 'phase4a_positive');
    it('has at least 5 positive cases', () => {
      assert.ok(positive.length >= 5, `Expected >=5, got ${positive.length}`);
    });
    for (const s of positive) {
      it(`"${s.naturalLanguagePrompt}" → scan_ai_security`, () => {
        assert.equal(s.expectedTool, 'scan_ai_security');
        assert.ok(s.forbiddenTools.includes('verify_llm_content'));
        assert.ok(s.forbiddenTools.includes('scan_tenant_isolation'));
      });
    }
  });

  describe('negative cases (should NOT select scan_ai_security)', () => {
    const negative = phase4a.filter((s) => s.category === 'phase4a_negative');
    it('has at least 5 negative cases', () => {
      assert.ok(negative.length >= 5, `Expected >=5, got ${negative.length}`);
    });
    for (const s of negative) {
      it(`"${s.naturalLanguagePrompt}" → ${s.expectedTool}`, () => {
        if (s.expectedTool !== 'NONE') {
          assert.notEqual(s.expectedTool, 'scan_ai_security');
        }
      });
    }
  });

  describe('cross-tool selection correctness', () => {
    it('tenant isolation prompts do not select scan_ai_security', () => {
      const tenant = phase4a.filter((s) => s.expectedTool === 'scan_tenant_isolation');
      for (const s of tenant) assert.ok(s.forbiddenTools.includes('scan_ai_security'));
    });
    it('LLM content prompts do not select scan_ai_security', () => {
      const llm = phase4a.filter((s) => s.expectedTool === 'verify_llm_content');
      for (const s of llm) assert.ok(s.forbiddenTools.includes('scan_ai_security'));
    });
    it('deploy gate prompts do not select scan_ai_security', () => {
      const deploy = phase4a.filter((s) => s.expectedTool === 'check_deploy_security');
      for (const s of deploy) assert.ok(s.forbiddenTools.includes('scan_ai_security'));
    });
  });
});
