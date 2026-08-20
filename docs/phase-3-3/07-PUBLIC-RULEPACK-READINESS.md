# 07 — Public Rulepack Readiness

## Evidence-Based Assessment

### PUBLIC_READY_DETECTORS: 86

These detectors are qualified and can be published as-is:
- 72 QUALIFIED_AS_IS (work correctly, accurate names and messages)
- 14 QUALIFIED_BUT_RENAME (work correctly, names should be changed in a future phase but don't block release)

### PUBLIC_READY_LOGICAL_CHECKS: 61

These logical checks have at least one qualified detector.

### RULES_REQUIRING_SMALL_FIX: 6

These detectors work but need minor fixes before they should be published:
- 5 QUALIFIED_WITH_PRECISION_REPAIR (too broad or too narrow)
- 1 PARSER_ERROR (regex fix needed)

### RULES_REQUIRING_REDESIGN: 29

These detectors need significant work before they can be published:
- 22 NEEDS_LOGIC_REPAIR (don't fire due to pattern/regex issues)
- 7 NEEDS_REDESIGN (fundamental approach is wrong)

## Recommended Eventual Public Rulepack Size

Based ONLY on qualified evidence:

**Initial public pack: 86 detectors / 61 logical checks**

This includes:
- All 72 QUALIFIED_AS_IS detectors
- All 14 QUALIFIED_BUT_RENAME detectors (with current names; renaming is a future improvement)

**Expanded public pack (after small fixes): 91 detectors / 61 logical checks**

This would add:
- 5 QUALIFIED_WITH_PRECISION_REPAIR detectors (after precision fixes)
- 1 PARSER_ERROR detector (after regex fix)

**NOT recommended for initial public pack:**
- 22 NEEDS_LOGIC_REPAIR detectors (don't work)
- 7 NEEDS_REDESIGN detectors (wrong approach)

## Decision Rationale

The evidence shows that 86 of 121 detectors work correctly. Publishing 86 detectors with 61 logical checks provides meaningful security coverage without publishing broken rules. The 29 detectors that need logic repair or redesign should be fixed before being added to the public pack.

This approach avoids:
- Publishing rules that don't fire (22 NEEDS_LOGIC_REPAIR)
- Publishing rules that can't distinguish safe from unsafe (7 NEEDS_REDESIGN)
- Claiming "121 protections" when only 86 work
