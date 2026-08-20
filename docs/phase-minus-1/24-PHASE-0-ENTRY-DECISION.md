# 24 — Phase 0 Entry Decision

> **Phase -1 final document (corrected in Phase -0.5).** Determines whether
> Phase 0 may begin and defines its scope.
>
> **Phase -0.5 correction:** Several Phase -1 conclusions were corrected. The
> rule-count conclusion, provenance assessment, LLMVerify classification, tenant
> isolation wording, canonicalization decision, competitive claims, and MCP
> architecture language were all revised. See `docs/phase-minus-0-5/` for details.
> The final Phase 0 entry decision is in
> `docs/phase-minus-0-5/13-PHASE-0-ENTRY-DECISION.md`.

---

## Decision: READY_FOR_PHASE_0

Phase 0 may begin. No P0 blockers prevent a design/scaffolding phase that does
NOT publish rules, NOT publish packages, and NOT make public claims.

**Note:** The authoritative Phase 0 entry decision and scope is now in
`docs/phase-minus-0-5/13-PHASE-0-ENTRY-DECISION.md`. This document is retained
for historical context.

---

## P0 Blockers (contained — must resolve before respective later phases)

| Blocker | Blocks which phase | Resolution required |
|---------|--------------------|---------------------|
| Rule provenance unknown (all 91 rules DO_NOT_PUBLISH_YET) | Rule extraction phase | Complete provenance audit + legal review |
| Canonical scanner version not decided | Scanner implementation phase | Pick single source for SCANNER_VERSION, RULEPACK_VERSION |
| npm package name / MCP namespace not finalized | Publish phase | Confirm `haiec-agent-security` + `io.github.subodhkc/haiec-agent-security` |
| MCP client spec support unknown (Claude Code, Cursor, Windsurf, VS Code) | AI selection testing phase | Test each client's MCP spec revision |

---

## Phase 0 Scope

### DO
1. Scaffold repo structure: `src/`, `tests/`, `docs/`, `rules/`, `.github/workflows/`
2. Define TypeScript interfaces: `ScanReceipt`, `Finding`, `Verdict`, `EngineResult`, `ScanOptions`
3. Set up MCP SDK v2 (`@modelcontextprotocol/server@2.x`) with stdio transport
4. Implement tool-independence module boundaries (compile-time isolation)
5. Set up independence test harness (import-graph verification)
6. Create the AI tool-selection evaluation corpus as test data (100 scenarios from `12-AI-TOOL-SELECTION-EVALS.json`)
7. Implement canonical JSON serialization + SHA-256 hashing (reused from `fingerprint.ts` pattern)
8. Implement path validator (`isWithinProjectRoot`, symlink rejection)
9. Implement output sanitizer (secret redaction, relative paths, no raw source)
10. Define `outputSchema` for each tool (MCP 2026-07-28 structured output)
11. Resolve P1 items: version canonicalization, rule count, display ID aliasing decision
12. Write `llms.txt` for AI discovery
13. Set up CI (build, test, typecheck, lint)

### DO NOT
1. Do NOT copy any Semgrep rules (provenance unresolved)
2. Do NOT publish to npm or MCP Registry
3. Do NOT integrate engines yet (define interfaces only)
4. Do NOT make public claims about rule counts or capabilities
5. Do NOT modify read-only repos
6. Do NOT implement `check_deploy_security` yet (requires all 3 engines first)
7. Do NOT implement the full Scan Receipt yet (define schema only)

---

## Phase 0 Entry Prerequisites (verified)

- [x] Workspace assembled with 1 write + 3 read-only repos
- [x] Session rules persisted in `AGENTS.md`
- [x] Phase tracker in `PHASES.md`
- [x] Phase -1 forensic audit complete (24 documents)
- [x] Read-only repos unmodified
- [x] No P0 blockers that affect Phase 0 scope
- [x] MCP compatibility matrix documented
- [x] Tool independence contract defined
- [x] AI tool-selection strategy + evals corpus created
- [x] Local security boundary defined
- [x] Output safety requirements defined
- [x] Evidence architecture reuse assessment complete
- [x] Scan receipt spec drafted
- [x] Finding semantics defined
- [x] Verdict contract defined
- [x] Phase gate checklist defined
- [x] Distribution architecture documented
- [x] Artifact advantage assessment complete
- [x] Public/private boundary defined
- [x] Open questions documented
