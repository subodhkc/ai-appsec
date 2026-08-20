# 00 — Phase 2 Summary

## Status: READY_WITH_EXCLUSIONS

## Key Numbers

| Metric | Value |
|--------|-------|
| Production detector definitions | 121 |
| Unique detector IDs | 121 |
| Duplicate detector IDs | 0 |
| Logical checks (checkId groups) | 80 |
| Legacy semgrep_rules.yaml detectors | 91 |
| Languages | python, javascript, typescript |
| Severity distribution | INFO: 54, WARNING: 45, ERROR: 22 |

## Finding Kind Distribution

| Finding Kind | Count |
|--------------|-------|
| PRESENCE | 43 |
| RISK_SIGNAL | 26 |
| CONTROL_GAP | 26 |
| VULNERABILITY | 26 |

## Default Disposition Distribution

| Disposition | Count |
|-------------|-------|
| INFORMATIONAL | 43 |
| REVIEW | 69 |
| BLOCK | 9 |

## Provenance

All 121 detectors classified as `STRONG_HAIEC_ORIGIN_EVIDENCE`.

All detectors are embedded in `modal_ai_security_scanner.py`, authored exclusively by Subodh (subodhkc@users.noreply.github.com, subodh@haiec.com) from 2026-01-04 onward. No third-party rule registry imports or external rule references found.

## Publication Status

All 121 detectors classified as `CANDIDATE` — pending final license review.

## Migration Classification

| Class | Count |
|-------|-------|
| MIGRATE_AS_IS | 91 |
| MIGRATE_THEN_IMPROVE | 30 |

## Candidate Version

`0.1.0-candidate.1` — pre-release migration identifier. Not a production release.

## Exclusions

No detectors are excluded from migration at this stage. All 121 are candidates pending final license and provenance review before public rule body publication.

Rule bodies remain in `.private-rule-staging/` (gitignored). Only metadata appears in tracked files.
