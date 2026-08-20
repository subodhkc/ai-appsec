# 00 — Executive Summary

> **Phase -1 Forensic Truth & Assumption Freeze (corrected in Phase -0.5).** This
> document summarizes the verified findings from the forensic audit of the HAIEC
> ecosystem. Full evidence is in the companion documents. No code was modified
> outside this new repo.
>
> **Phase -0.5 correction:** Several conclusions in this document were
> corrected during Phase -0.5 reconciliation. The most significant: the rule-count
> conclusion ("121 is FALSE; actual is 91") was too strong — 121 detector
> definitions DO exist in the Modal embedded rules (all `ai-*`), while 91 exist in
> the YAML file, and 0 SOC2 rules execute. See `docs/phase-minus-0-5/` for all
> corrections. The authoritative Phase 0 entry decision is now in
> `docs/phase-minus-0-5/13-PHASE-0-ENTRY-DECISION.md`.

---

## READY / NOT READY Decision

**READY_FOR_PHASE_0** — with documented P1 items to resolve during Phase 0.

No P0 blockers remain that would prevent Phase 0 from beginning, because Phase 0
will be a design/scaffolding phase that does not publish rules, does not publish
packages, and does not make public claims. All P0-class risks (rule licensing,
canonical scanner source, package identity) are **contained** — we know what we
don't know, and the Phase 0 scope explicitly avoids acting on unresolved items.

---

## The 10 Most Important Verified Findings

### 1. Rule count claim of "121 rules" is FALSE — actual count is 91
The production `semgrep_rules.yaml` contains **91 unique Semgrep rule IDs** (verified
by programmatic parse). The "121 rules" claim appears in `modal_ai_security_scanner.py:83`
("91 core AI security + 30 SOC2 compliance") and `lib/ai-security/config.ts:62`
(`TOTAL_STATIC_RULES = 121`). The 30 "SOC2 compliance" rules do not exist in the
YAML file. The README claims yet another number: "70 rules → 33 IDs" (stale).
**Evidence:** `semgrep_rules.yaml` (91 `id:` entries), `config.ts:38,55,62`, `modal_ai_security_scanner.py:83`, `README.md:150`

### 2. Critical version drift across 4+ files
- **SCANNER_VERSION:** `3.28.0` (Modal scanner) vs `3.27.0` (config.ts) — CONFLICT
- **RULEPACK_VERSION:** `121-rules-v4-soc2` (Modal) vs `2.0.0` (evidence-bundle generator) vs `2026.01.1` (artifact-generator, trust-artifacts) — THREE FORMATS
- **ENGINE_VERSION:** `3.8.0` (evidence-bundle generator) — yet another version
**Evidence:** `modal_ai_security_scanner.py:38,41`, `lib/ai-security/config.ts:21`, `lib/ai-security/ci/evidence-bundle/generator.ts:39-40`, `lib/artifacts/artifact-generator.ts:57`, `lib/trust-artifacts/service.ts:34`

### 3. Rule provenance is UNKNOWN — no license headers, no attribution
`semgrep_rules.yaml` contains **zero license headers, zero attribution comments,
zero Semgrep Registry references**. Git history shows only HAIEC-internal commits.
Before any rule can be published under MIT, provenance must be established for each
rule/rule family. **All 91 rules are currently `DO_NOT_PUBLISH_YET`.**
**Evidence:** grep for license/copyright/attribution/registry in `semgrep_rules.yaml` = 0 matches; `git log --follow semgrep_rules.yaml`

### 4. Display rule IDs are aliased — 91 Semgrep IDs map to 72 display IDs
The `metadata.rule_id` field (display ID) has only **72 unique values** for 91 rules.
12 display IDs are shared across multiple Semgrep rules (e.g., `R1` is used by 7
rules, `R2` by 3, `R5.2`/`R5.4`/`R5.5`/`R7.2`/`R7.3`/`R9.1`/`R9.4`/`R9.8`/`R12.4`/`R6.8` by 2 each).
This aliasing must be preserved or explicitly resolved in the new architecture.
**Evidence:** Programmatic parse of `metadata.rule_id` fields in `semgrep_rules.yaml`

