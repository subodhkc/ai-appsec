# 02 — Dependency Decision

> Phase 0 document. Records dependency versions selected and rationale.

## Runtime Dependencies

| Package | Version | License | Rationale |
|---------|---------|---------|-----------|
| `@modelcontextprotocol/server` | 2.0.0 | MIT | MCP TypeScript SDK v2 — required for MCP server. Dual-era stdio via `serveStdio()`. |
| `canonicalize` | 4.0.0 | Apache-2.0 | RFC 8785 JSON Canonicalization Scheme. Zero dependencies. Used for deterministic hashing. |
| `zod` | 4.4.3 | MIT | Schema validation. Required by MCP SDK v2 (`peerDependency: ^4.2.0`). |

## Dev Dependencies

| Package | Version | License | Rationale |
|---------|---------|---------|-----------|
| `typescript` | 5.9.3 | Apache-2.0 | TypeScript compiler. v7.0.2 incompatible with typescript-eslint. |
| `tsx` | 4.23.12 | MIT | TypeScript test runner. Used for `node:test` runner. |
| `eslint` | 10.8.1 | MIT | Linter. Used for `no-restricted-imports` engine independence enforcement. |
| `@eslint/js` | 10.0.1 | MIT | ESLint recommended config. |
| `typescript-eslint` | 8.67.0 | MIT | TypeScript ESLint integration. |
| `@types/node` | 26.2.0 | MIT | Node.js type definitions. |

## Version Pinning Strategy

All versions are **pinned** (no `^`, `~`, `latest`, or `*` ranges). This ensures:
- Reproducible builds
- No unexpected upgrades
- No supply-chain risk from auto-resolving to brand-new releases

## Dependency Count

- **Runtime:** 3 (MCP SDK, canonicalize, zod)
- **Dev:** 6 (typescript, tsx, eslint, @eslint/js, typescript-eslint, @types/node)
- **Total installed:** 98 packages (including transitive)

## npm audit

```
found 0 vulnerabilities
```

## No Install Scripts

The package itself has:
- NO `postinstall`
- NO `preinstall`
- NO `install`

scripts. This prevents supply-chain attacks via lifecycle hooks.

## engines

```json
"engines": {
  "node": ">=22"
}
```

MCP SDK v2 requires `node >=20`. We target `>=22` as per Phase 0 requirements.
