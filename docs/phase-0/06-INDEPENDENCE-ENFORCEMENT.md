# 06 — Independence Enforcement

> Phase 0 document. Tool independence enforcement layers.

## Layer 1: Directory/Module Architecture

```
src/
  engines/
    ai-security/        ← MUST NOT import from tenant-isolation or llmverify
    tenant-isolation/   ← MUST NOT import from ai-security or llmverify
    llmverify/          ← MUST NOT import from ai-security or tenant-isolation
  orchestration/
    deploy-security/    ← ONLY directory that may import from engine adapters
```

## Layer 2: ESLint no-restricted-imports

`eslint.config.js` enforces:
- Engine directories cannot import from sibling engine directories
- Engine directories cannot import `@modelcontextprotocol/server` directly
- Only `src/mcp/` may import the MCP SDK

## Layer 3: Architecture Tests

`tests/architecture/independence.test.ts`:
- Scans all `.ts` files in each engine directory
- Verifies no imports from other engines
- Verifies no imports from deploy-security orchestration
- Verifies exactly 3 engine subdirectories
- Verifies only 1 orchestration directory (deploy-security)

## Test Results

All 9 architecture tests pass:
- ai-security: no sibling imports, no orchestration imports
- tenant-isolation: no sibling imports, no orchestration imports
- llmverify: no sibling imports, no orchestration imports
- Exactly 3 engine directories
- Exactly 1 orchestration directory
