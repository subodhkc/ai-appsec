# Phase 4B — Process Tree Safety

## Problem

Node.js `child.kill()` only kills the direct child process. Descendant
processes (grandchildren) may survive as orphans. Semgrep spawns
`semgrep-core` as a subprocess, so killing `semgrep` alone may leave
`semgrep-core` running.

## Solution

`killProcessTree()` in `semgrep-runner.ts`:

### Windows
Uses `taskkill /T /F /PID <pid>` invoked directly (not through shell):
- `/T` = terminate descendant processes (tree kill)
- `/F` = force termination
- `shell: false` — no shell injection risk

### POSIX
Uses `process.kill(-pid, signal)` to kill the process group:
- Negative PID = kill entire process group
- Falls back to `child.kill(signal)` if process group kill fails

## Timeout sequence

1. `setTimeout(timeoutMs)` fires
2. `killProcessTree(child, 'SIGTERM')` — graceful termination
3. Wait 2 seconds
4. `killProcessTree(child, 'SIGKILL')` — force termination
5. Clear timeout handle

## Empirical test

`tests/engines/process-tree.test.ts` verifies:
- Synthetic child→grandchild tree is killed by `taskkill /T`
- Runner source code uses `taskkill` with `shell: false`
- Runner source code includes `/T`, `/F`, and `SIGKILL` escalation

## What is NOT claimed

- We do not claim process-tree kill works on POSIX without empirical testing
- We do not accept user-provided PIDs
- We do not kill unrelated Semgrep processes
