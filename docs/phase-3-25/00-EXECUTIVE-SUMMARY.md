# 00 — Executive Summary

## Overall Conclusion

**B. RULEPACK_AND_TEST_HARNESS_BOTH_HAVE_MATERIAL_ISSUES**

The production rulepack is NOT broadly broken — many rules work as designed. However, both the rules and the test harnesses (historical and Phase 2.6) have material issues that caused the 23/80 coverage number to be misleadingly low.

## Key Findings

### Test Harness Issues (Inflated the "broken" count)

1. **Historical test_sample_code.py** contains invalid semantic expectations (e.g., `os.system("ls -la")` expected to trigger a taint rule)
2. **Phase 2.6 fixtures** were generated from hardcoded templates, not from actual rule patterns — some fixtures use APIs that don't match the rule's configured sources
3. **Phase 2.6 negative/FP fixture logic** marks FAIL if ANY detector fires, even if the tested detector correctly did NOT fire (cross-rule interference)
4. **Phase 2.6 positive fixture logic** is correct: if expected detector fires, it's PASS regardless of other detectors

### Rule Issues (Real defects)

1. **`dangerous-eval-exec-ai-output`**: Has `new Function($AI_OUTPUT)` (JavaScript syntax) in a Python rule — causes parse error in isolation
2. **`ai-tool-abuse-output-exec`**: Taint rule fires on ANY `subprocess.run(..., shell=True, ...)` regardless of taint flow — Semgrep 1.52.0 taint mode issue with `...` in sink arguments
3. **`ai-prompt-injection-*` (7 rules)**: Fire on ALL AI API calls, not just injection — WORKS_BUT_MESSAGE_OVERSTATES
4. **`hardcoded-api-key-python`**: Matches placeholders like `YOUR_API_KEY` — WORKS_BUT_TOO_BROAD
5. **`missing-ai-auth-python`**: Only matches Flask `@app.route(...)`, not FastAPI `@app.post(...)` — WORKS_BUT_TOO_NARROW
6. **`missing-max-tokens`**: Actually WORKS_AS_DESIGNED (correctly distinguishes absence — contrary to initial Phase 2.6 classification)

### Production Pipeline

- API → Modal scanner → Semgrep 1.52 → parse → DB
- NO TypeScript post-processing of Semgrep findings
- `lib/ai-security/false-positive-filter.ts` = DEAD CODE (not imported anywhere)
- `lib/ai-security/deterministic-engine.ts` = DEAD CODE (not imported anywhere)

## Corrected Coverage

| Metric | Phase 2.6 Reported | Corrected |
|--------|-------------------|-----------|
| Positive coverage | 23/80 (28.75%) | ~45/80 (56%) |
| Reason for difference | — | Bad fixtures + cross-rule interference + wrong expectations |

The corrected number is an estimate based on isolated rule testing of key detectors. A full 121-rule isolated batch test would refine this number.
