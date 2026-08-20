# 05 — Rule Provenance Audit

> **Phase -1 forensic document.** Determines whether each rule/rule family can
> safely be redistributed under MIT. No rules copied or published.

---

## Methodology

For each rule or rule family, we classify provenance as:
- `HAIEC_ORIGINAL_CONFIRMED` — evidence of HAIEC authorship (commit history, unique pattern)
- `HAIEC_ORIGINAL_LIKELY` — no external attribution found, pattern appears HAIEC-specific
- `DERIVED_WITH_KNOWN_LICENSE` — derived from a known external source with compatible license
- `THIRD_PARTY` — copied from external source
- `UNKNOWN_ORIGIN` — no evidence either way
- `NEEDS_REVIEW` — requires manual pattern comparison against known public rules

---

## Evidence Gathered

### Automated checks (all returned 0 matches)
- License headers in `semgrep_rules.yaml`: **0**
- Copyright notices: **0**
- Attribution comments: **0**
- Semgrep Registry references (`semgrep.dev/r/`): **0**
- External repository references: **0**
- "adapted from" / "based on" / "originally from": **0**

### Git history
- `git log --follow semgrep_rules.yaml` shows only HAIEC-internal commits
- Commit messages reference HAIEC versions and internal reviews
- No commits reference importing rules from external sources

### Pattern analysis (preliminary)
- Rule patterns target AI/LLM-specific APIs (OpenAI, Anthropic, LangChain, etc.)
- Many rules are AI-specific and unlikely to exist in generic security rule packs
- However, some rules (e.g., `hardcoded-api-key-*`, `api-key-in-url-*`, `cors-misconfiguration-ai`, `ai-sql-injection`, `ai-ssrf`, `ai-xss`) are structurally similar to common public Semgrep rules for secrets detection and web vulnerabilities

---

## Classification

### HAIEC_ORIGINAL_LIKELY (AI-specific rules with no public equivalent)

These rules target AI/LLM-specific patterns that are unlikely to exist in generic
security rule packs:

| Rule family | Count | Rationale |
|-------------|-------|-----------|
| `ai-prompt-injection-*` | 7 | AI-specific prompt injection patterns |
| `ai-rest-*` (REST API detection for AI providers) | 8 | AI provider-specific REST call detection |
| `ai-sdk-*` | 5 | AI SDK-specific import detection |
| `ai-agent-*` | 3 | AI agent-specific patterns |
| `ai-multimodal-*` | 2 | AI multimodal-specific patterns |
| `ai-rag-poisoning`, `rag-metadata-injection` | 2 | RAG-specific patterns |
| `ai-memory-injection`, `ai-cot-exposure`, `ai-context-overflow` | 3 | AI-specific |
| `ai-tool-abuse-*`, `ai-tool-output-injection` | 3 | AI tool-specific |
| `ai-streaming-response`, `ai-function-calling` | 2 | AI-specific |
| `ai-model-extraction`, `model-extraction-risk`, `model-poisoning-risk` | 3 | AI model-specific |
| `embeddings-sensitive-data`, `user-controlled-embedding` | 2 | Embedding-specific |
| `unvalidated-vector-store`, `unrestricted-similarity-search`, `missing-vectorstore-auth` | 3 | Vector store-specific |
| `missing-retrieved-context-validation` | 1 | RAG-specific |
| `missing-model-integrity`, `unverified-model-loading` | 2 | Model security-specific |
| `missing-max-tokens`, `missing-cost-tracking` | 2 | AI-specific operational |
| `llm-response-pii-not-filtered`, `pii-in-llm-prompt` | 2 | LLM-specific PII |
| `sensitive-db-fields-in-prompt-*` | 2 | LLM prompt-specific |
| `training-data-leakage` | 1 | AI-specific |
| `dangerous-eval-exec-ai-output` | 1 | AI output-specific |
| `missing-llm-rate-limit-*` | 2 | LLM-specific |
| `missing-error-logging-ai-*` | 2 | AI-specific |
| `missing-data-minimization-*` | 2 | AI-specific |
| `missing-input-validation-ai` | 1 | AI-specific |
| `missing-ai-auth-*` | 2 | AI-specific |
| `debug-mode-production` | 1 | Generic but AI-tagged |
| `ai-dangerous-lambda-shell` | 1 | AI-specific |
| `ai-filesystem-access` | 1 | AI-specific |

