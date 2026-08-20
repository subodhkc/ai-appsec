# 19 — Phase 2 Exit Decision

## Decision

```
READY_WITH_EXCLUSIONS
```

## Exclusions

No detectors are excluded from migration. All 121 are classified as `CANDIDATE`. However, the following items must complete before public rule body publication:

1. External similarity audit (automated comparison against Semgrep community rules)
2. Final license selection for the project
3. Semgrep 1.52.0 execution validation in isolated environment
4. Golden corpus fixture implementation
5. User authorization for publication

## Exit Gate

| Gate | Status | Evidence |
|------|--------|----------|
| A. SOURCE — Production AI_SECURITY_RULES used | PASS | Extracted from `modal_ai_security_scanner.py` line 989 |
| B. COUNT — detectorDefinitions and logicalChecks separately counted | PASS | 121 detectors, 80 logical checks |
| C. PARITY — Staged extraction reproduces production baseline | PASS (EXPLAINED_DIFFERENCE) | Byte-for-byte extraction; execution validation pending |
| D. PROVENANCE — Every detector has provenance classification | PASS | All 121: STRONG_HAIEC_ORIGIN_EVIDENCE |
| E. LICENSE — Unresolved/restricted detectors prevented from publication | PASS | All CANDIDATE; rule bodies in gitignored staging |
| F. SEMANTICS — Every detector has detectorId, checkId, findingKind, defaultDisposition, ruleRevision | PASS | All 121 detectors have all five fields |
| G. BLOCK SAFETY — PRESENCE detectors not default BLOCK | PASS | All 43 PRESENCE detectors are INFORMATIONAL |
| H. QUALITY — Questionable detectors documented, not silently modified | PASS | See 16-RULE-QUALITY-BACKLOG.md |
| I. PRIVACY — No customer/private code in fixtures | PASS | Fixtures are designed but not yet implemented; no private code used |
| J. PUBLIC REPO SAFETY — No unresolved private rule bodies in tracked files | PASS | Rule bodies in .private-rule-staging/ (gitignored) |
| K. OTHER REPOS — No other repository modified | PASS | haiec-website, llmverify-npm, mcp-tenant-isolation unchanged |
| L. PUBLICATION — Nothing pushed/published/tagged/deployed | PASS | No commits, no pushes, no tags, no publishes |

## What Was NOT Done (Intentionally)

- No Semgrep modernization
- No MCP tool registration (`scan_ai_security` not registered)
- No rule body publication
- No license selection
- No rule quality fixes
- No automated external similarity check execution
