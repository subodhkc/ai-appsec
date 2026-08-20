# 03 — Rule Validation Comparison

## Legacy (1.52.0) Validation

```
Configuration is invalid - found 1 configuration error(s), and 121 rule(s).
[ERROR] Rule parse error in rule ai-function-calling-js:
 invalid regex 'functions\\s*:\\s*\\[': missing terminating ] for character class at position 21
```

**Result:** 120 valid, 1 error (`ai-function-calling-js`)

## Modern (1.173.0) Validation

```
Configuration is invalid - found 1 configuration error(s), and 121 rule(s).
[ERROR] Pattern parse error in rule ai-prompt-injection-langchain:
 Invalid pattern for Python:
--- pattern ---
new ChatOpenAI(...)
--- end pattern ---
Pattern error: Stdlib.Parsing.Parse_error
```

**Result:** 120 valid, 1 error (`ai-prompt-injection-langchain`)

## Comparison

| Rule | 1.52.0 | 1.173.0 | Change |
|------|--------|---------|--------|
| `ai-function-calling-js` | PATTERN_ERROR | VALID | Parser fix (improved) |
| `ai-prompt-injection-langchain` | VALID | PATTERN_ERROR | New error (regression) |
| All other 119 rules | VALID | VALID | Unchanged |

## Analysis

### `ai-function-calling-js` — Fixed in Modern

The regex `functions\s*:\s*\[` had an unescaped `[` that 1.52.0's regex parser rejected. Modern Semgrep's updated parser handles this correctly.

### `ai-prompt-injection-langchain` — New Error in Modern

The pattern `new ChatOpenAI(...)` is invalid Python syntax. `new` is not a Python keyword. This pattern was likely intended for JavaScript but was placed in a Python rule. Modern Semgrep's stricter parser catches this; 1.52.0 silently accepted it.

**Root cause:** The rule has `languages: [python]` but uses JavaScript-style `new ChatOpenAI(...)` syntax. This is a rule bug, not an engine bug. The modern engine correctly identifies it.
