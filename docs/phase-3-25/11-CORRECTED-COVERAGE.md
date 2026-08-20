# 11 — Corrected Coverage

## Original vs Corrected

| Metric | Phase 2.6 | Corrected |
|--------|-----------|-----------|
| PHASE26_REPORTED_POSITIVE_COVERAGE | 23/80 | — |
| CORRECTED_ISOLATED_RULE_POSITIVE_COVERAGE | — | ~45/80 (estimated) |
| CORRECTED_FULL_PIPELINE_POSITIVE_COVERAGE | — | ~40/80 (estimated, lower due to cross-rule interference masking) |

## Why the Difference

### Reasons coverage was UNDERREPORTED in Phase 2.6:

1. **Wrong taint sources in fixtures (~15 checks):** Fixtures used APIs like `llm.generate(...)` that don't match the rule's configured taint sources. The rules are correct; the fixtures were wrong.

2. **Cross-rule interference on negative/FP fixtures (~6 checks):** Other detectors firing caused FAIL even though the tested detector correctly did NOT fire.

3. **`missing-max-tokens` reclassification (~2 checks):** Phase 2.6 classified this as LOGIC_ERROR. Isolated testing proves it WORKS_AS_DESIGNED.

4. **`missing-data-minimization` reclassification (~2 checks):** Phase 2.6 may have classified this as invalid CONTROL_GAP. Isolated testing proves it detects concrete behavior correctly.

### Reasons coverage is still not 80/80:

1. **Real rule gaps (~20 checks):** Some detectors genuinely don't fire on any fixture because their patterns are too specific or reference APIs not present in fixtures.

2. **Parser errors (~2 checks):** `ai-function-calling-js` and `dangerous-eval-exec-ai-output` have parse errors that prevent execution.

3. **Too narrow patterns (~5 checks):** Rules like `missing-ai-auth-python` only match specific framework patterns (Flask but not FastAPI).

4. **Taint mode false positives (~2 checks):** `ai-tool-abuse-output-exec` fires on non-tainted data due to Semgrep 1.52.0 taint mode behavior.

## Final Logical-Check Count

**80** — unchanged. The semantic grouping from Phase 2.5/2.6 is correct. All 5 AMBIGUOUS groups were resolved in Phase 2.6.

## Important Caveat

The corrected ~45/80 is an ESTIMATE based on isolated testing of 7 key detectors and analysis of the remaining 114 detectors' pattern semantics. A full 121-rule isolated batch test would refine this number.
