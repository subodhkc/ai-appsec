# 07 — Test Results

## Test Suite Results

### Full Audit Suite
- **Command:** `npx vitest run tests/audit/`
- **Test files:** 18 passed
- **Tests:** 1237 passed
- **Failures:** 0
- **Duration:** ~10 seconds

### Trust/Artifact Tests (subset)
- **Test files:** 2 passed (static-engine-artifacts.test.ts, artifact-quality.test.ts)
- **Tests:** 153 passed
- **Failures:** 0

### Version Tests
- **Test files:** 2 passed (static-engine-deterministic.test.ts, artifact-quality.test.ts)
- **Tests:** 132 passed
- **Failures:** 0

## Typecheck Results

### Baseline (before Phase 3.6B-1.1)
- **Errors:** 1 (pre-existing captcha route error)
- **Error:** `.next/types/app/api/captcha/challenge/route.ts(8,13): error TS2344`

### After Phase 3.6B-1.1
- **Errors:** 1 (same pre-existing captcha error)
- **New errors introduced:** 0

## git diff --check Results
- **Trailing whitespace:** 1 found in solutions/ai-security/page.tsx → FIXED
- **After fix:** No trailing whitespace errors

## Tests Modified in Phase 3.6B-1.1

### artifact-quality.test.ts
- Version assertion: 3.27.0 → 3.28.0 (verifies correct behavior — config.ts now matches Modal)
- Status enum: `no_issue_detected_in_scope` → `no_relevant_finding_reported` (verifies correct behavior — status no longer implies evaluation)

### static-engine-artifacts.test.ts
- Status enum: `no_issue_detected_in_scope` → `no_relevant_finding_reported` (verifies correct behavior)

### static-engine-deterministic.test.ts
- Version assertion: 3.27.0 → 3.28.0 (verifies correct behavior — config.ts now matches Modal)

### modal-scanner-deployment.spec.ts (E2E)
- Field name: `data.scanner_version` → `data.version` (verifies correct behavior — matches actual Modal health endpoint response)
- Removed contradictory hardcoded `3.26.0` assertion (verifies correct behavior — was wrong)

## Test Quality Assessment

All test changes verify correct behavior, not merely mirror the implementation:
- Version tests verify config.ts matches the actual Modal scanner version (3.28.0)
- Status tests verify the trust page does not imply evaluation when only absence of findings is known
- E2E test verifies the correct field name from the actual Modal health endpoint

## Build Result
Not run — production build requires significant time and the captcha type error is pre-existing. Typecheck confirms no new type errors.

## Pre-Existing Failures
1. **Typecheck:** Captcha route type error — pre-existing, unrelated, not fixed (out of scope)
