# 02 — Rule Count and Version Truth

## Current Production Counts

| Source | Count | Location | Classification |
|--------|-------|----------|----------------|
| Modal rulepack | 121 (91 core + 30 SOC2) | modal_ai_security_scanner.py:41,83 | EXECUTABLE_TRUTH |
| Next.js config | 121 (91 + 30) | lib/ai-security/config.ts:62 | METADATA |
| Rule names registry | R1.1-R12.4 + R-PI01 to R-AC05 + profiles | lib/ai-security/rule-names.ts | METADATA |

## rc.3 Candidate Counts (Phase 3.5)

| Source | Count | Notes |
|--------|-------|-------|
| rc.3 detectors | 122 | 121 + 1 from eval/exec language split |
| rc.3 semantic checks | 81 | |
| rc.3 legacy display IDs | 78 | |
| rc.3 PUBLIC_READY | 72 | |
| rc.3 rulepack SHA-256 | 8d9596b5... | |

## Hardcoded Count Locations (must be manifest-derived)

### Count: 91 (CORE_AI_RULES_COUNT)
- lib/ai-security/config.ts:38 — METADATA (source)
- app/page.tsx:1029 — "121 detection rules" (uses 121, not 91)
- app/self-audit/SelfAuditContent.tsx:173,402,663 — "91 rule patterns"
- app/what-is-haiec/page.tsx:204 — "91 security rules"
- app/what-is-haiec/layout.tsx:50 — "91 security rules"
- app/start-here/page.tsx:220 — "91 security rules"
- app/how-it-works/page.tsx:276,293 — "91 rules (78 display IDs)"
- app/partners/referral/data.ts:29 — "91+ security rules"
- app/preview-homepage/page.tsx:202 — "91 rule patterns"
- lib/github-app/pr-commenter.ts:350 — "91 security rules"
- app/docs/github-app/GitHubAppDocsContent.tsx:152,300,399 — "91 AI security rules"

### Count: 92 (STALE — matches nothing)
- app/docs/engines/ai-security-static/page.tsx:7,23,269,296 — "92 core rules"
- app/docs/page.tsx:103 — "92 rules across 14 families"
- app/docs/github-app/GitHubAppDocsContent.tsx:641 — "92 core rules + 45 AI-Assisted Dev"
- app/docs/ci-pipeline/page.tsx:49 — "92 core rules"

### Count: 82 (STALE — old count)
- lib/reports/engines/ai-security-report.ts:208 — "82 security rules"
- public/demo/ai-security-scanner-sample-report.html:188,245 — "82 rules", "77 of 82 passed"

### Count: 78 (STALE — legacy display IDs)
- app/our-tools/page.tsx:62,148 — "78 detection rules"
- app/platform/page.tsx:247 — "78 detection rules"
- lib/email-templates-csm6-nurture.ts:388,439 — "78+ AI security rules"
- lib/content/knowledge-base-data.ts:56 — "78 rules"
- app/sample-reports/SampleReportsContent.tsx:136 — "78+ AI-specific security rules"

### Count: 27 (STALE — should be 30)
- app/dashboard/ai-security/scan/[scanId]/page.tsx:1532,1615 — "91 core + 27 SOC2"

## Version Drift

| Field | Modal | Next.js | Drift |
|-------|-------|---------|-------|
| scannerVersion | 3.28.0 (env fallback) | 3.27.0 (config.ts) | MISMATCH |
| rulepackVersion | 121-rules-v4-soc2 | TOTAL_STATIC_RULES=121 | OK |
| semgrepVersion | 1.52.0 | not tracked | N/A |
| buildCommit | env-injected | /api/health NOT created | ENDPOINT_MISSING |
| CI verification | deploy script injects | NOT implemented | NOT_IMPLEMENTED |

## Minimum Required Version Fields

1. `appBuildCommit` — git commit of deployed code
2. `scannerVersion` — human-readable scanner version
3. `rulepackVersion` — rulepack label (e.g., "121-rules-v4-soc2")
4. `rulepackDigest` — SHA-256 of canonical rulepack YAML
5. `semgrepVersion` — Semgrep engine version

### Deferred Fields
- `scannerBuildCommit` — only needed if scanner deploys independently from app
- `manifestVersion` — defer until canonical manifest exists
- `manifestDigest` — defer until canonical manifest exists
- `policyVersion` — defer until policy engine exists
