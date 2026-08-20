# Phase 4A — Semgrep Dependency

## Required version

`1.173.0` (exact match required)

## Resolver behavior

1. Check configured path (`HAIEC_SEMGREP_PATH` env var or constructor option)
2. Check `PATH` for `semgrep`
3. Require exact version `1.173.0`
4. Clear error if missing: "Semgrep not found. Install: pip install semgrep==1.173.0"
5. Clear error if unsupported version: "Semgrep version X.Y.Z found, but 1.173.0 required."
6. Prefer native execution
7. Never silently install dependencies
8. Never silently download dependencies
9. Never invoke Docker silently

## Metrics

Semgrep is invoked with `--metrics off`. No telemetry is emitted by Semgrep.
No telemetry is emitted by HAIEC.

## Status codes

| Status | Meaning |
|--------|---------|
| `AVAILABLE_SUPPORTED_VERSION` | Semgrep found, version matches |
| `AVAILABLE_UNSUPPORTED_VERSION` | Semgrep found, version mismatch |
| `MISSING` | Semgrep not found |
| `EXECUTION_ERROR` | Failed to execute version check |
