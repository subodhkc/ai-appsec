# 09 — Control Gap Review

## Problem

Pattern matching is poor at proving absence. A `missing-*` detector typically looks for the presence of a pattern (e.g., an API call without a rate limiter) and concludes the control is missing. But the control might exist elsewhere in the codebase.

## Control Gap Validity Assessment

| Status | Count |
|--------|-------|
| Valid CONTROL_GAP | 9 |
| Invalid (pattern cannot prove absence) | 17 |

## Invalid Control Gap Detectors (17)

These detectors are marked `REDESIGN_REQUIRED` because pattern-based "missing" detection is inherently unreliable:

```
missing-llm-rate-limit-python
missing-llm-rate-limit-js
missing-max-tokens
missing-max-tokens-js
missing-cost-tracking
missing-cost-tracking-js
missing-ai-auth-python
missing-ai-auth-js
missing-input-validation-ai-python
missing-input-validation-ai-js
missing-error-logging-ai-python
missing-error-logging-ai-js
missing-data-minimization-python
missing-data-minimization-js
missing-vectorstore-auth
unrestricted-similarity-search
missing-retrieved-context-validation
```

## Why Invalid

A detector that finds `openai.ChatCompletion.create()` without a nearby rate limiter call cannot conclude that rate limiting is missing from the application. The rate limiter might be:
- In a middleware layer
- In an API gateway
- In a separate configuration file
- Applied at the infrastructure level

## Recommendation

These 17 detectors should be:
1. Reclassified as `RISK_SIGNAL` (not `CONTROL_GAP`)
2. Messages updated to say "consider adding X" rather than "missing X"
3. Redesigned in a future phase to use whole-repository analysis

## Valid Control Gap Detectors (9)

These detectors can reasonably establish a control gap because they detect a configuration or code pattern that directly indicates the gap:

```
cors-misconfiguration-ai-python
cors-misconfiguration-ai-js
debug-mode-production-python
debug-mode-production-js
verbose-error-messages-python
verbose-error-messages-js
unvalidated-vector-store
unverified-model-loading
missing-model-integrity
```
