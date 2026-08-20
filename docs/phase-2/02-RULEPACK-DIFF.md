# 02 — Rulepack Diff: Production 121 vs Legacy 91

## Summary

| Metric | Count |
|--------|-------|
| Production total | 121 |
| Legacy total | 91 |
| Shared IDs | 63 |
| Identical (same body) | 55 |
| Changed (same ID, different body) | 8 |
| Production-only | 58 |
| Legacy-only | 28 |

## The 30-Detector Difference Explained

The net difference is 121 - 91 = 30. This is explained by:

- 28 legacy-only detectors were **split by language** into 56 production detectors
- 2 legacy detectors (`missing-cost-tracking`, `missing-max-tokens`) were **partially split**: the original ID kept Python-only, and a new `-js` variant was added
- Net: 58 production-only - 28 legacy-only = 30

### Language Split Pattern

The legacy `semgrep_rules.yaml` had single detectors targeting multiple languages (e.g. `ai-agent-loop` with `languages: [python, javascript, typescript]`). The production embedded rulepack split these into per-language detectors (e.g. `ai-agent-loop-python` and `ai-agent-loop-js`).

This was done to fix Semgrep `PatternParseError` issues — cross-language patterns in a single rule caused parse failures. See commits:
- `795be453` — "split 5 cross-language Semgrep rules causing exit code 2"
- `a040d04c` — "split 20+ cross-language Semgrep rules to fix PatternParseError (v3.24.0)"
- `4453a525` — "JSX PatternParseError + pre-validation rule stripping + more rule splits (v3.25.0)"

### Legacy-Only Detectors (28 — all language-split)

```
ai-agent-loop, ai-agent-recursive, ai-agent-safety, ai-context-overflow,
ai-function-calling, ai-multimodal-av, ai-multimodal-input,
ai-rest-anthropic, ai-rest-aws-bedrock, ai-rest-azure-openai, ai-rest-cohere,
ai-rest-google, ai-rest-huggingface, ai-rest-openai,
ai-sdk-cohere, ai-sdk-mistral, ai-sdk-ollama, ai-sdk-replicate, ai-sdk-together,
ai-sql-injection, ai-ssrf, ai-streaming-response, ai-tool-output-injection,
ai-xss, api-key-in-logs, cors-misconfiguration-ai, debug-mode-production,
missing-input-validation-ai
```

### Changed Detectors (8)

| ID | Change |
|----|--------|
| `ai-anthropic-import` | metadata changed |
| `ai-cot-exposure` | body changed |
| `ai-openai-import` | metadata changed |
| `ai-prompt-injection-anthropic` | body changed |
| `ai-prompt-injection-openai` | metadata changed |
| `ai-prompt-injection-openai-js` | metadata changed |
| `missing-cost-tracking` | languages: prod=[python], legacy=[python,javascript,typescript] |
| `missing-max-tokens` | languages: prod=[python], legacy=[python,javascript,typescript] |

### Identical Detectors (55)

55 shared detectors have identical rule bodies in both production and legacy. These include all hardcoded-api-key variants, dangerous-tool detectors, RAG detectors, model integrity detectors, and PII detectors.

## Conclusion

The 30-detector difference is fully explained by language-specific splits. No detectors were added or removed semantically — the production rulepack is the legacy rulepack with multi-language rules split into per-language variants.
