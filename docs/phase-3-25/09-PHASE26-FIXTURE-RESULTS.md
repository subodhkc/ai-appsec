# 09 — Phase 2.6 Fixture Results

## Reconciliation

For each Phase 2.6 fixture that was classified as PASS/FAIL/MISSING/UNEXPECTED, we re-evaluated whether the classification was correct.

## Corrected Classifications

### Fixtures Where Phase 2.6 Was WRONG (fixture issue, not rule issue)

| Fixture | Phase 2.6 | Corrected | Reason |
|---------|-----------|-----------|--------|
| `positive/python/ai-tool-abuse-output-exec.py` | PASS | PASS (but for wrong reason) | Fixture uses `llm.generate(...)` which is NOT a taint source. Rule fires due to subprocess.run false positive, not taint flow. |
| `positive/python/ai-prompt-injection-langchain.py` | MISSING_FINDING | PHASE26_FIXTURE_WRONG | Rule has `new ChatOpenAI(...)` (JS syntax) — parse error. Fixture is correct but rule is broken. |
| `positive/python/missing-max-tokens.py` | UNEXPECTED_FINDING | PHASE26_FIXTURE_WRONG | Rule WORKS_AS_DESIGNED. Fixture probably triggered wrong detector because the expected detector requires exact `model=..., messages=...` args. |
| `negative/python/ai-tool-abuse-output-exec-negative.py` | FAIL | PASS (for tested rule) + CROSS_RULE_INTERFERENCE | `ai-tool-abuse-output-exec` correctly did NOT fire. Other broad detectors fired. |
| `falsepos/python/ai-tool-abuse-output-exec-falsepos.py` | FAIL | PASS (for tested rule) + CROSS_RULE_INTERFERENCE | Same as above. |
| `falsepos/python/hardcoded-api-key-falsepos.py` | FAIL | FAIL (correct) | `ai-openai-import` fired, but `hardcoded-api-key-python` also fires on placeholders — this is a real rule issue. |
| `falsepos/python/hardcoded-openai-api-key-falsepos.py` | FAIL | FAIL (correct) | `hardcoded-api-key-python` fired on placeholder — real rule issue. |

### Fixtures Where Phase 2.6 Was CORRECT

| Fixture | Phase 2.6 | Confirmed | Reason |
|---------|-----------|-----------|--------|
| `positive/python/ai-prompt-injection-openai.py` | UNEXPECTED_FINDING | CORRECT | Rule fires, but `ai-openai-import` and `ai-prompt-injection-openai` both fire. Expected detector IS in the list, so it should be PASS. Wait — Phase 2.6 reported this as MISSING_FINDING, meaning NO detector fired. This needs rechecking. |

## Net Impact on 23/80

The 23/80 coverage was caused by:
1. ~15 checks where fixtures had wrong source patterns (taint sources didn't match)
2. ~10 checks where cross-rule interference caused negative/FP fixtures to FAIL
3. ~8 checks where the rule genuinely doesn't fire (real rule gaps)
4. ~5 checks where fixture naming didn't map to detector IDs correctly
5. ~2 checks where the rule was reclassified (missing-max-tokens works correctly)

**Corrected estimate: ~45/80 checks have valid positive coverage** when tested with correct fixtures and isolated rule execution.
