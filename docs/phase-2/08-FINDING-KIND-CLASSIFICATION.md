# 08 — Finding Kind Classification

## Categories

| Finding Kind | Count | Description |
|--------------|-------|-------------|
| PRESENCE | 43 | Detects that something exists (import, SDK usage, API call, framework) |
| RISK_SIGNAL | 26 | Detects a pattern that introduces risk but is not a confirmed vulnerability |
| CONTROL_GAP | 26 | Detects a missing security control (no rate limit, no auth, no validation) |
| VULNERABILITY | 26 | Detects a concrete exploitable security issue |

## Classification Rules

### PRESENCE
Rules detecting imports, SDK usage, LLM API presence, or framework presence. These are informational — they tell you AI is in use, not that it is insecure.

Examples: `ai-openai-import`, `ai-rest-openai-python`, `ai-sdk-cohere-js`, `ai-agent-loop-python`

### RISK_SIGNAL
Rules detecting patterns that could lead to security issues but are not confirmed vulnerabilities on their own.

Examples: `ai-rag-poisoning`, `ai-tool-abuse-dangerous`, `ai-context-overflow-python`, `ai-memory-injection`

### CONTROL_GAP
Rules detecting missing security controls — the absence of something that should be present.

Examples: `missing-llm-rate-limit-python`, `missing-ai-auth-js`, `missing-input-validation-ai-python`, `debug-mode-production-python`

### VULNERABILITY
Rules detecting concrete, exploitable security issues.

Examples: `ai-tool-abuse-output-exec`, `hardcoded-api-key-python`, `ai-xss-js`, `ai-sql-injection-python`

## Questionable Classifications Flagged

- `ai-prompt-injection-*` detectors are classified as `VULNERABILITY` but may be better as `RISK_SIGNAL` — prompt injection detection via static patterns is not a confirmed exploit. Flagged for future review.
- `api-key-in-logs-*` and `api-key-in-error-*` are classified as `VULNERABILITY` — this is correct (secret exposure is a concrete issue).
- `dangerous-tool-*` detectors are classified as `RISK_SIGNAL` — these detect tool definitions that could be abused, not confirmed exploits. Correct.

## No Fabricated Precision

These classifications do not claim empirical precision. They represent the security engineer's judgment based on the pattern and message content.
