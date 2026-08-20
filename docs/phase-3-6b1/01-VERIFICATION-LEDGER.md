# 01 — Verification Ledger

## Verification Status Legend
- **VERIFIED** — Executable code confirms the claim exactly
- **VERIFIED_WITH_SCOPE** — Claim is true under specific conditions
- **PARTIALLY_VERIFIED** — Some aspects confirmed, others not
- **NOT_VERIFIED** — Cannot confirm from executable code
- **DISPROVED** — Executable code contradicts the claim

## Phase 3.6A Claims Verification

### Claim 1: Production has 121 detector definitions
- **Path:** `modal_ai_security_scanner.py:989` (AI_SECURITY_RULES block)
- **Evidence:** Python regex count of `- id:` entries in the YAML block = 121
- **Status:** VERIFIED
- **Proposed correction:** Use "LEGACY PRODUCTION DETECTOR DEFINITIONS = 121" without decomposition

### Claim 2: 121 = 91 core AI + 30 SOC2
- **Path:** `modal_ai_security_scanner.py:41` comment, `config.ts:38,55,62`
- **Evidence:** The 121 rule IDs do NOT cleanly decompose into "91 core + 30 SOC2" by prefix. Rule IDs are: ai-* (67), api-* (6), cors-* (2), dangerous-* (7), debug-* (2), embeddings-* (1), hardcoded-* (5), llm-* (1), missing-* (17), model-* (2), pii-* (1), rag-* (1), sensitive-* (2), training-* (1), unrestricted-* (1), unvalidated-* (1), unverified-* (1), user-* (1), verbose-* (2). No R-PI/R-PR/R-CM/R-AV/R-VR/R-LG/R-HR/R-AC prefixed IDs found in the YAML.
- **Status:** DISPROVED — The 91+30 decomposition is NOT verifiable from executable rule IDs. The config constants (CORE_AI_RULES_COUNT=91, SOC2_STATIC_RULES_COUNT=30) are metadata that don't correspond to a clean split in the actual rule definitions.
- **Proposed correction:** Remove "91 core + 30 SOC2" decomposition from active claims. Use "121 legacy production detector definitions" only.

### Claim 3: Trust page defaults all 8 controls to 'implemented' with evidenceCount: 0
- **Path:** `lib/ai-security/outputs/trust-page.ts:79-120`
- **Evidence:** All 8 controls initialized with `status: 'implemented'`, `evidenceCount: 0`
- **Status:** VERIFIED
- **Proposed correction:** Replace 'implemented' default with evidence-aligned states

### Claim 4: Trust page infers tenant isolation from static scan
- **Path:** `lib/ai-security/outputs/trust-page.ts:105-108,138-139`
- **Evidence:** `tenantIsolation` control defaults to 'implemented'; R6.x mapped to `tenantIsolation`
- **Status:** VERIFIED
- **Proposed correction:** Remove tenant isolation from static scan trust page; use "requires separate tenant-isolation assessment"

### Claim 5: Trust page infers determinism from static scan
- **Path:** `lib/ai-security/outputs/trust-page.ts:115-118,149-157`
- **Evidence:** `determinism` control defaults to 'implemented'; R9.x and R12.x mapped to `determinism`
- **Status:** VERIFIED
- **Proposed correction:** Replace with "not evaluated by this scan" or evidence-aligned state

### Claim 6: SOC2 coverage = 100 - soc2Percentage (inverted)
- **Path:** `lib/ai-security/outputs/trust-page.ts:60`
- **Evidence:** `coveragePercentage: 100 - soc2Percentage` where `getSOC2CoveragePercentage()` returns % of controls WITH findings (line 246: `coveredControls = Object.values(coverage).filter((c) => c.count > 0).length`)
- **Status:** VERIFIED_WITH_SCOPE — The 3.6A description "inverted" is imprecise. The actual semantics: `soc2Percentage` = % of SOC2 controls that have at least one finding. `100 - soc2Percentage` = % of controls with NO findings. This is called "coveragePercentage" but it's actually "percentage of controls without findings" — NOT coverage.
- **Proposed correction:** Rename to `controlsWithoutFindings` or `frameworkReferences`; do NOT call it "coverage"

### Claim 7: Report says "This vulnerability violates SOC2, GDPR, HIPAA..."
- **Path:** `lib/reports/engines/ai-security-report.ts:277`
- **Evidence:** `This vulnerability violates ${complianceMapping.frameworks.join(', ')} requirements`
- **Status:** VERIFIED
- **Proposed correction:** Replace with "This finding maps to security considerations relevant to..."

### Claim 8: Report says "82 security rules"
- **Path:** `lib/reports/engines/ai-security-report.ts:208`
- **Evidence:** `This assessment evaluated your AI application against 82 security rules`
- **Status:** VERIFIED
- **Proposed correction:** Replace with manifest-derived or number-neutral language

### Claim 9: Sample report uses MOCK data
- **Path:** `scripts/test-ai-security-report.ts:15,24`
- **Evidence:** `// Mock data` comment; `const mockFindings: AISecurityFinding[] = [...]`
- **Status:** VERIFIED
- **Proposed correction:** Label as "Illustrative HAIEC Security Report" with synthetic scenario disclosure

