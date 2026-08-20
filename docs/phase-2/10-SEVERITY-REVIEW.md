# 10 — Severity Review

## Approach

Production severity is preserved for parity data. A separate `recommendedSeverity` is created.

| Field | Purpose |
|-------|---------|
| `legacySeverity` | The severity from the production rulepack — preserved unchanged |
| `recommendedSeverity` | The severity this detector should use in the public rulepack |
| `severityChangeReason` | Why the recommendation differs (if applicable) |

## Severity Changes

| Metric | Count |
|--------|-------|
| Changed | 30 |
| Unchanged | 91 |

## Change Rationale

### PRESENCE rules → INFO (30 changes)

All PRESENCE detectors have `recommendedSeverity: INFO` regardless of their legacy severity. Many presence detectors had `WARNING` or `ERROR` in production, which overstated their significance.

**Reason:** Detecting that an OpenAI import exists is informational, not a warning or error.

### VULNERABILITY rules with high evidence → ERROR

Rules detecting command injection, code execution, hardcoded secrets, and API key exposure are recommended as `ERROR`.

### CONTROL_GAP rules → WARNING

Missing controls are recommended as `WARNING` — they need attention but are not errors.

## No Numeric Confidence

No numeric confidence scores are assigned. Severity is a qualitative judgment based on:
- What the pattern detects
- How strong the evidence is
- What the false-positive rate is likely to be
