# 02 — Trust Mapping Validation

## Trust-Page Status Semantics

### Old Status Enum (Phase 3.6B-1)
- `evidence_found` — unreachable, no code path sets it
- `no_issue_detected_in_scope` — implies the check was evaluated and found clean
- `review_recommended` — correct
- `not_evaluated` — correct

### Problem with `no_issue_detected_in_scope`
The trust-page generator receives only `findings[]` + coarse `scanInfo { lastScan, routesScanned, filesAnalyzed, profile }`. It does NOT know:
- Which checks were actually evaluated
- Applicability by language/framework
- Whether positive evidence of a control exists

Therefore "no issue detected in scope" overclaims — it implies the check ran and found nothing, when in reality the generator only knows no finding was *reported*.

### New Status Enum (Phase 3.6B-1.1)
- `evidence_found` — STILL unreachable (reserved for future positive-evidence path). Documented as unreachable in the type comment.
- `no_relevant_finding_reported` — "No relevant finding reported by this scan." Does NOT imply evaluation, applicability, or implementation.
- `review_recommended` — Review recommended based on scan findings. (unchanged)
- `not_evaluated` — Not evaluated by this scan engine. (unchanged)

### Is `evidence_found` Reachable?
**NO.** The trust-page generator has no positive-evidence input path. It receives only findings (negative evidence). `evidence_found` is reserved for future use when the scanner can report affirmative control evidence (e.g., "auth middleware detected at line X"). It is documented as unreachable in the type definition.

### Empty-Findings Trust-Page Result
When `findings = []`:
- 6 controls (authentication, authorization, inputValidation, outputValidation, secretsManagement, egressControl) → `no_relevant_finding_reported`
- 2 controls (tenantIsolation, determinism) → `not_evaluated`

### Tenant Isolation Result
`not_evaluated` — The static scanner cannot verify tenant isolation. No rule mappings to tenantIsolation remain.

### Determinism Result
`not_evaluated` — Static analysis cannot establish application determinism. No rule mappings to determinism remain.

## Remaining Trust Mappings Review

### Mappings Preserved from Phase 3.6B-1

| Rule Family | Control | Classification | Reasoning |
|-------------|---------|----------------|-----------|
| R1.x | inputValidation | SEMANTICALLY_SUPPORTED | Prompt injection findings are within scanner scope |
| R2.x | outputValidation | SEMANTICALLY_SUPPORTED | Output validation findings are within scanner scope |
| R4.x | inputValidation | SEMANTICALLY_SUPPORTED | RAG security findings are within scanner scope |
| R5.x | authentication | SEMANTICALLY_SUPPORTED | Authentication findings are within scanner scope |
| R6.7–R6.10 | authorization | SUPPORTED_WITH_SCOPE | Tool access control findings are within scanner scope, but only cover tool-access authorization, not all authorization |
| R7.x | secretsManagement | SEMANTICALLY_SUPPORTED | Secrets management findings are within scanner scope |
| R8.x | egressControl | SEMANTICALLY_SUPPORTED | Egress control findings are within scanner scope |
| R10.x | authorization | SUPPORTED_WITH_SCOPE | Authorization findings are within scanner scope, but only cover detected patterns, not all authorization |
| R11.x | outputValidation | SEMANTICALLY_SUPPORTED | Output handling findings are within scanner scope |

### Mappings Removed (Phase 3.6B-1, confirmed correct)

| Rule Family | Control | Classification | Reason |
|-------------|---------|----------------|--------|
| R6.1–R6.6 | tenantIsolation | STALE | Static scanner cannot verify tenant isolation |
| R9.x | determinism | STALE | Static scanner cannot establish determinism |
| R12.x | determinism | STALE | Static scanner cannot establish determinism |

### Stale/Ambiguous Mappings Remaining
**0** — All remaining mappings are either SEMANTICALLY_SUPPORTED or SUPPORTED_WITH_SCOPE.

### SOC2 Mapping
The `RULE_SOC2_MAPPING` was NOT changed. The mapping from rule IDs to SOC 2 control IDs is preserved. What changed is how the percentage is labeled:
- `controlsWithRelevantFindings` — % of SOC 2 controls with at least one relevant finding
- `controlsWithoutFindings` — % of SOC 2 controls with no relevant findings

This is NOT coverage, compliance, or implementation. It is finding-oriented descriptive statistics.
