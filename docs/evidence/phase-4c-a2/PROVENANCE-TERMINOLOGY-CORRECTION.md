# Provenance Terminology Correction (Phase 4C-A2)

> Part 10 — Correct overclaiming of HAIEC_ORIGIN for all detectors.

## Issue

The previous Phase 4C-A evidence categorically labeled all 122 detectors as
`provenance: HAIEC_ORIGIN`. This overclaims authorship without direct
historical evidence for each detector.

## Correction

The manifest has been updated to use the already-approved nuanced model:

### Previous (overclaiming):
```json
{
  "provenance": "HAIEC_ORIGIN",
  "candidateStatus": "PUBLIC_READY",
  "publicStatus": "PUBLIC_READY"
}
```

### Corrected (honest):
```json
{
  "provenance": "HAIEC_ASSERTED",
  "originEvidence": "INCOMPLETE",
  "licenseDisposition": "REVIEW_REQUIRED",
  "finalLegalDisposition": "PENDING_HUMAN_REVIEW",
  "candidateStatus": "PUBLIC_READY",
  "publicStatus": "PUBLIC_READY"
}
```

## Field Definitions

### provenance
- `HAIEC_ASSERTED` — HAIEC asserts ownership but cannot prove authorship with
  direct historical evidence for every detector
- `HAIEC_ORIGIN` — Reserved for detectors with direct, verifiable authorship
  evidence (git history, commit records, etc.)

### originEvidence
- `STRONG` — Direct historical evidence (git commits, author records)
- `MODERATE` — Indirect evidence (codebase patterns, internal documentation)
- `INCOMPLETE` — No direct evidence available; assertion based on repository
  context only

### licenseDisposition
- `HAIEC_CAN_LICENSE` — HAIEC can license under final package license
- `ATTRIBUTION_REQUIRED` — Third-party attribution required
- `REVIEW_REQUIRED` — Legal review required before licensing

### finalLegalDisposition
- `PENDING_HUMAN_REVIEW` — Awaiting human/legal review
- `APPROVED` — Human/legal review complete, approved
- `BLOCKED` — Human/legal review complete, blocked

## Current Status (all 122 detectors)

| Field | Value | Count |
|-------|-------|-------|
| provenance | HAIEC_ASSERTED | 122 |
| originEvidence | INCOMPLETE | 122 |
| licenseDisposition | REVIEW_REQUIRED | 122 |
| finalLegalDisposition | PENDING_HUMAN_REVIEW | 122 |

## Important Claims NOT Made

- We do NOT claim direct authorship evidence for every detector
- We do NOT claim legal review is complete
- We do NOT claim "no external similarity found" constitutes legal proof
- We do NOT claim all detectors are licensible without review

## Manifest Digest Update

The manifest digest changed due to the provenance field additions:
- Previous: `sha256:2117f9b97865a42d57a3b0c44bea7e3d7171cbf9d6591c8c728421118b13327a`
- Current: `sha256:1aecdab24032115c1cb454d06261689db64efd416290de3b9af2867aa0a16712`

The rulepack YAML digest is unchanged:
- `sha256:013e2da09d22ceb9786109a2c04f82a80288213a42427d85c1a301ad5640289e`

## Conclusion

Provenance terminology corrected. All 122 detectors are now honestly classified
as `HAIEC_ASSERTED` with `INCOMPLETE` evidence and `PENDING_HUMAN_REVIEW` legal
disposition. Human/legal review remains a required gate before publication.
