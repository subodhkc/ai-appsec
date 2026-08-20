# 04 — Rulepack Forensic Inventory

> **Phase -1 forensic document (corrected in Phase -0.5).** Programmatic parse of
> the `semgrep_rules.yaml` rulepack. Exact counts. No rules changed.
>
> **Phase -0.5 correction:** This document covers ONLY `semgrep_rules.yaml` (91
> rules). The Modal production scanner uses a DIFFERENT rule set — `AI_SECURITY_RULES`
> embedded in `modal_ai_security_scanner.py:989-3358` — which contains **121** `ai-*`
> rules (91 single-language + 30 language-specific splits). See
> `docs/phase-minus-0-5/02-RULE-EXECUTION-INVENTORY.md` for the full execution trace.
>
> **Key correction:** The "121 = 91 core + 30 SOC2" formula is FALSE. The 121
> Modal rules are ALL `ai-*` rules. 0 SOC2 rules execute anywhere.

---

## Source File

- **File:** `semgrep_rules.yaml` (in `haiec-website` repo root)
- **Path:** `haiec-website/semgrep_rules.yaml`
- **Commit inspected:** `81ae7a4ef1e2ef83087141c4b59c09e9fd6321db`
- **Classification:** VERIFIED_CONFIG

---

## Total Counts

| Metric | Value | Method |
|--------|-------|--------|
| Total YAML rule definitions | **91** | Regex `^  - id:\s*(.+)$` count |
| Unique Semgrep rule IDs | **91** | Sorted-unique of all `id:` values |
| Duplicate Semgrep IDs | **0** | All 91 IDs are unique |
| Display rule IDs (`metadata.rule_id`) | **90** entries | Regex `^\s+rule_id:\s*(.+)$` count |
| Unique display rule IDs | **72** | Sorted-unique of `metadata.rule_id` values |
| Aliased display IDs (multiple Semgrep IDs → 1 display ID) | **12** | Group-where-count>1 |

---

## All 91 Semgrep Rule IDs (sorted)

```
ai-agent-loop
ai-agent-recursive
ai-agent-safety
ai-anthropic-import
ai-context-overflow
ai-cot-exposure
ai-dangerous-lambda-shell
ai-filesystem-access
ai-function-calling
ai-langchain-import
ai-memory-injection
ai-model-extraction
ai-multimodal-av
ai-multimodal-input
ai-openai-import
ai-prompt-injection-anthropic
ai-prompt-injection-google
ai-prompt-injection-huggingface
ai-prompt-injection-langchain
ai-prompt-injection-llamaindex
ai-prompt-injection-openai
ai-prompt-injection-openai-js
ai-rag-poisoning
ai-rest-anthropic
ai-rest-aws-bedrock
ai-rest-azure-openai
ai-rest-cohere
ai-rest-generic
ai-rest-google
ai-rest-huggingface
ai-rest-openai
ai-sdk-cohere
ai-sdk-mistral
ai-sdk-ollama
ai-sdk-replicate
ai-sdk-together
ai-sql-injection
ai-ssrf
ai-streaming-response
ai-tool-abuse-dangerous
ai-tool-abuse-output-exec
ai-tool-output-injection
ai-xss
api-key-in-error-js
api-key-in-error-python
api-key-in-logs
api-key-in-url-js
api-key-in-url-python
cors-misconfiguration-ai
dangerous-eval-exec-ai-output
dangerous-tool-api-requests
dangerous-tool-browser
dangerous-tool-filesystem-write
dangerous-tool-python-repl
dangerous-tool-shell
dangerous-tool-sql
debug-mode-production
embeddings-sensitive-data
hardcoded-anthropic-api-key-js
hardcoded-anthropic-api-key-python
hardcoded-api-key-js
hardcoded-api-key-python
hardcoded-openai-api-key
llm-response-pii-not-filtered
missing-ai-auth-js
missing-ai-auth-python
missing-cost-tracking
missing-data-minimization-js
missing-data-minimization-python
missing-error-logging-ai-js
missing-error-logging-ai-python
missing-input-validation-ai
missing-llm-rate-limit-js
missing-llm-rate-limit-python
missing-max-tokens
missing-model-integrity
missing-retrieved-context-validation
missing-vectorstore-auth
model-extraction-risk
model-poisoning-risk
pii-in-llm-prompt
rag-metadata-injection
sensitive-db-fields-in-prompt-js
sensitive-db-fields-in-prompt-python
training-data-leakage
unrestricted-similarity-search
unvalidated-vector-store
unverified-model-loading
user-controlled-embedding
verbose-error-messages-js
verbose-error-messages-python
```

---

## Severity Distribution

| Severity | Count |
|----------|-------|
| INFO | 36 |
| WARNING | 35 |
| ERROR | 20 |
| **Total** | **91** |

---

## Category Distribution

| Category | Count |
|----------|-------|
| operational | 11 |
| secrets_exposure | 10 |
| data_leakage | 8 |
| rest_api_detection | 8 |
| agent_safety | 8 |
| prompt_injection | 7 |
| dangerous_tools | 7 |
| rag_security | 7 |
| sdk_detection | 5 |
| model_security | 4 |
| ai_detection | 3 |
| tool_abuse | 3 |
| injection | 3 |
| multimodal | 3 |
| multimodal_misc | 2 |
| rag_poisoning | 1 |
| model_extraction | 1 |

