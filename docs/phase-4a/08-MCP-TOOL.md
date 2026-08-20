# Phase 4A — MCP Tool

## Registration

`scan_ai_security` is registered via `McpServer.registerTool()` in
`src/mcp/server-factory.ts`.

## Tool metadata

- **Name**: `scan_ai_security`
- **Title**: "Scan AI/LLM Source Code Security"
- **Read-only**: yes
- **Destructive**: no
- **Implemented**: true (Phase 4A)

## Tool description

The description includes:
- Positive use cases: AI source code security, AI-generated code, changed
  AI code, RAG/agent/tool security
- Negative boundaries: "Do NOT use for" tenant-boundary analysis, LLM
  response evaluation, generic code review

## Input schema

- `targetPath` (string, required): path to scan
- `scopeMode` (enum: `DEFAULT_PRODUCTION` | `EXTENDED_SECURITY`): default `DEFAULT_PRODUCTION`
- `timeoutMs` (number): default 120000

## Output

Structured JSON with:
- `scanId`: deterministic scan identifier
- `verdict`: `BLOCK` | `REVIEW` | `PASS` | `ERROR`
- `completeness`: `COMPLETE` | `PARTIAL` | `TIMEOUT` | `ERROR`
- `actionableFindings`: capped at 20
- `observations`: capped at 10
- `summary`: exact totals
- `truncation`: truncation metadata
- `versions`: rulepack and Semgrep versions
- `errors`: non-fatal errors
- `limitations`: scan limitations

## Protocol discipline

- MCP protocol traffic on stdout only
- Diagnostics on stderr only
- No stdout pollution from scanner or Semgrep

## Engine independence

`scan_ai_security` invokes ONLY the AI-security engine. It never invokes
Tenant Isolation or LLMVerify. The other three tools remain unimplemented
and unregistered.
