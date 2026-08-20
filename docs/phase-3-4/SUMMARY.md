# Phase 3.4 — Evidence Reconciliation Summary

## Phase Decision: COMPLETE

## Key Findings

### Engine Drift: ZERO
- Phase 2.6 corpus rerun on 1.173.0: 107/107 fixtures identical to 1.52.0
- 165 findings, 34 detectors, 1 parser error — same on both engines
- All Phase 3.3 diagnoses are CURRENT_STABLE_CONFIRMED

### Phase 3.3 Correction
- `dangerous-eval-exec-ai-output`: Phase 3.3 diagnosed as multi-lang silent failure. CORRECTED: the rule works for `exec()` but not `eval()` in multi-lang context. The `new Function($AI_OUTPUT)` pattern is NOT the cause — removing it doesn't fix `eval()`. The `eval($LLM_OUTPUT)` pattern simply doesn't match in multi-lang context. Reclassified from NEEDS_LOGIC_REPAIR to QUALIFIED_WITH_PRECISION_REPAIR.

### Reconciliation: 65 CONFLICT_2_6_FAIL_3_3_PASS
65 detectors failed Phase 2.6 golden corpus but passed Phase 3.3 isolated tests. Explanation: Phase 2.6 golden fixtures were auto-generated and didn't match exact pattern syntax. Phase 3.3 isolated fixtures were specifically crafted. These are NOT overfit — the patterns are straightforward (e.g., `while True:`, `os.system(...)`) and the golden fixtures simply had wrong syntax.

### 8 CONFLICT_2_6_PASS_3_3_FAIL
8 detectors passed Phase 2.6 but Phase 3.3 found defects:
- 7 prompt-injection rules: fired on golden fixture (API call) but can't distinguish safe from injection
- 1 dangerous-eval-exec: fired on golden fixture (exec) but eval pattern doesn't work in multi-lang

### Reproducibility: 5/5 IDENTICAL
Normalized digest: 53b425562b6a66fa45e26fb58006ba76feb7abf0d46b8d78702ee210beb1b75d

### rc.2 Repaired Candidate
- 185 findings (up from 165)
- 45 detectors fired (up from 34)
- 0 parser errors (down from 1)
- SHA256: ae3efd039c6f2b551f5af12b2353c15af4bf8b291a3c0381823971ce5fac8434

### Public Claims Audit
- 7 SUPPORTED
- 3 SUPPORTED_WITH_SCOPE
- 2 CONFLICTING
- 2 UNSUPPORTED
- 2 FALSE_AS_WRITTEN
- 1 NOT_YET_TESTED

### Final Public-Ready Counts
- PUBLIC_READY: 72
- READY_AFTER_METADATA_FIX: 14
- READY_AFTER_RULE_REPAIR: 28
- REDESIGN_REQUIRED: 7
- DEFER: 0
- DEPRECATE: 0
- TOTAL: 121
