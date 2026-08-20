# 00 — Current Diff Inventory

## Summary
52 modified files + 1 new file = 53 total files changed in haiec-website.

## File-by-File Classification

### KEEP (correct as-is from Phase 3.6B-1)
| File | Why changed | Risk |
|------|------------|------|
| app/page.tsx | Homepage scanner copy | Low |
| app/landing/page.tsx | Landing scanner copy | Low |
| app/trust-artifacts/page.tsx | Trust artifacts copy | Low |
| app/sample-reports/SampleReportsContent.tsx | Gallery copy | Low |
| app/sample-reports/metadata.ts | Gallery metadata | Low |
| app/frameworks/gdpr/page.tsx | "violates" → "may conflict" | Low |
| app/frameworks/hipaa/page.tsx | "violates" → "may conflict" | Low |
| app/dashboard/ai-security/scan-wizard/page.tsx | Stale rule count | Low |
| lib/ai-security/deterministic-engine.ts | Comment cleanup | Low |
| lib/ai-security/index.ts | Comment cleanup | Low |
| lib/ai-security/rules/index.ts | Comment cleanup | Low |
| lib/ai-security/rules/rule-spec.ts | Comment cleanup | Low |
| lib/ai-security/rule-names.ts | Comment cleanup | Low |
| lib/email-templates-csm6-nurture.ts | Stale rule count | Low |
| lib/pricing-config-v2.ts | Stale rule count | Low |
| components/services/EvidencePackPricing.tsx | Stale rule count | Low |
| lib/reports/benchmarks/industry-averages.ts | Unsupported benchmarks removed | Medium |
| lib/reports/templates/ai-security-html.ts | Stale rule count | Low |
| lib/reports/evidence-pack-html-template-v3.ts | Stale rule count | Low |

### CORRECT (fixed in Phase 3.6B-1.1)
| File | What was wrong | Fix applied |
|------|---------------|-------------|
| lib/ai-security/config.ts | SCANNER_VERSION was 3.27.0, Modal is 3.28.0 | Updated to 3.28.0 |
| lib/ai-security/scanner-health.ts | Expected 3.27.0 (wrong), hardcoded | Now imports SCANNER_VERSION from config |
| app/api/cron/health-check/route.ts | Expected 3.27.0 (wrong), hardcoded | Now imports SCANNER_VERSION from config |
| app/dashboard/ai-security/scan/[scanId]/page.tsx | Hardcoded 3.27.0, stale 91+30 decomposition | Uses SCANNER_VERSION, removed decomposition |
| lib/ai-security/outputs/trust-page.ts | `no_issue_detected_in_scope` implied evaluation | Renamed to `no_relevant_finding_reported` |
| lib/ai-security/types.ts | Old status enum | Updated to new status enum |
| app/trust/[slug]/page.tsx | Old status enum in UI | Updated to new status enum |
| lib/reports/calculators/financial-impact.ts | SOC2 had invented dollar amounts; "calibrated against IBM" | SOC2 now qualitative ($0); "informed by" not "calibrated" |
| lib/reports/engines/ai-security-report.ts | Financial copy claimed unused factors | Copy now matches actual formula |
| lib/reports/evidence-sources.ts | "calibrated against IBM" | "informed by published breach-cost context" |
| lib/ai-security/artifact-generator.ts | Hardcoded v3.22.0 | Now uses SCANNER_VERSION |
| lib/ai-security/scan-notification.ts | Hardcoded v3.22.0, "91 Semgrep Rules" | Now uses SCANNER_VERSION, TOTAL_STATIC_RULES |
| tests/audit/artifact-quality.test.ts | Expected 3.27.0, old status enum | Updated to 3.28.0, new status enum |
| tests/audit/static-engine-artifacts.test.ts | Old status enum | Updated to new status enum |
| tests/audit/static-engine-deterministic.test.ts | Expected 3.27.0 | Updated to 3.28.0 |
| tests/e2e/modal-scanner-deployment.spec.ts | Expected 3.26.0, wrong field name | Uses SCANNER_VERSION, correct field `version` |

### NEW (corrected in Phase 3.6B-1.1 — missed by Phase 3.6B-1)
| File | What was stale | Fix applied |
|------|---------------|-------------|
| app/ai-security/page.tsx | "91 Semgrep rules across 78 display IDs" (4 places) | "121 legacy production detector definitions" |
| app/ai-security/opengraph-image.tsx | "91 Semgrep rules across 78 display IDs" | "121 legacy production detector definitions" |
| app/soc2/opengraph-image.tsx | "91 rules" | "121 legacy production detector definitions" |
| app/solutions/ai-security/page.tsx | "91 Semgrep rules across 78 display IDs" (3 places) | "121 legacy production detector definitions" |
| app/solutions/ai-security/layout.tsx | "91 Semgrep rules, 82 compliance mappings" (4 places) | "121 legacy production detector definitions" |
| app/products/runtime-security/layout.tsx | "91 Semgrep rules, 82 compliance mappings" (4 places) | "121 legacy production detector definitions" |
| app/services/ai-security-evidence-pack/page.tsx | "91 rules, 6 profiles" | "121 legacy production detector definitions" |
| app/dashboard/ai-security/page.tsx | "91 Semgrep rules" | "121 legacy production detector definitions" |
| app/how-it-works/page.tsx | "91 rules (78 display IDs)", "78 rules" | "121 legacy production detector definitions" |
| app/docs/page.tsx | "92 rules across 14 families" | "121 legacy production detector definitions" |
| app/docs/engines/ai-security-static/page.tsx | "92 rules" | "121 legacy production detector definitions" |
| app/api/ai-navigation/search/route.ts | "92 rules" | "121 legacy production detector definitions" |
| app/github-integration/page.tsx | "200+ rules" | "multiple engines" (vague count removed) |
| components/ai-security/AISecurityWelcome.tsx | "91 Semgrep rules" | "121 legacy production detector definitions" |
| components/static-scanner/ArchitectureFlowDiagram.tsx | "78 display IDs", "82 compliance mappings", "91 rules / 78 display IDs" | Updated |
| components/static-scanner/ProcessFlowDiagram.tsx | "91 Semgrep YAML rules... 78 display IDs", "82 compliance mappings" | Updated |
| content/registry.ts | "78 rules" (2 places) | "121 legacy production detector definitions" |
| lib/content/knowledge-base-data.ts | "78 rules" | "121 legacy production detector definitions" |

### REVERT
None. No Phase 3.6B-1 changes were incorrect enough to revert. All were either correct or corrected in Phase 3.6B-1.1.

### NEEDS_MORE_EVIDENCE
None. All changes are evidence-based.
