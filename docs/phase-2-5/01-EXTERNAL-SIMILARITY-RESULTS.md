# 01 — External Similarity Results

## Method

The official `semgrep/semgrep-rules` repository was cloned (2,228 rules across all categories) and compared against all 121 HAIEC detectors using:

1. Exact rule body hash comparison
2. Exact normalized message match
3. Exact normalized pattern match
4. AI-related rule ID similarity

Generic syntax patterns (`eval(...)`, `os.system(...)`, `requests.get(...)`) were NOT flagged as copying.

## Results

| Similarity Status | Count |
|-------------------|-------|
| NO_MEANINGFUL_MATCH_FOUND | 118 |
| GENERIC_SIMILARITY | 3 |
| POTENTIAL_DERIVATION | 0 |
| STRONG_MATCH | 0 |
| EXACT_MATCH | 0 |

## GENERIC_SIMILARITY Details (3 detectors)

### 1. `hardcoded-api-key-python`
- **External match:** `anthropic-hardcoded-api-key-python`, `openai-hardcoded-api-key-python`
- **External path:** `ai/ai-best-practices/`
- **External license:** LGPL-2.1
- **Similarity reason:** AI-related rule ID similarity — both detect hardcoded API keys for AI providers
- **Implementation difference:** External uses `metavariable-regex` with `^sk-` pattern; HAIEC uses different pattern syntax
- **Manual review status:** NOT copying — hardcoded API key detection is a generic security pattern

### 2. `missing-max-tokens`
- **External match:** `anthropic-missing-max-tokens-javascript`, `anthropic-missing-max-tokens-python`, `openai-missing-max-tokens-javascript`
- **External path:** `ai/ai-best-practices/`
- **Similarity reason:** AI-related rule ID similarity — both detect missing max_tokens parameter
- **Implementation difference:** Different patterns and messages
- **Manual review status:** NOT copying — missing max_tokens is a common AI best practice check

### 3. `hardcoded-openai-api-key`
- **External match:** `openai-api-key` (gitleaks)
- **External path:** `generic/secrets/gitleaks/`
- **Similarity reason:** AI-related rule ID similarity — both detect OpenAI API keys
- **Implementation difference:** Gitleaks uses regex patterns; HAIEC uses Semgrep pattern syntax
- **Manual review status:** NOT copying — OpenAI API key detection is a generic secret scanning pattern

## External AI Rules Found

The external semgrep-rules repo contains 131 AI-specific rules under `ai/ai-best-practices/`, covering:
- Hardcoded API keys (OpenAI, Anthropic, Cohere, Gemini, HuggingFace, Mistral)
- Missing max tokens, missing moderation, missing system prompts
- User input in system prompts
- LLM output to exec (taint mode)
- LangChain dangerous exec (taint mode)
- MCP tool poisoning, command injection, SSRF
- Skill markdown injection, data exfiltration

## Conclusion

No HAIEC detector is copied from or derived from external rules. The 3 GENERIC_SIMILARITY cases are expected — any AI security tool will detect hardcoded API keys and missing max_tokens. The implementations are different.

`NO_MEANINGFUL_MATCH_FOUND` does NOT prove legal ownership. It only means the automated comparison found no meaningful match.
