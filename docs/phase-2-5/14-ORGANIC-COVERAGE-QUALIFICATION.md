# 14 — Organic Coverage Qualification

## Method

Each of the 10 proposed security taxonomy areas was reviewed against the qualified logical checks to determine if the rules genuinely provide coverage.

## Qualification Results

| Category | Detectors | Coverage | Qualification |
|----------|-----------|----------|---------------|
| AI API / Authentication | 34 | SDK imports, REST calls, auth controls, rate limiting | STRONG_COVERAGE |
| Agent / Tool Execution | 23 | Agent loops, dangerous tools, function calling, tool output | STRONG_COVERAGE |
| Production Controls | 12 | Debug mode, error logging, cost tracking, max tokens | PARTIAL_COVERAGE |
| Secrets & Credentials | 11 | Hardcoded keys, keys in logs/errors/URLs | STRONG_COVERAGE |
| Output Handling | 9 | XSS, SQL injection, SSRF, streaming, CoT exposure | PARTIAL_COVERAGE |
| RAG / Retrieval Security | 8 | RAG poisoning, vector stores, embeddings, similarity | PARTIAL_COVERAGE |
| Prompt Injection Exposure | 7 | API call detection (not actual injection) | WEAK_COVERAGE |
| AI Data Exposure | 7 | PII in prompts, sensitive DB fields, data minimization | PARTIAL_COVERAGE |
| Model / Supply Integrity | 5 | Model loading, poisoning, integrity, extraction | PARTIAL_COVERAGE |
| Multimodal / File Handling | 5 | Multimodal input, AV processing, filesystem access | PARTIAL_COVERAGE |

## WEAK_COVERAGE Details

### Prompt Injection Exposure (7 detectors)
- **Issue:** Detectors only find API calls, not actual prompt injection
- **Cannot claim:** "Detects prompt injection in AI applications"
- **Can claim:** "Identifies AI API calls that should be reviewed for prompt injection risk"
- **Action:** DO_NOT_MARKET_YET as "prompt injection detection" — redesign required first

## STRONG_COVERAGE Details

### AI API / Authentication (34 detectors)
- Solid coverage of AI provider SDK usage and REST API calls
- Can claim: "AI API security scanning" and "AI authentication control gaps"

### Agent / Tool Execution (23 detectors)
- Good coverage of dangerous tools, agent loops, and tool output injection
- Can claim: "AI agent security" and "secure AI tool calling"

### Secrets & Credentials (11 detectors)
- Good coverage of hardcoded keys and key exposure
- Can claim: "LLM secret exposure detection" (with caveat about placeholder false positives)

## DO_NOT_MARKET_YET

- "Prompt injection detection" — current rules detect API calls, not injection
- "121 security protections" — 121 detectors ≠ 121 protections (80 logical checks, many PRESENCE)
- "SOC2 compliance" — code detectors do not prove compliance
- "GDPR/HIPAA compliance" — legal compliance cannot be verified by code scanning
