# 07 — Secret Rule Results

## Detectors Tested

```
hardcoded-api-key-python
hardcoded-api-key-js
hardcoded-anthropic-api-key-python
hardcoded-anthropic-api-key-js
hardcoded-openai-api-key
api-key-in-url-python
api-key-in-url-js
api-key-in-logs-python
api-key-in-logs-js
api-key-in-error-python
api-key-in-error-js
```

## Scan Results

| Detector | Fired? | Positive Fixture? | FP Fixture? |
|----------|--------|-------------------|-------------|
| `hardcoded-api-key-python` | YES | NO (wrong detector fired) | N/A |
| `hardcoded-api-key-js` | NO | NO | N/A |
| `hardcoded-anthropic-api-key-python` | NO | NO | N/A |
| `hardcoded-anthropic-api-key-js` | NO | NO | N/A |
| `hardcoded-openai-api-key` | NO | NO | YES (wrong detector fired on placeholder) |
| `api-key-in-url-python` | NO | NO | N/A |
| `api-key-in-url-js` | NO | NO | N/A |
| `api-key-in-logs-python` | YES | NO (MISSING_FINDING) | N/A |
| `api-key-in-logs-js` | YES | N/A | N/A |
| `api-key-in-error-python` | YES | N/A | N/A |
| `api-key-in-error-js` | YES | N/A | N/A |

## False-Positive Evidence

The `hardcoded-openai-api-key-falsepos.py` fixture contains:
```python
openai.api_key = "YOUR_API_KEY"
```

The detector `hardcoded-api-key-python` fired on this placeholder, proving that the secret detection patterns cannot distinguish real keys from obvious placeholders.

## Conclusion

All secret-related detectors are classified `REDESIGN_BEFORE_BLOCK` because:
1. Most don't fire on their intended positive fixtures
2. The ones that do fire cannot distinguish real keys from placeholders
3. No `metavariable-regex` is used to validate key format
4. `YOUR_API_KEY` and `sk-xxxx` placeholders trigger detection

## Required Redesign

1. Add `metavariable-regex` to validate key format (e.g., `^sk-proj-`, `^sk-ant-`)
2. Exclude common placeholders (`YOUR_API_KEY`, `example`, `placeholder`, `sk-xxxx`)
3. Test against the false-positive fixtures to confirm no false triggers
