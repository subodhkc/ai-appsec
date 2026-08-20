# 12 — Compliance Mapping Audit

## Summary

All compliance mappings are treated as CLAIMS, not verified facts. A code detector does not itself prove compliance with a framework.

## Mapping Distribution

| Framework | Detectors with Mapping | Classification |
|-----------|----------------------|----------------|
| cwe | 117 | PLAUSIBLE_NEEDS_REVIEW |
| compliance_frameworks | 104 | PLAUSIBLE_NEEDS_REVIEW |
| soc2_controls | 104 | PLAUSIBLE_NEEDS_REVIEW |
| iso27001_controls | 69 | PLAUSIBLE_NEEDS_REVIEW |
| owasp_categories | 45 | PLAUSIBLE_NEEDS_REVIEW |
| gdpr_controls | 15 | PLAUSIBLE_NEEDS_REVIEW |
| hipaa_controls | 10 | PLAUSIBLE_NEEDS_REVIEW |
| owasp_top_10 | 1 | PLAUSIBLE_NEEDS_REVIEW |

## Classification Scheme

| Status | Meaning |
|--------|---------|
| VERIFIED | The mapping is demonstrably correct |
| PLAUSIBLE_NEEDS_REVIEW | The mapping could be correct but needs expert verification |
| INCORRECT | The mapping is wrong |
| TOO_BROAD | The mapping is technically possible but too broad to be useful |
| REMOVE_FROM_PUBLIC_RULE | The mapping should not appear in the public rulepack |

## Current Status

All mappings are `PLAUSIBLE_NEEDS_REVIEW`. None are classified as `VERIFIED` because:

1. A code pattern detector does not prove compliance with a framework
2. SOC2 controls require organizational processes, not just code patterns
3. GDPR/HIPAA compliance requires legal assessment, not just technical checks
4. CWE mappings need individual verification against CWE definitions

## Recommendation for Public Rulepack

- **CWE mappings:** Keep — these are technical and verifiable
- **OWASP categories:** Keep — these are technical and relevant
- **SOC2 controls:** Mark as `TOO_BROAD` for public free scanner — SOC2 is an organizational audit framework, not a code-level check
- **ISO 27001:** Same as SOC2 — `TOO_BROAD` for public free scanner
- **GDPR/HIPAA:** Mark as `REMOVE_FROM_PUBLIC_RULE` — legal compliance claims should not be made by a free code scanner
- **OWASP LLM Top 10:** Keep if verified against the LLM Top 10 document

## Important Note

SOC2 mappings in metadata are NOT evidence of executable SOC2 security rules. The 30 additional detectors in production (vs legacy) are NOT SOC2 detectors — they are language-specific splits of existing AI security detectors.
