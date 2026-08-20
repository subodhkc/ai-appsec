# Human Provenance and License Release Packet

## Phase 4C-B — Human Review Required

**Engineering must NOT convert PENDING_HUMAN_REVIEW into APPROVED.**

## Summary

| Field | Value |
|-------|-------|
| Total detectors | 122 |
| originEvidence: STRONG | 122 |
| originEvidence: MODERATE | 0 |
| originEvidence: INCOMPLETE | 0 |
| licenseDisposition: HAIEC_CAN_LICENSE | 122 |
| finalLegalDisposition: PENDING_HUMAN_REVIEW | 122 |

## Provenance Evidence Basis

- Phase 2.5 external similarity check: 2228 rules compared, 0 strong/exact matches
- Git authorship: all rules authored by Subodh (subodhkc, subodh@haiec.com)
- The 122nd detector is a language split of an existing detector, not a new external import

## Exceptions/Risk Items

None identified. All 122 detectors have STRONG origin evidence and HAIEC_CAN_LICENSE.
However, finalLegalDisposition remains PENDING_HUMAN_REVIEW for all 122 detectors.

## Detector List

| # | Detector ID | Revision | Origin Evidence | License Disposition | Final Legal Disposition |
|---|------------|----------|-----------------|---------------------|------------------------|
| 1 | ai-prompt-injection-openai | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 2 | ai-openai-import | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 3 | ai-anthropic-import | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 4 | ai-prompt-injection-openai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 5 | ai-prompt-injection-anthropic | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 6 | ai-prompt-injection-langchain | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 7 | ai-langchain-import | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 8 | ai-prompt-injection-llamaindex | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 9 | ai-prompt-injection-huggingface | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 10 | ai-prompt-injection-google | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 11 | ai-tool-abuse-dangerous | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 12 | ai-tool-abuse-output-exec | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 13 | ai-dangerous-lambda-shell | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 14 | ai-rag-poisoning | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 15 | ai-model-extraction | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 16 | hardcoded-api-key-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 17 | hardcoded-api-key-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 18 | ai-memory-injection | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 19 | hardcoded-anthropic-api-key-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 20 | hardcoded-anthropic-api-key-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 21 | api-key-in-logs-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 22 | api-key-in-logs-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 23 | api-key-in-error-python | rc.6.1 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 24 | api-key-in-error-js | rc.6.1 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 25 | api-key-in-url-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 26 | api-key-in-url-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 27 | pii-in-llm-prompt | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 28 | sensitive-db-fields-in-prompt-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 29 | sensitive-db-fields-in-prompt-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 30 | missing-data-minimization-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 31 | missing-data-minimization-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 32 | llm-response-pii-not-filtered | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 33 | training-data-leakage | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 34 | embeddings-sensitive-data | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 35 | unvalidated-vector-store | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 36 | user-controlled-embedding | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 37 | missing-vectorstore-auth | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 38 | rag-metadata-injection | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 39 | unrestricted-similarity-search | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 40 | missing-retrieved-context-validation | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 41 | missing-llm-rate-limit-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 42 | missing-llm-rate-limit-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 43 | missing-max-tokens | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 44 | missing-max-tokens-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 45 | missing-cost-tracking | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 46 | missing-cost-tracking-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 47 | missing-ai-auth-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 48 | missing-ai-auth-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 49 | cors-misconfiguration-ai-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 50 | cors-misconfiguration-ai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 51 | missing-input-validation-ai-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 52 | missing-input-validation-ai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 53 | debug-mode-production-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 54 | debug-mode-production-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 55 | missing-error-logging-ai-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 56 | missing-error-logging-ai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 57 | verbose-error-messages-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 58 | verbose-error-messages-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 59 | unverified-model-loading | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 60 | model-poisoning-risk | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 61 | missing-model-integrity | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 62 | model-extraction-risk | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 63 | ai-rest-openai-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 64 | ai-rest-openai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 65 | ai-rest-anthropic-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 66 | ai-rest-anthropic-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 67 | ai-rest-google-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 68 | ai-rest-google-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 69 | ai-rest-cohere-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 70 | ai-rest-cohere-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 71 | ai-rest-huggingface-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 72 | ai-rest-huggingface-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 73 | ai-rest-aws-bedrock-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 74 | ai-rest-aws-bedrock-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 75 | ai-rest-azure-openai-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 76 | ai-rest-azure-openai-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 77 | ai-rest-generic | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 78 | ai-sdk-cohere-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 79 | ai-sdk-cohere-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 80 | ai-sdk-mistral-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 81 | ai-sdk-mistral-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 82 | ai-sdk-ollama-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 83 | ai-sdk-ollama-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 84 | ai-sdk-replicate-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 85 | ai-sdk-replicate-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 86 | ai-sdk-together-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 87 | ai-sdk-together-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 88 | dangerous-tool-python-repl | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 89 | dangerous-tool-shell | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 90 | dangerous-tool-filesystem-write | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 91 | dangerous-tool-sql | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 92 | dangerous-tool-browser | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 93 | dangerous-tool-api-requests | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 94 | dangerous-eval-exec-ai-output-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 95 | dangerous-eval-exec-ai-output-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 96 | hardcoded-openai-api-key | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 97 | ai-agent-loop-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 98 | ai-agent-loop-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 99 | ai-agent-recursive-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 100 | ai-agent-recursive-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 101 | ai-agent-safety-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 102 | ai-agent-safety-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 103 | ai-context-overflow-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 104 | ai-context-overflow-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 105 | ai-cot-exposure | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 106 | ai-function-calling-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 107 | ai-function-calling-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 108 | ai-tool-output-injection-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 109 | ai-tool-output-injection-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 110 | ai-streaming-response-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 111 | ai-streaming-response-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 112 | ai-xss-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 113 | ai-xss-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 114 | ai-sql-injection-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 115 | ai-sql-injection-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 116 | ai-ssrf-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 117 | ai-ssrf-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 118 | ai-multimodal-input-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 119 | ai-multimodal-input-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 120 | ai-multimodal-av-python | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 121 | ai-multimodal-av-js | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |
| 122 | ai-filesystem-access | rc.5 | STRONG | HAIEC_CAN_LICENSE | PENDING_HUMAN_REVIEW |

## Human Review Required

A human reviewer with IP/legal authority must:
1. Review the provenance evidence for all 122 detectors
2. Confirm ownership/IP is clear
3. Approve or reject the license disposition
4. Set finalLegalDisposition from PENDING_HUMAN_REVIEW to APPROVED or BLOCKED

Engineering has provided the evidence. The decision is human.