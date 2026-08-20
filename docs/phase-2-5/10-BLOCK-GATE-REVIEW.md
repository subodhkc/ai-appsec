# 10 — BLOCK Gate Review

## BLOCK Revalidation Results

| Status | Count |
|--------|-------|
| CONFIRMED_BLOCK | 7 |
| REDESIGN_BEFORE_BLOCK | 2 |
| REVIEW_ONLY | 112 |

## Changes from Phase 2

| Detector | Phase 2 | Phase 2.5 | Reason |
|----------|---------|-----------|--------|
| `api-key-in-url-python` | BLOCK | REDESIGN_BEFORE_BLOCK | Credential-looking URL is not automatically proof of a live secret |
| `api-key-in-url-js` | BLOCK | REDESIGN_BEFORE_BLOCK | Same as above |

## CONFIRMED_BLOCK Detectors (7)

### `ai-tool-abuse-output-exec`
- **Evidence:** AI output flows to subprocess/shell execution = command injection
- **False positives:** Sandboxed execution, test code
- **Remediation:** Never execute AI-generated code without validation

### `dangerous-eval-exec-ai-output`
- **Evidence:** AI output passed to eval/exec = code injection
- **False positives:** Test eval of non-AI string
- **Remediation:** Never execute AI-generated code via eval

### `hardcoded-api-key-python` / `hardcoded-api-key-js`
- **Evidence:** Hardcoded API key in source = secret exposure
- **False positives:** Test files, example code, placeholder keys
- **Remediation:** Move to environment variables or secrets manager

### `hardcoded-anthropic-api-key-python` / `hardcoded-anthropic-api-key-js`
- **Evidence:** Hardcoded Anthropic key = secret exposure
- **False positives:** Same as above
- **Remediation:** Same as above

### `hardcoded-openai-api-key`
- **Evidence:** Hardcoded OpenAI key = secret exposure
- **False positives:** Same as above
- **Remediation:** Same as above

## REDESIGN_BEFORE_BLOCK Detectors (2)

### `api-key-in-url-python` / `api-key-in-url-js`
- **Why downgraded:** A credential-looking URL parameter is not automatically proof of a live secret. Some APIs legitimately use URL parameters for signed URLs or temporary tokens.
- **What's needed:** Redesign to use `metavariable-regex` to match real API key patterns (e.g., `sk-`, `AIza`) rather than any URL parameter
- **Current disposition:** REVIEW (not BLOCK)

## BLOCK Safety Rules Enforced

1. PRESENCE detectors must not default to BLOCK — **ENFORCED** (all 43 PRESENCE = INFORMATIONAL)
2. BLOCK requires strong evidence — **ENFORCED** (all 7 confirmed BLOCKs have concrete evidence)
3. BLOCK requires positive, negative, and false-positive fixtures — **PROVIDED** (all 9 BLOCK candidates have fixtures)
4. BLOCK requires documented false-positive scenarios — **PROVIDED**
5. BLOCK requires safe remediation — **PROVIDED**
