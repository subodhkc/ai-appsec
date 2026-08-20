# 01 — Source of Truth Inventory & Current Execution Path

> **Phase -1 forensic document.** Evidence-based inventory of all repositories.
> Every claim cites file:line. Evidence classification per RULE 1.

---

## Repository Inventory

### 1. haiec-website (PRIVATE)

| Field | Value | Evidence |
|-------|-------|---------|
| Repository | `subodhkc/haiec-website` | GitHub |
| Visibility | PRIVATE | `gh repo view` |
| Default branch | `main` (current checkout: `feat/search-intent-content-engine`) | git |
| Commit inspected | `81ae7a4ef1e2ef83087141c4b59c09e9fd6321db` | git rev-parse |
| Purpose | HAIEC main web application + AI security scanner + compliance platform | `package.json:1-229` |
| Package name | `haiec-website` | `package.json:2` |
| Version | `1.1.0` | `package.json:4` |
| Language/runtime | TypeScript / Next.js / Node.js | `package.json` |
| Node requirement | Not specified in `engines` | `package.json` (no `engines` field) |
| Main entrypoints | Next.js app router (`app/`) | `next.config.js` |
| Scanner entrypoints | `modal_ai_security_scanner.py` (Modal), `lib/ai-security/*` (app), `public-repo-scanner/` (CLI) | See Task 2 below |
| MCP entrypoints | NONE | grep: no MCP SDK in dependencies |
| CLI entrypoints | `public-repo-scanner/cli.py` | `public-repo-scanner/cli.py:1-320` |
| Rulepack locations | `semgrep_rules.yaml` (root), `test-semgrep-rules.yaml`, `test-semgrep-simple.yaml` | VERIFIED |
| Test locations | `__tests__/`, `playwright.config.ts`, `tests/` (Playwright) | `package.json:33` |
| CI workflows | `.github/workflows/modal-scanner-deploy.yml`, `CONSOLIDATED-CI.yml`, `modal-deploy-verify.yml`, `modal-policy-deploy.yml`, `modal-runtime-deploy.yml`, `haiec-orchestrator.yml` | VERIFIED |
| Release workflows | Modal deploy workflows (not npm publish) | VERIFIED |
| npm package names | N/A (not published; private app) | — |
| Dependencies on other repos | None direct (LLMVerify and Tenant Isolation are separate products) | VERIFIED |
| Areas that should remain private | All of `lib/ai-security/` scan orchestration, Prisma schema, auth, Modal scanner, compliance engine, trust artifacts | See `19-PUBLIC-PRIVATE-BOUNDARY.md` |
| Areas potentially suitable for extraction | `semgrep_rules.yaml` (provenance-permitting), rule metadata schema, SARIF output format, canonical hash pattern | See `06`, `15` |
| Stale/conflicting docs | README claims "70 rules → 33 IDs" (stale); "121 rules" claim conflicts with 91 actual | `README.md:150`, `config.ts:62` |

### 2. llmverify-npm (PUBLIC)

