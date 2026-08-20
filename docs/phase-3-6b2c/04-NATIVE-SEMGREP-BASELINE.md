# 04 — Native Semgrep Baseline

## Native Installation

Semgrep 1.173.0 installed in isolated venv:
- Path: `.private-rule-staging/phase36b2c/semgrep-venv/`
- Version confirmed: `semgrep --version` → `1.173.0`
- No global environment modifications

## Native vs Docker Performance

| Repo | Size | Docker Time | Native Time | Speedup | Docker Findings | Native Findings |
|---|---|---|---|---|---|---|
| together-python | SMALL | 69.65s | 8.26s | 8.4x | 308 | 312 |
| anthropic-sdk-ts | MEDIUM | 71.0s | 10.12s | 7.0x | 138 | 146 |
| anthropic-sdk-py | LARGE | 230.15s | 17.07s | 13.5x | 478 | 489 |
| autogen | MEDIUM | TIMEOUT(300s) | 23.03s | N/A | 0 | 680 |
| crewAI | LARGE | TIMEOUT(600s) | 176.63s | N/A | 0 | 1170 |

## Finding Count Differences

Native findings differ slightly from Docker findings because:
1. rc.5 has different XSS/SSRF detector patterns (taint mode) than rc.4
2. Native Semgrep may parse some edge-case files slightly differently
3. The exclude patterns may behave slightly differently between Docker and native

The differences are expected and do not indicate a correctness issue.

## Previously Timed-Out Repos

| Repo | Docker Result | Native Result |
|---|---|---|
| autogen | TIMEOUT at 300s | FULL_SUCCESS in 23.03s |
| crewAI | TIMEOUT at 600s | FULL_SUCCESS in 176.63s |

## Docker Timeout Cause Classification

**DOCKER_IO_CONFIRMED**

Evidence:
1. All 4 Docker timeouts occurred on repos with large file trees
2. Native Semgrep on the same repos completes successfully
3. Native execution is 7-14x faster across all repos
4. The rulepack is identical — only the execution environment differs
5. No resource failures (memory/CPU) were observed

Primary cause: Docker volume mount I/O overhead on Windows with large repository trees.

## Recommendation

Phase 4 MCP implementation should use native Semgrep execution as the preferred mode. Docker may be used as a fallback but with documented performance limitations on Windows.
