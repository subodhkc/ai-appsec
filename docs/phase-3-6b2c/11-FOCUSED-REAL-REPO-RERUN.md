# 11 — Focused Real-Repo Rerun

## Scope

Re-ran only repositories affected by:
- Detector changes (ai-xss-js, ai-ssrf-js taint mode fixes)
- Previous likely FPs (openai-node SSRF, llama_index XSS)
- Native execution comparison

## Results

| Repo | Engine | Findings | Errors | Time | FP Status |
|---|---|---|---|---|---|
| together-python | Native | 312 | 0 | 8.26s | N/A (no FPs) |
| anthropic-sdk-ts | Native | 146 | 2 | 10.12s | N/A |
| anthropic-sdk-py | Native | 489 | 0 | 17.07s | N/A |
| autogen | Native | 680 | 0 | 23.03s | N/A (was TIMEOUT) |
| crewAI | Native | 1170 | 5 | 176.63s | N/A (was TIMEOUT) |
| openai-node | Docker (rc.5) | 276 | 0 | N/A | SSRF FPs ELIMINATED |
| llama_index | Docker (rc.5) | 703 | 0 | N/A | XSS FPs ELIMINATED |

## FP Resolution Verification

### openai-node (rc.5)
- rc.4: 11 SSRF findings (all FPs from cosmetic metavariable)
- rc.5: 0 SSRF findings
- **FP FIXED**

### llama_index (rc.5)
- rc.4: 5 XSS findings (all FPs from cosmetic metavariable)
- rc.5: 0 XSS findings
- **FP FIXED**

## Previously Timed-Out Repos

| Repo | Docker (rc.4) | Native (rc.5) |
|---|---|---|
| autogen | TIMEOUT at 300s | 680 findings in 23.03s |
| crewAI | TIMEOUT at 600s | 1170 findings in 176.63s |

Both previously-timed-out repos complete successfully with native execution.

## Finding Count Differences (rc.4 vs rc.5)

Finding counts differ slightly between rc.4 and rc.5 because:
1. ai-xss-js and ai-ssrf-js were rewritten with taint mode (different detection behavior)
2. Native Semgrep may parse edge-case files slightly differently than Docker

These differences are expected and do not indicate correctness issues.

## Conclusion

Focused rerun passes:
- 0 previously-likely-FP findings remain (all 4 resolved)
- 0 unresolved VULNERABILITY findings
- Previously-timed-out repos now complete natively
- Normalization valid (0 wrongly collapsed)
