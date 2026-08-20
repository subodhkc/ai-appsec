# 19 — Public / Private Boundary

> **Phase -1 document.** Defines what can become open source and what must
> remain private. No code moved.

---

## Principle

The public repo (`haiec-ai-agent-security-free-mcp`) is the **orchestration and
distribution layer**. It does NOT contain:
- HAIEC business logic
- Production database schema
- Authentication/OAuth flows
- Modal deployment code
- Compliance engine internals
- Customer data or production secrets

---

## MUST REMAIN PRIVATE (in haiec-website)

| Component | Reason |
|-----------|--------|
| `modal_ai_security_scanner.py` | Modal infrastructure, Postgres coupling, SCANNER_API_KEY |
| `lib/ai-security/scan-*.ts` (all) | Prisma coupling, app-specific orchestration |
| `lib/ai-security/consent-enforcement.ts` | Business logic, legal compliance |
| `lib/ai-security/github-token.ts` | OAuth token retrieval, Prisma coupling |
| `lib/ai-security/artifact-storage.ts` | Prisma coupling, evidence storage |
| `prisma/schema.prisma` | Production database schema |
| `app/api/ai-security/scan/` | API routes, auth coupling |
| `lib/safety/evidence-integrity.ts` | Prisma coupling, HMAC secret |
| `lib/artifacts/`, `lib/trust-artifacts/` | Compliance engine, artifact generation |
| `lib/compliance-wizard/` | Compliance framework logic |
| `lib/audit-orchestrator/` (event-log) | Prisma coupling for event storage |
| `.env.example`, `.env*` | Environment configuration (references secrets) |
| `packages/haiec-anthropic/`, `packages/haiec-openai/` | SDK wrappers (business logic) |
| `packages/intake-ai/` | AI-guided intake (business logic) |
| `public-repo-scanner/` | Python; uses `--config=auto` fallback, fabricates confidence |

---

## POTENTIALLY SUITABLE FOR EXTRACTION (with conditions)

| Component | Condition | Destination |
|-----------|-----------|-------------|
| `semgrep_rules.yaml` (91 rules) | **DO_NOT_PUBLISH_YET** — provenance must be established first | Public repo rulepack |
| Rule metadata schema (category, cwe, compliance_frameworks, etc.) | Reusable schema design | Public repo |
| `lib/audit-orchestrator/fingerprint.ts` (canonical hash) | REUSE_IMPLEMENTATION — no Prisma coupling | Public repo (Scan Receipt) |
| Canonical JSON serialization pattern | Reusable | Public repo |
| Hash-chained event log concept | Reusable concept | Public repo |
| SARIF 2.1.0 output format | Reusable pattern | Public repo |
| Severity/category ontology | Reusable | Public repo |

---

## WILL BE IMPORTED AS DEPENDENCIES (not copied)

| Engine | Package | Integration |
|--------|---------|-------------|
| Tenant Isolation | `mcp-tenant-isolation` (npm) | `import { scan } from 'mcp-tenant-isolation'` |
| LLMVerify | `llmverify` (npm) | `import { verify, checkPromptInjection, ... } from 'llmverify'` |
| AI Security Scanner | NEW implementation in public repo | Fresh TypeScript implementation using Semgrep CLI |

---

## What the Public Repo Contains

| Component | Source |
|-----------|--------|
| MCP server (stdio, v2 SDK) | New code |
| `scan_ai_security` tool | New code (wraps Semgrep CLI + HAIEC rulepack) |
| `scan_tenant_isolation` tool | New code (wraps `mcp-tenant-isolation` scan()) |
| `verify_llm_content` tool | New code (wraps `llmverify` verify()) |
| `check_deploy_security` tool | New code (orchestrates the above) |
| HAIEC rulepack (Semgrep YAML) | Extracted from haiec-website AFTER provenance audit |
| Scan Receipt | New code (reuses canonical hash pattern) |
| Output sanitizer | New code |
| Path validator | New code |
| MCP server.json | New config |
| GitHub Action | New workflow |
| Documentation | New docs |

---

## What the Public Repo Does NOT Contain

- No Prisma, no database
- No NextAuth, no OAuth
- No Modal, no serverless deployment
- No compliance engine
- No trust artifacts
- No production secrets
- No customer data
- No HAIEC SaaS features
