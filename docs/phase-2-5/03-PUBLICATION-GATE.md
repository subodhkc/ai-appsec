# 03 — Publication Gate

## Publication Status Distribution

| Status | Count |
|--------|-------|
| APPROVED_CANDIDATE | 121 |
| LEGAL_REVIEW_REQUIRED | 0 |
| PROVENANCE_REVIEW_REQUIRED | 0 |
| REDESIGN_REQUIRED | 0 (as publication status) |
| DO_NOT_PUBLISH | 0 |

## Important Distinction

All 121 detectors are `APPROVED_CANDIDATE` for **metadata** publication (detector IDs, check IDs, categories, finding kinds, etc.).

However, 24 detectors have `dispositionStatus: REDESIGN_REQUIRED` — their **rule bodies** require redesign before public rule body publication:
- 17 CONTROL_GAP detectors (pattern cannot prove absence)
- 7 prompt-injection detectors (messages overstate evidence)

## What APPROVED_CANDIDATE Means

- Provenance is strong (STRONG_HAIEC_ORIGIN_EVIDENCE)
- No external similarity concerns
- Metadata is safe to publish
- Rule body publication requires:
  1. Final project license selection
  2. User authorization
  3. For REDESIGN_REQUIRED detectors: rule body must be improved first

## What Is NOT Allowed

- No rule body publication without final license selection
- No rule body publication without user authorization
- No REDESIGN_REQUIRED rule body publication without redesign
- No claims of "safe to publish" — the correct statement is "technical/provenance candidate pending founder/legal license decision"
