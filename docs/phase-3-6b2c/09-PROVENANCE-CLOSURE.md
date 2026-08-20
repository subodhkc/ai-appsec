# 09 — Provenance Closure

## 3 Review-Required Detectors from Phase 2B

### hardcoded-api-key-python

| Criterion | Assessment |
|---|---|
| HAIEC first-known source | modal_ai_security_scanner.py (original production scanner) |
| Rule body | pattern-regex for sk-[A-Za-z0-9-]{20,} and openai.api_key patterns |
| External similarity | GENERIC_SIMILARITY — hardcoded API key detection is universal |
| Structural similarity | LOW — HAIEC uses own regex patterns and message text |
| Literal copied expressions | NONE |
| Third-party copyright concerns | NONE |
| Independent HAIEC history | YES — HAIEC-specific metadata (rule_id, compliance_frameworks) |
| **Decision** | **PROVENANCE_CLEAR** |

**Rationale:** Generic security concept similarity (detect hardcoded API keys) is not copied rule provenance. No protectable expression was copied. Independent HAIEC history established.

### missing-max-tokens

| Criterion | Assessment |
|---|---|
| HAIEC first-known source | modal_ai_security_scanner.py — AI-specific check |
| Rule body | Detects LLM calls without max_tokens parameter |
| External similarity | GENERIC_SIMILARITY — AI-specific pattern |
| Structural similarity | LOW — HAIEC uses own pattern matching |
| Literal copied expressions | NONE |
| Third-party copyright concerns | NONE |
| Independent HAIEC history | YES — AI-specific check not in general security scanners |
| **Decision** | **PROVENANCE_CLEAR** |

**Rationale:** AI-specific security concept (missing max_tokens in LLM calls) is not a generic security pattern copied from external rules. Independent HAIEC history established.

### hardcoded-openai-api-key

| Criterion | Assessment |
|---|---|
| HAIEC first-known source | modal_ai_security_scanner.py (original production scanner) |
| Rule body | pattern-regex for sk- prefix (publicly known OpenAI key format) |
| External similarity | GENERIC_SIMILARITY — hardcoded OpenAI key detection is common |
| Structural similarity | LOW — HAIEC uses own regex patterns |
| Literal copied expressions | NONE |
| Third-party copyright concerns | NONE |
| Independent HAIEC history | YES — HAIEC-specific metadata |
| **Decision** | **PROVENANCE_CLEAR** |

**Rationale:** The sk- prefix pattern is a publicly known OpenAI key format, not a protectable expression. No literal copied expressions. Independent HAIEC history established.

## Summary

| Status | Count |
|---|---|
| PROVENANCE_CLEAR | 3 |
| PROVENANCE_REVIEW_REQUIRED | 0 |
| EXCLUDE_FROM_PUBLIC_CORE | 0 |

All 3 detectors are PROVENANCE_CLEAR. Generic security concept similarity alone is NOT copied rule provenance. No protectable expressions were copied from any external source. Independent HAIEC history is established for all 3 detectors.

## Legal Disclaimer

This is an engineering provenance assessment, not a legal conclusion. The assessment is based on available evidence including rule body comparison, source history, and structural analysis.
