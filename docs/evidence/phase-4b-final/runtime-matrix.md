# Runtime Support Matrix

## Node.js

| Version | Status | Notes |
|---------|--------|-------|
| 20.x | UNVERIFIED | engines field says >=22, not tested |
| 22.x | TESTED | Minimum required version |
| 24.x | TESTED | Development and validation environment (v24.11.1) |

## Operating Systems

| OS | Status | Notes |
|----|--------|-------|
| Windows (win32/x64) | TESTED | Primary development and validation environment |
| Linux (amd64) | PARTIALLY_TESTED | POSIX code path implemented (process-group kill), not empirically tested |
| macOS | UNVERIFIED | POSIX code path should work, not tested |

## CPU Architectures

| Arch | Status | Notes |
|------|--------|-------|
| x64 | TESTED | Windows x64 |
| arm64 | UNVERIFIED | Not tested |

## Semgrep

| Requirement | Value |
|-------------|-------|
| Required version | 1.173.0 (exact match) |
| Installation | HAIEC-managed isolated venv (via `setup` command) |
| Execution | External subprocess, not embedded |

## MCP SDK

| Package | Version | Type |
|---------|---------|------|
| @modelcontextprotocol/server | 2.0.0 | Runtime |
| @modelcontextprotocol/client | ^2.0.0 | Development (tests only) |

## package.json engines

```json
"engines": {
  "node": ">=22"
}
```

This reflects the actual minimum tested version. Node 20 is not claimed as supported.
