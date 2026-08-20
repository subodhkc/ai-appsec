# 15 — Prioritized Gaps

## P0 — Can materially mislead users / security claims (12)

| ID | Title | Fix Timing | Path |
|----|-------|-----------|------|
| GAP-001 | Trust page defaults all 8 controls to 'implemented' with 0 evidence | FIX_BEFORE_SAAS_CUTOVER | trust-page.ts:79-120 |
| GAP-002 | Sample AI security report uses MOCK data but gallery says 'real output' | FIX_BEFORE_SAAS_CUTOVER | test-ai-security-report.ts:24 + metadata.ts:5 |
| GAP-003 | Report says 'violates SOC2/GDPR/HIPAA' from pattern detection alone | FIX_BEFORE_SAAS_CUTOVER | ai-security-report.ts:277 |
| GAP-004 | Industry benchmarks cite 'OWASP LLM Security Report 2024' with no URL | FIX_BEFORE_SAAS_CUTOVER | industry-averages.ts:21,33,45,57 |
| GAP-005 | Verizon DBIR 2024 cited for 'data exposure risks per AI application' | FIX_BEFORE_SAAS_CUTOVER | industry-averages.ts:72,84,96 |
| GAP-006 | 45/28/15/5% exploitation probabilities have no source | FIX_BEFORE_SAAS_CUTOVER | financial-impact.ts:97-102 |
| GAP-007 | 'Estimated Value Protected $X.XM' derived from unverified inputs | FIX_BEFORE_SAAS_CUTOVER | ai-security-report.ts:186,239 |
| GAP-008 | Homepage claims 'Provable data-flow paths. Not heuristics.' | FIX_BEFORE_SAAS_CUTOVER | page.tsx:1029 |
| GAP-009 | deterministic-engine.ts claims 'No heuristics' but context-aware uses heuristic scoring | FIX_BEFORE_SAAS_CUTOVER | deterministic-engine.ts:8 |
| GAP-010 | Trust artifacts page claims 'Generated from actual security scans' | FIX_BEFORE_SAAS_CUTOVER | trust-artifacts/page.tsx:27 |
| GAP-011 | (reserved, see claim-map.json) | FIX_BEFORE_SAAS_CUTOVER | — |
| GAP-022 | REGULATORY_FINE_RANGES and INCIDENT_COST_RANGES have no citations | FIX_BEFORE_SAAS_CUTOVER | financial-impact.ts:25-92 |

## P1 — Can break scanner/product behavior (5)

| ID | Title | Fix Timing | Path |
|----|-------|-----------|------|
| GAP-011 | Risk score can inflate from duplicate findings | FIX_DURING_SAAS_CUTOVER | aggregation.ts:336-356 |
| GAP-012 | Scanner version drift: Modal 3.28.0 vs Next.js 3.27.0 | FIX_BEFORE_SAAS_CUTOVER | modal:38 vs config.ts:21 |
| GAP-013 | Next.js /api/health endpoint NOT created | FIX_BEFORE_SAAS_CUTOVER | VERSION-SOURCE-OF-TRUTH.md:288 |
| GAP-014 | CI/CD pipeline NOT updated to verify commit | FIX_BEFORE_SAAS_CUTOVER | VERSION-SOURCE-OF-TRUTH.md:293-299 |
| GAP-015 | Sample report shows '82 rules' and '77 of 82 passed' (stale) | FIX_BEFORE_SAAS_CUTOVER | sample-report.html:188,245 |
| GAP-019 | cleanRules treats 'no finding' as 'rule passed' | FIX_DURING_SAAS_CUTOVER | ai-security-transformer.ts:27-39 |

## P2 — Architecture/debt to correct before scale (7)

| ID | Title | Fix Timing | Path |
|----|-------|-----------|------|
| GAP-016 | 8 different rule counts across UI (78, 82, 91, 92, 121) | FIX_DURING_SAAS_CUTOVER | multiple |
| GAP-017 | Self-audit says 'deterministic Python engines' (scanner is Semgrep) | FIX_DURING_SAAS_CUTOVER | SelfAuditContent.tsx:173 |
| GAP-018 | Dashboard hardcodes '91 core + 27 SOC2' but config says 30 | FIX_DURING_SAAS_CUTOVER | dashboard:1532,1615 |
| GAP-020 | AI Inventory sync divides riskScore by 10 without validation | FIX_DURING_SAAS_CUTOVER | ai-security-sync.ts:236 |
| GAP-021 | TypeScript engine not wired to production scan path | DEFER | deterministic-engine.ts |
| GAP-024 | getActiveRulesCount falls back to 9 if import fails | FIX_DURING_SAAS_CUTOVER | trust-page.ts:324 |
| GAP-025 | SOC2 coverage percentage is inverted calculation | FIX_DURING_SAAS_CUTOVER | trust-page.ts:60 |

## P3 — Cleanup only (1)

| ID | Title | Fix Timing | Path |
|----|-------|-----------|------|
| GAP-023 | Old Files/extracted/ contains duplicate stale routes | DEFER | Old Files/extracted/ |

## Fix Timing Summary

| Timing | Count |
|--------|-------|
| FIX_BEFORE_MCP_STATIC | 0 |
| FIX_DURING_MCP_STATIC | 0 |
| FIX_BEFORE_SAAS_CUTOVER | 14 |
| FIX_DURING_SAAS_CUTOVER | 8 |
| DEFER | 3 |

**Key insight:** No P0 or P1 issues block MCP static integration. All critical issues are in the HAIEC SaaS product (trust page, reports, samples, benchmarks), not in the MCP control surface. The MCP can proceed independently while SaaS cutover issues are addressed.