**Subtotal: ~63 rules classified HAIEC_ORIGINAL_LIKELY**

### NEEDS_REVIEW (rules structurally similar to public Semgrep rules)

These rules detect patterns that are common in public security rule packs
(secrets, injection, CORS, etc.). While they may be HAIEC-original adaptations
targeting AI contexts, their structural similarity to public rules requires
manual verification:

| Rule | Count | Concern |
|------|-------|---------|
| `hardcoded-api-key-*`, `hardcoded-openai-api-key`, `hardcoded-anthropic-api-key-*` | 5 | Hardcoded secret detection is common in public Semgrep rules |
| `api-key-in-url-*`, `api-key-in-error-*`, `api-key-in-logs` | 5 | Secret exposure patterns are common publicly |
| `cors-misconfiguration-ai` | 1 | CORS misconfiguration rules exist publicly |
| `ai-sql-injection` | 1 | SQL injection rules exist publicly |
| `ai-ssrf` | 1 | SSRF rules exist publicly |
| `ai-xss` | 1 | XSS rules exist publicly |
| `dangerous-tool-shell`, `dangerous-tool-sql`, `dangerous-tool-browser`, `dangerous-tool-filesystem-write`, `dangerous-tool-python-repl`, `dangerous-tool-api-requests` | 6 | Dangerous tool patterns may overlap with public rules |
| `verbose-error-messages-*` | 2 | Verbose error message rules exist publicly |

**Subtotal: ~28 rules classified NEEDS_REVIEW**

---

## Summary

| Classification | Count | Can publish under MIT? |
|----------------|-------|------------------------|
| HAIEC_ORIGINAL_CONFIRMED | 0 | (no confirming evidence found) |
| HAIEC_ORIGINAL_LIKELY | ~63 | Probable, but needs legal confirmation |
| DERIVED_WITH_KNOWN_LICENSE | 0 | N/A |
| THIRD_PARTY | 0 | N/A |
| UNKNOWN_ORIGIN | 0 | N/A |
| NEEDS_REVIEW | ~28 | NO — requires manual pattern comparison |

---

## Provenance Audit Workflow (recommended for later phase)

Before any rule is copied to the public repo:

1. **For each NEEDS_REVIEW rule:** Compare pattern against:
   - Semgrep Registry rules (`semgrep.dev/r/`)
   - GitHub Security Lab rules
   - Semgrep community rule packs
   - OWASP/CWE reference patterns
   If a match is found, either:
   - Obtain the original license and attribute properly, OR
   - Rewrite the rule from scratch with HAIEC-specific patterns

2. **For each HAIEC_ORIGINAL_LIKELY rule:** Document the HAIEC authorship
   evidence (git blame, commit history, unique AI-specific targeting).

3. **Add provenance metadata to each rule:**
   ```yaml
   metadata:
     provenance: HAIEC_ORIGINAL
     provenance_evidence: "git blame shows HAIEC author, AI-specific pattern"
     # OR
     provenance: DERIVED_FROM_PUBLIC
     source: "semgrep.dev/r/<rule-id>"
     source_license: "LGPL-2.1"
   ```

4. **Legal review:** Have counsel confirm that HAIEC-authored rules can be
   released under MIT (check employment/IP agreements).

---

## Current Status

**ALL 91 RULES ARE `DO_NOT_PUBLISH_YET`.**

No rule may be copied to the public `haiec-ai-agent-security-free-mcp` repo
until:
1. The provenance audit workflow above is completed
2. Legal confirms HAIEC-authored rules can be MIT-licensed
3. Any derived rules are properly attributed or rewritten

This is a P0 blocker for any phase that involves rule extraction or publication.
