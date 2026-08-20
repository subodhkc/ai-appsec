# 18 — Verdict Contract

> **Phase -1 document.** Defines top-level verdict semantics. No implementation.

---

## Top-Level Verdicts

| Verdict | Definition |
|---------|------------|
| `PASS` | All required, applicable, configured checks completed. No configured blocking or review conditions were found. |
| `REVIEW` | Checks completed, but findings, ambiguity, partial coverage, or unsupported areas require human review. |
| `BLOCK` | One or more explicit policy blockers fired. Deploy should not proceed until blockers are resolved. |
| `ERROR` | A required engine or check could not run, or its result cannot be trusted. The verdict is not reliable. |

---

## Critical Rule

**Never interpret "0 findings" as automatically `PASS` when:**
- Significant coverage was unsupported (e.g., language not supported)
- Required engines failed to run
- The scan could not complete fully

0 findings + unsupported coverage = `REVIEW` (not `PASS`)
0 findings + engine failure = `ERROR` (not `PASS`)
0 findings + full coverage + all engines passed = `PASS`

---

## Verdict Determination Logic (conceptual)

```
if any engine status == FAILED:
    verdict = ERROR
elif any engine status == PARTIAL:
    verdict = REVIEW
elif any finding.defaultDisposition == BLOCK:
    verdict = BLOCK
elif any finding.defaultDisposition == REVIEW:
    verdict = REVIEW
elif any unsupportedCoverage or any engine status == NOT_APPLICABLE with required:
    verdict = REVIEW
elif all engines status == PASSED and findingsCount == 0:
    verdict = PASS
else:
    verdict = REVIEW
```

---

## Per-Engine Statuses

| Status | Meaning |
|--------|---------|
| `PASSED` | Engine ran successfully, no findings |
| `FINDINGS` | Engine ran successfully, findings present |
| `NOT_APPLICABLE` | Engine determined the target is not applicable (e.g., tenant isolation on single-tenant app) |
| `PARTIAL` | Engine ran but coverage was partial (e.g., some files unsupported) |
| `SKIPPED` | Engine was explicitly skipped (not configured, or user excluded it) |
| `FAILED` | Engine could not run or its result cannot be trusted |

---

## Verdict vs Per-Engine Status

| Scenario | Engine statuses | Verdict |
|----------|-----------------|---------|
| All engines pass, no findings | `PASSED`, `PASSED`, `PASSED` | `PASS` |
| One engine has findings (REVIEW disposition) | `PASSED`, `FINDINGS`, `PASSED` | `REVIEW` |
| One engine has findings (BLOCK disposition) | `PASSED`, `FINDINGS`, `PASSED` | `BLOCK` |
| One engine failed | `PASSED`, `FAILED`, `PASSED` | `ERROR` |
| One engine partial coverage | `PASSED`, `PARTIAL`, `PASSED` | `REVIEW` |
| One engine not applicable | `PASSED`, `NOT_APPLICABLE`, `PASSED` | `PASS` (if others pass) |
| All engines skipped | `SKIPPED`, `SKIPPED`, `SKIPPED` | `ERROR` (nothing ran) |

---

## `check_deploy_security` Verdict Reporting

The composite tool MUST report:
1. Top-level verdict (`PASS` / `REVIEW` / `BLOCK` / `ERROR`)
2. Per-engine status for each engine
3. Verdict reason (human-readable explanation)
4. Which findings contributed to the verdict
5. Which limitations or unsupported coverage affected the verdict

**Example output:**
```json
{
  "verdict": "REVIEW",
  "verdictReason": "scan_ai_security found 3 REVIEW-disposition findings. scan_tenant_isolation passed. verify_llm_content not applicable (no LLM output provided).",
  "engines": {
    "scan_ai_security": { "status": "FINDINGS", "findingsCount": 3, "ran": true, "reasonRan": "ai_security_policy_enabled" },
    "scan_tenant_isolation": { "status": "PASSED", "findingsCount": 0, "ran": true, "reasonRan": "tenant_isolation_policy_enabled" },
    "verify_llm_content": { "status": "NOT_APPLICABLE", "ran": false, "reasonSkipped": "no_llm_output_provided" }
  }
}
```
