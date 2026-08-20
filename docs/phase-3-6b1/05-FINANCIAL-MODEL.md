# 05 — Financial Model

## Old Structure

- **Severity probabilities**: Hardcoded values (45/28/15/5/1%) labeled as "chance of exploitation" with no source
- **Incident cost ranges**: Hardcoded by company size, no source citations
- **Regulatory fine ranges**: GDPR, HIPAA, NYC LL144, SOC2, PCI-DSS — no source citations
- **SOC2 treated as regulatory fine**: "SOC2 customer-breach" and "SOC2 compliance-failure" fine ranges
- **Sources list**: "IBM Cost of Data Breach Report 2024", "Verizon DBIR 2024", "Ponemon Institute Cyber Risk Studies 2024" — outdated and unverifiable
- **Methodology**: "exploitation probability based on severity"
- **Executive summary**: "Remediating these vulnerabilities protects an estimated $X.XM in potential AI-related breach costs"

## New Structure

- **Severity weights**: Same values (45/28/15/5/1%) but relabeled as "severityWeight — HAIEC model assumption" NOT "probability of exploitation"
- **Incident cost ranges**: Same values but classified as HAIEC_MODEL_ASSUMPTION, calibrated against IBM CODB 2026
- **Regulatory fine ranges**: GDPR, HIPAA, NYC LL144, PCI-DSS preserved. **SOC2 REMOVED** (attestation framework, not regulatory fine schedule)
- **SOC2 handling**: Now modeled as "SOC 2 Assurance Impact" / "attestation-readiness-impact" — customer assurance exposure, NOT regulatory fine
- **Sources list**: Updated to 2026 verified sources with specific metrics cited
- **Methodology**: "severity-based scenario weight" / "modeled scenario, not a prediction of actual loss"
- **Executive summary**: "Modeled Potential Impact: An evidence-informed planning estimate of $X.XM over the next 12 months, based on finding severity, evidence strength, affected scope, organization profile, published breach-cost research, and disclosed HAIEC scenario assumptions."

## Financial Model Version

**Version: 2.0** (Phase 3.6B-1)

Changes from v1:
- Severity weights relabeled from "probability" to "severityWeight"
- SOC2 removed from regulatory fines
- Sources updated to 2026 verified primary sources
- Methodology reframed as modeled scenario
- Executive summary copy changed from "protects" to "Modeled Potential Impact"

## PRIMARY_SOURCE_METRIC Count: 7
1. IBM CODB 2026 — global average breach cost (USD 4.99M)
2. IBM CODB 2026 — AI-enabled breach average (USD 6M)
3. Verizon DBIR 2026 — breach pattern analysis (22,000+ breaches)
4. OWASP LLM Top 10 2025 — risk taxonomy
5. NIST AI RMF 1.0 — risk management framework
6. NIST AI 600-1 — Generative AI Profile
7. AICPA 2017 TSC — SOC 2 attestation framework

## HAIEC_MODEL_ASSUMPTION Count: 3
1. HAIEC Modeled Severity Weights (0.45/0.28/0.15/0.05/0.01)
2. HAIEC Modeled Incident Cost Ranges (by company size)
3. HAIEC Modeled Regulatory Fine Ranges (GDPR, HIPAA, NYC LL144, PCI-DSS)

## Unverified Numeric Input Count Still Rendered Publicly: 0
All numeric inputs are now either PRIMARY_SOURCE_METRIC or HAIEC_MODEL_ASSUMPTION, with the classification disclosed in the methodology and evidence source registry.

## Final User-Facing Financial-Impact Copy

"Modeled Potential Impact: An evidence-informed planning estimate of $X.XM over the next 12 months, based on finding severity, evidence strength, affected scope, organization profile, published breach-cost research, and disclosed HAIEC scenario assumptions. Designed to support remediation prioritization; it is a modeled scenario, not a prediction of actual loss."
