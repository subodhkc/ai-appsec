# 01 — Static Product Dependency Map

## Scan Trigger → Output Path

```
User (dashboard/ai-security)
  → POST /api/ai-security/scan/route.ts
    → ScanStateMachine (lib/ai-security/scan-state-machine.ts)
    → Modal scanner (modal_ai_security_scanner.py)
      → Semgrep 1.52.0 execution
      → Rule parsing (HAIEC_RULE_TO_DISPLAY_ID)
      → Finding generation (SARIF + JSON)
    → ScanCompletionHandler (lib/ai-security/scan-completion-handler.ts)
      → ContextGatingPipeline (optional, v2 risk score)
      → aggregateFindings (lib/ai-security/aggregation.ts)
        → SEVERITY_WEIGHTS: CRITICAL=10, HIGH=7, MEDIUM=4, LOW=2, INFO=1
        → Logarithmic scaling: log(instanceCount+1) capped at log(11)*1.5
      → riskScore stored in ai_security_scans.riskScore
    → AI Security Sync (lib/ai-inventory/discovery/ai-security-sync.ts)
      → Creates ai_systems records
      → Creates risk_assessments (riskScore/10)
      → Creates security_issues (ruleId → issueType)
    → Report generation (lib/reports/engines/ai-security-report.ts)
      → Industry benchmarks (lib/reports/benchmarks/industry-averages.ts)
      → Financial impact (lib/reports/calculators/financial-impact.ts)
      → Compliance mappings (lib/ai-security/compliance-mappings.ts)
    → Trust page (lib/ai-security/outputs/trust-page.ts)
      → Controls default to 'implemented'
      → SOC2 coverage calculation
    → Email (lib/email/generate-scan-email.ts)
    → Artifacts (lib/ai-security/artifact-generator.ts)
    → Dashboard (app/dashboard/ai-security/scan/[scanId]/page.tsx)
```

## CRITICAL Dependencies (9)

| Path | Symbol | Risk if Rulepack Changes |
|------|--------|--------------------------|
| modal_ai_security_scanner.py | RULEPACK_VERSION, HAIEC_RULE_TO_DISPLAY_ID | Rule IDs change → all downstream mappings break |
| lib/ai-security/aggregation.ts | aggregateFindings, calculateRiskScore | Severity weights + ruleId grouping → risk score changes |
| lib/ai-security/scan-completion-handler.ts | handleScanCompletion | v1/v2 risk score version → stored score semantics change |
| lib/ai-security/outputs/trust-page.ts | generateTrustPage | ruleToControl mapping (R1-R12) → control status changes |
| lib/reports/engines/ai-security-report.ts | AISecurityReport | "82 rules" hardcoded in overview text; compliance "violates" language |
| lib/reports/benchmarks/industry-averages.ts | getBenchmark | Benchmark comparison uses finding counts by category |
| lib/reports/calculators/financial-impact.ts | calculateFinancialImpact | Severity probabilities × cost ranges → "value protected" |
| public/demo/ai-security-scanner-sample-report.html | static HTML | "82 rules", "77 of 82 passed" — stale mock data |
| app/page.tsx:1029 | homepage | "121 detection rules... Provable data-flow paths. Not heuristics." |

## HIGH Dependencies (8)

| Path | Symbol | Risk |
|------|--------|------|
| lib/ai-security/config.ts | SCANNER_VERSION, TOTAL_STATIC_RULES | Version drift (3.27.0 vs Modal 3.28.0) |
| lib/reports/transformers/ai-security-transformer.ts | transformScanToAssessmentData | Imports TOTAL_STATIC_RULES; cleanRules calculation |
| lib/reports/risk-summary-generator.ts | generateRiskSummary | Severity-based risk summary |
| lib/ai-inventory/discovery/ai-security-sync.ts | syncAISecurityScan | ruleId → issueType; riskScore/10 normalization |
| lib/ai-security/report-generator.ts | generateReport | rulesEvaluated, cleanRules display |
| app/dashboard/ai-security/scan/[scanId]/page.tsx | ScanDetailPage | Hardcoded "91 core + 27 SOC2" in UI text |
| app/sample-reports/SampleReportsContent.tsx | artifacts | "78+ AI-specific security rules" |
| lib/ai-security/rule-names.ts | RULE_NAMES | Display name mapping for all rule IDs |

## Rule Count Sources (20+ hardcoded locations)

| Count | Location | Classification |
|-------|----------|----------------|
| 121 | modal_ai_security_scanner.py:41,83 | EXECUTABLE_TRUTH |
| 121 | lib/ai-security/config.ts:62 (TOTAL_STATIC_RULES) | METADATA |
| 91 | lib/ai-security/config.ts:38 (CORE_AI_RULES_COUNT) | METADATA |
| 91 | app/page.tsx:1029, self-audit, what-is-haiec, start-here, partners, github-app-docs, preview-homepage | STALE (should derive from manifest) |
| 92 | app/docs/engines/ai-security-static/page.tsx, app/docs/page.tsx, github-app-docs:641 | STALE (doesn't match any known count) |
| 82 | ai-security-report.ts:208, sample-report.html:188,245 | STALE (old count) |
| 78 | our-tools, platform, email-templates, knowledge-base, sample-reports gallery | STALE (legacy display ID count) |
| 30 | lib/ai-security/config.ts:55 (SOC2_STATIC_RULES_COUNT) | METADATA |
| 27 | dashboard page.tsx:1532,1615 ("91 core + 27 SOC2") | STALE (config says 30, not 27) |

**All hardcoded counts must eventually be replaced by canonical manifest-derived data.**