---

## Display ID Aliasing (12 display IDs shared across multiple Semgrep rules)

| Display ID | Count | Semgrep rule IDs (inferred from position) |
|------------|-------|--------------------------------------------|
| R1 | 7 | ai-prompt-injection-openai, -openai-js, -anthropic, -langchain, -llamaindex, -huggingface, -google |
| R2 | 3 | (prompt injection variants) |
| R6.8 | 2 | |
| R5.2 | 2 | |
| R5.4 | 2 | |
| R5.5 | 2 | |
| R7.2 | 2 | |
| R7.3 | 2 | |
| R9.1 | 2 | |
| R9.4 | 2 | |
| R9.8 | 2 | |
| R12.4 | 2 | |

**Note:** 90 `metadata.rule_id` entries for 91 rules means one rule is missing
the `metadata.rule_id` field. This should be investigated.

---

## Compliance Framework Mapping

| Framework | Rule count (rules tagged with this framework) |
|-----------|-----------------------------------------------|
| SOC2 | 74 |
| ISO27001 | 48 |
| OWASP | 33 |
| GDPR | 15 |
| HIPAA | 10 |

---

## CWE Distribution

| CWE | Count |
|-----|-------|
| CWE-20 | 15 |
| CWE-319 | 8 |
| CWE-359 | 7 |
| CWE-77 | 7 |
| CWE-94 | 5 |
| CWE-770 | 4 |
| CWE-209 | 4 |
| CWE-200 | 4 |
| CWE-798 | 4 |
| CWE-778 | 3 |
| CWE-918 | 3 |
| CWE-306 | 3 |
| CWE-400 | 2 |
| CWE-89 | 2 |
| CWE-494 | 2 |
| CWE-598 | 2 |
| CWE-22 | 1 |
| CWE-74 | 1 |
| CWE-674 | 1 |
| CWE-79 | 1 |
| CWE-754 | 1 |
| CWE-835 | 1 |
| CWE-489 | 1 |
| CWE-346 | 1 |
| CWE-532 | 1 |
| CWE-73 | 1 |
| CWE-78 | 1 |
| CWE-829 | 1 |

---

## Rule Type Classification (preliminary — based on rule names and severity)

| Type | Count | Examples |
|------|-------|---------|
| **Presence/detection** (INFO, detects AI usage) | ~36 | `ai-openai-import`, `ai-anthropic-import`, `ai-langchain-import`, `ai-sdk-*`, `ai-rest-*` |
| **Risk signals** (WARNING, indicates potential risk) | ~35 | `ai-prompt-injection-*`, `missing-*`, `ai-context-overflow`, `ai-cot-exposure` |
| **Control gaps** (WARNING/INFO, missing security controls) | ~15 | `missing-ai-auth-*`, `missing-llm-rate-limit-*`, `missing-cost-tracking`, `missing-max-tokens`, `missing-vectorstore-auth` |
| **Vulnerability patterns** (ERROR, strong vulnerability) | ~20 | `hardcoded-*-api-key-*`, `dangerous-tool-shell`, `dangerous-tool-sql`, `ai-sql-injection`, `ai-ssrf`, `ai-xss` |

> **Note:** This is a preliminary classification based on severity and naming.
> A proper classification requires reading each rule's patterns — deferred to
> the rule semantics phase. See `17-FINDING-SEMANTICS.md`.

---

## Conflict with Code Comments

| Source | Claim | Actual | Status |
|--------|-------|--------|--------|
| `modal_ai_security_scanner.py:83` | "Total: 121 unique rules (91 core AI security + 30 SOC2 compliance)" | 121 `ai-*` rules in `AI_SECURITY_RULES` (Python); 91 in YAML; 0 SOC2 | **PARTIALLY_TRUE** — 121 is correct for Modal embedded rules, but "91+30 SOC2" formula is FALSE |
| `lib/ai-security/config.ts:62` | `TOTAL_STATIC_RULES = 121` | 121 in Modal, 91 in YAML, 0 SOC2 | **MISLEADING** — coincidentally matches Modal count, but formula is wrong |
| `README.md:150` | "70 Semgrep pattern detection rules → 33 unique compliance rule IDs" | 91 rules, 72 display IDs | **STALE** |

---

## Metadata Schema (per rule)

Each rule includes `metadata:` with:
- `category` (string)
- `cwe` (string, e.g., "CWE-77")
- `rule_id` (string, display ID, e.g., "R1")
- `ai_surface_type` (string)
- `model_provider` (string, where applicable)
- `ai_component_type` (string, where applicable)
- `compliance_frameworks` (array, e.g., ["SOC2", "ISO27001", "OWASP", "GDPR", "HIPAA"])
- `soc2_controls` (array, where applicable)
- `iso27001_controls` (array, where applicable)
- `owasp_categories` (array, where applicable)
- `owasp_top_10` (array, where applicable)

---

## License/Attribution

- **License headers:** NONE (0 matches for license/copyright/attribution)
- **Semgrep Registry references:** NONE (0 matches)
- **External source references:** NONE (0 matches)
- **Git history:** Only HAIEC-internal commits (no external attribution in commit messages)

**Conclusion:** Provenance is UNKNOWN for all 91 rules. See `05-RULE-PROVENANCE-AUDIT.md`.
