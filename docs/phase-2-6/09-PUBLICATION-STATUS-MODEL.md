# 09 — Publication Status Model

## Problem with Phase 2.5 Model

Phase 2.5 used a single `publicationStatus` field with 121 `APPROVED_CANDIDATE` while simultaneously saying 24 detectors need redesign. This was ambiguous.

## New Model: Two Separate Concepts

### metadataPublicationStatus

Controls whether detector **metadata** (ID, category, finding kind, severity, etc.) can be publicly exposed.

| Status | Count | Meaning |
|--------|-------|---------|
| METADATA_APPROVED | 121 | Metadata is safe to publish |
| METADATA_REVIEW_REQUIRED | 0 | Metadata needs review |

### ruleBodyPublicationStatus

Controls whether the actual **rule body** (Semgrep pattern) can be publicly published.

| Status | Count | Meaning |
|--------|-------|---------|
| QUALIFIED_CANDIDATE | 88 | Rule body passed execution validation |
| REDESIGN_REQUIRED | 33 | Rule body must be redesigned before publication |
| PROVENANCE_REVIEW_REQUIRED | 0 | Provenance needs review |
| LICENSE_REVIEW_REQUIRED | 0 | License needs selection |
| DO_NOT_PUBLISH | 0 | Must not be published |

## Why 33 REDESIGN_REQUIRED

The 33 detectors requiring redesign include:
- 1 PATTERN_ERROR detector (`ai-function-calling-js`)
- 9 BLOCK candidates that failed fixture validation
- 17 CONTROL_GAP detectors (pattern cannot prove absence)
- 7 prompt-injection detectors (messages overstate evidence)
- 1 findingKind reclassification (behavioral evidence)

Some detectors appear in multiple categories.

## Key Principle

A detector may safely expose metadata while its rule body is not ready for publication. This allows:
- Publishing the catalog of what HAIEC checks for
- Documenting the security taxonomy
- Not exposing rule patterns that don't work correctly
