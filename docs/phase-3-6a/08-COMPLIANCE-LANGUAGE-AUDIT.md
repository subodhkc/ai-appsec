# 08 — Compliance Language Audit

## Findings

### 1. "violates SOC2, GDPR, HIPAA, ISO27001..." — OVERCLAIM

**Location:** `lib/reports/engines/ai-security-report.ts:277`

```typescript
`This vulnerability violates ${complianceMapping.frameworks.join(', ')} requirements`
```

**Problem:** Static pattern detection does not prove a compliance violation. A finding is evidence that a control gap MAY exist. "Violates" implies a legal/regulatory determination.

**Safe alternative:** "may affect SOC2..." or "relevant to SOC2 control CC6.1..." or "mapped to SOC2..."

### 2. "SOC 2–certified infrastructure" — SUPPORTED_WITH_SCOPE

**Location:** `app/security/SecurityContent.tsx:25,90,108,156`

**Problem:** The claim is about infrastructure providers (Vercel, Neon, Modal), not about HAIEC itself. This is accurate for the providers but could be misread as HAIEC being SOC2-certified.

**Safe as written if scoped clearly.**

### 3. "compliant with GDPR" (ISAF) — NEEDS_REVIEW

**Location:** `app/isaf/content.tsx:390`

**Problem:** "ISAF logs metadata... This is privacy-preserving and compliant with GDPR." This is a product claim about ISAF, not about the scanner. Needs legal review.

### 4. "NYC Local Law 144 compliant" — SUPPORTED_WITH_SCOPE

**Location:** `app/bootstrap/bias-audit/page.tsx:130,517`, `app/products/page.tsx:202`

**Problem:** These refer to the bias audit product, not the static scanner. The bias audit tool is designed for NYC LL144 compliance. This is a product capability claim, not a scanner output claim.

### 5. "EU AI Act compliant" — NEEDS_REVIEW

**Location:** `app/products/page.tsx:70`

**Problem:** "EU AI Act compliant with human-in-the-loop controls" — refers to kill switch product. Needs legal review.

### 6. Compliance Mapping vs. Compliance Violation

**Location:** `lib/ai-security/compliance-mappings.ts` (referenced by ai-security-report.ts:259)

The compliance mappings themselves (mapping rule IDs to framework controls) are **framework mappings**, not **proof of compliance violation**. The mapping is: "if this rule fires, it's relevant to these framework controls." The report generator incorrectly converts this to: "this vulnerability VIOLATES these frameworks."

### Framework Mapping vs. Proof Distinction

| Concept | Correct Language |
|---------|-----------------|
| Framework mapping | "mapped to", "relevant to", "may affect" |
| Proof of violation | "violates", "non-compliant", "fails compliance" |
| Evidence for review | "evidence for review", "control gap detected" |
| Compliance certification | "certified", "passes compliance" |

**Current code uses "violates" which requires proof. Should use "mapped to" or "may affect."**

## Recommendations (do NOT implement yet)

1. Replace "violates" with "may affect" or "relevant to" in ai-security-report.ts
2. Distinguish framework mapping from compliance determination in all report text
3. Add disclaimer: "Static analysis findings are evidence for review, not compliance determinations"
4. Remove or clarify any "compliant" claims that lack legal review
5. SOC2 "fines" in financial-impact.ts should be removed (SOC2 is attestation, not regulatory)
