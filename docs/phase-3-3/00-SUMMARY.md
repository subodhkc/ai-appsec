# 00 — Summary

## Overall Conclusion

**B. RULEPACK_AND_TEST_HARNESS_BOTH_HAVE_MATERIAL_ISSUES** (confirmed from Phase 3.25, now with exact counts)

## Exact Final Counts (sum to 121)

| Status | Count |
|--------|-------|
| QUALIFIED_AS_IS | 72 |
| QUALIFIED_BUT_RENAME | 14 |
| QUALIFIED_BUT_MESSAGE_FIX | 0 |
| QUALIFIED_WITH_PRECISION_REPAIR | 5 |
| NEEDS_LOGIC_REPAIR | 22 |
| NEEDS_REDESIGN | 7 |
| PARSER_ERROR | 1 |
| NOT_YET_VALIDATED | 0 |
| **TOTAL** | **121** |

| Future Action | Count |
|---------------|-------|
| KEEP | 72 |
| RENAME | 14 |
| MESSAGE_FIX | 0 |
| REPAIR | 28 |
| REDESIGN | 7 |
| DEFER | 0 |
| DEPRECATE | 0 |
| **TOTAL** | **121** |

## Logical Checks

- **Total logical checks:** 78 (not 80 as previously claimed)
- **Qualified logical checks:** 61
- **Not-qualified logical checks:** 17

## Qualified Detectors

- **Qualified detector definitions:** 91 (QUALIFIED_AS_IS + QUALIFIED_BUT_RENAME + QUALIFIED_WITH_PRECISION_REPAIR)
- **Total detector definitions:** 121

## Semgrep Version

- **Historical production:** Semgrep 1.52.0 (returntocorp/semgrep:1.52.0)
- **Verified stable for future:** Semgrep 1.172.0 (semgrep/semgrep:1.172.0, digest sha256:65dcd4408adda7c183a6b4550cb1e9b19f7f627a6fbb7e0559bd466bedc44d7b)
- **1.173.0 exists** (released 2026-08-12) but was NOT used as the verified baseline per user instruction

## Key Root Causes for 22 NEEDS_LOGIC_REPAIR

1. **Double-escaped regex** (12 rules): `ai-rest-*` rules use `'https://api\\.openai\\.com'` — double backslash matches literal backslash, not dot
2. **`...` in strings doesn't work** (6 rules): Semgrep 1.52.0 does not support `...` as a wildcard inside regular string literals or f-strings
3. **Multi-language silent failure** (2 rules): JS patterns in multi-language rules cause silent failure for Python
4. **Pattern doesn't match keyword arguments** (1 rule): `ai-function-calling-python` patterns don't match kwargs inside function calls
5. **`?` in template literals** (1 rule): `api-key-in-url-js` — `?` character causes pattern matching failure

## Recommended Public Rulepack

Based ONLY on qualified evidence:
- **PUBLIC_READY_DETECTORS:** 86 (72 QUALIFIED_AS_IS + 14 QUALIFIED_BUT_RENAME)
- **PUBLIC_READY_LOGICAL_CHECKS:** 61
- **RULES_REQUIRING_SMALL_FIX:** 6 (5 precision + 1 parser)
- **RULES_REQUIRING_REDESIGN:** 29 (22 logic + 7 redesign)

The recommended eventual public rulepack size is **86 detectors / 61 logical checks**, expandable to 91/61 after precision fixes.
