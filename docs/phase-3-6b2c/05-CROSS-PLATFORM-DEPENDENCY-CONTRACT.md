# 05 — Cross-Platform Dependency Contract

## Semgrep Location Strategy

Phase 4 MCP implementation should locate Semgrep in this order:

1. **Configured path:** Check MCP config for `semgrepPath`. If set, use that executable.
2. **System PATH:** Run `semgrep --version` to check if Semgrep is available in PATH.
3. **Clear error:** If not found, return a clear error message instructing installation of Semgrep 1.173.0.

## Forbidden Actions

The MCP must NOT:
- Silently download executables
- Silently install Python packages
- Silently invoke Docker
- Silently invoke WSL
- Make hidden environment changes

## Version Policy

- **Required version:** 1.173.0 (exact match)
- **Rationale:** All qualification was performed on 1.173.0. For first public release, exact version pin ensures reproducibility.
- **Future:** A compatibility range may be tested in later phases.

## SemgrepDependencyStatus

| Status | Description |
|---|---|
| AVAILABLE_SUPPORTED_VERSION | Semgrep found, version matches 1.173.0 |
| AVAILABLE_UNSUPPORTED_VERSION | Semgrep found, version does not match |
| MISSING | Semgrep not found |
| EXECUTION_ERROR | Semgrep found but failed to execute |

## Execution Mode

- **Preferred:** NATIVE (7-14x faster, no Docker I/O overhead)
- **Fallback:** Docker (with documented performance limitations on Windows)

## Local-First Constraints

- Semgrep metrics disabled (`--metrics off`)
- No login required
- No registry config required
- No community rule download
- Network-none compatible
