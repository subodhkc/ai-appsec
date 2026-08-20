# 10 — Performance Baseline

## Environment

| Field | Value |
|-------|-------|
| Container | returntocorp/semgrep:1.52.0 |
| OS | Linux (Docker) |
| Semgrep | 1.52.0 |
| Rulepack | 121 detectors (1 with pattern error) |
| Fixtures | 107 files |

## Measured Values

| Metric | Value |
|--------|-------|
| Total findings | 165 |
| Total errors | 1 |
| Files scanned | 107 |
| Unique detectors fired | 34 |

## Timing

Semgrep 1.52.0 JSON output does not include wall-clock timing. External timing using `date` was attempted but the container's `date` command does not support nanosecond precision.

For Phase 3 modernization comparison, use:
```bash
time semgrep --config <rulepack> <fixtures> --json --metrics off
```

## Memory

Peak memory was not reliably measurable inside the Docker container without additional tooling.

## Purpose

This baseline is for modernization comparison only. It is NOT marketing benchmark data.
