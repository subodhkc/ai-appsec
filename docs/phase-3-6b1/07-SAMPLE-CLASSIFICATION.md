# 07 — Sample Classification

## Methodology

Each of the 45 public HTML samples in `public/demo/` was individually inspected for:
- References to real companies, repositories, or scanner output
- Mock data, synthetic scenarios, or fictional entities
- Disclaimer/disclosure language
- Rule counts and version numbers

## Classification Results

| Classification | Count |
|---------------|-------|
| REAL_RUN | 0 |
| SYNTHETIC_DEMO | 45 |
| HISTORICAL_SAMPLE | 0 |
| UNKNOWN_SOURCE | 0 |

## Individual Classifications

### AI Security Samples (3)
1. `ai-code-security-analysis-sample.html` — SYNTHETIC_DEMO. No real company or repo. Uses "38 validation rules" (stale count).
2. `ai-runtime-security-sample-report.html` — SYNTHETIC_DEMO. Uses fictional drug "Zypharex" for hallucination test.
3. `ai-security-scanner-sample-report.html` — SYNTHETIC_DEMO. Generated from `scripts/test-ai-security-report.ts` using `mockFindings` array.

### Artifact Samples (10)
4. `artifact-showcase.html` — SYNTHETIC_DEMO. Explicitly states "sample artifact for demonstration purposes."
5. `art9-risk-management.html` — SYNTHETIC_DEMO. EU AI Act Article 9 template.
6. `art10-data-governance.html` — SYNTHETIC_DEMO. EU AI Act Article 10 template.
7. `art11-technical-documentation.html` — SYNTHETIC_DEMO. EU AI Act Article 11 template.
8. `art13-transparency-instructions.html` — SYNTHETIC_DEMO. EU AI Act Article 13 template.
9. `art17-quality-management.html` — SYNTHETIC_DEMO. EU AI Act Article 17 template.
10. `art27-fundamental-rights-impact.html` — SYNTHETIC_DEMO. EU AI Act Article 27 template.
11. `art43-conformity-assessment.html` — SYNTHETIC_DEMO. EU AI Act Article 43 template.
12. `art47-declaration-of-conformity.html` — SYNTHETIC_DEMO. EU AI Act Article 47 template.

### Compliance Report Samples (12)
13. `compliance-wizard-soc2-sample-report.html` — SYNTHETIC_DEMO. SOC 2 audit template with example data.
14. `soc2-readiness-assessment-sample.html` — SYNTHETIC_DEMO. SOC 2 readiness template.
15. `gdpr-dpia-sample.html` — SYNTHETIC_DEMO. GDPR DPIA template.
16. `gdpr-sample-compliance-report.html` — SYNTHETIC_DEMO. GDPR compliance template.
17. `iso27001-audit-report-sample.html` — SYNTHETIC_DEMO. ISO 27001 audit template.
18. `iso27001-evidence-package-sample.html` — SYNTHETIC_DEMO. ISO 27001 evidence template.
19. `iso27001-risk-assessment-sample.html` — SYNTHETIC_DEMO. ISO 27001 risk template.
20. `iso27001-sample-evidence-package.html` — SYNTHETIC_DEMO. ISO 27001 evidence template.
21. `iso27001-soa-sample.html` — SYNTHETIC_DEMO. ISO 27001 SOA template.
22. `hipaa-baa-sample.html` — SYNTHETIC_DEMO. HIPAA BAA template.
23. `hipaa-breach-notification-sample.html` — SYNTHETIC_DEMO. HIPAA breach notification template.
24. `hipaa-policies-sample.html` — SYNTHETIC_DEMO. HIPAA policies template.
25. `hipaa-risk-assessment-sample.html` — SYNTHETIC_DEMO. HIPAA risk assessment template.
26. `hipaa-sample-security-assessment.html` — SYNTHETIC_DEMO. HIPAA security assessment template.

### NYC LL144 Samples (8)
27. `nyc-ll144-attestation.html` — SYNTHETIC_DEMO. NYC LL144 attestation template.
28. `nyc-ll144-bias-audit-attestation-sample.html` — SYNTHETIC_DEMO. NYC LL144 bias audit template.
29. `nyc-ll144-public-disclosure.html` — SYNTHETIC_DEMO. NYC LL144 disclosure template.
30. `nyc-ll144-sample-disclosure.html` — SYNTHETIC_DEMO. NYC LL144 disclosure template.
31. `nyc-ll144-sample-evidence-bundle.html` — SYNTHETIC_DEMO. NYC LL144 evidence template.
32. `nyc-ll144-sample-report.html` — SYNTHETIC_DEMO. NYC LL144 report template.
33. `nyc-ll144-service-disclosure.html` — SYNTHETIC_DEMO. NYC LL144 service disclosure template.
34. `nyc-ll144-service-evidence.html` — SYNTHETIC_DEMO. NYC LL144 service evidence template.
35. `nyc-ll144-service-report.html` — SYNTHETIC_DEMO. NYC LL144 service report template.

### Colorado AI Act Samples (7)
36. `colorado-ai-act-sample-report.html` — SYNTHETIC_DEMO. Colorado AI Act report template.
37. `colorado-ai-consumer-notice-sample.html` — SYNTHETIC_DEMO. Colorado consumer notice template.
38. `colorado-ai-impact-assessment-sample.html` — SYNTHETIC_DEMO. Colorado impact assessment template.
39. `colorado-ai-risk-policy-sample.html` — SYNTHETIC_DEMO. Colorado risk policy template.
40. `colorado-consumer-disclosure-sample.html` — SYNTHETIC_DEMO. Colorado disclosure template.
41. `colorado-dataset-card-sample.html` — SYNTHETIC_DEMO. Colorado dataset card template.
42. `colorado-impact-assessment-sample.html` — SYNTHETIC_DEMO. Colorado impact assessment template.
43. `colorado-model-card-sample.html` — SYNTHETIC_DEMO. Colorado model card template.

### Other Samples (2)
44. `github-app-sample-report.html` — SYNTHETIC_DEMO. GitHub App report template with disclaimer.
45. `eu-ai-act-sample-conformity-assessment.html` — SYNTHETIC_DEMO. EU AI Act conformity assessment template.

## AI-Security Sample Final Label/Copy

**Old:** "Static analysis report with executive dashboard, vulnerability findings by severity, code snippets, industry benchmarks, and remediation roadmap. Covers 78+ AI-specific security rules."

**New:** "Illustrative HAIEC Security Report generated through the HAIEC reporting pipeline using a synthetic demonstration scenario. Static analysis report with executive dashboard, security findings by severity, code snippets, industry risk context, and remediation roadmap. HAIEC-owned security checks executed via the Semgrep analysis engine."

## Gallery Copy Changes

**Old:** "Enterprise-grade compliance output — the same reports your auditors, board, and regulators will see. No mockups. These are real outputs from HAIEC engines."

**New:** "Preview the structure and level of detail HAIEC can produce. Each sample is labeled as a live-run output, historical example, or synthetic demonstration. Structured outputs designed for technical, executive, and assurance review."

## Metadata Copy Changes

**Old:** "Preview enterprise-grade compliance reports, trust artifacts, and evidence bundles generated by HAIEC. SOC 2, NYC LL144, AI Security — see real output before you buy."

**New:** "Preview the structure and level of detail HAIEC can produce. Each sample is labeled as a live-run output, historical example, or synthetic demonstration. SOC 2, NYC LL144, AI Security — structured outputs designed for technical, executive, and assurance review."
