# 12 — Rule Status Matrix

## Full Classification (121 Detectors)

### Preliminary classification based on pattern analysis and calibration testing

| Rule Status | Count | Detectors |
|-------------|-------|-----------|
| WORKS_AS_DESIGNED | ~95 | Most pattern rules with correct syntax |
| WORKS_BUT_NAME_MISLEADING | 15 | `missing-data-minimization-*`, `missing-cost-tracking-*`, `missing-llm-rate-limit-*`, `missing-error-logging-*`, `missing-input-validation-*` — all detect concrete behavior, not absence |
| WORKS_BUT_MESSAGE_OVERSTATES | 7 | `ai-prompt-injection-*` — detect API calls, not injection |
| WORKS_BUT_TOO_BROAD | 2 | `hardcoded-api-key-python` (matches placeholders), `ai-tool-abuse-output-exec` (taint false positive on subprocess.run) |
| WORKS_BUT_TOO_NARROW | 1 | `missing-ai-auth-python` (only Flask, not FastAPI) |
| NEEDS_REPAIR | 1 | `dangerous-eval-exec-ai-output` (JS pattern in Python rule) |
| PARSER_ERROR | 1 | `ai-function-calling-js` (regex error in 1.52.0, fixed in 1.173.0) |

### Detailed Matrix (Key Detectors Only)

| Detector | Mode | Test Status | Rule Status | Next Action |
|----------|------|-------------|-------------|-------------|
| `ai-tool-abuse-output-exec` | TAINT | HISTORICAL_TEST_WRONG | WORKS_BUT_TOO_BROAD | REPAIR (fix sink pattern) |
| `dangerous-eval-exec-ai-output` | PATTERN | PHASE26_FIXTURE_WRONG | NEEDS_REPAIR | REPAIR (remove JS pattern) |
| `ai-prompt-injection-openai` | PATTERN | PHASE26_FIXTURE_CORRECT | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `ai-prompt-injection-openai-js` | PATTERN | PHASE26_FIXTURE_CORRECT | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `ai-prompt-injection-anthropic` | PATTERN | PHASE26_FIXTURE_CORRECT | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `ai-prompt-injection-langchain` | PATTERN | PHASE26_FIXTURE_WRONG | PARSER_ERROR (modern) | REPAIR (fix pattern syntax) |
| `ai-prompt-injection-llamaindex` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `ai-prompt-injection-huggingface` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `ai-prompt-injection-google` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_BUT_MESSAGE_OVERSTATES | REDESIGN (taint mode) |
| `missing-data-minimization-python` | PATTERN | PHASE26_FIXTURE_CORRECT | WORKS_BUT_NAME_MISLEADING | RENAME_OR_RECLASSIFY |
| `missing-data-minimization-js` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_BUT_NAME_MISLEADING | RENAME_OR_RECLASSIFY |
| `missing-max-tokens` | PATTERN | PHASE26_FIXTURE_WRONG | WORKS_AS_DESIGNED | KEEP |
| `missing-max-tokens-js` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_AS_DESIGNED | KEEP |
| `hardcoded-api-key-python` | PATTERN | PHASE26_FIXTURE_CORRECT | WORKS_BUT_TOO_BROAD | REPAIR (add metavariable-regex) |
| `hardcoded-api-key-js` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | WORKS_BUT_TOO_BROAD | REPAIR (add metavariable-regex) |
| `missing-ai-auth-python` | PATTERN | PHASE26_FIXTURE_WRONG | WORKS_BUT_TOO_NARROW | REPAIR (add FastAPI patterns) |
| `ai-function-calling-js` | PATTERN | NO_PREVIOUS_SEMANTIC_TEST | PARSER_ERROR | REPAIR (fix regex) |
