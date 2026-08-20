# 08 — Tenant Isolation Integration Assessment

> **Phase -1 forensic document.** Verifies that direct programmatic integration
> of the tenant isolation engine into HAIEC Agent Security is feasible.

---

## Current State (verified)

| Field | Value | Evidence |
|-------|-------|---------|
| Package name | `mcp-tenant-isolation` | `package.json:2` |
| Version | `1.6.2` | `package.json:4` |
| MCP Registry name | `io.github.subodhkc/mcp-tenant-isolation` | `package.json` mcpName, `server.json` |
| Node requirement | `>=18.0.0` | `package.json` engines |
| MCP SDK | `@modelcontextprotocol/sdk@^1.0.0` (**v1, not v2**) | `package.json:95` |
| Rule count | 57 (42 general + 15 MCP-specific) | `src/rules/index.ts:11` |
| Rule format | TypeScript (`src/rules/general.ts`, `src/rules/mcp.ts`) | VERIFIED |
| scan() export | YES — `src/index.ts:7` | VERIFIED |
| scan() signature | `scan(options: ScanOptions): Promise<ScanResult>` | `src/engine/scanner.ts:72` |
| ScanOptions | `{ projectRoot, config?, severityFilter?, rulesFilter?, noSuppress? }` | `src/engine/scanner.ts` |
| Transports | stdio (default), SSE | `src/mcp/server.ts:12-13,134,364,384` |
| MCP tools | 4: `scan_tenant_isolation`, `list_tenant_isolation_rules`, `explain_tenant_isolation_rule`, `suppress_tenant_isolation_finding` | `src/mcp/server.ts:34-130` |
| SARIF support | YES (SARIF 2.1.0) | `src/reporters/index.ts:192` |
| Reporters | JSON, SARIF, terminal, AI-JSON, markdown | `src/reporters/index.ts` |
| Suppression | `.mti-suppressions.json` (requires reason, approver, compensating controls, optional expiry) | `src/engine/suppressions.ts:73-88` |
| Baseline | `.mti-baseline.json` | `src/engine/scanner.ts:282-292` |
| Tests | 10 test files | `tests/` |
| CI | Build, test, self-scan, npm publish (provenance), MCP Registry publish | `.github/workflows/ci.yml` |
| Dependencies | @babel/parser, @babel/traverse, @babel/types, @modelcontextprotocol/sdk, commander, fast-glob | `package.json` |

---

## Architecture Assessment

### Scanner-core + MCP-wrapper separation

```
src/
├── engine/          ← Scanner core (no MCP dependency)
│   ├── scanner.ts   ← scan() function
│   ├── suppressions.ts
│   └── ...
├── rules/           ← Rule definitions (TypeScript)
│   ├── general.ts
│   ├── mcp.ts
│   └── index.ts
├── reporters/       ← Output formats
├── parsers/         ← AST parsers (Babel, Prisma, SQL)
├── mcp/             ← MCP wrapper (depends on engine, not vice versa)
│   └── server.ts
├── cli/             ← CLI wrapper
└── index.ts         ← Public API (exports scan, rules, reporters, types)
```

**Verdict:** Clean separation. The scanner engine (`src/engine/`) does NOT depend
on the MCP layer (`src/mcp/`). The `scan()` function can be imported directly
without starting an MCP server.

---

## Integration Feasibility

### Can HAIEC import `scan()` directly?

**YES.** The `src/index.ts` exports:
- `scan` function
- `buildFlowGraph`, `findPaths`
- `filterFalsePositives`
- `applySuppressions`, `validateSuppression`
- All reporters
- All rules
- All types
- Parsers (JS, Prisma, SQL)

**Integration pattern:**
```typescript
// In haiec-ai-agent-security-free-mcp
import { scan } from 'mcp-tenant-isolation';

// scan_tenant_isolation tool implementation
const result = await scan({
  projectRoot: '/path/to/project',
  severityFilter: 'HIGH',
  rulesFilter: ['DBQ-001', 'IDOR-002'],
});
```

### What HAIEC should NOT do

- **Do NOT use the tenant-isolation MCP server as a nested execution mechanism.**
  The intended integration is direct programmatic import, not MCP-to-MCP.
- **Do NOT merge tenant-isolation source code into HAIEC.** The engine remains
  an independent product with its own release cycle.
- **Do NOT add tenant-isolation as a dependency of `scan_ai_security`.** Per the
  tool-independence contract, `scan_ai_security` MUST NOT call tenant isolation.

---

## Issues to Address

### 1. MCP SDK v1 (not v2)

| Issue | `mcp-tenant-isolation` uses `@modelcontextprotocol/sdk@^1.0.0` (v1) |
|-------|-------------------------------------------------------------------|
| Impact | HAIEC targets MCP SDK v2 (`@modelcontextprotocol/server@2.x`). If HAIEC imports `mcp-tenant-isolation` as a library, the MCP SDK version mismatch doesn't matter (HAIEC only imports `scan()`, not the MCP server). However, if both run as MCP servers in the same process, there could be conflicts. |
| Resolution | Not a blocker for programmatic integration. HAIEC imports `scan()` only. The tenant-isolation MCP SDK version is its own concern. Recommend tenant-isolation upgrade to v2 independently (not HAIEC's task). |

### 2. Node engine version

| Issue | `engines.node` is `>=18.0.0` |
|-------|------------------------------|
| Impact | HAIEC may target Node 20+ or 22+. If tenant-isolation uses Node 18-specific APIs, this is fine. |
| Resolution | Test tenant-isolation `scan()` on Node 22/24 during Phase 0. |

### 3. Babel dependency weight

| Issue | `@babel/parser`, `@babel/traverse`, `@babel/types` are heavy dependencies |
|-------|---------------------------------------------------------------------------|
| Impact | Importing `mcp-tenant-isolation` brings Babel into HAIEC's dependency tree. |
| Resolution | Acceptable — Babel is needed for AST-based tenant isolation analysis. No alternative without reimplementing the engine (which violates independence). |

---

## Rule Categories (57 rules)

| Category | Prefix | Count | What it checks |
|----------|--------|-------|----------------|
| Tenant Context Management | TCM | 6 | Tenant context propagation |
| Database Query | DBQ | 10 | Prisma queries without tenant filters |
| IDOR | IDOR | 5 | Insecure direct object references |
| Cache/Session Isolation | CSI | 4 | Cache key scoping |
| API Security | API | 3 | API endpoint tenant isolation |
| Filesystem Isolation | FSI | 4 | Filesystem access scoping |
| Logging | LOG | 4 | Log attribution |
| Schema | SCH | 6 | Schema-level tenant isolation |
| MCP-specific | MCP | 15 | MCP tool visibility, session binding, credential vault, rate limiting, vector store |

---

## Conclusion

**Direct programmatic integration is FEASIBLE and RECOMMENDED.**

- `scan()` is cleanly exported with no MCP coupling
- The engine is a pure function: `scan(options) → result`
- No database, auth, or network coupling in the engine
- SARIF, JSON, and AI-JSON reporters available for output normalization

**HAIEC integration plan (for later phases):**
1. Add `mcp-tenant-isolation` as a dependency of `haiec-ai-agent-security-free-mcp`
2. Import only `scan()` and types — do NOT import the MCP server
3. Wrap `scan()` in the HAIEC `scan_tenant_isolation` MCP tool
4. Normalize output to HAIEC's common finding format
5. Maintain engine independence — `scan_ai_security` never imports this
