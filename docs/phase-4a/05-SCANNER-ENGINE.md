# Phase 4A — Scanner Engine

## Safe subprocess runner

The Semgrep runner (`semgrep-runner.ts`) implements:

- **No shell invocation**: `spawn(executable, args, { shell: false })`
- **Argument arrays**: all arguments passed as array elements, never as a
  shell command string
- **Timeout enforcement**: `setTimeout` → SIGTERM → 2s grace → SIGKILL
- **Bounded stdout**: 16MB max (prevents memory exhaustion)
- **Bounded stderr**: 1MB max
- **Metrics off**: `--metrics off` flag passed to Semgrep
- **No remote configs**: no `p/*` registry patterns, no `--config` URLs
- **No shell injection**: impossible by construction (no shell)

## Process cleanup

On timeout:
1. Send SIGTERM
2. Wait 2 seconds
3. If still alive, send SIGKILL
4. Clear timeout handle

On error:
1. Capture error event
2. Return error result with stderr

## Captured output

- stdout: parsed as JSON (Semgrep `--json` output)
- stderr: captured for diagnostics, not returned to agent
- Parse errors preserved in result
- Completeness information preserved (errors array from Semgrep)

## Semgrep command

```
semgrep scan --config <rulepack> --json --metrics off \
  --exclude node_modules --exclude .git ... \
  <target>
```
