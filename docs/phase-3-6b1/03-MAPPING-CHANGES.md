# 03 — Mapping Changes

## Stale Rule-to-Control Mappings Removed

### Removed: R6.1–R6.6 → tenantIsolation
**Reason:** The static AI-security scanner cannot verify tenant isolation. Tenant isolation requires a separate tenant-isolation assessment (cross-tenant boundary checks, data access controls, multi-tenant test scenarios). Inferring tenant isolation from the absence of R6.x findings is negative-evidence inference.

**Action:** R6.1–R6.6 removed from `ruleToControl` mapping in `trust-page.ts`. The `tenantIsolation` control now defaults to `not_evaluated` regardless of findings.

### Removed: R9.x → determinism
**Reason:** Static analysis cannot establish application determinism. Determinism requires runtime verification, behavioral testing, and output consistency analysis — none of which are in the static scanner's scope.

**Action:** R9.x removed from `ruleToControl` mapping. The `determinism` control now defaults to `not_evaluated`.

### Removed: R12.x → determinism
**Reason:** Same as R9.x. Cost/DoS findings do not establish or refute application determinism.

**Action:** R12.x removed from `ruleToControl` mapping.

## Preserved Mappings

- R1.x → inputValidation (prompt injection findings are within scanner scope)
- R2.x → outputValidation (output validation findings are within scanner scope)
- R4.x → inputValidation (RAG security findings are within scanner scope)
- R5.x → authentication (authentication findings are within scanner scope)
- R6.7–R6.10 → authorization (tool access control findings are within scanner scope)
- R7.x → secretsManagement (secrets management findings are within scanner scope)
- R8.x → egressControl (egress control findings are within scanner scope)
- R10.x → authorization (authorization findings are within scanner scope)
- R11.x → outputValidation (output handling findings are within scanner scope)

## SOC2 Mapping

The `RULE_SOC2_MAPPING` in `soc2-mapping.ts` was NOT changed. The mapping from rule IDs to SOC 2 control IDs is preserved. What changed is how the percentage is labeled and displayed:
- Old: `coveragePercentage` (implied compliance/implementation)
- New: `controlsWithRelevantFindings` / `controlsWithoutFindings` (descriptive of what the number actually measures)
