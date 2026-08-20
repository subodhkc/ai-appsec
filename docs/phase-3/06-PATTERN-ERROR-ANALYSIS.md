# 06 — Pattern Error Analysis

## `ai-function-calling-js`

### Error in 1.52.0
```
invalid regex 'functions\\s*:\\s*\\[': missing terminating ] for character class at position 21
```

### Status in 1.173.0
**FIXED** — no error. The modern regex parser handles the pattern correctly.

### Root Cause
The regex `functions\s*:\s*\[` contains `\[` which the 1.52.0 PCRE parser interpreted as a character class start. Modern Semgrep's updated parser correctly interprets it as an escaped literal bracket.

### Fix Required
None — the modern engine parses this correctly. However, the rule should still be reviewed for semantic correctness (does it actually detect function calling?).

## `ai-prompt-injection-langchain`

### Error in 1.52.0
None — the rule validated successfully.

### Error in 1.173.0
```
Pattern parse error: Invalid pattern for Python: `new ChatOpenAI(...)`
Pattern error: Stdlib.Parsing.Parse_error
```

### Root Cause
The rule has `languages: [python]` but the pattern `new ChatOpenAI(...)` uses JavaScript `new` syntax, which is invalid Python. This is a **rule bug**, not an engine bug.

The pattern was likely copied from a JavaScript variant or written without considering the target language. Modern Semgrep's stricter parser correctly rejects it.

### Fix Required
Change the pattern to valid Python syntax:
```python
# Instead of: new ChatOpenAI(...)
# Use: ChatOpenAI(...)
```

### Classification
This is a RULE_REDESIGN_REQUIRED issue, not a MODERN_ENGINE_REGRESSION. The rule was always wrong; 1.52.0 just didn't catch it.
