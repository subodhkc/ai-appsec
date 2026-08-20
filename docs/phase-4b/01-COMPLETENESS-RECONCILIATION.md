# Phase 4B — Completeness Reconciliation

## Canonical completeness enum

```
COMPLETE | PARTIAL | UNSUPPORTED | ERROR
```

**TIMEOUT is NOT a completeness type.** Timeout is an error code (`SEMGREP_TIMEOUT`).

## Rules

| Condition | Completeness |
|-----------|-------------|
| Full successful supported analysis | COMPLETE |
| Timeout + trustworthy partial findings | PARTIAL |
| Timeout + no trustworthy result | ERROR |
| Parser errors affecting part of target | PARTIAL |
| Unsupported dominant source/language | UNSUPPORTED |
| Execution error (Semgrep missing/failed) | ERROR |

## Engine status vs completeness vs verdict

These are three separate dimensions:

**Engine status** (internal): PASSED | FINDINGS | NOT_APPLICABLE | PARTIAL | SKIPPED | FAILED

**Scan completeness** (agent-facing): COMPLETE | PARTIAL | UNSUPPORTED | ERROR

**Scan verdict** (advisory): PASS | REVIEW | BLOCK | ERROR

### Deterministic relationships

| Completeness | Verdict if no findings | Verdict if REVIEW findings | Verdict if BLOCK findings |
|-------------|----------------------|--------------------------|-------------------------|
| COMPLETE | PASS | REVIEW | BLOCK |
| PARTIAL | REVIEW | REVIEW | BLOCK |
| UNSUPPORTED | PASS | REVIEW | BLOCK |
| ERROR | ERROR | ERROR | ERROR |

**Zero findings alone never implies PASS.** Only COMPLETE + zero findings = PASS.
PARTIAL + zero findings = REVIEW (because we don't know what we missed).
