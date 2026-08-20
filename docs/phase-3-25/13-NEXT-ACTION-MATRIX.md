# 13 — Next Action Matrix

## Future Action Classification (No Changes Made)

| Action | Count | Description |
|--------|-------|-------------|
| KEEP | ~95 | Rules that work as designed, no changes needed |
| RENAME_OR_RECLASSIFY | 15 | `missing-*` rules that detect concrete behavior — rename to reflect actual semantics |
| REPAIR | 5 | Minor fixes needed |
| REDESIGN | 7 | Prompt injection rules need taint-mode redesign |
| DEPRECATE | 0 | No rules recommended for deprecation at this time |

## REPAIR Details

| Detector | Issue | Fix |
|----------|-------|-----|
| `ai-function-calling-js` | Regex `functions\s*:\s*\[` has unescaped `[` | Escape the bracket or use single-quoted regex |
| `dangerous-eval-exec-ai-output` | `new Function($AI_OUTPUT)` is JS syntax in Python rule | Split into separate Python and JS rules |
| `hardcoded-api-key-python` | Matches placeholders like `YOUR_API_KEY` | Add `metavariable-regex` for key format |
| `hardcoded-api-key-js` | Same as Python variant | Same fix |
| `missing-ai-auth-python` | Only matches Flask `@app.route(...)` | Add FastAPI `@app.post(...)` patterns |

## REDESIGN Details

| Detector Group | Current | Future |
|----------------|---------|--------|
| `ai-prompt-injection-*` (7 rules) | Pattern matching on API calls | Taint mode: untrusted source → prompt → LLM sink |

## RENAME_OR_RECLASSIFY Details

| Detector | Current Name | Suggested Name |
|----------|-------------|----------------|
| `missing-data-minimization-python` | implies absence detection | `entire-object-to-llm-python` |
| `missing-data-minimization-js` | implies absence detection | `entire-object-to-llm-js` |
| `missing-cost-tracking-python` | implies absence detection | `llm-response-without-tracking-python` |
| `missing-cost-tracking-js` | implies absence detection | `llm-response-without-tracking-js` |
| `missing-llm-rate-limit-python` | implies absence detection | `llm-endpoint-without-rate-limit-python` |
| `missing-llm-rate-limit-js` | implies absence detection | `llm-endpoint-without-rate-limit-js` |
| `missing-error-logging-ai-python` | implies absence detection | `ai-call-without-error-logging-python` |
| `missing-error-logging-ai-js` | implies absence detection | `ai-call-without-error-logging-js` |
| `missing-input-validation-ai-python` | implies absence detection | `unvalidated-ai-input-python` |
| `missing-input-validation-ai-js` | implies absence detection | `unvalidated-ai-input-js` |

**Note:** These rules WORK correctly — only the names are misleading. Renaming is a cosmetic improvement, not a functional fix.
