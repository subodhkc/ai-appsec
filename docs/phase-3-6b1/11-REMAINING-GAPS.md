# 11 — Remaining Gaps

## Issues Deferred to Phase 3.6B-2

### 1. Risk-Score Duplicate-Finding Inflation
**Status:** Documented, not fixed
**Reason:** Fixing requires changes to the aggregation logic in `risk-summary-generator.ts` and/or `aggregation.ts` that could affect scan result compatibility. The scanner's deduplication in `modal_ai_security_scanner.py` handles most cases at the source.
**Phase 3.6B-2 action:** Implement finding deduplication in the risk score calculation (dedupe by ruleId + filePath + lineRange).

### 2. Captcha Route Type Error
**Status:** Pre-existing, unrelated
**Reason:** The `.next/types/app/api/captcha/challenge/route.ts` type error is unrelated to AI security scanner semantics. Fixing it would expand scope beyond Phase 3.6B-1.
**Phase 3.6B-2 action:** Fix the captcha route type error if it's still present.

### 3. "No AI guessing" in Compliance Engine Contexts
**Status:** Preserved (defensible for deterministic compliance engines)
**Reason:** The "No AI guessing" tagline remains in readiness-assessment, how-it-works, and compare pages where it refers to deterministic compliance engines that ARE rule-based. This is accurate for those engines.
**Phase 3.6B-2 action:** Review each remaining instance individually to confirm it only appears in compliance-engine contexts, not AI-security-scanner contexts.

### 4. Sample Report HTML Files Not Updated
**Status:** Not modified
**Reason:** The 45 HTML files in `public/demo/` contain hardcoded copy (e.g., "38 validation rules" in ai-code-security-analysis-sample.html). These are static HTML files, not generated from the TypeScript templates. Updating them individually is a large scope expansion.
**Phase 3.6B-2 action:** Update static HTML sample files to align with new copy standards, or regenerate them from the TypeScript templates.

### 5. Modal Scanner Version Drift (3.27.0 vs 3.28.0)
**Status:** Partially fixed
**Reason:** The Next.js side now consistently uses 3.27.0 (config.ts). The Modal scanner fallback version (3.28.0) was not changed because `modal_ai_security_scanner.py` rule bodies are out of scope.
**Phase 3.6B-2 action:** Align Modal scanner version with config.ts (3.27.0) or update config.ts to match Modal (if 3.28.0 is the actual deployed version).

### 6. E2E Test Version Expectation
**Status:** Not fixed
**Reason:** `tests/e2e/modal-scanner-deployment.spec.ts` expects `scanner_version` to be `'3.26.0'`. This is a stale E2E test expectation.
**Phase 3.6B-2 action:** Update E2E test to expect the correct version.

### 7. TypeScript Analyzer Wiring
**Status:** Not addressed
**Reason:** The TypeScript deterministic analyzer (`deterministic-engine.ts`) is not wired to the production scan path. This was identified in Phase 3.6A but is out of scope for 3.6B-1.
**Phase 3.6B-2 action:** Decide whether to wire the TypeScript analyzer to the production scan path or document it as a future capability.

### 8. AI Inventory Integration
**Status:** Not addressed
**Reason:** AI Inventory risk scoring integration was identified in Phase 3.6A but is out of scope for 3.6B-1.
**Phase 3.6B-2 action:** Review AI Inventory risk scoring for unsupported claims.

### 9. "No AI guessing" in SEO Metadata
**Status:** Not fixed
**Reason:** SEO metadata templates (`lib/seo/metadata-templates.ts`, `app/readiness-assessment/metadata.ts`, etc.) contain "No AI guessing" in meta descriptions. These are in compliance-engine contexts but should be reviewed.
**Phase 3.6B-2 action:** Review and update SEO metadata if needed.

### 10. Industry Averages Benchmarks (Compliance/GitHub/NYC)
**Status:** Not removed
**Reason:** The `COMPLIANCE_BENCHMARKS`, `GITHUB_BENCHMARKS`, and `NYC_LL144_BENCHMARKS` in `industry-averages.ts` were NOT removed because they are used by non-AI-security engines. Only `AI_SECURITY_BENCHMARKS` was removed (the unsupported OWASP/Verizon per-app metrics).
**Phase 3.6B-2 action:** Verify the compliance/GitHub/NYC benchmark sources.
