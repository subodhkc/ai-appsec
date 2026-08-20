# 23 — Open Questions

> **Phase -1 document.** Unresolved questions requiring external/manual verification
> or later-phase investigation.

---

## External Validation Required

| # | Question | Why it matters | How to resolve |
|---|----------|----------------|----------------|
| 1 | Which MCP spec revision does Claude Code currently support? | HAIEC targets 2026-07-28; if Claude Code is on older revision, compatibility issues | Check Claude Code docs or test with a v2 server |
| 2 | Which MCP spec revision does Cursor currently support? | Same | Check Cursor docs or test |
| 3 | Which MCP spec revision does Windsurf currently support? | Same | Check Windsurf docs or test |
| 4 | Which MCP spec revision does VS Code's MCP extension support? | Same | Check VS Code extension docs |
| 5 | Are any of the 91 Semgrep rules derived from public rule packs? | Blocks rule publication (provenance) | Manual pattern comparison against Semgrep Registry, GitHub Security Lab, community packs |
| 6 | Does `@modelcontextprotocol/server@2.x` have Node.js version requirements? | Affects minimum Node version | Check published package `engines` field |
| 7 | Does the MCP Registry preview have rate limits or restrictions? | Affects publishing strategy | Check registry docs or test |
| 8 | Can HAIEC-authored rules be legally released under MIT? | Blocks rule publication | Legal review of IP/employment agreements |

---

## Later-Phase Investigation

| # | Question | Phase |
|---|----------|-------|
| 9 | Where are the "30 SOC2 compliance rules" that bring the total to 121? | Phase 0 (or retire the claim) |
| 10 | Is `lib/ai-security/v2/` active or legacy? | Phase 0 |
| 11 | What is the relationship between ENGINE_VERSION (3.8.0) and SCANNER_VERSION (3.28.0)? | Phase 0 (consolidate) |
| 12 | Which rule is missing the `metadata.rule_id` field (90 entries for 91 rules)? | Phase 0 |
| 13 | Does `lib/scoring/deterministic-engine.ts` contain relevant scoring logic? | Phase 0 |
| 14 | What is the actual test count in haiec-website (README claims 148)? | Phase 0 |
| 15 | Is the "AI Security Runtime" (README:12) a real active component? | Phase 0 |

---

## Design Decisions for Phase 0

| # | Question | Options |
|---|----------|---------|
| 16 | Should display ID aliasing (91→72) be preserved or resolved? | Preserve (backward compat) vs resolve (clarity) |
| 17 | Should the new scanner use Semgrep CLI subprocess or a Semgrep library? | CLI (simpler, isolated) vs library (faster, in-process) |
| 18 | Should the npm package name be `haiec-agent-security` or `@haiec/agent-security`? | Scoped vs unscoped |
| 19 | Should the MCP registry name be `io.github.subodhkc/haiec-agent-security`? | Confirm namespace |
| 20 | Should v0.1 support all 4 tools or start with just `scan_ai_security`? | All-at-once vs incremental |
