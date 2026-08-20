# 07 — Tenant Integration Correction

> **Phase -0.5 document.** Corrects the Phase -1 wording about tenant isolation
> MCP coupling.

---

## Phase -1 Error

Phase -1 stated: "Tenant Isolation has no MCP coupling" and "clean separation,
scanner engine does NOT depend on the MCP layer."

**This was imprecise.** The package DOES include MCP functionality. The correct
statement is about the integration approach, not about the package's architecture.

---

## Corrected Architecture Description

### What the package contains

`mcp-tenant-isolation` is a full MCP server package that includes:
- Scanner engine (`src/engine/`) — the core scanning logic
- MCP server wrapper (`src/mcp/`) — MCP protocol handling
- CLI (`src/cli/`) — command-line interface
- Reporters (`src/reporters/`) — output formats
- Rules (`src/rules/`) — TypeScript rule definitions

### The correct integration approach

The package has MCP functionality, BUT its scanning engine exposes a directly
importable programmatic `scan()` API that bypasses the MCP wrapper.

**Future HAIEC integration should:**
- Import `scan()` directly from `mcp-tenant-isolation`
- NOT use the tenant-isolation MCP server as a nested execution mechanism
- NOT start the tenant-isolation MCP server within HAIEC's MCP server

**This is "bypass the MCP wrapper," not "no MCP coupling."**

---

## Corrected Wording

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Tenant Isolation has no MCP coupling" | "Tenant Isolation includes MCP functionality, but its `scan()` API can be imported directly, bypassing the MCP wrapper" |
| "The engine does NOT depend on the MCP layer" | "The engine (`src/engine/`) does not import from the MCP layer (`src/mcp/`), but the package as a whole includes MCP server functionality" |
| "Clean separation" | "Clean API separation — `scan()` is independently importable" |

---

## Integration Plan (unchanged)

1. Add `mcp-tenant-isolation` as a dependency of `haiec-ai-agent-security-free-mcp`
2. Import only `scan()` and types — do NOT import or start the MCP server
3. Wrap `scan()` in the HAIEC `scan_tenant_isolation` MCP tool
4. Normalize output to HAIEC's common finding format
5. Maintain engine independence — `scan_ai_security` never imports this
