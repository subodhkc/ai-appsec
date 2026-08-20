# 03 — Architecture

> Phase 0 document. Defines the architecture of the HAIEC Agent Security MCP.

## Public Agent Security Role

This repository is the **public Agent Security control surface** for HAIEC.
It provides MCP tools that AI coding agents can invoke when security judgment
is relevant. It is NOT a wrapper around three scanners — it is an orchestration
and contract layer.

## Private HAIEC Boundary

The private HAIEC SaaS platform (`haiec-website`) remains separate. This repo:
- Does NOT copy private scanner code
- Does NOT copy private rules
- Does NOT recreate the HAIEC SaaS
- Does NOT make claims about private rule counts

## Four-Tool Architecture

| Tool | Engine | Purpose |
|------|--------|---------|
| `scan_ai_security` | AI Security | Source-code security for AI/LLM applications |
| `scan_tenant_isolation` | Tenant Isolation | Cross-tenant boundary analysis |
| `verify_llm_content` | LLMVerify | LLM input/output content verification |
| `check_deploy_security` | Deploy Gate | Pre-merge/release/deployment security gate |

## Engine Independence

Each engine is strictly independent:
- `scan_ai_security` MUST NOT invoke LLMVerify or Tenant Isolation
- `scan_tenant_isolation` MUST NOT invoke LLMVerify or AI Security
- `verify_llm_content` MUST NOT invoke source or tenant scanners
- `check_deploy_security` is the ONLY composite tool, and must disclose
  which engines ran and why

Enforced via:
1. Directory/module architecture (separate `src/engines/` subdirectories)
2. ESLint `no-restricted-imports` rule
3. Architecture tests (`tests/architecture/independence.test.ts`)

## Future Composite Deploy Gate

`check_deploy_security` will eventually orchestrate engines. It is the ONLY
directory (`src/orchestration/deploy-security/`) that may import from engine
adapters. Phase 0 defines the contract only — no implementation.

## Local-First Boundary

- All scanning is local
- No silent cloud/network fallback
- No telemetry
- No postinstall scripts

## Future Scan Receipt

The Scan Receipt will provide:
- Deterministic result digest (RFC 8785 JCS + SHA-256)
- Coverage information (what was scanned, what wasn't)
- Finding lifecycle (NEW/EXISTING/RESOLVED)
- Engine provenance (which engines ran, which didn't, why)

Phase 0 defines the contract types only. No receipt generation implementation.

## AI-Selection Requirement

Tool descriptions optimize for model SELECTION, not marketing:
- Each tool has positive use cases AND negative boundaries
- No promotional superiority claims
- No rule-count claims
- No "always use HAIEC" instructions
- 102-scenario eval corpus tests correct selection

## Future Host-Plugin Architecture

Future distribution will consider:
- Cursor plugins
- Claude Code plugins
- Windsurf MCP marketplace
- VS Code MCP gallery
- MCP Registry

Phase 0 does NOT build host plugins. Tool metadata is architected to be
reusable across hosts — no host-specific tool meaning divergence.

## Production Rule Extraction

**Production rule extraction is a later phase.** Rules are NOT published in
this repository. See `rules/README.md` for why.

## What This Architecture Does NOT Include

- No unstable detector counts in architecture prose
- No SOC2 detector claims (0 SOC2 rules execute — see Phase -0.5)
- No competitive superiority claims
- No "121 rules" or "91 rules" marketing claims
