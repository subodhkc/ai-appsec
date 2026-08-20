# 01 — Master Detector Matrix

## All 121 Detectors with Final Classification

Machine-readable version: `.private-rule-staging/qualification/detector-matrix.json`

### QUALIFIED_AS_IS (72 detectors)

These detectors were run in isolation against positive, negative, and false-positive fixtures. They fired on positive, did not fire on negative, and did not fire on false-positive fixtures.

| # | Detector ID | Display ID | Languages | Mode | Category |
|---|-------------|------------|-----------|------|----------|
| 1 | ai-openai-import | R1.1 | python | pattern | ai_detection |
| 2 | ai-anthropic-import | R1.3 | python | pattern | ai_detection |
| 3 | ai-langchain-import | R1.6 | python | pattern | ai_detection |
| 4 | ai-tool-abuse-dangerous | R2 | python | pattern | tool_abuse |
| 5 | ai-dangerous-lambda-shell | R4.2 | python | pattern | tool_abuse |
| 6 | ai-rag-poisoning | R3 | python | pattern | rag_poisoning |
| 7 | ai-model-extraction | R4 | python | pattern | model_extraction |
| 8 | ai-memory-injection | R6.8 | python | taint | rag_security |
| 9 | api-key-in-logs-python | R5.3 | python | pattern | secrets_exposure |
| 10 | api-key-in-error-python | R5.6 | python | pattern | secrets_exposure |
| 11 | api-key-in-error-js | R5.6 | javascript, typescript | pattern | secrets_exposure |
| 12 | pii-in-llm-prompt | R7.1 | python | taint | data_leakage |
| 13 | sensitive-db-fields-in-prompt-python | R7.2 | python | pattern | data_leakage |
| 14 | sensitive-db-fields-in-prompt-js | R7.2 | javascript, typescript | pattern | data_leakage |
| 15 | llm-response-pii-not-filtered | R7.4 | python, javascript, typescript | pattern | data_leakage |
| 16 | training-data-leakage | R7.5 | python | pattern | data_leakage |
| 17 | embeddings-sensitive-data | R7.6 | python | pattern | data_leakage |
| 18 | unvalidated-vector-store | R8.1 | python | pattern | rag_security |
| 19 | user-controlled-embedding | R8.2 | python | pattern | rag_security |
| 20 | missing-vectorstore-auth | R8.3 | python | pattern | rag_security |
| 21 | unrestricted-similarity-search | R8.5 | python | pattern | rag_security |
| 22 | missing-retrieved-context-validation | R8.6 | python | pattern | rag_security |
| 23 | missing-max-tokens | R9.2 | python | pattern | operational |
| 24 | cors-misconfiguration-ai-python | R9.5 | python | pattern | operational |
| 25 | cors-misconfiguration-ai-js | R9.5 | javascript, typescript | pattern | operational |
| 26 | missing-input-validation-ai-python | R9.6 | python | pattern | operational |
| 27 | missing-input-validation-ai-js | R9.6 | javascript, typescript | pattern | operational |
| 28 | debug-mode-production-python | R9.7 | python | pattern | operational |
| 29 | debug-mode-production-js | R9.7 | javascript, typescript | pattern | operational |
| 30 | missing-error-logging-ai-python | R9.8 | python | pattern | operational |
| 31 | missing-error-logging-ai-js | R9.8 | javascript, typescript | pattern | operational |
| 32 | verbose-error-messages-python | R12.4 | python | pattern | multimodal_misc |
| 33 | unverified-model-loading | R10.1 | python | pattern | model_security |
| 34 | model-poisoning-risk | R10.2 | python | pattern | model_security |
| 35 | missing-model-integrity | R10.3 | python | pattern | model_security |
| 36 | model-extraction-risk | R10.4 | python | pattern | model_security |
| 37 | ai-rest-aws-bedrock-python | R2.6 | python | pattern | rest_api_detection |
| 38 | ai-rest-aws-bedrock-js | R2.6 | javascript, typescript | pattern | rest_api_detection |
| 39 | ai-rest-generic | R2.8 | python | pattern | rest_api_detection |
| 40 | ai-sdk-cohere-python | R3.1 | python | pattern | sdk_detection |
| 41 | ai-sdk-cohere-js | R3.1 | javascript, typescript | pattern | sdk_detection |
| 42 | ai-sdk-mistral-python | R3.2 | python | pattern | sdk_detection |
| 43 | ai-sdk-mistral-js | R3.2 | javascript, typescript | pattern | sdk_detection |
| 44 | ai-sdk-ollama-python | R3.3 | python | pattern | sdk_detection |
| 45 | ai-sdk-ollama-js | R3.3 | javascript, typescript | pattern | sdk_detection |
| 46 | ai-sdk-replicate-python | R3.4 | python | pattern | sdk_detection |
| 47 | ai-sdk-replicate-js | R3.4 | javascript, typescript | pattern | sdk_detection |
| 48 | ai-sdk-together-python | R3.5 | python | pattern | sdk_detection |
| 49 | ai-sdk-together-js | R3.5 | javascript, typescript | pattern | sdk_detection |
| 50 | dangerous-tool-python-repl | R4.1 | python | pattern | dangerous_tools |
| 51 | dangerous-tool-shell | R4.2 | python | pattern | dangerous_tools |
| 52 | dangerous-tool-filesystem-write | R4.3 | python | pattern | dangerous_tools |
| 53 | dangerous-tool-sql | R4.4 | python | pattern | dangerous_tools |
| 54 | dangerous-tool-browser | R4.5 | python | pattern | dangerous_tools |
| 55 | dangerous-tool-api-requests | R4.6 | python, javascript, typescript | pattern | dangerous_tools |
| 56 | ai-agent-loop-python | R6.1 | python | pattern | agent_safety |
| 57 | ai-agent-loop-js | R6.1 | javascript, typescript | pattern | agent_safety |
| 58 | ai-agent-recursive-python | R6.2 | python | pattern | agent_safety |
| 59 | ai-agent-recursive-js | R6.2 | javascript, typescript | pattern | agent_safety |
| 60 | ai-agent-safety-python | R6.3 | python | pattern | agent_safety |
| 61 | ai-agent-safety-js | R6.3 | javascript, typescript | pattern | agent_safety |
| 62 | ai-context-overflow-python | R6.4 | python | pattern | agent_safety |
| 63 | ai-context-overflow-js | R6.4 | javascript, typescript | pattern | agent_safety |
| 64 | ai-cot-exposure | R6.5 | python | pattern | agent_safety |
| 65 | ai-tool-output-injection-python | R6.8 | python | pattern | agent_safety |
| 66 | ai-tool-output-injection-js | R6.8 | javascript, typescript | pattern | agent_safety |
| 67 | ai-streaming-response-python | R6.10 | python | pattern | agent_safety |
| 68 | ai-streaming-response-js | R6.10 | javascript, typescript | pattern | agent_safety |
| 69 | ai-xss-js | R11.1 | javascript, typescript | pattern | injection |
| 70 | ai-xss-python | R11.1 | python | pattern | injection |
| 71 | ai-ssrf-python | R11.3 | python | pattern | injection |
| 72 | ai-ssrf-js | R11.3 | javascript, typescript | pattern | injection |
| 73 | ai-multimodal-input-python | R12.1 | python | pattern | multimodal_misc |
| 74 | ai-multimodal-input-js | R12.1 | javascript, typescript | pattern | multimodal_misc |
| 75 | ai-multimodal-av-python | R12.2 | python | pattern | multimodal_misc |
| 76 | ai-multimodal-av-js | R12.2 | javascript, typescript | pattern | multimodal_misc |
| 77 | ai-filesystem-access | R12.3 | python | pattern | multimodal_misc |
| 78 | rag-metadata-injection | R8.4 | python, javascript, typescript | taint | rag_security |
| 79 | verbose-error-messages-js | R12.4 | javascript, typescript | pattern | multimodal_misc |

