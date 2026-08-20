# 12 — Prompt Injection Quality

## Applicable Detectors (7)

```
ai-prompt-injection-openai
ai-prompt-injection-openai-js
ai-prompt-injection-anthropic
ai-prompt-injection-langchain
ai-prompt-injection-llamaindex
ai-prompt-injection-huggingface
ai-prompt-injection-google
```

## Assessment

| Issue | Status |
|-------|--------|
| Message overstates evidence | YES (all 7) |
| Pattern detects API call, not injection | YES (all 7) |
| Can distinguish injection from normal API usage | NO |
| Uses taint analysis | NO |

## Message vs. Detection Analysis

### Example: `ai-prompt-injection-openai`
- **Message:** "OpenAI API call detected - review for prompt injection vulnerabilities"
- **Actual detection:** `openai.ChatCompletion.create(...)` or similar API call
- **Problem:** The pattern matches ANY OpenAI API call, not just calls with user input flowing to the prompt. Every OpenAI API call would be flagged as a "prompt injection vulnerability."

### All 7 detectors have the same pattern:
1. Detect an AI provider API call (OpenAI, Anthropic, LangChain, LlamaIndex, HuggingFace, Google)
2. Label it as "review for prompt injection"
3. But the pattern cannot distinguish:
   - A call with hardcoded prompts (no injection risk)
   - A call with user input (potential injection risk)
   - A call with sanitized input (no injection risk)

## Classification

- **Current findingKind:** VULNERABILITY
- **Correct findingKind:** RISK_SIGNAL (or PRESENCE for import-only rules)
- **Message status:** MESSAGE_OVERSTATES_EVIDENCE
- **Disposition:** REVIEW (not BLOCK — already correct)
- **Redesign required:** YES

## What Redesign Should Do

1. Use Semgrep taint mode to track user input → AI prompt
2. Only flag when user-controlled data flows into the prompt parameter
3. Update message to say "User input flows to AI prompt — review for prompt injection"
4. Do not flag hardcoded prompts or system messages

## Comparison with External Rules

The external semgrep-rules repo has:
- `openai-user-input-in-system-prompt` — uses taint mode
- `anthropic-user-input-in-system-prompt` — uses taint mode
- `llm-output-to-exec-python` — uses taint mode

These external rules use taint analysis, which is the correct approach. HAIEC rules use simple pattern matching, which cannot detect actual injection.

## Current Disposition

All 7 prompt-injection detectors are `REDESIGN_REQUIRED` and `REVIEW` (not BLOCK). This is correct — they should not block deployment because they cannot confirm injection.
