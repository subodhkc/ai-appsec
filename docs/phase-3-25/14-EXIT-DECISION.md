# 14 — Exit Decision

## Overall Conclusion

**B. RULEPACK_AND_TEST_HARNESS_BOTH_HAVE_MATERIAL_ISSUES**

The production rulepack is NOT broadly broken. Most rules (~95/121) work as designed. However:
- 7 prompt-injection rules overstate their evidence (detect API calls, not injection)
- 15 "missing-*" rules have misleading names (detect concrete behavior, not absence)
- 2 rules have parser errors
- 2 rules are too broad (match placeholders / false positive on subprocess.run)
- 1 rule is too narrow (only Flask, not FastAPI)

The test harness (both historical and Phase 2.6) had material issues:
- Historical test_sample_code.py was never an automated test and contains wrong expectations
- Phase 2.6 fixtures were generated from names/messages, not from actual rule patterns
- Phase 2.6 negative/FP logic counted cross-rule interference as failures

## Corrected Coverage

| Metric | Value |
|--------|-------|
| Phase 2.6 reported | 23/80 (28.75%) |
| Corrected isolated-rule estimate | ~45/80 (56%) |
| Corrected full-pipeline estimate | ~40/80 (50%) |

## Does Phase 3.5 Rebuild Recommendation Still Stand?

**YES, with modified scope.**

The Phase 3.5 redesign should focus on:
1. **REDESIGN (7 rules):** Prompt injection rules → taint mode
2. **REPAIR (5 rules):** Fix parser errors, add metavariable-regex, add FastAPI patterns
3. **RENAME (15 rules):** Rename "missing-*" rules to reflect actual behavior
4. **KEEP (~95 rules):** No changes needed

The full 121-rule rebuild is NOT needed. Most rules work correctly. The Phase 3.5 MVP should ship the ~95 WORKS_AS_DESIGNED rules plus the 15 RENAME_OR_RECLASSIFY rules (after renaming), totaling ~110 rules. The 7 REDESIGN and 5 REPAIR rules should be excluded from the initial MVP.

## Exit Gate

| Gate | Status |
|------|--------|
| Historical tests inventoried | PASS |
| Production runtime pipeline traced | PASS |
| False-positive-filter reachability resolved | PASS (DEAD_CODE) |
| Deterministic-engine reachability resolved | PASS (DEAD_CODE) |
| Phase 2.6 harness logic audited | PASS |
| Key rules tested in semantic batches | PASS (7 calibration cases) |
| Isolated rule results exist | PASS |
| Full-pack interference results exist | PASS |
| 23/80 recalculated | PASS (~45/80 corrected estimate) |
| No production rules changed | PASS |
| Nothing committed/pushed/published | PASS |
