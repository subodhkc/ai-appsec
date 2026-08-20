# Offline Execution Proof

## Method

Source inspection + dependency analysis. No firewall modification was performed.

## Normal scan path network calls

The `scan_ai_security` tool executes the following path:

1. `createServer()` → `McpServer` registration (no network)
2. `scanAiSecurity()` → `resolveRulepack()` → `BundledPublicCoreRulepackProvider.resolve()` (reads local files only)
3. `SemgrepResolver.resolve()` → `execFile(semgrep, ['--version'])` (local subprocess)
4. `runSemgrep()` → `spawn(semgrep, ['scan', '--config', rulepack, '--json', '--metrics', 'off', ...])` (local subprocess)
5. Finding adapter, normalizer, prioritizer, output builder (all in-process, no network)

## Semgrep metrics

Semgrep is invoked with `--metrics off` which disables Semgrep's own telemetry.

## Source inspection

Files in the normal scan path:
- `src/engines/ai-security/scanner.ts` — no `fetch`, `http`, `https`, `net`, `dns` imports
- `src/engines/ai-security/semgrep-runner.ts` — only `child_process.spawn` with `shell: false`
- `src/engines/ai-security/semgrep-resolver.ts` — only `child_process.execFile` for version check
- `src/engines/ai-security/rulepack-provider.ts` — only `fs.readFile` for local files
- `src/engines/ai-security/finding-adapter.ts` — only `crypto.createHash`
- `src/engines/ai-security/normalizer.ts` — no network imports
- `src/engines/ai-security/prioritizer.ts` — no network imports
- `src/mcp/server-factory.ts` — only MCP SDK (local protocol)

## Dependency inspection

Runtime dependencies:
- `@modelcontextprotocol/server` — MCP protocol library (local stdio transport, no network)
- `zod` — schema validation (in-process, no network)
- `canonicalize` — JSON canonicalization (in-process, no network)

None of these dependencies make network calls during normal operation.

## Explicit setup

The `setup` command MAY use network access (to install Semgrep from PyPI).
This is explicitly user-invoked, not part of normal scan execution.

## Result

**PARTIALLY_VERIFIED** — Source inspection and dependency analysis confirm no network calls
in the normal scan path. Full network denial testing was not performed (would require
firewall modification or sandboxed environment). The evidence is strong but not
empirically verified through network isolation.

## Limitations

- No firewall-level network denial was performed
- No process-level network instrumentation was used
- Semgrep's own behavior is trusted based on `--metrics off` flag
- The HAIEC-managed Semgrep installation (venv) was not inspected for hidden network calls
