# 02 — Provenance Closure

## Combined Evidence

### Git History Evidence
- All 121 detectors embedded in `modal_ai_security_scanner.py`
- Authored exclusively by Subodh (subodhkc, subodh@haiec.com)
- First commit: 2026-01-04, Latest: 2026-08-01
- No third-party rule imports or external rule references

### External Similarity Evidence
- 118/121: NO_MEANINGFUL_MATCH_FOUND
- 3/121: GENERIC_SIMILARITY (expected for common security patterns)
- 0: POTENTIAL_DERIVATION, STRONG_MATCH, or EXACT_MATCH

## Final Provenance Classification

| Status | Count |
|--------|-------|
| PROVEN_HAIEC_ORIGINAL | 0 |
| STRONG_HAIEC_ORIGIN_EVIDENCE | 121 |
| KNOWN_DERIVATION_COMPATIBLE | 0 |
| KNOWN_DERIVATION_RESTRICTED | 0 |
| THIRD_PARTY | 0 |
| UNRESOLVED | 0 |

## Why STRONG_HAIEC_ORIGIN_EVIDENCE, not PROVEN_HAIEC_ORIGINAL?

Git authorship + no external similarity = strong evidence of HAIEC origin. However, `PROVEN_HAIEC_ORIGINAL` requires conclusive proof that no one else independently created similar rules. Since we cannot search all private rule repositories worldwide, we conservatively use `STRONG_HAIEC_ORIGIN_EVIDENCE`.

## No Unresolved Detectors

All 121 detectors have a definitive provenance classification. None are `UNRESOLVED`.