### 5. Scanner is heavily coupled to database, Modal, and auth — cannot move to open source as-is
The scanner logic in `lib/ai-security/` makes **direct Prisma calls in 10+ files**
(scan-timeout, scan-state-machine, scan-intent, scan-audit, artifact-storage,
github-token, consent-enforcement, scan-authorization, scan-limiter, scan-cleanup).
The Modal scanner (`modal_ai_security_scanner.py`) is a 5500+ line FastAPI app
deployed on Modal with `httpx`, `asyncpg`, and `SCANNER_API_KEY` coupling.
**Evidence:** See `06-PUBLIC-SCANNER-EXTRACTION-ASSESSMENT.md` for file:line citations

### 6. LLMVerify has a postinstall banner that prints to stdout — breaks MCP stdio
`llmverify-npm` v1.5.2 has `"postinstall": "node dist/postinstall.js || true"` which
prints a large ASCII banner to **stdout**. This will corrupt MCP stdio protocol if
LLMVerify is imported into an MCP server. The banner respects `CI=true`,
`npm_config_loglevel=silent`, and `LLMVERIFY_SILENT=true`, but those are not set in
all MCP host environments.
**Evidence:** `package.json:43`, `src/postinstall.ts:106` (`console.log(banner)`)

### 7. LLMVerify has duplicate npm publishing workflows
Two workflows both publish to npm: `npm-publish.yml` (tag-triggered, with provenance)
and `publish.yml` (manual `workflow_dispatch`, no provenance). This is a maintenance
and security risk — the manual one could publish without provenance.
**Evidence:** `.github/workflows/npm-publish.yml:43`, `.github/workflows/publish.yml:61`

### 8. Tenant Isolation engine has clean architecture — direct programmatic integration is feasible
`mcp-tenant-isolation` v1.6.2 has a clean **scanner-core + MCP-wrapper** separation.
The `scan()` function is exported from `src/index.ts` and can be imported directly
without running the MCP server. 57 rules (42 general + 15 MCP-specific), SARIF 2.1.0
support, suppression mechanism with required compensating controls.
**Evidence:** `src/index.ts:7`, `src/engine/scanner.ts:72`, `src/mcp/server.ts:133`

### 9. Public-repo-scanner fabricates numeric confidence values
`public-repo-scanner/scanner/analyzer.py:299-311` `_calculate_confidence()` maps
Semgrep's qualitative confidence to fabricated numeric values (HIGH→0.9, MEDIUM→0.7,
LOW→0.5, default→0.8). These are not empirically calibrated probabilities. The new
architecture should not preserve fabricated numeric confidence.
**Evidence:** `public-repo-scanner/scanner/analyzer.py:299-311`

### 10. Evidence/fingerprint architecture has two separate implementations with different semantics
- `lib/safety/evidence-integrity.ts`: HMAC-based, includes userId + timestamp in
  composite hash, coupled to Prisma. NOT deterministic across reruns (timestamp varies).
- `lib/audit-orchestrator/fingerprint.ts`: Canonical JSON serialization, SHA-256,
  hash-chained event log, config snapshot hashing. More deterministic but does not
  include working tree state or file manifests.
Neither is suitable as-is for the Scan Receipt. The concept is reusable; the
implementations need rework.
**Evidence:** `lib/safety/evidence-integrity.ts:44`, `lib/audit-orchestrator/fingerprint.ts:26-43,100-116`

---

## Incorrect Assumptions Previously Held

| Assumption | Reality | Impact |
|------------|---------|--------|
| "121 rules" | 91 Semgrep rules in YAML; 30 "SOC2 compliance" rules don't exist | Public claims, rule count metrics, receipt design |
| Rulepack version is consistent | 3+ different version formats across files | Receipt reproducibility, version reporting |
| Rules are safe to open-source under MIT | No provenance evidence; all rules `DO_NOT_PUBLISH_YET` | Blocks rule extraction; requires provenance audit |
| LLMVerify is MCP-stdio-safe | Postinstall prints to stdout | Must fix before MCP integration |
| `llmverify` Python repo is canonical | It's a placeholder (v0.0.1, "Development Status :: 1 - Planning", 1 star); `llmverify-npm` is canonical | Confirmed: use llmverify-npm only |
| Confidence values are meaningful | Fabricated numeric mappings (0.9/0.7/0.5/0.8) | Must replace with qualitative evidence strength |
| Evidence fingerprint is deterministic | evidence-integrity.ts includes timestamp → not reproducible | Must redesign for Scan Receipt determinism |

