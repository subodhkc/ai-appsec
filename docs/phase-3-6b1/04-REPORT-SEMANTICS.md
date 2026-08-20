# 04 — Report Semantics

## Finding Language Changes

### "vulnerability" → "finding" (where appropriate)
- Executive summary: "AI security vulnerabilities" → "AI security findings"
- Key findings: "total vulnerabilities detected" → "total security findings detected"
- Why it matters: "This vulnerability violates..." → "This finding maps to security considerations relevant to..."

### "violates" → "maps to"
**Old:** `This vulnerability violates ${complianceMapping.frameworks.join(', ')} requirements`
**New:** `This finding maps to security considerations relevant to ${complianceMapping.frameworks.join(', ')} and related frameworks. It is provided as evidence for security and assurance review.`

### "rules passed with no violations" → "no findings within this scan scope"
**Old:** `${cleanRules} of ${rulesEvaluated} rules passed with no violations`
**New:** `${cleanRules} of ${rulesEvaluated} evaluated checks produced no findings within this scan scope`

### "security rules passed without violations" → "evaluated checks produced no findings"
**Old:** `${cleanRules} security rules passed without violations`
**New:** `${cleanRules} evaluated checks produced no findings within this scan scope`

## Compliance Language Changes

### Framework mapping ≠ legal violation
All "violates X" language replaced with "maps to security considerations relevant to X" or "may conflict with X requirements". Findings are now positioned as evidence for review, not as legal determinations.

### HIPAA/GDPR pages
- "violates HIPAA § 164.514" → "may conflict with § 164.514(b) requirements"
- "violates § 164.514(b)" → "may conflict with § 164.514(b) requirements"

## Clean/Pass/Negative-Evidence Semantics

### No-finding semantics
**Old:** Absence of findings implied controls were "implemented" or "passed"
**New:** Absence of findings is stated as "No issue detected by this check within the analyzed scope" — not as proof of implementation or compliance.

### Positive findings fallback
**Old:** `${cleanRules} security rules passed without violations`
**New:** `${cleanRules} evaluated checks produced no findings within this scan scope`

## Industry Context Changes

### Old (unsupported):
"Based on OWASP LLM Security Report 2024, mid-market organizations typically have 18.4 prompt injection vulnerabilities per application."

### New (verified):
"Industry Risk Context: IBM's 2026 Cost of a Data Breach Report reports a global average breach cost of USD 4.99M, with AI-enabled malicious breaches averaging USD 6M. The Verizon 2026 DBIR analyzed 22,000+ confirmed breaches across 145 countries. The OWASP Top 10 for LLM Applications (2025) and NIST AI 600-1 Generative AI Profile provide risk taxonomies for AI-specific threats. These sources inform remediation prioritization; they do not predict the cost or likelihood of any specific finding."

### "67% of organizations" claim removed
**Old:** `Industry data shows that ${category} vulnerabilities are among the most commonly exploited in AI applications, with 67% of organizations experiencing related incidents.`
**New:** `${category} is a recognized risk category in the OWASP Top 10 for LLM Applications and the NIST AI RMF Generative AI Profile. Organizations should assess exposure based on their specific AI usage and threat model.`

## Risk-Score Duplicate Safety

The risk score calculation in `risk-summary-generator.ts` was reviewed. Duplicate findings (same rule, same file, same line range) can inflate the risk score. This is documented as a known limitation. The fix is deferred to Phase 3.6B-2 because it requires changes to the aggregation logic that could affect scan result compatibility.

**Current behavior:** Each finding contributes to the risk score independently. If the scanner produces duplicate findings for the same issue, the risk score will be inflated.

**Mitigation:** The scanner's deduplication logic in `modal_ai_security_scanner.py` (unchanged) handles most cases at the source. Downstream consumers should be aware that risk scores reflect finding count, not unique issue count.
