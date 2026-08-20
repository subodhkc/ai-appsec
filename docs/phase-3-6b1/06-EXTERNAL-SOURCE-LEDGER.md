# 06 — External Source Ledger

All sources verified August 17, 2026.

## IBM 2026 — Cost of a Data Breach Report
- **URL:** https://www.ibm.com/reports/data-breach
- **Status:** VERIFIED
- **Key metrics:**
  - Global average cost of a data breach: USD 4.99M (12% increase YoY)
  - AI-enabled malicious breach average: USD 6M (25% of malicious breaches, 56% increase YoY)
  - US average: USD 11.5M
  - Based on 602 organizations breached March 2025 – February 2026
- **Supports:** Contextual reference baseline for breach-cost planning estimates
- **Does NOT support:** Per-finding dollar impact, per-application loss prediction, AI-specific breach cost

## Verizon 2026 — Data Breach Investigations Report (DBIR)
- **URL:** https://www.verizon.com/business/resources/reports/dbir/
- **Status:** VERIFIED
- **Key metrics:**
  - 31,000+ security incidents analyzed
  - 22,000+ confirmed data breaches
  - 145 countries represented
  - Incident window: November 1, 2024 – October 31, 2025
- **Supports:** Industry breach-pattern context, attack vector frequency trends
- **Does NOT support:** Per-application vulnerability counts, "data exposure risks per AI application", prompt injection averages

## OWASP — Top 10 for LLM Applications 2025
- **URL:** https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/
- **Status:** VERIFIED
- **Key facts:**
  - Published November 2024
  - Risk taxonomy (NOT quantitative benchmarks)
  - 10 risk categories for LLM/GenAI applications
- **Supports:** Risk category mapping, threat taxonomy reference
- **Does NOT support:** Per-application vulnerability averages by company size, quantitative benchmarks

## NIST — AI Risk Management Framework (AI RMF 1.0)
- **URL:** https://www.nist.gov/itl/ai-risk-management-framework
- **Status:** VERIFIED
- **Key facts:**
  - Released January 2023
  - Voluntary framework for AI trustworthiness
  - Being revised as part of White House AI Action Plan
- **Supports:** Risk management framework reference, trustworthiness characteristics
- **Does NOT support:** Quantitative benchmarks, per-finding dollar impact

## NIST — AI 600-1: Generative AI Profile
- **URL:** https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.600-1.pdf
- **Status:** VERIFIED
- **Key facts:**
  - Released July 26, 2024
  - Companion to AI RMF 1.0
  - Cross-sectoral profile for Generative AI
- **Supports:** GenAI-specific risk identification, risk management actions
- **Does NOT support:** Quantitative benchmarks, per-finding dollar impact

## AICPA — 2017 Trust Services Criteria (SOC 2)
- **URL:** https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022
- **Status:** VERIFIED
- **Key facts:**
  - SOC 2 is an ATTESTATION framework, NOT a regulatory fine schedule
  - There are no "SOC 2 fines"
  - Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy
  - Revised Points of Focus: 2022
- **Supports:** SOC 2 control mapping, Trust Services Criteria reference
- **Does NOT support:** SOC 2 regulatory fines, SOC 2 compliance percentage from static analysis

## Source Classification Summary

| Source | Classification | Use in Product |
|--------|---------------|----------------|
| IBM CODB 2026 | PRIMARY_SOURCE_METRIC | Breach-cost context |
| Verizon DBIR 2026 | PRIMARY_SOURCE_METRIC | Breach-pattern context |
| OWASP LLM Top 10 2025 | PRIMARY_SOURCE_METRIC | Risk taxonomy |
| NIST AI RMF 1.0 | PRIMARY_SOURCE_METRIC | Risk framework |
| NIST AI 600-1 | PRIMARY_SOURCE_METRIC | GenAI risk profile |
| AICPA TSC 2017 | PRIMARY_SOURCE_METRIC | SOC 2 attestation |
| HAIEC Severity Weights | HAIEC_MODEL_ASSUMPTION | Remediation prioritization |
| HAIEC Incident Cost Ranges | HAIEC_MODEL_ASSUMPTION | Modeled impact |
| HAIEC Regulatory Fine Ranges | HAIEC_MODEL_ASSUMPTION | Regulatory exposure context |
