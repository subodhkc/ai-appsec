# 05 — Report Semantics Audit

## Findings → Stronger Claims Conversion

### 1. "violates SOC2, GDPR, HIPAA, ISO27001..." — OVERCLAIM

**Location:** `lib/reports/engines/ai-security-report.ts:277`

```typescript
whyItMatters: complianceMapping
  ? `This vulnerability violates ${complianceMapping.frameworks.join(', ')} requirements and exposes your organization to ${this.getRiskExposure(aiFinding.category)}.`
  : `This ${aiFinding.category} vulnerability exposes your organization to ${this.getRiskExposure(aiFinding.category)}.`,
```

**Classification:** OVERCLAIM

**Reason:** Static pattern detection (e.g., finding a hardcoded API key pattern) does NOT prove a compliance violation. A finding is evidence that a control gap MAY exist. "Violates" implies a legal/regulatory determination that requires context, scope, and often human judgment.

**Safe language:** "may affect SOC2, GDPR..." or "relevant to SOC2 control CC6.1..." or "mapped to SOC2..."

### 2. "82 security rules" in Overview — STALE_SEMANTICS

**Location:** `lib/reports/engines/ai-security-report.ts:208`

```typescript
'This assessment evaluated your AI application against 82 security rules covering OWASP LLM Top 10, NIST AI RMF, and EU AI Act requirements.'
```

**Classification:** STALE_SEMANTICS

**Reason:** 82 is an old count. Current production is 121. rc.3 is 122. This number should be derived from the canonical manifest, not hardcoded.

### 3. "Provable data-flow paths. Not heuristics." — OVERCLAIM

**Location:** `app/page.tsx:1029`

```typescript
desc: '121 detection rules across prompt injection, missing auth, tool abuse, RAG poisoning, tenant isolation. Provable data-flow paths. Not heuristics.',
```

**Classification:** OVERCLAIM

**Reason:** Only 6 taint rules have data-flow paths. The remaining 115+ are pattern-match rules. "Not heuristics" is also false — context-aware aggregation uses heuristic confidence scoring.

### 4. "No AI. No heuristics. No guesses." — OVERCLAIM

**Location:** `lib/ai-security/deterministic-engine.ts:8`

**Classification:** OVERCLAIM

**Reason:** The deterministic engine itself is rule-based, but the surrounding system (context-aware aggregation, confidence scoring) uses heuristics. The claim is misleading in context.

### 5. "deterministic static analysis" — SUPPORTED_WITH_SCOPE

**Location:** `lib/reports/engines/ai-security-report.ts:208`, sample report

**Classification:** SUPPORTED_WITH_SCOPE

**Reason:** Semgrep IS deterministic (same input → same output, verified in Phase 3.5). But the claim implies more comprehensive determinism than just the scan step.

### 6. "Estimated Value Protected $X.XM" — UNSUPPORTED

**Location:** `lib/reports/engines/ai-security-report.ts:186,239`

**Classification:** UNSUPPORTED

**Reason:** Derived from:
- Unverified exploitation probabilities (45/28/15/5%)
- Unverified incident cost ranges
- Unverified confidence multiplier

No source citations exist for any of these numbers.

### 7. "industry average" comparisons — UNVERIFIED

**Location:** `lib/reports/engines/ai-security-report.ts:110-149`

**Classification:** UNVERIFIED

**Reason:** Benchmarks cite "OWASP LLM Security Report 2024" and "Verizon DBIR 2024" but:
- OWASP LLM Top 10 exists, but "per-application prompt injection vulnerability averages" are not published by OWASP
- Verizon DBIR covers data breaches, not "data exposure risks per AI application"

### 8. Legacy R1 Prompt Injection Semantics

**Location:** `lib/reports/engines/ai-security-report.ts:116-118`

```typescript
const promptInjectionCount = this.assessmentData.findings.filter(f =>
  f.category === 'Prompt Injection' || f.ruleId.startsWith('R1')
).length
```

**Classification:** STALE_SEMANTICS

**Reason:** Phase 3.5 reclassified R1.x rules as PRESENCE signals (they detect API usage, not prompt injection proof). Counting R1 findings as "prompt injection vulnerabilities" overclaims. R1.x detects the PRESENCE of an AI provider integration, not a proven prompt injection vulnerability.

## Summary

| Finding | Classification | Count |
|---------|---------------|-------|
| OVERCLAIM | 4 |
| STALE_SEMANTICS | 2 |
| UNSUPPORTED | 1 |
| UNVERIFIED | 1 |
| SUPPORTED_WITH_SCOPE | 1 |
| SUPPORTED_BY_DETECTOR | 0 |
