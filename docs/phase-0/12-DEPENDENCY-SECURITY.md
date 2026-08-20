# 12 — Dependency Security

> Phase 0 document. Dependency audit and security posture.

## npm audit

```
found 0 vulnerabilities
```

## Runtime Dependencies (3)

| Package | Version | Dependencies | Rationale |
|---------|---------|-------------|-----------|
| @modelcontextprotocol/server | 2.0.0 | zod, @modelcontextprotocol/core | MCP SDK v2 — required |
| canonicalize | 4.0.0 | (none) | RFC 8785 JCS — zero dependencies |
| zod | 4.4.3 | (none) | Schema validation — required by MCP SDK |

## Dev Dependencies (6)

| Package | Version | Rationale |
|---------|---------|-----------|
| typescript | 5.9.3 | Compiler |
| tsx | 4.23.12 | Test runner |
| eslint | 10.8.1 | Linter |
| @eslint/js | 10.0.1 | ESLint config |
| typescript-eslint | 8.67.0 | TS ESLint integration |
| @types/node | 26.2.0 | Node type definitions |

## Security Posture

- **No install scripts:** NO postinstall, NO preinstall, NO install
- **No floating ranges:** All versions pinned
- **Low runtime dependency count:** 3 (MCP SDK, canonicalize, zod)
- **No crypto packages:** Uses Node built-in `crypto` only
- **No network packages:** All scanning is local
- **No telemetry:** No analytics or tracking packages

## Version Pinning

All versions are exact-pinned (no `^`, `~`, `*`, `latest`). This ensures:
- Reproducible builds
- No unexpected upgrades
- No supply-chain risk from auto-resolving to new releases
