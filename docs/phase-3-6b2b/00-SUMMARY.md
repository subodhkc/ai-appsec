# Phase 3.6B-2B — Summary

## Decision: PASS — TECHNICALLY_QUALIFIED_PENDING_PROVENANCE

The canonical private static-security bundle (rc.4) is technically ready to power `scan_ai_security` in the HAIEC Agent Security MCP, pending founder provenance/license decision on 3 detectors with generic pattern similarity to external rules.

## Key Results

| Metric | Value |
|---|---|
| Semgrep version | 1.173.0 |
| Semgrep digest | sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a |
| Candidate version | 0.1.0-rc.4 |
| Repos attempted | 12 |
| FULL_SUCCESS | 8 |
| TIMEOUT | 4 |
| SMALL repos | 1 |
| MEDIUM repos | 5 |
| LARGE repos | 6 |
| Python repos | 7 |
| JS/TS repos | 5 |
| Network-none | 6/6 NETWORK_EQUIVALENT |
| Reproducibility | 3/3 repos 5/5 IDENTICAL |
| rc.4 created | YES (4 detectors repaired) |
| Final detector count | 122 |
| Final security-check count | 80 |
| Public Core detector count | 122 |
| Public Core security-check count | 80 |
| Public Core parser errors | 0 |
| Public Core known FP fixture failures | 0 |
| Bundle validator | PASS (0 errors) |
| BLOCK count | 2 |
| Provenance-clear | 119 |
| Provenance-review-required | 3 |

## Four Detector Repairs

All 4 previously-excluded detectors repaired in rc.4:
- `api-key-in-logs-python/js`: Added metavariable-regex constraint for secret-like identifiers
- `dangerous-eval-exec-ai-output-python/js`: Replaced cosmetic metavariables with taint mode

All 4 pass positive, negative, and false-positive fixture tests.

## BLOCK Decision

Both taint-proven detectors (`ai-tool-abuse-output-exec` and `dangerous-eval-exec-ai-output-python`) confirmed as BLOCK_ELIGIBLE after testing 7 scenarios including direct flow, intermediate variable, sink-without-source, and source-without-sink.

## Readiness

TECHNICALLY_QUALIFIED_PENDING_PROVENANCE — Phase 4 may begin when founder approves the 3 provenance-review-required detectors.
