# 08 — Exit Decision

## Phase 3.3 Status: COMPLETE

## What Was Accomplished

1. Verified Semgrep 1.172.0 as the stable future baseline (1.173.0 exists but was not used per user instruction)
2. Extracted all 121 detector definitions with full metadata
3. Ran all 121 detectors in isolation against positive, negative, and false-positive fixtures
4. Investigated all 27 initial failures through 5 additional testing rounds
5. Identified exact root causes for every failure
6. Built the master detector matrix with 121 rows
7. Built the logical-check matrix with 78 rows
8. Rechecked all special areas (ai-tool-abuse-output-exec, dangerous-eval-exec-ai-output, prompt-injection, secrets, missing-*)
9. Verified TypeScript engine status as IMPLEMENTED_BUT_NOT_PRODUCTION_WIRED
10. Confirmed all counts sum to exactly 121
11. Performed cross-engine gap analysis

## Key Findings

- 72 detectors work perfectly (QUALIFIED_AS_IS)
- 14 work but need renaming (QUALIFIED_BUT_RENAME)
- 5 work but need precision fixes (QUALIFIED_WITH_PRECISION_REPAIR)
- 22 don't fire due to pattern/regex issues (NEEDS_LOGIC_REPAIR)
- 7 need fundamental redesign (NEEDS_REDESIGN)
- 1 has a parser error (PARSER_ERROR)
- 78 logical checks (not 80 as previously claimed)
- 61 qualified logical checks

## Should Rule Redesign Phase Start?

**YES, but with precise scope:**

1. **REPAIR (28 detectors):** Fix the 22 logic issues (mostly `...` in strings and double-escaped regex), 5 precision issues, and 1 parser error
2. **REDESIGN (7 detectors):** Convert prompt-injection rules to taint mode
3. **RENAME (14 detectors):** Rename `missing-*` rules to reflect actual behavior

The REPAIR items are mostly mechanical fixes:
- 12 double-escaped regex: change `\\.` to `\.` in single-quoted YAML
- 6 `...` in strings: use `pattern-regex` or `metavariable-regex` instead
- 2 multi-lang issues: split into separate language rules
- 1 pattern doesn't match kwargs: adjust pattern syntax
- 1 `?` in template literal: escape or restructure pattern
- 5 precision issues: add `metavariable-regex` or additional patterns
- 1 parser error: fix regex bracket escaping

## Exit Gate

| Gate | Status |
|------|--------|
| All 121 detectors tested in isolation | PASS |
| All failures have root cause identified | PASS |
| Status counts sum to 121 | PASS |
| Action counts sum to 121 | PASS |
| Logical check count verified (78) | PASS |
| Special areas rechecked | PASS |
| TS engine status classified | PASS |
| No production rules changed | PASS |
| Nothing committed/pushed/published | PASS |
| Cross-engine gaps identified | PASS |
