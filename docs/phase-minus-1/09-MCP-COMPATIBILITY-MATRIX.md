# 10 — MCP Compatibility Matrix

> **Phase -1 document.** Defines MCP architecture targets for the HAIEC AI Agent
> Security Scanner. No implementation yet. Evidence-based; external validation
> noted where required.

---

## 1. Current MCP Protocol Revision

| Item | Value | Source | Evidence classification |
|------|-------|--------|------------------------|
| Current spec revision | **2026-07-28** | [blog.modelcontextprotocol.io/posts/2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/) | VERIFIED (official blog + spec site) |
| Previous spec revision | 2025-11-25 | MCP spec changelog | VERIFIED |
| Protocol core change | **Stateless** — `initialize/initialized` handshake removed (SEP-2575), `Mcp-Session-Id` header removed (SEP-2567) | 2026-07-28 blog post | VERIFIED |
| New discovery RPC | `server/discover` replaces handshake-based capability discovery | 2026-07-28 blog post | VERIFIED |
| Mid-tool input | MRTR (Multi-Round-Trip Requests, SEP-2322) — server returns `resultType: "input_required"` | 2026-07-28 blog post | VERIFIED |
| HTTP routing headers | `Mcp-Method` and `Mcp-Name` headers required on Streamable HTTP requests (SEP-2243) | 2026-07-28 blog post | VERIFIED |
| Response caching | `tools/list`, `prompts/list`, `resources/list`, `resources/read` responses carry `ttlMs` and `cacheScope` (SEP-2549) | 2026-07-28 blog post | VERIFIED |

---

## 2. TypeScript SDK

