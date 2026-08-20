# 02 — Trust Page Changes

## Old Behavior

All 8 security controls defaulted to `status: 'implemented'` with `evidenceCount: 0`:
- authentication, authorization, inputValidation, outputValidation
- secretsManagement, tenantIsolation, egressControl, determinism

This meant: **absence of findings = control implemented**. This is negative-evidence inference — a logical fallacy. No findings does not prove a control is implemented; it only proves the scanner didn't find issues within its scope.

Additionally:
- `tenantIsolation` was inferred from R6.x findings — but the static scanner cannot verify tenant isolation.
- `determinism` was inferred from R9.x/R12.x findings — but static analysis cannot establish application determinism.
- Only CRITICAL/HIGH findings would change status to `pending`; MEDIUM/LOW findings incremented evidenceCount but left status as `implemented`.

## New Status Model

Four evidence-aligned states:
1. `evidence_found` — Supporting implementation evidence detected
2. `no_issue_detected_in_scope` — No issue detected within this scan scope
3. `review_recommended` — Review recommended based on scan evidence
4. `not_evaluated` — Not evaluated by this scan

### Default states (no findings):
- authentication → `no_issue_detected_in_scope`
- authorization → `no_issue_detected_in_scope`
- inputValidation → `no_issue_detected_in_scope`
- outputValidation → `no_issue_detected_in_scope`
- secretsManagement → `no_issue_detected_in_scope`
- **tenantIsolation → `not_evaluated`** (requires separate tenant-isolation assessment)
- egressControl → `no_issue_detected_in_scope`
- **determinism → `not_evaluated`** (not evaluable by static analysis)

### Finding-driven escalation:
- Any CRITICAL or HIGH finding for a mapped control → `review_recommended`
- MEDIUM/LOW findings increment evidenceCount but do not change status from `no_issue_detected_in_scope`

## Stale Rule Mappings Removed

- R6.1–R6.6 no longer map to `tenantIsolation` (static scanner cannot verify tenant isolation)
- R9.x no longer maps to `determinism` (static scanner cannot establish application determinism)
- R12.x no longer maps to `determinism` (same reason)
- R6.7–R6.10 still map to `authorization` (tool access control — within scanner scope)

## SOC2 Coverage Semantic Change

**Old:** `coveragePercentage: 100 - soc2Percentage` (inverted finding percentage, labeled "coverage")
**New:** `controlsWithRelevantFindings: soc2Percentage` + `controlsWithoutFindings: 100 - soc2Percentage`

This is NOT coverage, compliance, or implementation. It is the percentage of SOC 2 controls that have at least one relevant finding. The label now accurately describes what the number means.

## getActiveRulesCount Fallback

**Old:** Fallback to `9` if rule registry import fails
**New:** Fallback to `0` — never return a hardcoded rule count that could be misleading
