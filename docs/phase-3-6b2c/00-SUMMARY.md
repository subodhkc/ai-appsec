# Phase 3.6B-2C — Summary

## Decision: PASS — READY_FOR_MCP_IMPLEMENTATION

The canonical private static-security bundle (rc.5) is ready for Phase 4 MCP implementation of `scan_ai_security`.

## Key Changes from Phase 2B

1. **Semantic consolidation:** Merged 2 duplicate BLOCK checks into 1 (`HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION`). Removed implementation-defect name `SC-EVAL-EXEC-COSMETIC-METAVAR`.
2. **FP closure:** Fixed 4 real-world likely FPs (2 SSRF + 2 XSS) by converting cosmetic-metavariable detectors to taint mode in rc.5.
3. **Native execution baseline:** Native Semgrep is 7-14x faster than Docker. All 4 previously-timed-out repos complete natively. Docker I/O confirmed as timeout cause.
4. **Provenance closure:** All 3 provenance-review-required detectors cleared (generic concept similarity, no copied expressions, independent HAIEC history).
5. **Agent output contract:** Raw evidence separated from agent-facing output. Output bounded (50 actionable + 20 observations). Deterministic prioritization.
6. **Target scope contract:** Default production scope defined. Tests/docs excluded by default except for VULNERABILITY and secrets checks.

## Final Counts

| Metric | Value |
|---|---|
| Candidate version | 0.1.0-rc.5 |
| Detector count | 122 |
| Security-check count | 79 |
| BLOCK count | 1 |
| Provenance-clear | 122 |
| Provenance-review-required | 0 |
| Parser errors | 0 |
| Known FP fixture failures | 0 |
| Unresolved VULNERABILITY findings | 0 |
