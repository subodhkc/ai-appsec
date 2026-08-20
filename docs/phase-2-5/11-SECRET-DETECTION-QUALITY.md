# 11 — Secret Detection Quality

## Applicable Detectors

9 detectors related to secret detection:
- `hardcoded-api-key-python`, `hardcoded-api-key-js`
- `hardcoded-anthropic-api-key-python`, `hardcoded-anthropic-api-key-js`
- `hardcoded-openai-api-key`
- `api-key-in-logs-python`, `api-key-in-logs-js`
- `api-key-in-url-python`, `api-key-in-url-js`
- `api-key-in-error-python`, `api-key-in-error-js`

## Quality Assessment

| Issue | Status |
|-------|--------|
| Can distinguish real keys from placeholders | NO |
| Uses metavariable-regex for key validation | NO |
| Matches example/documentation keys | YES (false positive) |
| Matches `YOUR_API_KEY` placeholder | YES (false positive) |
| Matches `sk-xxxx` example keys | YES (false positive) |

## Root Cause

HAIEC secret detection patterns do not use `metavariable-regex` to validate that the detected string looks like a real API key. The external semgrep-rules repo's `openai-hardcoded-api-key-python` rule uses:
```yaml
metavariable-regex:
  metavariable: $KEY
  regex: ^sk-
```

HAIEC rules do not have this validation, so they match any string assigned to an API key parameter.

## False-Positive Fixtures

The false-positive fixtures confirm this issue:
- `hardcoded-api-key-falsepos.py`: `api_key="sk-xxxx...your-key-here"` — should NOT trigger
- `hardcoded-openai-api-key-falsepos.py`: `openai.api_key = "YOUR_API_KEY"` — should NOT trigger

## Recommendation

All secret detection rules should be marked `REDESIGN_REQUIRED` and updated to:
1. Use `metavariable-regex` to validate key format (e.g., `^sk-`, `^sk-ant-`, `^AIza`)
2. Exclude common placeholder patterns (`YOUR_API_KEY`, `sk-xxxx`, `example`, `placeholder`)
3. Consider entropy-based detection for unknown key formats

## Current Disposition

Despite the false-positive risk, the 5 hardcoded-key detectors remain `CONFIRMED_BLOCK` because:
- Detecting a hardcoded string in an API key parameter is still a strong signal
- The false-positive rate is acceptable for a security scanner (better to over-report than miss real secrets)
- The redesign should reduce false positives, not change the disposition
