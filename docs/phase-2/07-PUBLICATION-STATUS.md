# 07 — Publication Status

## Classification

| Publication Status | Count |
|---------------------|-------|
| CANDIDATE | 121 |
| NEEDS_PROVENANCE_REVIEW | 0 |
| NEEDS_LICENSE_REVIEW | 0 |
| DO_NOT_PUBLISH | 0 |
| APPROVAL_REQUIRED | 0 |

## Rationale

All 121 detectors are classified as `CANDIDATE` because:

1. **Provenance:** All have `STRONG_HAIEC_ORIGIN_EVIDENCE` — authored by HAIEC, no third-party imports
2. **No restricted derivations:** No `KNOWN_DERIVATION_RESTRICTED` classifications
3. **No unresolved provenance:** No `UNRESOLVED` classifications

## What CANDIDATE Means

A detector with `CANDIDATE` status is cleared for migration into the staging area. It does NOT mean the rule body is ready for public tracked publication. Before any rule body appears in tracked `rules/`:

1. External similarity audit must complete (see `06-EXTERNAL-SIMILARITY-AUDIT.md`)
2. Final license review must approve the project's open-source license
3. User must explicitly authorize publication

## What Is NOT Allowed

- No rule body may move into tracked public `rules/` merely because its git commit author is Subodh
- No rule body may be published without the external similarity check completing
- No rule body may be published before the project license is chosen
