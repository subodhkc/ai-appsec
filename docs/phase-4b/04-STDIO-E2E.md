# Phase 4B — STDIO E2E Test Results

## Test setup

- Real MCP Client (`@modelcontextprotocol/client`)
- Real McpServer (`@modelcontextprotocol/server`)
- InMemoryTransport (linked pair)
- Synthetic test rulepack (no proprietary bodies)

## Test cases

### 1. initialize → tools/list

- **Result**: PASS
- `scan_ai_security` appears in tools/list
- Description does NOT contain "prompt-injection exposure"
- Description contains "USE when:" and "DO NOT use for:" sections
- `readOnlyHint: true`, `openWorldHint: false`
- `destructiveHint` and `idempotentHint` NOT set

### 2. tools/call with invalid path

- **Result**: PASS
- `isError: true`
- `structuredContent` present with `verdict: ERROR`, `completeness: ERROR`
- Text content contains compact summary
- Error code is a known code (INVALID_TARGET_PATH, etc.)

### 3. Server health after error

- **Result**: PASS
- Server responds to tools/list after error call

### 4. Tool isolation

- **Result**: PASS
- Only `scan_ai_security` registered
- `scan_tenant_isolation`, `verify_llm_content`, `check_deploy_security` NOT registered

## Private-bundle MCP E2E

### anthropic-sdk-python (medium)

| Metric | Value |
|--------|-------|
| Duration | 25.6s |
| Verdict | REVIEW |
| Completeness | COMPLETE |
| Raw findings | 489 |
| Actionable total | 379 |
| Observations total | 20 |
| Files analyzed | 1137 |
| Findings excluded by scope | 90 |
| Structured bytes | 16429 |
| Text bytes | 753 |
| Total response | 17KB |
| isError | false |

### anthropic-sdk-typescript (medium)

| Metric | Value |
|--------|-------|
| Duration | 16.9s |
| Verdict | REVIEW |
| Completeness | PARTIAL (2 parse errors) |
| Raw findings | 146 |
| Actionable total | 90 |
| Observations total | 12 |
| Files analyzed | 247 |
| Findings excluded by scope | 44 |
| Structured bytes | 16024 |
| Text bytes | 875 |
| Total response | 17KB |
| isError | false |
