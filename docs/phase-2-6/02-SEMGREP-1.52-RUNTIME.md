# 02 — Semgrep 1.52.0 Runtime Execution

## Validation

```
semgrep --validate --config ai-security-rules-extracted.yaml --metrics off
```

**Result:** 1 configuration error found, 120 rules valid.

### Validation Error

```
[ERROR] Rule parse error in rule ai-function-calling-js:
 invalid regex 'functions\\s*:\\s*\\[': missing terminating ] for character class at position 21
```

**Root cause:** The regex pattern `functions\s*:\s*\[` has an unescaped `[` inside a character class context. The `\[` is being interpreted as a character class start, not a literal bracket.

**Impact:** `ai-function-calling-js` cannot execute. It is marked `PATTERN_ERROR`.

## Scan Execution

```
semgrep --config ai-security-rules-extracted.yaml fixtures/ --json --metrics off --quiet
```

**Result:** 165 findings, 1 error, 34 unique detectors fired.

## Detector Execution Status

| Status | Count |
|--------|-------|
| EXECUTED_MATCHED | 34 |
| EXECUTED_NO_MATCH | 86 |
| PATTERN_ERROR | 1 |
| **Total** | **121** |

## Detectors That Fired (34)

```
ai-anthropic-import
ai-cot-exposure
ai-langchain-import
ai-memory-injection
ai-model-extraction
ai-openai-import
ai-prompt-injection-anthropic
ai-prompt-injection-google
ai-prompt-injection-huggingface
ai-prompt-injection-langchain
ai-prompt-injection-llamaindex
ai-prompt-injection-openai
ai-prompt-injection-openai-js
ai-rest-aws-bedrock-python
ai-rest-generic
ai-sdk-cohere-python
ai-sdk-mistral-python
ai-sdk-ollama-python
ai-sdk-replicate-python
ai-sdk-together-python
ai-streaming-response-js
ai-tool-abuse-dangerous
ai-tool-abuse-output-exec
ai-xss-js
api-key-in-error-js
api-key-in-error-python
api-key-in-logs-js
api-key-in-logs-python
dangerous-eval-exec-ai-output
hardcoded-api-key-python
llm-response-pii-not-filtered
missing-model-integrity
model-extraction-risk
unverified-model-loading
```

## Key Observation

87 detectors (72%) did not fire on ANY fixture. This means either:
1. The fixtures don't match the pattern syntax
2. The patterns are too narrow
3. The patterns reference APIs/functions not present in fixtures

This is a significant quality issue that must be addressed in future redesign.
