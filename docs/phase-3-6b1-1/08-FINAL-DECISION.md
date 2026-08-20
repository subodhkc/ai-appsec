# 08 — Final Decision

## Phase Decision: PASS

Phase 3.6B-1.1 is complete. The Phase 3.6B-1 working tree has been validated, corrected, and is now internally consistent, semantically accurate, non-breaking, truthful about its calculations and evidence, and safe to freeze.

## Exit Gate Checklist

- [x] complete 3.6B-1 diff reviewed
- [x] each modified file has purpose/test coverage
- [x] version reconciliation is internally consistent
- [x] health checker does not knowingly expect wrong Modal version
- [x] trust statuses do not imply evaluation not proven
- [x] evidence_found requires affirmative evidence (documented as unreachable)
- [x] Tenant Isolation remains NOT evaluated by static scanner
- [x] remaining trust mappings semantically reviewed
- [x] actual financial formula documented
- [x] public financial copy exactly matches actual formula
- [x] internal model assumptions explicitly identified
- [x] no empirical "probability" claim without evidence
- [x] SOC2 has no regulatory-fine semantics
- [x] no unsupported SOC2 dollar value
- [x] source registry primary-source verified
- [x] every sample classification has evidence or UNKNOWN_SOURCE
- [x] public/static sample contradictions reconciled
- [x] active claim sweep completed
- [x] "No AI guessing" occurrences individually reviewed
- [x] risk-score structural change deferred
- [x] rc.3 unchanged
- [x] Modal rule bodies unchanged
- [x] MCP unchanged
- [x] Tenant Isolation unchanged
- [x] LLMVerify unchanged
- [x] targeted changed-area tests pass
- [x] audit tests pass
- [x] no new typecheck/build regressions
- [x] nothing committed/pushed/deployed/published/tagged

## Key Corrections Made in Phase 3.6B-1.1

1. **Version reconciliation:** config.ts updated from 3.27.0 to 3.28.0 (matching Modal). Health checkers now import SCANNER_VERSION instead of hardcoding. Artifact generator and scan notification email updated to use SCANNER_VERSION instead of stale 3.22.0.

2. **Trust-page status semantics:** `no_issue_detected_in_scope` renamed to `no_relevant_finding_reported` because the generator cannot prove the check was actually evaluated — it only knows no finding was reported.

3. **Financial model SOC2:** Removed invented $100K–$1M dollar range for SOC2 "Assurance Impact." SOC2 is now qualitative only ($0).

4. **Financial copy:** Removed "evidence strength" and "affected scope" from the Modeled Potential Impact copy — these are NOT mathematical inputs. Copy now accurately lists: finding severity, finding category, company size, confidence level, compliance mapping.

5. **Stale rule counts:** Fixed 18 additional files that Phase 3.6B-1 missed (91 Semgrep rules, 92 rules, 78 display IDs, 82 compliance mappings, 200+ rules, 78 rules).

6. **E2E test:** Fixed wrong field name and contradictory version assertions.

7. **Source registry:** Fixed "calibrated against IBM" to "informed by published breach-cost context."

## Files Changed in Phase 3.6B-1.1
52 modified + 1 new = 53 total (includes Phase 3.6B-1 changes + Phase 3.6B-1.1 corrections)
