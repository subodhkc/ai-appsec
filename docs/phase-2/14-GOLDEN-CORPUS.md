# 14 — Golden Migration Corpus

## Purpose

Synthetic fixtures for migration verification. Every logical check must have at least one positive fixture. Every BLOCK candidate must have positive, negative, and false-positive fixtures.

## Requirements

- Fixtures must be synthetic — no customer code, no private repository code, no production secrets
- Language-specific detector splits must have fixtures proving each language detector contributes independently
- Fixtures cover all 80 logical checks

## Fixture Structure

```
fixtures/
  positive/     # Code that SHOULD trigger the detector
  negative/     # Code that should NOT trigger the detector
  falsepos/     # Code that likely triggers but is not a real issue
```

## Coverage Plan

### BLOCK Candidates (9) — Full Coverage Required

| Detector | Positive | Negative | False-Positive |
|----------|----------|----------|----------------|
| `ai-tool-abuse-output-exec` | AI output → subprocess.call | AI output → string display | AI output → logging only |
| `dangerous-eval-exec-ai-output` | AI output → eval() | AI output → json.loads | Test eval of non-AI string |
| `hardcoded-api-key-python` | sk-... in source | os.environ['API_KEY'] | Example key in docstring |
| `hardcoded-api-key-js` | sk-... in source | process.env.API_KEY | Example key in comment |
| `hardcoded-anthropic-api-key-python` | sk-ant-... in source | os.environ['ANTHROPIC_KEY'] | Test fixture key |
| `hardcoded-anthropic-api-key-js` | sk-ant-... in source | process.env.ANTHROPIC_KEY | Example in README |
| `hardcoded-openai-api-key` | sk-... in source | os.environ['OPENAI_KEY'] | Placeholder key |
| `api-key-in-url-python` | requests.get(url+key) | requests.get(url, headers=) | Signed URL with temp token |
| `api-key-in-url-js` | fetch(url+key) | fetch(url, {headers}) | Signed URL with temp token |

### PRESENCE Detectors (43) — One Positive Fixture Each

Each PRESENCE detector needs one positive fixture showing the import/SDK usage/API call it detects.

### RISK_SIGNAL and CONTROL_GAP Detectors (52) — One Positive Fixture Each

Each risk signal and control gap detector needs one positive fixture showing the pattern it detects.

## Status

The fixture corpus design is documented. Implementation of all fixtures is a prerequisite for the parity test (see `15-PARITY-REPORT.md`).