---

## P0 Blockers (would block Phase 0 if Phase 0 acted on them)

**None.** Phase 0 is a design/scaffolding phase that will NOT publish rules, NOT
publish packages, and NOT make public claims. All P0-class risks are contained
by the Phase 0 scope restrictions below.

The following are P0-class risks that MUST be resolved before the respective later
phase acts on them:
1. **Rule licensing** — must resolve provenance before any rule is copied to the public repo (blocks rule extraction phase)
2. **Canonical scanner source** — must decide which version constants are authoritative before implementing scanner (blocks scanner implementation phase)
3. **Package identity** — must finalize npm package name and MCP registry namespace before publishing (blocks publish phase)

---

## P1 Issues (resolve during Phase 0 or early implementation)

1. Version drift: pick canonical source for SCANNER_VERSION, RULEPACK_VERSION, ENGINE_VERSION
2. Rule count discrepancy: decide whether "121" is retired or the 30 SOC2 rules are added
3. Display ID aliasing: decide whether to preserve or resolve the 91→72 mapping
4. LLMVerify postinstall stdout: plan the v1.6.0 fix
5. LLMVerify duplicate publishing workflows: plan consolidation
6. Evidence fingerprint determinism: design the Scan Receipt digest to exclude timestamps
7. Fabricated confidence: design qualitative evidence-strength replacement
8. MCP SDK version: mcp-tenant-isolation uses `@modelcontextprotocol/sdk@^1.0.0` (v1); HAIEC should target v2

---

## Important Opportunities Discovered

1. **Tenant isolation engine is integration-ready** — clean `scan()` export, no MCP coupling required. This is the easiest engine to integrate first.
2. **Canonical JSON serialization exists** (`lib/audit-orchestrator/fingerprint.ts:26-43`) — the `canonicalizeForHash` + `sortedReplacer` pattern is reusable for the Scan Receipt.
3. **Hash-chained event log** (`fingerprint.ts:129-145`) — reusable concept for tamper-evident scan audit trails.
4. **SARIF 2.1.0 support already exists** in both tenant-isolation and HAIEC — can leverage for GitHub Code Scanning integration.
5. **Suppression mechanism with compensating controls** (tenant-isolation) — reusable pattern for the HAIEC scanner.
6. **57 tenant isolation rules are TypeScript-defined** (not YAML) — provenance is clearer (HAIEC-authored, in-repo).
7. **MCP 2026-07-28 spec is stateless** — aligns perfectly with HAIEC's local-first, no-cloud-fallback requirement.

---

## Recommended Phase 0 Scope

1. Scaffold the `haiec-ai-agent-security-free-mcp` repo structure (src/, tests/, docs/)
2. Define TypeScript interfaces for: ScanReceipt, Finding, Verdict, EngineResult
3. Implement the tool-independence contract as compile-time module boundaries
4. Set up the test harness for independence tests (import-graph verification)
5. Create the AI tool-selection evaluation corpus (100 scenarios) as data, not code
6. Target MCP SDK v2 (`@modelcontextprotocol/server@2.x`) and 2026-07-28 spec
7. Do NOT copy any rules yet (provenance unresolved)
8. Do NOT publish anything yet
9. Do NOT integrate engines yet — define interfaces only
10. Resolve P1 items 1-3 (version canonicalization, rule count, display ID aliasing)

---

## What Should Be Removed From the Current Plan

1. **"121 rules" as a marketing/public claim** — it's false. Use "91 rules" or re-audit.
2. **Any plan to copy rules to the public repo before provenance audit** — blocked.
3. **Any assumption that LLMVerify is MCP-stdio-safe out of the box** — it's not.
4. **Any plan to use the existing evidence-integrity.ts fingerprint as-is** — not deterministic.
5. **Any plan to use fabricated numeric confidence values** — not calibrated.

