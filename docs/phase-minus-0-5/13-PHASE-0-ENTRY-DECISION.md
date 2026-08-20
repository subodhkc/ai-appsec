# 13 — Phase 0 Entry Decision (Phase -0.5)

> **Phase -0.5 final document.** Reassesses Phase 0 entry readiness after
> reconciliation.

---

## Decision: READY_FOR_PHASE_0

Phase 0 may begin. The reconciliation has corrected the overstrong Phase -1
conclusions. No P0 blockers prevent a scaffolding/design phase that does NOT
publish rules, NOT publish packages, and NOT make public claims.

---

## What Changed from Phase -1 Decision

| Phase -1 | Phase -0.5 |
|----------|------------|
| "121 rules is FALSE; actual count is 91" | "121 detector definitions execute in Modal (all `ai-*`); 91 in YAML file; 0 SOC2 rules execute" |
| "Rule provenance UNKNOWN for all 91" | "~63 PROVEN_HAIEC_ORIGINAL, ~28 STRONG_HAIEC_ORIGIN_EVIDENCE" |
| "LLMVerify is not MCP-stdio-safe" | "MCP_STDIO_FIRST_RUN_RISK — untested, not confirmed broken" |
| "Tenant Isolation has no MCP coupling" | "Tenant Isolation includes MCP, but `scan()` bypasses the MCP wrapper" |
| "Canonical JSON directly reusable" | "REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS" |
| "Scan Receipt is a unique differentiator" | "COMPETITIVE_VALIDATION_REQUIRED — potential differentiation is the combination, not any single feature" |
| "MCP 2026 is stateless" | "stdio is long-lived; HTTP is stateless; dual-era SDK handles both" |
| "MCP client spec unknown = P0 blocker" | "Build-time: dual-era SDK; host validation deferred to pre-Beta" |

---

## P0 Blockers (contained — do NOT block Phase 0)

| Blocker | Blocks which phase | Resolution |
|---------|--------------------|------------|
| SOC2 rules non-functional (0 execute) | Rule extraction phase | Document as non-functional; do NOT claim SOC2 rule count |
| Rule provenance for ~28 generic patterns | Rule publication phase | Pattern comparison against public rule packs |
| Legal review for HAIEC-authored rules | Rule publication phase | Confirm IP/employment agreements |
| LLMVerify stdio risk | LLMVerify integration phase | Empirical test before Beta |
| MCP host validation | Pre-Beta phase gates | Test each client empirically |

**None of these block Phase 0 scaffolding.**

---

## Phase 0 Entry Prerequisites (verified)

- [x] Tool independence contract stable (corrected in Phase -0.5)
- [x] Basic package architecture defined (Phase 0 scope below)
- [x] MCP SDK strategy decided (v2, dual-era, `serveStdio()`)
- [x] Safe filesystem boundary design defined (Phase -1 doc 13)
- [x] Output-safety design defined (Phase -1 doc 14)
- [x] Clear claims ledger (corrected in Phase -0.5)
- [x] Clear separation between verified rule counts and unresolved counts
- [x] Rule execution truth established (121 Modal / 91 YAML / 0 SOC2)
- [x] Evidence canonicalization decided (RFC 8785 JCS)
- [x] Competitive claims corrected (no unvalidated uniqueness claims)

---

## Revised Phase 0 Scope

### DO

1. Scaffold public repo as TypeScript/Node project
2. Set package `"private": true` initially to prevent accidental npm publication
3. Target Node `>=22` for this new package (unless dependency evidence requires otherwise)
4. Use MCP TypeScript SDK v2 (`@modelcontextprotocol/server`)
5. Design stdio using `serveStdio()` with dual-era compatibility (default `legacy: 'serve'`)
6. Define contracts (interfaces only) for:
   - `scan_ai_security`
   - `scan_tenant_isolation`
   - `verify_llm_content`
   - `check_deploy_security`
7. Define canonical shared result types (`ScanReceipt`, `Finding`, `Verdict`, `EngineResult`)
8. Define tool-independent module boundaries
9. Add compile/test enforcement preventing forbidden cross-engine imports
10. Add path/root validation utility and tests
11. Add output sanitization/redaction utility and tests
12. Add RFC 8785 JCS canonicalization utility and deterministic tests
13. Add tool-selection eval harness structure (schema from `12-AI-TOOL-SELECTION-EVAL-REVIEW.md`)
14. Add CI: build, typecheck, lint, unit tests, independence tests
15. Keep `rules/` empty except README/placeholder explaining why rule publication is blocked

### DO NOT

1. Do NOT integrate actual scanner engines (define interfaces only)
2. Do NOT copy private rules (provenance unresolved for ~28; SOC2 non-functional)
3. Do NOT modify LLMVerify
4. Do NOT modify Tenant Isolation
5. Do NOT implement deploy orchestration (`check_deploy_security` is interface only)
6. Do NOT publish npm
7. Do NOT publish MCP Registry
8. Do NOT create website pages
9. Do NOT make competitive claims
10. Do NOT make rule-count claims (use taxonomy from `03-RULE-COUNT-TAXONOMY.md`)
11. Do NOT implement the full Scan Receipt (define schema only; JCS utility is OK)