| Item | Value | Source | Evidence classification |
|------|-------|--------|------------------------|
| Current stable SDK | **v2** — `@modelcontextprotocol/server@2.0.0`, `@modelcontextprotocol/client@2.0.0`, `@modelcontextprotocol/core@2.0.0` | [npm @modelcontextprotocol/client](https://www.npmjs.com/package/@modelcontextprotocol/client), published 2026-07-27 | VERIFIED |
| Legacy SDK | v1 — `@modelcontextprotocol/sdk` (monolithic). Bugfixes/security for ≥6 months after v2 release | [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) README | VERIFIED |
| v2 package split | `@modelcontextprotocol/server`, `@modelcontextprotocol/client`, `@modelcontextprotocol/core`, plus adapters: `@modelcontextprotocol/express`, `@modelcontextprotocol/hono`, `@modelcontextprotocol/fastify` | npm + GitHub releases | VERIFIED |
| Runtime support | Node.js, Bun, Deno | SDK docs at ts.sdk.modelcontextprotocol.io/v2 | VERIFIED |

**Recommendation for HAIEC:** Target SDK v2 (`@modelcontextprotocol/server@2.x`) and
the 2026-07-28 spec. Do NOT build on v1 — it enters a limited maintenance window.
The monolithic `@modelcontextprotocol/sdk` package should not be used.

---

## 3. Transport

| Transport | Status (2026-07-28) | HAIEC recommendation |
|-----------|---------------------|----------------------|
| **stdio** | Active, primary for local tools | **Primary for HAIEC local scanner** — zero network surface, matches local-privacy requirement |
| **Streamable HTTP** | Active (stateless core, `Mcp-Method`/`Mcp-Name` headers) | Future option for cloud/CI; not v0.1 |
| **Legacy HTTP+SSE** | **Deprecated** — 12-month offramp | Do NOT use. If existing repos use SSE, flag for migration. |

---

## 4. Deprecated Features (SEP-2577, 12-month minimum window)

| Feature | Status | Replacement | HAIEC action |
|---------|--------|-------------|--------------|
| **Roots** (`roots/list`, `notifications/roots/list_changed`) | Deprecated | Explicit tool parameters, resource URIs, or server config | Do NOT use Roots. Pass project root as an explicit tool argument. |
| **Sampling** (`sampling/createMessage`) | Deprecated | Call LLM provider APIs directly; or MRTR `InputRequiredResult` | Do NOT use Sampling. HAIEC is a scanner, not an LLM orchestrator. |
| **Logging** (`logging/setLevel`, `notifications/message`) | Deprecated | `stderr` for stdio; OpenTelemetry for HTTP | Use `stderr` only for stdio. Never write logs to stdout (protocol-clean). |
| `ping` method | **Removed** (not just deprecated) | N/A — method returns "Method not found" on modern connections | Do not implement or rely on `ping`. |

**Critical for HAIEC:** The stdio transport MUST keep stdout protocol-clean. All
logging goes to stderr. This is a hard constraint — see `14-MCP-OUTPUT-SAFETY.md`.

---

## 5. Tool Definition Features

| Feature | Status | HAIEC usage |
|---------|--------|-------------|
| `inputSchema` (JSON Schema 2020-12) | Active, required | Define for each tool. Use `{ "type": "object", "additionalProperties": false }` for no-param tools. |
| `outputSchema` (JSON Schema 2020-12) | Active, optional but recommended | **Define for all HAIEC tools** — structured output is critical for AI-agent consumption and Scan Receipt. |
| `structuredContent` field | Active | Return structured JSON results (findings, receipts) here. Also return serialized text in `content` for backwards compat. |
| `annotations` (tool behavior metadata) | Active — but clients MUST treat as untrusted | Use for hints (e.g., `readOnlyHint`, `destructiveHint: false`). Do not rely on annotations for security. |
| `x-mcp-header` on input params | Active | Not needed for v0.1 (stdio transport). |

---

## 6. MCP Registry Requirements

| Requirement | Detail | Source |
|-------------|--------|--------|
| Registry URL | `registry.modelcontextprotocol.io` (preview) | [registry docs](https://github.com/modelcontextprotocol/registry) |
| Format | `server.json` per [generic-server-json.md](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md) | VERIFIED |
| Namespace (GitHub auth) | `io.github.<username>/*` or `io.github.<orgname>/*` (must be org Owner) | [authentication.mdx](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx) |
| Namespace (domain auth) | `com.example.*/*` (reverse-DNS of owned domain) | Same |
| Package ownership | Add `mcpName` to `package.json` matching server.json name | [quickstart.mdx](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx) |
| npm packages | Must be published to `https://registry.npmjs.org` (only) first — registry hosts metadata, not artifacts | [official-registry-requirements.md](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/official-registry-requirements.md) |
| `_meta` restrictions | Only `io.modelcontextprotocol.registry/publisher-provided` key allowed | Same |
| Publishing tool | `mcp-publisher` CLI | quickstart.mdx |
| Schema URL | `https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json` (referenced in examples) | generic-server-json.md |

**For HAIEC:** If publishing to the MCP Registry:
- npm package must be published first (to `registry.npmjs.org` only)
- `server.json` name should be `io.github.subodhkc/haiec-agent-security` (GitHub auth)
- `package.json` must include `"mcpName": "io.github.subodhkc/haiec-agent-security"`
- Registry is in preview — breaking changes possible. Do NOT rush to publish in early phases.

---

## 7. Client Compatibility Matrix

| Client | Protocol support | SDK | Notes | External validation |
|--------|-----------------|-----|-------|---------------------|
| **Claude Code** | 2026-07-28 (assumed latest) | Anthropic's own client | Supports stdio MCP servers, skills, rules | UNKNOWN_EXTERNAL_VALIDATION_REQUIRED — verify Claude Code's current MCP spec support level |
| **Cursor** | TBD | TBD | Supports MCP servers via config | UNKNOWN_EXTERNAL_VALIDATION_REQUIRED — verify Cursor's current MCP spec + SDK version |
| **Windsurf** | TBD | TBD | Supports MCP servers | UNKNOWN_EXTERNAL_VALIDATION_REQUIRED — verify Windsurf's current MCP spec + SDK version |
| **VS Code** | TBD | TBD | MCP support via extension(s) | UNKNOWN_EXTERNAL_VALIDATION_REQUIRED — verify VS Code MCP extension spec support |
| **Generic MCP client** | 2026-07-28 | `@modelcontextprotocol/client@2.x` | Any client built on SDK v2 | VERIFIED for SDK v2 clients |

> **WARNING:** Do NOT assume all clients support the 2026-07-28 spec revision yet.
> Some clients may still be on 2025-11-25 or earlier. The HAIEC server should
> negotiate protocol version gracefully. If a client only supports an older
> revision, the server should either work with that revision or clearly refuse.
> This must be tested empirically in a later phase — see
> `11-AI-TOOL-SELECTION-STRATEGY.md`.

---

## 8. HAIEC MCP Architecture Targets (draft — no implementation)

| Target | Value | Rationale |
|--------|-------|-----------|
| Spec revision | 2026-07-28 | Current stable |
| SDK | `@modelcontextprotocol/server@2.x` | Current stable, stateless core |
| Transport (v0.1) | stdio only | Local privacy, zero network surface |
| Transport (future) | Streamable HTTP (stateless) | For CI/cloud; not v0.1 |
| Logging | stderr only (stdio) | Protocol-clean stdout |
| Tool output | `structuredContent` + `outputSchema` | AI-agent consumable + Scan Receipt |
| Roots | NOT used | Deprecated; pass project root as tool argument |
| Sampling | NOT used | Deprecated; HAIEC is not an LLM orchestrator |
| Legacy SSE | NOT used | Deprecated |
| Registry | Publish after npm package is stable | Registry is in preview; don't rush |
| server.json name | `io.github.subodhkc/haiec-agent-security` (proposed) | GitHub auth namespace |

---

## 9. Open Questions (require external/manual validation)

1. Which MCP spec revision does Claude Code currently support? (2026-07-28 or earlier?)
2. Which MCP spec revision does Cursor currently support?
3. Which MCP spec revision does Windsurf currently support?
4. Which MCP spec revision does VS Code's MCP extension currently support?
5. Does the MCP Registry preview have any rate limits or restrictions that affect HAIEC publishing?
6. Are there client-specific tool-description length limits or rendering quirks that affect AI tool selection?
7. Does the `@modelcontextprotocol/server@2.x` SDK have any Node.js version requirements beyond what's documented? (Verify `engines` field in published package.)

These must be resolved before Phase 0 implementation begins. Mark as P1 blockers
for implementation, but not for Phase -1 completion (Phase -1 is documentary).
