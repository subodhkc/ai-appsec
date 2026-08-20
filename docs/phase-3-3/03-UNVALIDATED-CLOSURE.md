# 03 — Unvalidated Closure

## All 121 Detectors Validated

Every single detector was run in isolation against positive, negative, and false-positive fixtures using Semgrep 1.52.0 (the production engine). No detector was classified without evidence.

## Testing Rounds

### Round 1: Auto-generated fixtures (121 detectors)
- 92 WORKS_AS_DESIGNED
- 1 WORKS_BUT_TOO_BROAD
- 1 TOO_BROAD
- 27 NO_MATCH_ON_FIXTURE

### Round 2: Corrected fixtures for 27 NO_MATCH detectors
- 2 fixed → WORKS_AS_DESIGNED (JS fixture syntax errors)
- 1 PARSER_ERROR confirmed (ai-function-calling-js)
- 24 still NO_MATCH

### Round 3: Full-pack scan with original YAML (25 detectors)
- 0 additional fixed (confirmed original YAML doesn't help)
- 1 PARSER_ERROR confirmed

### Round 4: Pattern-level debugging (key detectors)
- Confirmed `pattern-regex` inside `pattern-either` works
- Confirmed `dangerous-eval-exec-ai-output` multi-lang silent failure
- Confirmed `ai-rest-*` double-escaped regex bug

### Round 5: Precisely matching fixtures (10 detectors)
- 1 fixed → WORKS_AS_DESIGNED (verbose-error-messages-js)
- 1 fixed → WORKS_AS_DESIGNED (rag-metadata-injection with correct taint source)
- 8 confirmed as real rule bugs

### Round 6: Root cause analysis
- Confirmed `...` in regular strings does NOT work in Semgrep 1.52.0
- Confirmed `...` in f-strings does NOT work as wildcard in Semgrep 1.52.0
- Confirmed `...` in JS template literals DOES work
- Confirmed `?` in template literals causes pattern matching failure
- Confirmed `hardcoded-openai-api-key` pattern-regex is too restrictive (skips keys with hyphens)

## Final Classification

| Status | Count | Evidence |
|--------|-------|----------|
| QUALIFIED_AS_IS | 72 | Isolated test: pos=Y, neg=N, fp=N |
| QUALIFIED_BUT_RENAME | 14 | Same + name is misleading |
| QUALIFIED_BUT_MESSAGE_FIX | 0 | — |
| QUALIFIED_WITH_PRECISION_REPAIR | 5 | Works but too broad/narrow |
| NEEDS_LOGIC_REPAIR | 22 | Does not fire with correct fixture |
| NEEDS_REDESIGN | 7 | Fires on all API calls, can't distinguish safe from unsafe |
| PARSER_ERROR | 1 | Regex parse error |
| NOT_YET_VALIDATED | 0 | All validated |
| **TOTAL** | **121** | |

## No Inference Used

No detector was classified based on:
- YAML parsing success alone
- Similar language variant working
- Rule looking correct
- Production historically returning findings
- Another detector in the same logical group working

Every classification is backed by an actual isolated Semgrep run with a specific fixture.