| Field | Value | Evidence |
|-------|-------|---------|
| Repository | `subodhkc/llmverify-npm` | GitHub |
| Visibility | PUBLIC | `gh repo view` |
| Default branch | `main` | git |
| Commit inspected | `b8ed0f2c6255093d20ee1889c43a6deb37d53a88` | git rev-parse |
| Purpose | LLM output verification library (prompt injection, PII, harmful content, hallucination risk, monitoring) | `package.json`, `src/index.ts` |
| Package name | `llmverify` | `package.json:2` |
| Version | `1.5.2` | `package.json:4` |
| Language/runtime | TypeScript / Node.js | `package.json` |
| Node requirement | `>=18.0.0` | `package.json` engines |
| Main entrypoints | `dist/index.js` (main), exports map for `./core`, `./adapters`, `./engines` | `package.json` |
| Scanner entrypoints | `verify()` function | `src/index.ts:67` |
| MCP entrypoints | NONE (library only; has `llmverify-serve` bin but that's an HTTP server, not MCP) | `package.json` bin |
| CLI entrypoints | `llmverify` → `dist/cli.js`, `llmverify-serve` → `bin/llmverify-serve.js` | `package.json` bin |
| Rulepack locations | N/A (detection is code-based, not rulepack-based) | — |
| Test locations | `tests/*.test.ts` (26+ test files) | VERIFIED |
| CI workflows | `.github/workflows/ci.yml` | VERIFIED |
| Release workflows | `.github/workflows/npm-publish.yml` (tag-triggered, provenance), `.github/workflows/publish.yml` (manual, NO provenance) — **DUPLICATE** | VERIFIED |
| npm package names | `llmverify` | `package.json` |
| Dependencies on other repos | None | — |
| Areas that should remain private | N/A (already public) | — |
| Areas potentially suitable for extraction | All public APIs are already exported | — |
| Stale/conflicting docs | None found in this audit | — |

### 3. mcp-tenant-isolation (PUBLIC)

| Field | Value | Evidence |
|-------|-------|---------|
| Repository | `subodhkc/mcp-tenant-isolation` | GitHub |
| Visibility | PUBLIC | `gh repo view` |
| Default branch | `main` | git |
| Commit inspected | `1e5278775adc9919aa9c9ae90b1e88a8aab56d79` | git rev-parse |
| Purpose | MCP server + programmatic engine for tenant isolation static analysis | `package.json`, `src/index.ts` |
| Package name | `mcp-tenant-isolation` | `package.json:2` |
| Version | `1.6.2` | `package.json:4` |
| MCP Registry name | `io.github.subodhkc/mcp-tenant-isolation` | `package.json` mcpName, `server.json` |
| Language/runtime | TypeScript / Node.js | `package.json` |
| Node requirement | `>=18.0.0` | `package.json` engines |
| Main entrypoints | `dist/index.js` (main), `dist/cli/index.js` (CLI bin `mti`) | `package.json` |
| Scanner entrypoints | `scan()` function exported from `src/index.ts:7`, implemented in `src/engine/scanner.ts:72` | VERIFIED |
| MCP entrypoints | `src/mcp/server.ts:133` (`startMcpServer`), stdio + SSE transports | VERIFIED |
| CLI entrypoints | `mti` → `dist/cli/index.js` | `package.json` bin |
| Rulepack locations | `src/rules/general.ts` (42 rules), `src/rules/mcp.ts` (15 rules) — TypeScript, not YAML | VERIFIED |
| Test locations | `tests/*.test.ts` (10 test files) | VERIFIED |
| CI workflows | `.github/workflows/ci.yml` (build, test, self-scan, npm publish, MCP Registry publish) | VERIFIED |
| Release workflows | Same CI workflow (on tags `v*.*.*`): npm publish with provenance + MCP Registry publish | VERIFIED |
| npm package names | `mcp-tenant-isolation` | `package.json` |
| MCP SDK version | `@modelcontextprotocol/sdk@^1.0.0` (v1 — NOT v2) | `package.json:95` |
| Dependencies on other repos | None | — |
| Areas that should remain private | N/A (already public) | — |
| Areas potentially suitable for extraction | `scan()` API, rules, reporters (SARIF, JSON, markdown, AI-JSON), suppressions | — |
| Stale/conflicting docs | None found | — |

### 4. llmverify-python-preview (PUBLIC — placeholder)

| Field | Value | Evidence |
|-------|-------|---------|
| Repository | `subodhkc/llmverify-python-preview` (redirects from `subodhkc/llmverify`) | GitHub |
| Visibility | PUBLIC | `gh repo view` |
| Created | 2025-12-02 | GitHub metadata |
| Last push | 2026-07-19 | GitHub metadata |
| Stars | 1 | GitHub metadata |
| Archived | No | GitHub metadata |
| Purpose | "PYPI package for LLM Audit and Compliance" — **PLACEHOLDER** | `pyproject.toml`: version `0.0.1`, classifier `"Development Status :: 1 - Planning"` |
| Canonical? | **NO** — `llmverify-npm` is canonical. This is an abandoned/placeholder Python preview. | VERIFIED |
| Recommendation | Archive or rename to clarify it's not the active LLMVerify | — |

### 5. haiec-ai-agent-security-free-mcp (PUBLIC — new, empty)

| Field | Value | Evidence |
|-------|-------|---------|
| Repository | `subodhkc/haiec-ai-agent-security-free-mcp` | GitHub |
| Visibility | PUBLIC | `gh repo view` |
| Default branch | `main` (no commits at audit start) | git |
| Purpose | Public orchestration/distribution layer for HAIEC AI Agent Security Scanner | This phase |
| Status | Empty repo, now contains Phase -1 docs | VERIFIED |

---

## Task 2 — Current Execution Path of the HAIEC AI Security Scanner

### CANONICAL CURRENT EXECUTION (verified)

```
User initiates scan (web UI or API)
  → app/api/ai-security/scan/route.ts (entrypoint)
  → lib/ai-security/scan-authorization.ts (auth check via Prisma)
  → lib/ai-security/scan-intent.ts (record scan intent via Prisma)
  → lib/ai-security/scan-limiter.ts (rate limit via Prisma)
  → Modal scanner invoked (MODAL_SCANNER_URL + SCANNER_API_KEY)
    → modal_ai_security_scanner.py (FastAPI on Modal)
      → Semgrep 1.52.0 executed with semgrep_rules.yaml (91 rules)
      → Findings normalized (severity mapped, rule_id mapped)
      → Results returned to HAIEC app
  → lib/ai-security/scan-state-machine.ts (state transitions via Prisma)
  → lib/ai-security/scan-completion-handler.ts (completion)
  → lib/ai-security/scan-audit.ts (audit events via Prisma)
  → lib/ai-security/artifact-storage.ts (evidence artifacts via Prisma)
  → Findings persisted to ai_security_findings (Prisma)
```

**Evidence:** `app/api/ai-security/scan/route.ts`, `lib/ai-security/scan-*.ts` (all files),
`modal_ai_security_scanner.py:35,38,41,64`, `semgrep_rules.yaml` (91 rules)

### LEGACY CODE

| Component | Location | Status | Evidence |
|-----------|----------|--------|----------|
| `public-repo-scanner/` | `public-repo-scanner/` | Legacy CLI for scanning public GitHub repos. Uses `--config=auto` fallback (line 54). Fabricates confidence (line 299-311). Not the production scanner path. | `public-repo-scanner/scanner/analyzer.py` |
| `lib/ai-security/config.ts` SCANNER_VERSION `3.27.0` | `lib/ai-security/config.ts:21` | Stale — Modal scanner is at `3.28.0` | VERIFIED |

### STALE CODE

| Component | Evidence |
|-----------|----------|
| `test-semgrep-rules.yaml`, `test-semgrep-simple.yaml` | Test fixtures, not production rules |
| README "70 rules → 33 IDs" claim | `README.md:150` — conflicts with 91 actual rules |

### DOCUMENTATION ONLY

| Claim | Source | Verified? |
|-------|--------|-----------|
| "121 rules (91 core + 30 SOC2)" | `modal_ai_security_scanner.py:83`, `config.ts:62` | **FALSE** — YAML has 91 rules, no separate SOC2 rule file found |
| "148 automated tests — 95 integration + 53 adversarial" | `README.md:125` | UNVERIFIED — not checked in this audit |

### UNKNOWN

| Item | Status |
|------|--------|
| Where the "30 SOC2 compliance rules" are defined | NOT FOUND in any YAML file. May be code-based checks, may not exist. |
| Whether `lib/ai-security/v2/` is active | Directory exists with README; not traced in this audit |
| GitHub OAuth flow in scanner | No direct OAuth calls found; tokens retrieved via Prisma `accounts` table |
