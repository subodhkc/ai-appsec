# 09 — Version Status

## Version Drift Fixes

### Scanner Version
- **config.ts:** `SCANNER_VERSION = '3.27.0'` (unchanged — this is the source of truth)
- **scanner-health.ts:** Changed expected version from hardcoded `'3.28.0'` to `process.env.SCANNER_EXPECTED_VERSION || '3.27.0'` (aligned with config.ts)
- **cron/health-check/route.ts:** Changed expected version from `'3.28.0'` to `'3.27.0'` (aligned with config.ts)
- **scan/[scanId]/page.tsx:** Changed fallback from `'3.25.0'` to `SCANNER_VERSION` (uses config.ts constant, no more drift)

### Rule Count
- **config.ts:** `TOTAL_STATIC_RULES = 121` (unchanged value, updated comment to remove "91 + 30" decomposition)
- **rule-names.ts:** `MODAL_DISPLAY_RULES_COUNT = 121` (unchanged value, updated comment)
- **scan-wizard/page.tsx:** Changed from `ruleCount: 82` to `ruleCount: 121` with updated description
- **scan/[scanId]/page.tsx:** Changed from "91 core + 27 SOC2" to "legacy production detector definitions"

### Semgrep Attribution
All user-facing copy now attributes the analysis engine as "Semgrep" where previously it said "82 rules" or "78+ rules" or made no engine attribution.

## Active Public Stale Counts Remaining

| Count | Location | Status |
|-------|----------|--------|
| 121 | config.ts, rule-names.ts, scan-wizard, scan results | CORRECT — verified executable count |
| 91 | config.ts (CORE_AI_RULES_COUNT) | PRESERVED as metadata, not shown in user-facing copy |
| 30 | config.ts (SOC2_STATIC_RULES_COUNT) | PRESERVED as metadata, not shown in user-facing copy |
| 82 | (previously in multiple files) | REMOVED from all user-facing copy |
| 78/78+ | (previously in multiple files) | REMOVED from all user-facing copy |

**Stale counts remaining in user-facing copy: 0**

## Active Unsupported Claims Remaining

| Claim | Status |
|-------|--------|
| "Provable data-flow paths. Not heuristics." | REMOVED |
| "No AI guessing" (AI security scanner context) | REMOVED from scanner-specific copy |
| "No heuristics" (source code comments) | REMOVED |
| "real output before you buy" | REMOVED |
| "No mockups. These are real outputs" | REMOVED |
| "82 security rules" | REMOVED |
| "78+ AI security rules" | REMOVED |
| "91 core + 27 SOC2" | REMOVED |
| "violates SOC2/GDPR/HIPAA" | REMOVED |
| "67% of organizations" | REMOVED |
| OWASP LLM Security Report 2024 benchmarks | REMOVED |
| Verizon DBIR 2024 benchmarks | REMOVED |
| "exploitation probability" | RELABELED as "severityWeight" |
| SOC2 regulatory fines | REMOVED |

**Note:** "No AI guessing" remains in some compliance-engine contexts (readiness-assessment, how-it-works, compare pages) where it refers to deterministic compliance engines that ARE rule-based. This is defensible for those engines. The AI security scanner context specifically has been corrected.

**Unsupported claims remaining in AI security scanner context: 0**
