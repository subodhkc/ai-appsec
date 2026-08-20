# 14 — Simplified SaaS Cutover

## Context

There are NO customers. No historical customer-data migration is needed. The only artifacts that matter are samples, demos, and proof artifacts — which can be regenerated, version-labeled, or archived.

## Minimum Safe Cutover Plan

### Step 1: Canonical Bundle Finalized
- Finalize `canonical-static-security/haiec-ai-security.yml` + `manifest.json`
- Compute and record all hashes
- Validate against rc.3 test fixtures

### Step 2: Adapter Implemented in Development
- Build adapter that reads manifest and derives all counts/mappings
- Replace hardcoded constants with manifest-derived values
- Implement normalization layer (from Phase 3.5 spec)

### Step 3: Current APIs/UI/Report Contracts Tested
- Run existing tests against new adapter
- Verify all API responses still have required fields
- Verify UI renders correctly with manifest-derived counts
- Verify report generation produces valid output

### Step 4: New Scanner Results Tested
- Run rc.3 rulepack against test fixtures
- Verify 0 parser errors
- Verify normalization removes duplicates
- Verify risk score is calculated correctly
- Verify findings map to correct securityCheckIds

### Step 5: Sample/Demo Outputs Regenerated or Version-Labeled
- Regenerate AI security sample from real scanner output, OR
- Label current sample as SYNTHETIC_DEMO with version info
- Update sample gallery descriptions
- Remove "real output" claim if sample is synthetic

### Step 6: Build/Typecheck/Tests
- `npm run build`
- `npm run typecheck`
- `npm run test`
- Fix any failures

### Step 7: Staging/Development Smoke Test
- Deploy to staging
- Run a real scan against a test repository
- Verify end-to-end flow: scan → findings → aggregation → risk score → report → trust page → email → artifacts

### Step 8: Modal/Version Health Verification
- Deploy Modal scanner with new rulepack
- Verify `/health` endpoint returns correct version + commit
- Verify CI verification passes

### Step 9: Deploy
- Deploy Modal scanner
- Deploy Vercel app
- Verify both report same commit

### Step 10: Immediate Smoke Test
- Run a real scan in production
- Verify findings appear in dashboard
- Verify report generates correctly
- Verify trust page renders correctly
- Verify email sends correctly

### Step 11: Rollback Available
- Keep previous Modal deployment revision available
- Keep previous Vercel deployment available
- Document rollback procedure
- If any smoke test fails, rollback immediately

## Feature Flag Assessment

**A temporary feature flag is NOT needed.**

Reasons:
1. There are no customers to protect from breaking changes
2. The cutover is a single deployment, not a gradual rollout
3. A feature flag adds complexity without safety benefit
4. Rollback is available via Modal/Vercel revision history
5. The canonical bundle is either deployed or not — there's no partial state worth flagging

If a feature flag were needed, it would be for: "use canonical manifest vs hardcoded constants." But since there are no customers, we can deploy the manifest-derived version directly and rollback if it fails.

## What We Do NOT Need

- Customer history migration
- Legacy customer data backfill
- Multi-month dual production
- Complex DB version migration
- Feature flag infrastructure