---

## What Is Missing From the Current Plan

1. **Rule provenance audit workflow** — no process defined for establishing provenance of 91 rules
2. **MCP client compatibility testing** — which spec revision each client (Cursor, Claude Code, Windsurf, VS Code) currently supports is UNKNOWN
3. **Node 22/24 testing for LLMVerify** — engines.node is `>=18.0.0` but Node 22/24 not tested
4. **Network-blocked execution test** — no test verifies that local mode truly makes zero network calls
5. **Prompt-injection-from-findings test** — no test verifies that scanner output cannot inject into the AI agent context

---

## Facts Requiring External/Manual Verification

1. Which MCP spec revision does Claude Code currently support?
2. Which MCP spec revision does Cursor currently support?
3. Which MCP spec revision does Windsurf currently support?
4. Which MCP spec revision does VS Code's MCP extension currently support?
5. Are any of the 91 Semgrep rules derived from public rule packs (Semgrep Registry, GitHub Security Lab, etc.)? Requires manual review of rule patterns against known public rules.
6. Does `@modelcontextprotocol/server@2.x` have Node.js version requirements beyond what's documented?
7. Does the MCP Registry preview have rate limits or restrictions affecting HAIEC?

---

## Files Created (in `haiec-ai-agent-security-free-mcp/`)

- `AGENTS.md` (session rules, created before this phase)
- `PHASES.md` (phase tracker, created before this phase)
- `docs/phase-minus-1/00-EXECUTIVE-SUMMARY.md` (this file)
- `docs/phase-minus-1/01-SOURCE-OF-TRUTH.md`
- `docs/phase-minus-1/02-CLAIMS-LEDGER.md`
- `docs/phase-minus-1/03-VERSION-DRIFT-AUDIT.md`
- `docs/phase-minus-1/04-RULEPACK-FORENSIC-INVENTORY.md`
- `docs/phase-minus-1/05-RULE-PROVENANCE-AUDIT.md`
- `docs/phase-minus-1/06-PUBLIC-SCANNER-EXTRACTION-ASSESSMENT.md`
- `docs/phase-minus-1/07-LLMVERIFY-1.6-RECOMMENDATION.md`
- `docs/phase-minus-1/08-TENANT-ISOLATION-INTEGRATION-ASSESSMENT.md`
- `docs/phase-minus-1/09-MCP-COMPATIBILITY-MATRIX.md`
- `docs/phase-minus-1/10-TOOL-INDEPENDENCE.md`
- `docs/phase-minus-1/11-AI-TOOL-SELECTION-STRATEGY.md`
- `docs/phase-minus-1/12-AI-TOOL-SELECTION-EVALS.json`
- `docs/phase-minus-1/13-LOCAL-SECURITY-BOUNDARY.md`
- `docs/phase-minus-1/14-MCP-OUTPUT-SAFETY.md`
- `docs/phase-minus-1/15-EVIDENCE-ARCHITECTURE-REUSE-ASSESSMENT.md`
- `docs/phase-minus-1/16-SCAN-RECEIPT-SPEC-DRAFT.md`
- `docs/phase-minus-1/17-FINDING-SEMANTICS.md`
- `docs/phase-minus-1/18-VERDICT-CONTRACT.md`
- `docs/phase-minus-1/19-PUBLIC-PRIVATE-BOUNDARY.md`
- `docs/phase-minus-1/20-DISTRIBUTION-AND-ORGANIC-GROWTH.md`
- `docs/phase-minus-1/21-ARTIFACT-ADVANTAGE-ASSESSMENT.md`
- `docs/phase-minus-1/22-PHASE-GATE.md`
- `docs/phase-minus-1/23-OPEN-QUESTIONS.md`
- `docs/phase-minus-1/24-PHASE-0-ENTRY-DECISION.md`

## Existing Files Modified

**None outside the new repo.** The three read-only repos
(`haiec-website`, `llmverify-npm`, `mcp-tenant-isolation`) were inspected but not
modified. Their git status was clean at entry (except a pre-existing modified
`llmverify-audit.jsonl` in llmverify-npm that was not touched).
