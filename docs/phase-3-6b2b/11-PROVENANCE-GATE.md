# 11 — Provenance Gate

## Phase 2A Provenance Status

| Status | Count |
|---|---|
| PROVENANCE_CLEAR | 119 |
| PROVENANCE_REVIEW_REQUIRED | 3 |

## Provenance-Review-Required Detectors

1. `hardcoded-api-key-python` — GENERIC_SIMILARITY to external rules
2. `missing-max-tokens` — GENERIC_SIMILARITY to external rules
3. `hardcoded-openai-api-key` — GENERIC_SIMILARITY to external rules

All 3 share generic pattern structure with common security patterns but appear to be independent HAIEC implementations. No third-party rule bodies were copied.

## Public Core Provenance Status

All 3 provenance-review-required detectors are currently inside Public Core.

| Status | Count |
|---|---|
| Public Core provenance-clear | 119 |
| Public Core provenance-review-required | 3 |

## Decision

Public Core is marked as: **TECHNICALLY_QUALIFIED_PENDING_PROVENANCE**

The 3 provenance-review-required detectors have generic pattern similarity to external rules but no copied bodies. License remains a separate founder decision.

## No Silent Release-Ready Claim

Public Core is NOT silently called "release-ready." The provenance status is explicitly documented. The founder must decide whether:
1. The 3 detectors are approved for public use (PROVENANCE_CLEAR)
2. The 3 detectors require further review (remain PROVENANCE_REVIEW_REQUIRED)
3. The 3 detectors are excluded from Public Core

Until the founder decides, the status remains TECHNICALLY_QUALIFIED_PENDING_PROVENANCE.
