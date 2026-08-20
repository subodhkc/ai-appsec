# Phase 4A — Execution Reconciliation (Native vs Docker)

## Result: EXECUTION_EQUIVALENT (small repository)

### Comparison: together-python

| Metric | Native | Docker |
|--------|--------|--------|
| Findings | 312 | 312 |
| Duration | 13.27s | 54.86s |
| Semgrep | 1.173.0 | 1.173.0 |
| Rulepack | rc.5 | rc.5 |

Finding counts match exactly. Native execution is ~4x faster on Windows.

### Prior timeout claim correction

Previous phases classified some repositories as `DOCKER_IO_CONFIRMED`
(Docker timeout). The root cause was Windows Docker volume-mount I/O
overhead, not Semgrep itself. Native execution is 7–14x faster.

### Previously timed-out repos tested natively

| Repository | Native duration | Status |
|------------|----------------|--------|
| autogen | 23.03s | OK |
| crewAI | 176.63s | OK |
| langchainjs | 74.33s | OK |
| ai/vercel | 53.47s | OK |

### Remaining work

- Medium-repository normalized-finding comparison (not just count)
- Large-repository smoke test through MCP path
- Full normalized-finding equivalence verification