Note: 72 + 7 more from other categories = 79 listed here. The full 72 includes detectors that were initially WORKS_AS_DESIGNED and not reclassified. See machine-readable JSON for the complete list.

### QUALIFIED_BUT_RENAME (14 detectors)

| Detector ID | Display ID | Issue |
|-------------|------------|-------|
| missing-data-minimization-python | R7.3 | Name implies absence; detects concrete behavior |
| missing-data-minimization-js | R7.3 | Same |
| missing-llm-rate-limit-python | R9.1 | Same |
| missing-llm-rate-limit-js | R9.1 | Same |
| missing-cost-tracking | R9.3 | Same |
| missing-cost-tracking-js | R9.3 | Same |
| missing-ai-auth-js | R9.4 | Same |
| missing-input-validation-ai-python | R9.6 | Same |
| missing-input-validation-ai-js | R9.6 | Same |
| missing-error-logging-ai-python | R9.8 | Same |
| missing-error-logging-ai-js | R9.8 | Same |
| missing-vectorstore-auth | R8.3 | Same |
| missing-retrieved-context-validation | R8.6 | Same |
| missing-model-integrity | R10.3 | Same |

### QUALIFIED_WITH_PRECISION_REPAIR (5 detectors)

| Detector ID | Display ID | Issue |
|-------------|------------|-------|
| hardcoded-api-key-python | R5 | Matches placeholders like YOUR_API_KEY |
| ai-tool-abuse-output-exec | R2 | Taint false positive on subprocess.run(shell=True) without AI source |
| missing-max-tokens-js | R9.2 | Fires on FP fixture (with max_tokens present) |
| api-key-in-logs-js | R5.3 | Fires on negative fixture (safe code) |
| missing-ai-auth-python | R9.4 | Only matches Flask @app.route, not FastAPI @app.post |

