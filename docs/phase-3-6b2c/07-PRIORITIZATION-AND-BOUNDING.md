# 07 — Prioritization and Bounding

## Deterministic Prioritization

Findings are ordered by this deterministic rule (no hidden AI scoring):

1. BLOCK-disposition VULNERABILITY findings (sorted by securityCheckId, then path, then line)
2. REVIEW-disposition VULNERABILITY findings (sorted by securityCheckId, then path, then line)
3. CONTROL_GAP findings (sorted by securityCheckId, then path, then line)
4. RISK_SIGNAL findings with ERROR severity (sorted by securityCheckId, then path, then line)
5. RISK_SIGNAL findings with WARNING severity (sorted by securityCheckId, then path, then line)
6. INFORMATIONAL RISK_SIGNAL findings (sorted by securityCheckId, then path, then line)

PRESENCE findings are NOT in the prioritization list — they go in observations[] separately.

## Output Bounding

| Limit | Value |
|---|---|
| Max actionable findings returned | 50 |
| Max observations returned | 20 |
| Max examples per securityCheck | 3 |
| Summary counts | Always exact |
| Truncation message | "Showing N of M actionable findings." |
| Raw evidence | Preserved internally, count always reported |

## No Silent Discard

When output is truncated:
- The exact remaining count is reported
- Raw evidence is preserved internally
- Future pagination/detail tooling may expose subsets
- No findings are silently deleted

## Rationale

A scanner that returns 4,786 raw findings to an AI agent is not useful. The agent cannot reason about thousands of findings. By bounding output to 50 actionable findings + 20 observations, the agent can focus on the most important issues while knowing the total count.

The prioritization ensures BLOCK and VULNERABILITY findings are always shown first, followed by CONTROL_GAP, then RISK_SIGNAL. PRESENCE observations are separated entirely.
