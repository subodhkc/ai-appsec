# 10 — MCP v2 Compatibility Decision

> **Phase -0.5 document.** Corrects MCP architecture language and defines the
> dual-era compatibility strategy using the official TypeScript SDK v2.

---

## Phase -1 Errors

1. Phase -1 said "MCP 2026 is stateless" as a blanket statement — this is imprecise
2. Phase -1 listed MCP client spec support as a P0 blocker — this overstates the issue

---

## MCP Protocol Semantics (corrected)

### Differentiate these concepts

| Concept | Description |
|---------|-------------|
| **Modern protocol semantics (2026-07-28)** | New features: structured output, `server/discover`, per-request identity, etc. |
| **stdio long-lived connection** | stdio is a long-lived connection — one process, one connection, many requests |
| **HTTP per-request/stateless handling** | HTTP transport is per-request and stateless — each request may be handled independently |
| **Legacy compatibility (2025-era)** | The 2025-era protocol is what most existing clients speak today |

**Do NOT say "MCP 2026 is stateless" as a blanket statement.** stdio is long-lived;
HTTP is stateless. The protocol revision (2026-07-28) adds features but doesn't
change the transport semantics.

---

## MCP TypeScript SDK v2 Strategy

### Confirmed facts (from official SDK v2 documentation)

1. **`@modelcontextprotocol/server`** is the v2 server package
2. **`serveStdio()`** is the v2 entry point for stdio transport
3. `serveStdio()` supports BOTH 2025-era and 2026-07-28 protocol revisions via
   "era negotiation" in the opening exchange
4. The `legacy` option controls whether 2025-era clients are served (`'serve'`,
   default) or rejected (`'reject'`)
5. The factory pattern: `serveStdio(() => { const server = new McpServer(...); ... return server; })`
6. `StdioServerTransport` is still available for hand-wired servers (2025-era only)
7. stdout is the protocol channel — any non-protocol stdout corrupts the connection

### Dual-era compatibility design

```typescript
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';

// This single entry point serves BOTH 2025-era and 2026-07-28 clients
// The opening exchange negotiates which era the connection uses
serveStdio(() => {
  const server = new McpServer({
    name: 'haiec-agent-security',
    version: '0.1.0',
  });
  // Register tools — same factory serves both eras
  // server.registerTool(...)
  return server;
});
// Default: legacy: 'serve' — 2025-era clients are served from the same factory
```

### What this means for HAIEC

- **BUILD-TIME COMPATIBILITY:** HAIEC uses the official SDK to serve both protocol
  eras. No need to know which revision each client supports at build time.
- **HOST VALIDATION:** Empirical testing of each client (Cursor, Claude Code,
  Windsurf, VS Code) is deferred to pre-Beta phase gates.
- **Unknown client spec revisions do NOT block Phase 0 scaffolding.**

---

## Corrected Phase -1 Language

| Phase -1 | Phase -0.5 |
|----------|------------|
| "MCP 2026 is stateless" | "stdio is long-lived; HTTP is per-request/stateless; the 2026-07-28 revision adds features but doesn't change transport semantics" |
| "MCP client spec support unknown = P0 blocker" | "BUILD-TIME: dual-era SDK compatibility handles both; HOST VALIDATION: deferred to pre-Beta gates" |
| "Legacy HTTP+SSE transport is deprecated" | Confirmed — but not relevant to HAIEC (HAIEC uses stdio, not HTTP+SSE) |

---

## MCP Compatibility Matrix (updated)

### Build-time compatibility

| Capability | Status | Evidence |
|------------|--------|---------|
| Serve stdio (2025-era) | YES — `serveStdio()` with default `legacy: 'serve'` | Official SDK v2 docs |
| Serve stdio (2026-07-28) | YES — `serveStdio()` negotiates era automatically | Official SDK v2 docs |
| Structured output (`structuredContent`) | YES — `outputSchema` + `structuredContent` | MCP 2026-07-28 spec |
| Tool annotations | YES — supported in v2 | MCP 2026-07-28 spec |
| Resources | YES — supported in v2 | Official SDK v2 docs |
| Error handling | YES — typed errors in v2 | Official SDK v2 docs |

### Host validation (deferred to pre-Beta)

| Host | Test required | When |
|------|---------------|------|
| Cursor | Start, list tools, call tools, structured output, errors, terminate | Pre-Beta |
| Claude Code | Same | Pre-Beta |
| Windsurf | Same | Pre-Beta |
| VS Code | Same | Pre-Beta |

**The exact protocol revision used by each host may remain UNKNOWN** if vendors
don't document it. That UNKNOWN must not be falsely converted into a known version.
But it also does not block safe dual-era scaffolding.
