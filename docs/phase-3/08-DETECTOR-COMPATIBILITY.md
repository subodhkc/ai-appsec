# 08 — Detector Compatibility

## Breakdown

| Compatibility Status | Count | Detectors |
|----------------------|-------|-----------|
| COMPATIBLE_UNCHANGED | 119 | All detectors that fired identically or didn't fire in both |
| COMPATIBLE_IMPROVED | 1 | `ai-function-calling-js` (parser fix) |
| MODERN_ENGINE_REGRESSION | 1 | `ai-prompt-injection-langchain` (new parse error — rule bug) |
| COMPATIBLE_WITH_DIFFERENCE | 0 | — |
| RULE_REDESIGN_REQUIRED | 0 | — (existing rule-quality issues are separate from engine compatibility) |

## Important Distinction

Existing rule-quality problems (from Phase 2.6) are NOT counted as engine compatibility issues:

- 33 REDESIGN_REQUIRED detectors are rule-quality problems, not engine problems
- 87 detectors that didn't fire are pattern-scope issues, not engine issues
- 0 BLOCK candidates are fixture-validation issues, not engine issues

The engine compatibility assessment is purely about whether the modern engine executes the rules the same way as 1.52.0. It does.

## The One "Regression"

`ai-prompt-injection-langchain` has a new parse error in 1.173.0. However, this is a **rule bug** (JavaScript syntax in a Python rule), not an engine bug. The modern engine is correctly stricter. This should be classified as RULE_REDESIGN_REQUIRED, not MODERN_ENGINE_REGRESSION.

## Corrected Compatibility (with rule-bug reclassification)

| Status | Count |
|--------|-------|
| COMPATIBLE_UNCHANGED | 119 |
| COMPATIBLE_IMPROVED | 1 |
| RULE_REDESIGN_REQUIRED (rule bug, not engine) | 1 |
| MODERN_ENGINE_REGRESSION | 0 |
