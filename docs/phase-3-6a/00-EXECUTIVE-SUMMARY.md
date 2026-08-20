# Phase 3.6A — Executive Summary

## Phase Decision

**PHASE_3.6A_COMPLETE — READ-ONLY FORENSIC AUDIT DONE.**

This phase was read-only. No production code, sample reports, trust pages, reports, public copy, MCP implementation, or rule bodies were modified. No commits, pushes, publishes, tags, or deployments were made.

## Key Numbers

| Metric | Value |
|--------|-------|
| Production detector count | 121 (91 core AI + 30 SOC2) |
| rc.3 candidate detector count | 122 (121 + 1 eval/exec split) |
| Semantic-check count | 81 |
| Legacy display IDs | 78 |
| Static-scanner downstream consumers found | 31 |
| CRITICAL dependencies | 9 |
| HIGH dependencies | 8 |
| Hardcoded count locations | 20+ across UI/docs/email |
| Public/demo sample artifacts found | 11 |
| Samples using synthetic/mock data | 11 (ALL) |
| Inaccurate sample descriptions | 4 |
| Stale sample rule counts | 1 (82 rules in sample, current is 121) |
| Unsupported sample claims | 4 ("real output", "actual scans", "No AI guessing", financial value) |
| Trust-page reachability | REACHABLE via /api/ai-security/trust-page/route.ts |
| Trust-page semantic problems | 1 CRITICAL (controls default to 'implemented' with 0 evidence) |
| Report semantic overclaims | 3 (violates compliance, data-flow paths, deterministic) |
| Risk-score formulas found | 3 (aggregation-v1, context-aware-v2, ai-inventory) |
| Duplicate-finding risk-score impact | CONFIRMED (inflation possible) |
| Benchmark claim status | UNVERIFIED (OWASP/DBIR citations lack URLs) |
| Financial-impact claim status | UNSUPPORTED (probabilities and costs unverified) |
| Compliance-overclaim locations | 1 CRITICAL (ai-security-report.ts:277) |
| False clean/pass/implemented semantics | 2 (trust-page defaults, cleanRules calculation) |
| TypeScript analyzer capabilities worth preserving | 8 (CFG, alias, heap, taint, evidence, completeness, conservative-flagging, best-practices) |
| P0 issues | 12 |
| P1 issues | 5 |
| P2 issues | 7 |
| P3 issues | 1 |

## Version Drift Findings

1. **Scanner version drift:** Modal fallback `3.28.0` vs Next.js `config.ts` `3.27.0`
2. **Next.js /api/health endpoint:** NOT created (VERSION-SOURCE-OF-TRUTH.md line 288 unchecked)
3. **CI/CD verification:** NOT implemented (doc lines 293-299 all unchecked)
4. **Semgrep version:** Modal pins `1.52.0`; rc.3 uses `1.173.0` (not yet deployed)

## Top P0 Issues (12)

1. Trust page defaults all 8 controls to 'implemented' with 0 evidence
2. Sample AI security report uses MOCK data but gallery says "real output"
3. Report says "violates SOC2/GDPR/HIPAA" from pattern detection alone
4. Industry benchmarks cite "OWASP LLM Security Report 2024" with no URL
5. Verizon DBIR 2024 cited for "data exposure risks per AI application" (DBIR doesn't cover this)
6. 45/28/15/5% exploitation probabilities have no source
7. "Estimated Value Protected $X.XM" derived from unverified inputs
8. Homepage claims "Provable data-flow paths. Not heuristics." (only 6 taint rules)
9. deterministic-engine.ts claims "No heuristics" but context-aware aggregation uses heuristic scoring
10. Trust artifacts page claims "Generated from actual security scans" but trust page defaults to implemented
11. REGULATORY_FINE_RANGES and INCIDENT_COST_RANGES have no citations
12. Sample report shows "82 security rules" (stale; current is 121)

## Recommended Phase 3.6B Scope

1. Fix P0 trust-page overclaim (controls default to implemented)
2. Fix P0 compliance overclaim in ai-security-report.ts ("violates")
3. Fix P0 sample report: regenerate with real scanner output OR label as SYNTHETIC_DEMO
4. Fix P0 financial/benchmark claims: add citations or downgrade to ILLUSTRATIVE
5. Fix P0 "data-flow paths" and "No heuristics" overclaims
6. Fix P1 version drift (Modal vs Next.js scanner version)
7. Fix P1 Next.js /api/health endpoint
8. Fix P1 cleanRules negative-evidence semantics
9. Design canonical manifest-derived count replacement for hardcoded UI counts
10. Implement sample-versioning contract

## Confirmations

- HAIEC website: **unchanged** (read-only forensic)
- Supporting repos (mcp-tenant-isolation, llmverify-npm, llmverify-python-preview): **unchanged**
- Nothing committed, pushed, published, tagged, or deployed
