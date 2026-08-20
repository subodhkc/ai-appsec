# 00 — Phase 2.5 Summary

## Decision: QUALIFIED_WITH_RULE_EXCLUSIONS

## Key Numbers

| Metric | Value |
|--------|-------|
| Production detector definitions | 121 |
| Validated logical checks | 80 (75 GROUP_VERIFIED, 5 AMBIGUOUS) |
| Semgrep 1.52.0 YAML validation | PASS (121/121) |
| Semgrep 1.52.0 execution | DEFERRED (requires Unix) |
| Golden corpus fixtures | 107 |
| External similarity — NO_MEANINGFUL_MATCH_FOUND | 118 |
| External similarity — GENERIC_SIMILARITY | 3 |
| External similarity — STRONG_MATCH | 0 |
| External similarity — EXACT_MATCH | 0 |
| Provenance — STRONG_HAIEC_ORIGIN_EVIDENCE | 121 |
| Publication — APPROVED_CANDIDATE | 121 |
| BLOCK confirmed | 7 |
| BLOCK redesign required | 2 |
| Redesign required (total) | 24 |
| Control gap invalid | 17 |
| Prompt injection message overstates | 7 |

## What Changed from Phase 2

| Item | Phase 2 | Phase 2.5 |
|------|---------|-----------|
| External similarity | Not executed | 121 detectors compared against 2,228 external rules |
| Provenance | STRONG_HAIEC (assumed) | STRONG_HAIEC (confirmed by similarity check) |
| Semgrep validation | Not executed | YAML validation PASS; execution deferred (Unix required) |
| Golden corpus | Designed only | 107 fixtures implemented |
| BLOCK count | 9 | 7 confirmed, 2 redesign required |
| Control gap validity | Not assessed | 17 invalid (pattern cannot prove absence) |
| Prompt injection | Not assessed | 7 messages overstate evidence |
| Manifest schema | 1.0 | 1.1 (added qualification fields) |

## Exclusions

24 detectors require redesign before publication of rule bodies:
- 17 CONTROL_GAP detectors where pattern matching cannot prove absence
- 7 prompt-injection detectors where messages overstate the evidence

These detectors remain APPROVED_CANDIDATE for metadata publication but their rule bodies require redesign before public release.
