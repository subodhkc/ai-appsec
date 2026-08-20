# 04 — Trust Page Audit

## Reachability Status

**REACHABLE.** The trust page is actively reachable via:
- `app/api/ai-security/trust-page/route.ts` — API endpoint
- `app/trust/[slug]/page.tsx` — public trust page route
- `app/trust/page.tsx` — trust page index
- `app/ai-builders/trust/page.tsx` — AI builders trust page
- `lib/ai-security/outputs/trust-page.ts` — generator
- `lib/ai-security/compliance/trust-page-generator.ts` — compliance generator

## Semantic Problems

### CRITICAL: Controls Default to 'Implemented' with 0 Evidence

**Location:** `lib/ai-security/outputs/trust-page.ts:79-120`

All 8 security controls are initialized as `'implemented'` with `evidenceCount: 0`:

```typescript
const controls = {
  authentication: { status: 'implemented', description: 'AI endpoints require authentication', evidenceCount: 0 },
  authorization: { status: 'implemented', description: 'Role-based access control for AI actions', evidenceCount: 0 },
  inputValidation: { status: 'implemented', description: 'User input is validated before AI processing', evidenceCount: 0 },
  outputValidation: { status: 'implemented', description: 'AI outputs are validated before execution', evidenceCount: 0 },
  secretsManagement: { status: 'implemented', description: 'Secrets are protected from AI exposure', evidenceCount: 0 },
  tenantIsolation: { status: 'implemented', description: 'Customer data is isolated in AI workflows', evidenceCount: 0 },
  egressControl: { status: 'implemented', description: 'Outbound requests are restricted', evidenceCount: 0 },
  determinism: { status: 'implemented', description: 'AI behavior is predictable and auditable', evidenceCount: 0 },
};
```

**Impact:** Absence of findings becomes evidence that a control is implemented. This is false negative evidence.

### Can Static Scanning Currently Claim These Controls Without Evidence?

| Control | Can Claim? | Reason |
|---------|-----------|--------|
| authentication implemented | NO | No finding ≠ auth implemented; R5.x detects missing auth patterns, but absence could mean scan didn't cover auth code |
| authorization implemented | NO | Same logic; R10.x detects missing RBAC patterns |
| tenant isolation implemented | NO | R6.x detects some tenant isolation issues, but absence doesn't prove isolation |
| egress controls implemented | NO | R8.x detects SSRF patterns, but absence doesn't prove egress controls |
| determinism implemented | NO | R9.x/R12.x detect non-determinism patterns, but absence doesn't prove determinism |

**All 8 controls are OVERCLAIMS when defaulted to 'implemented'.**

### Legacy Rule Mapping Alignment

**Location:** `lib/ai-security/outputs/trust-page.ts:123-158`

The `ruleToControl` mapping covers R1-R12 (legacy display IDs). This mapping is **semantically aligned** with the production 121-detector rulepack for the R1-R12 subset, but:

1. Does NOT cover SOC2 rules (R-PI01 to R-AC05) — 30 rules unmapped
2. Does NOT cover profile rules (VAI, AGW, ESA, RAG, AIC) — these aren't in the trust page
3. R1.x prompt injection rules are mapped to `inputValidation` — but Phase 3.5 reclassified these as PRESENCE signals (detect API usage, not injection proof)

### Classification

| Component | Classification |
|-----------|---------------|
| Trust page generator | OVERCLAIMS (controls default to implemented) |
| Rule-to-control mapping | STALE_MAPPING (doesn't cover SOC2/profile rules; R1.x semantics changed) |
| Trust page HTML formatter | SAFE (renders what generator produces) |
| Trust page API route | SAFE (passes through) |
| getActiveRulesCount fallback | REQUIRES_REDESIGN (falls back to 9 if import fails — should never be 9) |

### SOC2 Coverage Calculation

**Location:** `lib/ai-security/outputs/trust-page.ts:60`

```typescript
coveragePercentage: 100 - soc2Percentage  // Inverted: fewer findings = better coverage
```

This is semantically confusing. `soc2Percentage` from `getSOC2CoveragePercentage` represents the percentage of SOC2 controls with findings. Inverting it (100 - X) gives "percentage without findings" — but this is NOT coverage. It's absence-of-findings. This conflates "no finding" with "control implemented."

## Recommendations (do NOT implement yet)

1. Controls should default to `'unknown'` or `'not_assessed'`, not `'implemented'`
2. Controls should only be `'implemented'` if positive evidence exists (e.g., a control-confirmation rule fired)
3. Controls should be `'pending'` if a finding exists, `'unknown'` if no finding and no positive evidence
4. SOC2 coverage should distinguish "mapped" from "verified"
5. R1.x mapping to `inputValidation` should be reconsidered given PRESENCE reclassification
