# 03 — Golden Corpus Execution

## Fixture Inventory (Recounted)

| Category | Python | JavaScript | Total |
|----------|--------|------------|-------|
| Positive | 80 | 13 | 93 |
| Negative | 5 | 2 | 7 |
| False-positive | 5 | 2 | 7 |
| **Total** | **90** | **17** | **107** |

## Execution Results

| Outcome | Count |
|---------|-------|
| PASS | 33 |
| UNEXPECTED_FINDING | 52 |
| MISSING_FINDING | 16 |
| FAIL | 6 |

## PASS (33)

Fixtures where the expected detector fired correctly.

## MISSING_FINDING (16)

Positive fixtures where NO detector fired at all:

```
positive/python/ai-prompt-injection-huggingface.py → ai-prompt-injection-huggingface
positive/python/ai-prompt-injection-llamaindex.py → ai-prompt-injection-llamaindex
positive/python/ai-rag-poisoning.py → ai-rag-poisoning
positive/python/ai-rest-anthropic-python.py → ai-rest-anthropic-python
positive/python/ai-rest-azure-openai-python.py → ai-rest-azure-openai-python
positive/python/ai-rest-cohere-python.py → ai-rest-cohere-python
positive/python/ai-rest-generic.py → ai-rest-generic (fired on other fixtures, not this one)
positive/python/ai-rest-huggingface-python.py → ai-rest-huggingface-python
positive/python/api-key-in-logs-python.py → api-key-in-logs-python
positive/python/missing-vectorstore-auth.py → missing-vectorstore-auth
positive/python/rag-metadata-injection.py → rag-metadata-injection
positive/javascript/ai-agent-loop-js.js → ai-agent-loop-js
positive/javascript/ai-anthropic-import.js → ai-anthropic-import
positive/javascript/ai-openai-import.js → ai-openai-import
positive/javascript/hardcoded-anthropic-api-key-js.js → hardcoded-anthropic-api-key-js
positive/javascript/hardcoded-api-key-js.js → hardcoded-api-key-js
```

## UNEXPECTED_FINDING (52)

Positive fixtures where a DIFFERENT detector fired (not the expected one). This is the largest category and indicates broad pattern over-matching.

Common pattern: `ai-prompt-injection-openai` fires on almost any fixture containing `openai.ChatCompletion.create()` — even fixtures designed for XSS, SSRF, SQL injection, etc.

## FAIL (6)

Negative/false-positive fixtures where detectors fired when they should not have:

```
negative/python/ai-tool-abuse-output-exec-negative.py → triggered ai-openai-import, ai-prompt-injection-openai
negative/python/api-key-in-url-negative.py → triggered ai-rest-generic
negative/javascript/api-key-in-url-negative.js → triggered ai-rest-generic
falsepos/python/ai-tool-abuse-output-exec-falsepos.py → triggered ai-openai-import, api-key-in-logs-python, ai-prompt-injection-openai
falsepos/python/hardcoded-api-key-falsepos.py → triggered ai-openai-import
falsepos/python/hardcoded-openai-api-key-falsepos.py → triggered ai-openai-import, hardcoded-api-key-python
```

## Key Insight

The golden corpus reveals that many HAIEC detectors are **too broad** — they fire on any code containing AI API calls rather than detecting the specific security issue. This is especially true for `ai-prompt-injection-openai` which acts as a catch-all for OpenAI API usage.
