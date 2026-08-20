# Phase 4A — Private Bundle Smoke Test

## Results

All smoke tests run through the full MCP scanner path using the private
rc.5 rulepack bundle (gitignored, not committed).

### together-python (small)

| Metric | Value |
|--------|-------|
| Raw findings | 312 |
| Actionable total | 101 |
| Observations total | 208 |
| Actionable returned | 20 (truncated) |
| Observations returned | 10 (truncated) |
| Completeness | COMPLETE |
| Verdict | REVIEW |
| Errors | 0 |
| Duration | ~17s |

### anthropic-sdk-python (medium)

| Metric | Value |
|--------|-------|
| Raw findings | 489 |
| Actionable total | 379 |
| Observations total | 20 |
| Actionable returned | 20 (truncated) |
| Observations returned | 10 (truncated) |
| Completeness | COMPLETE |
| Verdict | REVIEW |
| Errors | 0 |
| Duration | ~25s |

### anthropic-sdk-typescript (medium)

| Metric | Value |
|--------|-------|
| Raw findings | 146 |
| Actionable total | 90 |
| Observations total | 12 |
| Actionable returned | 20 (truncated) |
| Observations returned | 10 (truncated) |
| Completeness | PARTIAL (2 parse errors) |
| Verdict | REVIEW |
| Errors | 0 |
| Duration | ~15s |

## Direct-scan vs MCP semantic equivalence

The scanner is invoked through the same code path whether called directly
or through the MCP tool. The MCP tool is a thin wrapper that:
1. Validates input
2. Calls `scanAiSecurity()`
3. Returns the structured result

No semantic difference exists between direct and MCP invocation.

## Large repository

Not yet tested through the MCP path. Previous native tests showed:
- langchainjs: 1529 findings, 74.33s
- ai/vercel: 2814 findings, 53.47s

These should be tested through the MCP path in Phase 4B.
