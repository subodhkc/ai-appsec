# 05 — Provenance Audit

## Method

For every detector in the production rulepack, the following evidence was inspected:

1. **Git history** of `modal_ai_security_scanner.py` (the embedded rulepack source)
2. **Git history** of `semgrep_rules.yaml` (the legacy extracted file)
3. **First-introducing commit** for each file
4. **Author** of each commit
5. **Commit messages** for context
6. **Rule generation scripts** (`extract_rules.py`)

## Git History Summary

### modal_ai_security_scanner.py

| Property | Value |
|----------|-------|
| First commit | `38b17d66` (2026-01-04) |
| First author | subodhkc@users.noreply.github.com |
| Latest commit | `d0ed945d` (2026-08-01) |
| Latest author | 25489879+subodhkc@users.noreply.github.com |
| Total commits touching file | 30+ |
| All authors | Subodh (subodhkc, subodh@haiec.com) |

### semgrep_rules.yaml

| Property | Value |
|----------|-------|
| First commit | `ab461d56` (2026-01-19) |
| First author | subodh@haiec.com |
| Latest commit | `2d5dcae1` (2026-03-14) |
| Total commits | 6 |
| All authors | Subodh (subodhkc, subodh@haiec.com) |

## Classification Results

| Provenance Status | Count |
|-------------------|-------|
| PROVEN_HAIEC_ORIGINAL | 0 |
| STRONG_HAIEC_ORIGIN_EVIDENCE | 121 |
| KNOWN_DERIVATION_COMPATIBLE | 0 |
| KNOWN_DERIVATION_RESTRICTED | 0 |
| THIRD_PARTY | 0 |
| UNRESOLVED | 0 |

## Rationale

All 121 detectors are classified as `STRONG_HAIEC_ORIGIN_EVIDENCE` because:

1. All detectors are embedded in `modal_ai_security_scanner.py`, a HAIEC production file
2. All commits touching this file are authored by Subodh (HAIEC)
3. No imports of external rule registries or third-party rule packs found
4. No `--config auto` or Semgrep Registry references in the scanner
5. The rule generation script (`extract_rules.py`) is also HAIEC-authored

### Why not PROVEN_HAIEC_ORIGINAL?

Git authorship alone is not sufficient proof of original authorship. Some patterns (e.g. `eval(...)`, `os.system(...)`) are generic security patterns that appear in many rule packs. Without an external similarity check confirming no matches, we conservatively use `STRONG_HAIEC_ORIGIN_EVIDENCE`.

## Conservative Note

This classification does not constitute legal proof of originality. External similarity checks (see `06-EXTERNAL-SIMILARITY-AUDIT.md`) and final license review are required before public rule body publication.
