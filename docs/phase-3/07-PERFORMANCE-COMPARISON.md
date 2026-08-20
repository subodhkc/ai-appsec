# 07 — Performance Comparison

## Environment

Both scans ran in Docker containers on the same Windows 11 host with Docker Desktop Linux engine.

## Measured Values

| Metric | 1.52.0 | 1.173.0 |
|--------|--------|---------|
| Findings | 165 | 165 |
| Errors | 1 | 1 |
| Files scanned | 107 | 107 |
| Detectors fired | 34 | 34 |

## Timing

Semgrep JSON output does not include wall-clock timing in either version. External timing was not reliably measurable due to Docker overhead and PowerShell redirection issues.

For Phase 3.5, use:
```bash
time docker run --rm -v <vol>:/src semgrep/semgrep:1.173.0 semgrep --config <rules> <fixtures> --json --metrics off
```

## Memory

Peak memory was not measured. Both containers ran within Docker Desktop's default resource limits.

## Purpose

This is an internal engine-selection decision, not public benchmark data.
