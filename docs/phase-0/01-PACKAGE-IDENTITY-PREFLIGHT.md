# 01 — Package Identity Preflight

> Phase 0 document. Records npm registry checks for candidate package names.

## Commands Run

### npm whoami
```
npm error code E401
npm error 401 Unauthorized - GET https://registry.npmjs.org/-/whoami
```
**Result:** Not authenticated. Did not log in.

### @haiec/agent-security
```
npm view @haiec/agent-security name version --registry=https://registry.npmjs.org/
npm error code E404
npm error 404 Not Found
```
**Result:** Package does not exist on npm registry.

### haiec-agent-security
```
npm view haiec-agent-security name version --registry=https://registry.npmjs.org/
npm error code E404
npm error 404 Not Found
```
**Result:** Package does not exist on npm registry.

### haiec-agent-security-mcp
```
npm view haiec-agent-security-mcp name version --registry=https://registry.npmjs.org/
npm error code E404
npm error 404 Not Found
```
**Result:** Package does not exist on npm registry.

### haiec-ai-agent-security
```
npm view haiec-ai-agent-security name version --registry=https://registry.npmjs.org/
npm error code E404
npm error 404 Not Found
```
**Result:** Package does not exist on npm registry.

### npm search "haiec agent security" --json
**Result:** No HAIEC packages found in search results. Results were unrelated packages
(New Relic, agent-base, Arcjet, helmet, proxy-agent, etc.)

## Recommended Package Identity

Based on registry evidence:

| Priority | Name | Status |
|----------|------|--------|
| Preferred | `@haiec/agent-security` | 404 — not taken (requires @haiec org) |
| Fallback | `haiec-agent-security` | 404 — not taken |

**Current package.json uses:** `haiec-agent-security` (fallback, no org required)

**Note:** npm search absence is NOT proof that a name is available. The @haiec org
scope must be created before publishing `@haiec/agent-security`. No org was created
in this phase.

## Repository

- GitHub: `subodhkc/haiec-ai-agent-security-free-mcp`
- Future MCP identity: `com.haiec/agent-security` (not verified — domain namespace
  ownership not confirmed)
- No `mcpName/server.json` added yet.
