# Phase 4B — Direct vs MCP Equivalence

## Method

The MCP tool handler is a thin wrapper:
1. Validates input args
2. Calls `scanAiSecurity()` (same function used by direct tests)
3. Returns `{ content, structuredContent, isError }`

The `scanAiSecurity()` function is identical whether called directly or
through MCP. No semantic difference exists.

## Evidence

- MCP E2E test with invalid path: `verdict: ERROR`, `completeness: ERROR`
  — matches direct scanner behavior for invalid paths
- MCP E2E with anthropic-sdk-python: 489 raw → 379 actionable
  — matches Phase 4A direct smoke test (489 raw → 379 actionable)
- MCP E2E with anthropic-sdk-typescript: 146 raw → 90 actionable, PARTIAL
  — matches Phase 4A direct smoke test (146 raw → 90 actionable, PARTIAL)

## Conclusion

Direct and MCP invocations produce identical semantic output. The MCP layer
adds protocol framing (structuredContent, text summary, isError) but does
not alter scan semantics.
