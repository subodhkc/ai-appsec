# 04 — Final Diff Review

## Review Methodology
Complete diff of all 53 files reviewed for: accidental broad replacements, broken imports, dead code, stale comments, semantic type mismatches, copy that says more than code proves, references to unpublished rc.3, hardcoded candidate counts, version constants that contradict executable truth, invalid external URLs, unreachable statuses, UI color/status regressions.

## Issues Found and Fixed

### 1. Version Drift (CRITICAL)
- **config.ts:** SCANNER_VERSION was 3.27.0, Modal fallback is 3.28.0 → FIXED to 3.28.0
- **scanner-health.ts:** Hardcoded 3.27.0 → FIXED to import SCANNER_VERSION
- **cron/health-check/route.ts:** Hardcoded 3.27.0 → FIXED to import SCANNER_VERSION
- **scan/[scanId]/page.tsx:** Hardcoded 3.27.0 → FIXED to use SCANNER_VERSION
- **artifact-generator.ts:** Hardcoded 3.22.0 → FIXED to use SCANNER_VERSION
- **scan-notification.ts:** Hardcoded v3.22.0 → FIXED to use SCANNER_VERSION

### 2. Trust-Page Status Overclaim (CRITICAL)
- `no_issue_detected_in_scope` implied evaluation was proven → RENAMED to `no_relevant_finding_reported`
- `evidence_found` was unreachable and not documented as such → NOW documented as unreachable/reserved

### 3. Financial Model Inconsistencies (CRITICAL)
- SOC2 had invented dollar amounts ($100K–$1M) → REMOVED, now qualitative ($0)
- Copy claimed "evidence strength" and "affected scope" as factors → NOT in formula, REMOVED from copy
- Copy claimed "calibrated against IBM CODB" → NOT calibrated, only "informed by" → FIXED
- Source registry said "calibrated against IBM" → FIXED to "informed by"

### 4. Stale Rule Counts (MEDIUM)
- 18 additional files with "91 Semgrep rules", "92 rules", "78 display IDs", "82 compliance mappings" → ALL FIXED to "121 legacy production detector definitions"
- Phase 3.6B-1 claimed "0 remaining stale rule-count claims" → WAS WRONG, now corrected

### 5. E2E Test Bugs (LOW)
- Expected wrong field name (`scanner_version` vs `version`) → FIXED
- Contradictory version assertions (SCANNER_VERSION vs hardcoded 3.26.0) → FIXED

### 6. Trailing Whitespace
- solutions/ai-security/page.tsx line 168 → FIXED

## Issues Found and NOT Fixed (Out of Scope)

### 1. Captcha Route Type Error
- Pre-existing, unrelated to Phase 3.6B-1/1.1
- `.next/types/app/api/captcha/challenge/route.ts(8,13): error TS2344`

### 2. errors/types.ts:134 Stale Fallback
- `engineVersion: params.engineVersion || process.env.SCANNER_VERSION || '3.22.0'`
- Stale fallback '3.22.0' but only triggers if both params and env are unset
- Out of scope for this phase

### 3. Static HTML Sample Files
- 55 HTML files in public/demo/ contain stale copy ("38 validation rules", "91 rules", etc.)
- Not modified — would require regenerating all 55 files
- Gallery metadata copy now discloses samples as synthetic

### 4. OSNIT "industry average" Claims
- `app/osnit/content.tsx` claims "industry average (34%)" for false positive rates
- This is a different product (OSNIT bot detection, not AI security scanner)
- Out of scope for this phase

## No Issues Found

- No broken imports
- No dead code introduced
- No references to unpublished rc.3
- No hardcoded candidate counts (122, etc.)
- No invalid external URLs
- No UI color/status regressions
- No semantic type mismatches (after fixes)
