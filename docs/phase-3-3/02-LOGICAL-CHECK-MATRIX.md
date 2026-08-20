# 02 — Logical Check Matrix

## Total Logical Checks: 78

The previous claim of 80 logical checks was incorrect. The production `HAIEC_RULE_TO_DISPLAY_ID` mapping produces 78 unique display IDs among the 121 detectors.

## Why 78, Not 80

Three display IDs are shared between import detectors and prompt-injection detectors:
- R1.1: `ai-prompt-injection-openai` + `ai-openai-import`
- R1.3: `ai-anthropic-import` + `ai-prompt-injection-anthropic`
- R1.6: `ai-prompt-injection-langchain` + `ai-langchain-import`

This reduces the unique count from 80 (if each detector had a unique display ID) to 78.

## Qualified Logical Checks: 61

A logical check is QUALIFIED if at least one of its detectors has status:
- QUALIFIED_AS_IS
- QUALIFIED_BUT_RENAME
- QUALIFIED_BUT_MESSAGE_FIX
- QUALIFIED_WITH_PRECISION_REPAIR

## Not-Qualified Logical Checks: 17

| Logical Check | Detectors | Status(es) | Root Cause |
|---------------|-----------|------------|------------|
| R1.2 | ai-prompt-injection-openai-js | NEEDS_REDESIGN | Fires on all API calls |
| R1.4 | ai-prompt-injection-google | NEEDS_REDESIGN | Fires on all API calls |
| R1.5 | ai-prompt-injection-huggingface | NEEDS_REDESIGN | Fires on all API calls |
| R1.7 | ai-prompt-injection-llamaindex | NEEDS_REDESIGN | Fires on all API calls |
| R2.1 | ai-rest-openai-python, ai-rest-openai-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R2.2 | ai-rest-anthropic-python, ai-rest-anthropic-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R2.3 | ai-rest-google-python, ai-rest-google-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R2.4 | ai-rest-cohere-python, ai-rest-cohere-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R2.5 | ai-rest-huggingface-python, ai-rest-huggingface-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R2.7 | ai-rest-azure-openai-python, ai-rest-azure-openai-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | Double-escaped regex |
| R4.7 | dangerous-eval-exec-ai-output | NEEDS_LOGIC_REPAIR | JS pattern in multi-lang rule |
| R5.1 | hardcoded-openai-api-key | NEEDS_LOGIC_REPAIR | All patterns fail |
| R5.2 | hardcoded-anthropic-api-key-python, hardcoded-anthropic-api-key-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | ... in strings + regex issues |
| R5.4 | hardcoded-api-key-js | NEEDS_LOGIC_REPAIR | ... in strings doesn't work |
| R5.7 | api-key-in-url-python, api-key-in-url-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | ... in f-strings + ? in template |
| R6.6 | ai-function-calling-python, ai-function-calling-js | NEEDS_LOGIC_REPAIR, PARSER_ERROR | Pattern/regex issues |
| R11.2 | ai-sql-injection-python, ai-sql-injection-js | NEEDS_LOGIC_REPAIR, NEEDS_LOGIC_REPAIR | ... in strings doesn't work |

## Partially Qualified Logical Checks (qualified but some detectors need work)

| Logical Check | Qualified Detectors | Failing Detectors |
|---------------|--------------------|-------------------|
| R1.1 | ai-openai-import (QUALIFIED_AS_IS) | ai-prompt-injection-openai (NEEDS_REDESIGN) |
| R1.3 | ai-anthropic-import (QUALIFIED_AS_IS) | ai-prompt-injection-anthropic (NEEDS_REDESIGN) |
| R1.6 | ai-langchain-import (QUALIFIED_AS_IS) | ai-prompt-injection-langchain (NEEDS_REDESIGN) |
| R5.3 | api-key-in-logs-python (QUALIFIED_AS_IS), api-key-in-error-python (QUALIFIED_AS_IS) | api-key-in-logs-js (QUALIFIED_WITH_PRECISION_REPAIR) |
| R9.2 | missing-max-tokens (QUALIFIED_AS_IS) | missing-max-tokens-js (QUALIFIED_WITH_PRECISION_REPAIR) |
| R9.4 | missing-ai-auth-js (QUALIFIED_BUT_RENAME) | missing-ai-auth-python (QUALIFIED_WITH_PRECISION_REPAIR) |

These logical checks ARE counted as qualified because at least one detector works.
