# 00 — Phase 2.6 Summary

## Decision: QUALIFIED_WITH_RULE_EXCLUSIONS

## Key Numbers

| Metric | Value |
|--------|-------|
| Production detector definitions | 121 |
| Validated logical checks | 80 (all AMBIGUOUS resolved) |
| Semgrep 1.52.0 execution | EXECUTED on Linux (Docker) |
| Detectors executed (matched) | 34 |
| Detectors executed (no match) | 86 |
| Detectors with PATTERN_ERROR | 1 (`ai-function-calling-js`) |
| Golden corpus fixtures | 107 |
| Total findings | 165 |
| Positive coverage | 23/80 logical checks |
| BLOCK confirmed | 0 (all 9 downgraded to REDESIGN_BEFORE_BLOCK) |
| REDESIGN_REQUIRED (rule body) | 33 |
| QUALIFIED_CANDIDATE (rule body) | 88 |
| Parity status | EXACT |

## What Changed from Phase 2.5

| Item | Phase 2.5 | Phase 2.6 |
|------|-----------|-----------|
| Semgrep execution | DEFERRED (Windows) | EXECUTED on Linux Docker |
| BLOCK confirmed | 7 | 0 (all failed fixture validation) |
| Positive coverage | Not measured | 23/80 (28.75%) |
| Pattern errors | Unknown | 1 (`ai-function-calling-js`) |
| Publication model | Single status | Split: metadata + rule body |
| FindingKind | 26 VULN | 25 VULN (1 reclassified to PRESENCE) |
| AMBIGUOUS groups | 5 | 0 (all resolved) |

## Critical Finding

**Zero BLOCK candidates survived fixture validation.** All 9 BLOCK candidates failed because:
- Positive fixtures did not trigger the expected detector
- Negative/false-positive fixtures triggered wrong detectors
- Some detectors did not fire at all

This means the current rulepack cannot support automated deployment blocking without significant redesign.