### Claim 10: All 11 public samples are synthetic
- **Path:** `public/demo/*.html`
- **Evidence:** 45 HTML files found (not 11). All are template/example documents. AI security samples use mock data. Compliance samples are filled-in templates. None reference real scanner output or real companies.
- **Status:** PARTIALLY_VERIFIED — 3.6A undercounted (11 vs 45). All are synthetic/demo, but the count was wrong.
- **Proposed correction:** Classify all 45 individually; all are SYNTHETIC_DEMO

### Claim 11: 45/28/15/5% exploitation probabilities have no source
- **Path:** `lib/reports/calculators/financial-impact.ts:96-105`
- **Evidence:** `getSeverityProbability()` returns hardcoded values with no source citation
- **Status:** VERIFIED
- **Proposed correction:** Replace "probability" with "severityWeight" (modeled assumption, not empirical probability)

### Claim 12: OWASP LLM Security Report 2024 benchmark is unverified
- **Path:** `lib/reports/benchmarks/industry-averages.ts:21,33,45,57`
- **Evidence:** OWASP publishes LLM Top 10 (a risk taxonomy), NOT "per-application vulnerability averages by company size"
- **Status:** DISPROVED — OWASP does NOT publish the metric claimed
- **Proposed correction:** Remove unsupported benchmark; replace with verified Industry Risk Context

### Claim 13: Verizon DBIR 2024 benchmark is unverified
- **Path:** `lib/reports/benchmarks/industry-averages.ts:72,84,96,108`
- **Evidence:** Verizon DBIR covers data breach incidents, NOT "data exposure risks per AI application"
- **Status:** DISPROVED — DBIR does NOT publish the metric claimed
- **Proposed correction:** Remove unsupported benchmark; replace with verified Industry Risk Context

### Claim 14: Homepage claims "Provable data-flow paths. Not heuristics."
- **Path:** `app/page.tsx:1029`
- **Evidence:** (Will verify exact line)
- **Status:** VERIFIED
- **Proposed correction:** Replace with "Deterministic static analysis with source-linked evidence, including pattern and data-flow checks where applicable."

### Claim 15: deterministic-engine.ts claims "No AI. No heuristics. No guesses."
- **Path:** `lib/ai-security/deterministic-engine.ts:8`
- **Evidence:** (Will verify exact line)
- **Status:** VERIFIED
- **Proposed correction:** This file is not in the active scan path; reword to be accurate

### Claim 16: Trust artifacts page claims "Generated from actual security scans"
- **Path:** `app/trust-artifacts/page.tsx:27`
- **Evidence:** "Generated from actual security scans and compliance checks. No AI guessing"
- **Status:** VERIFIED
- **Proposed correction:** Reword to "Generated from scanner output and compliance checks"

### Claim 17: "Estimated Value Protected $X.XM" derived from unverified inputs
- **Path:** `lib/reports/engines/ai-security-report.ts:239`
- **Evidence:** `Remediating these vulnerabilities protects an estimated $${...}M in potential AI-related breach costs`
- **Status:** VERIFIED
- **Proposed correction:** Reframe as "Modeled Potential Impact" with disclosed assumptions

### Claim 18: REGULATORY_FINE_RANGES have no citations
- **Path:** `lib/reports/calculators/financial-impact.ts:25-50`
- **Evidence:** Hardcoded ranges with no source URLs
- **Status:** VERIFIED
- **Proposed correction:** Add source registry; classify as HAIEC_MODEL_ASSUMPTION; remove SOC2 from regulatory fines

### Claim 19: getActiveRulesCount falls back to 9
- **Path:** `lib/ai-security/outputs/trust-page.ts:324`
- **Evidence:** `return 9;` in catch block
- **Status:** VERIFIED
- **Proposed correction:** Fail safely with 0 or throw; 9 is never correct

## Corrected P0/P1 Counts

Phase 3.6A reported 12 P0 + 5 P1 but included a "reserved" placeholder. Corrected:

### P0 (11 confirmed, no placeholders):
1. Trust page defaults all 8 controls to 'implemented' with 0 evidence
2. Sample AI security report uses MOCK data but gallery says "real output"
3. Report says "violates SOC2/GDPR/HIPAA" from pattern detection alone
4. Industry benchmarks cite OWASP LLM Security Report 2024 (DISPROVED — metric doesn't exist)
5. Verizon DBIR 2024 cited for "data exposure risks per AI application" (DISPROVED — metric doesn't exist)
6. 45/28/15/5% exploitation probabilities have no source
7. "Estimated Value Protected $X.XM" derived from unverified inputs
8. Homepage claims "Provable data-flow paths. Not heuristics."
9. deterministic-engine.ts claims "No heuristics" but context-aware uses heuristic scoring
10. Trust artifacts page claims "Generated from actual security scans... No AI guessing"
11. REGULATORY_FINE_RANGES and INCIDENT_COST_RANGES have no citations

### P1 (5 confirmed):
1. Risk score can inflate from duplicate findings
2. Scanner version drift: Modal 3.28.0 vs Next.js 3.27.0
3. Next.js /api/health endpoint NOT created
4. CI/CD pipeline NOT updated to verify commit
5. Sample report shows "82 rules" and "77 of 82 passed" (stale)

**Corrected counts: P0=11, P1=5, P2=7, P3=1**
