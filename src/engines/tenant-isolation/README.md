# Tenant Isolation Engine

This directory will contain the tenant isolation engine adapter.

## Phase 0 Status

**NOT INTEGRATED.** This directory contains no implementation in Phase 0.

## Future Purpose

The tenant isolation engine will analyze multi-tenant SaaS and MCP server code
for cross-tenant data exposure, missing tenant filters, IDOR, RLS gaps, shared
caches, and tenant-aware boundary issues.

## Independence Constraint

This engine MUST NOT import from:
- `../ai-security/`
- `../llmverify/`
- `../../orchestration/deploy-security/`

Only `orchestration/deploy-security/` may eventually depend on this engine's adapter.