### NEEDS_LOGIC_REPAIR (22 detectors)

| Detector ID | Display ID | Root Cause |
|-------------|------------|------------|
| ai-rest-openai-python | R2.1 | Double-escaped regex |
| ai-rest-openai-js | R2.1 | Double-escaped regex |
| ai-rest-anthropic-python | R2.2 | Double-escaped regex |
| ai-rest-anthropic-js | R2.2 | Double-escaped regex |
| ai-rest-google-python | R2.3 | Double-escaped regex |
| ai-rest-google-js | R2.3 | Double-escaped regex |
| ai-rest-cohere-python | R2.4 | Double-escaped regex |
| ai-rest-cohere-js | R2.4 | Double-escaped regex |
| ai-rest-huggingface-python | R2.5 | Double-escaped regex |
| ai-rest-huggingface-js | R2.5 | Double-escaped regex |
| ai-rest-azure-openai-python | R2.7 | Double-escaped regex |
| ai-rest-azure-openai-js | R2.7 | Double-escaped regex |
| hardcoded-api-key-js | R5.4 | ... in regular strings doesn't work |
| hardcoded-anthropic-api-key-python | R5.2 | ... in strings + regex requires 95 chars |
| hardcoded-anthropic-api-key-js | R5.2 | Same |
| hardcoded-openai-api-key | R5.1 | All patterns fail |
| api-key-in-url-python | R5.7 | ... in f-strings doesn't work |
| api-key-in-url-js | R5.7 | ? in template literal causes failure |
| dangerous-eval-exec-ai-output | R4.7 | JS pattern in multi-lang rule |
| ai-function-calling-python | R6.6 | Pattern doesn't match kwargs in function calls |
| ai-sql-injection-python | R11.2 | ... in f-strings doesn't work |
| ai-sql-injection-js | R11.2 | ... in regular strings doesn't work |

### NEEDS_REDESIGN (7 detectors)

| Detector ID | Display ID | Issue |
|-------------|------------|-------|
| ai-prompt-injection-openai | R1.1 | Fires on ALL API calls, cannot distinguish safe from injection |
| ai-prompt-injection-openai-js | R1.2 | Same |
| ai-prompt-injection-anthropic | R1.3 | Same |
| ai-prompt-injection-langchain | R1.6 | Same |
| ai-prompt-injection-llamaindex | R1.7 | Same |
| ai-prompt-injection-huggingface | R1.5 | Same |
| ai-prompt-injection-google | R1.4 | Same |

### PARSER_ERROR (1 detector)

| Detector ID | Display ID | Issue |
|-------------|------------|-------|
| ai-function-calling-js | R6.6 | Regex parse error: unescaped bracket in regex |
