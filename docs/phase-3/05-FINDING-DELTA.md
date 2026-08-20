# 05 — Finding Delta

## Summary

| Delta Type | Count |
|------------|-------|
| IDENTICAL | 143 |
| NEW_MATCH | 0 |
| LOST_MATCH | 0 |
| LINE_SHIFT_ONLY | 0 |
| SEVERITY_CHANGE | 0 |
| PARSER_FIX | 0 (findings unchanged) |
| PARSER_REGRESSION | 0 (findings unchanged) |
| ENGINE_SEMANTIC_CHANGE | 0 |
| ERROR_CHANGE | 1 (different rule has error) |
| UNKNOWN_DIFFERENCE | 0 |

## Conclusion

There are **zero finding-level differences** between Semgrep 1.52.0 and 1.173.0 when running the same frozen rulepack against the same golden corpus.

The only difference is at the validation level: which rule has a pattern parse error. This does not affect finding output because:
- `ai-function-calling-js` was already broken in 1.52 (no findings from it)
- `ai-prompt-injection-langchain` is newly broken in 1.173 (but it still fires in the scan despite the validation error — Semgrep skips invalid rules and continues)

## No UNKNOWN_DIFFERENCE

Every difference is fully explained. No unexplained behavior change.
