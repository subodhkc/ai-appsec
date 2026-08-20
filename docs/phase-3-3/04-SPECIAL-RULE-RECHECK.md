# 04 — Special Rule Recheck

## A. ai-tool-abuse-output-exec

### Test Results

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Positive: AI output → os.system | YES | ✓ |
| Positive: AI output → subprocess.run(shell=True) | YES | ✓ |
| Negative: fixed `os.system("ls -la")` (no AI) | NO | ✓ |
| Negative: safe print of AI response | NO | ✓ |
| Negative: unrelated AI call + fixed shell | NO | ✓ |
| **`subprocess.run("ls -la", shell=True)` (no AI)** | **YES** | **✗ FALSE POSITIVE** |
| **`subprocess.run(cmd, shell=True)` (func param, no AI)** | **YES** | **✗ FALSE POSITIVE** |

### Classification

**Root cause:** The sink pattern `subprocess.run(..., shell=True, ...)` uses `...` in the arguments. In Semgrep 1.52.0 taint mode, when a sink has `...` in its arguments, the sink matches regardless of whether tainted data flows into it. The `os.system(...)` and `eval(...)` sinks work correctly (they require taint).

**This is NOT solely a "Semgrep bug."** The rule's sink pattern `subprocess.run(..., shell=True, ...)` is too broad — it matches any `subprocess.run` call with `shell=True`, regardless of taint. A more precise sink would be `subprocess.run($TAINTED, shell=True, ...)` where `$TAINTED` is a metavariable bound to the taint source.

**Final status:** QUALIFIED_WITH_PRECISION_REPAIR
**Future action:** REPAIR — make sink patterns more specific

### Historical Test Reconciliation

The historical `test_sample_code.py` expected `os.system("ls -la")` to trigger this rule. This is WRONG — the rule is taint-based and requires AI output flowing to the sink. A fixed string has no AI source. The historical expectation was a test-harness error, not a detector failure.

---

## B. dangerous-eval-exec-ai-output

### Test Results

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Python-only extraction: `eval(code)` where code is AI output | YES | ✓ |
| Multi-lang (original): same fixture | NO (silent failure) | ✗ |
| `eval("1+1")` (no AI) with Python-only | NO | ✓ |

### Classification

**Root cause:** The rule has `languages: [python, javascript, typescript]` and includes the pattern `new Function($AI_OUTPUT)` which is JavaScript syntax. When Semgrep 1.52.0 encounters this pattern, it cannot parse it for Python. Instead of skipping the invalid pattern and using the valid ones, it silently fails the entire rule for Python. No error is reported (errors=0), but no findings are produced.

**This is a RULE_ERROR, not an EXTRACTION_HARNESS_ERROR.** The isolation extraction correctly preserved the rule YAML. The rule itself contains a pattern that is invalid for one of its declared languages. The production scanner's pre-validation step (`semgrep --validate`) would catch this and strip the rule, but the rule would still not produce findings.

**Final status:** NEEDS_LOGIC_REPAIR
**Future action:** REPAIR — split into separate Python and JavaScript rules, or remove the JS pattern from the Python language list

---

## C. Prompt-Injection Family (7 rules)

### Test Results

| Detector | Safe API Call | User Input to Prompt | Can Distinguish? |
|----------|--------------|---------------------|------------------|
| ai-prompt-injection-openai | FIRED (2 findings) | FIRED (2 findings) | NO |
| ai-prompt-injection-openai-js | FIRED | FIRED | NO |
| ai-prompt-injection-anthropic | FIRED | FIRED | NO |
| ai-prompt-injection-langchain | FIRED | FIRED | NO |
| ai-prompt-injection-llamaindex | FIRED | FIRED | NO |
| ai-prompt-injection-huggingface | FIRED | FIRED | NO |
| ai-prompt-injection-google | FIRED | FIRED | NO |

### Classification

All 7 prompt-injection rules fire on ANY AI API call, regardless of whether user input flows to the prompt. They cannot distinguish safe API usage from untrusted-input injection. The patterns match API call syntax (e.g., `openai.chat.completions.create(...)`), not injection flow.

**Final status:** NEEDS_REDESIGN (all 7)
**Future action:** REDESIGN — convert to taint mode with untrusted source → prompt → LLM sink

---

## D. Secrets Family

### Test Results

| Detector | Real Key | Placeholder | Env Var | Status |
|----------|----------|-------------|---------|--------|
| hardcoded-api-key-python | FIRED ✓ | FIRED ✗ | NO ✓ | QUALIFIED_WITH_PRECISION_REPAIR |
| hardcoded-api-key-js | NOT FIRED ✗ | NOT FIRED | NOT FIRED | NEEDS_LOGIC_REPAIR |
| hardcoded-anthropic-api-key-python | NOT FIRED ✗ | NOT FIRED | NOT FIRED | NEEDS_LOGIC_REPAIR |
| hardcoded-anthropic-api-key-js | NOT FIRED ✗ | NOT FIRED | NOT FIRED | NEEDS_LOGIC_REPAIR |
| hardcoded-openai-api-key | NOT FIRED ✗ | NOT FIRED | NOT FIRED | NEEDS_LOGIC_REPAIR |
| api-key-in-logs-python | FIRED ✓ | — | — | QUALIFIED_AS_IS |
| api-key-in-logs-js | FIRED ✓ | — | — | QUALIFIED_WITH_PRECISION_REPAIR (too broad) |
| api-key-in-error-python | FIRED ✓ | — | — | QUALIFIED_AS_IS |
| api-key-in-error-js | FIRED ✓ | — | — | QUALIFIED_AS_IS |
| api-key-in-url-python | NOT FIRED ✗ | — | — | NEEDS_LOGIC_REPAIR |
| api-key-in-url-js | NOT FIRED ✗ | — | — | NEEDS_LOGIC_REPAIR |

### Classification

- `hardcoded-api-key-python` is the ONLY secret detector that works on real keys. But it also matches placeholders — needs `metavariable-regex` for precision.
- `hardcoded-api-key-js` uses `const apiKey = "sk-..."` — `...` in regular strings doesn't work in Semgrep 1.52.0.
- `hardcoded-anthropic-api-key-*` uses `api_key = "sk-ant-..."` — same `...` issue. Also has `pattern-regex` requiring exactly 95 chars.
- `hardcoded-openai-api-key` has `pattern-regex: "sk-[A-Za-z0-9]{20,}"` which doesn't match real keys with hyphens (like `sk-proj-...`). Also has `...` in strings issue.
- `api-key-in-url-*` uses `...` in f-strings/template literals — doesn't work for f-strings, and `?` causes issues in JS template literals.

**Do NOT generalize hardcoded-api-key-python behavior to all secret rules.** Each was tested independently. Only 1 of 5 hardcoded-key rules works. Only 2 of 4 API-key-exposure rules work correctly.

---

## E. missing-* Family

### Test Results

Each missing-* rule was tested independently:

| Detector | Fires on Positive? | Fires on Negative? | Status |
|----------|--------------------|--------------------|--------|
| missing-data-minimization-python | YES | NO | QUALIFIED_BUT_RENAME |
| missing-data-minimization-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-llm-rate-limit-python | YES | NO | QUALIFIED_BUT_RENAME |
| missing-llm-rate-limit-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-max-tokens | YES | NO | QUALIFIED_AS_IS |
| missing-max-tokens-js | YES | NO (but YES on FP) | QUALIFIED_WITH_PRECISION_REPAIR |
| missing-cost-tracking | YES | NO | QUALIFIED_BUT_RENAME |
| missing-cost-tracking-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-ai-auth-python | YES | NO | QUALIFIED_WITH_PRECISION_REPAIR (too narrow) |
| missing-ai-auth-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-input-validation-ai-python | YES | NO | QUALIFIED_BUT_RENAME |
| missing-input-validation-ai-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-error-logging-ai-python | YES | NO | QUALIFIED_BUT_RENAME |
| missing-error-logging-ai-js | YES | NO | QUALIFIED_BUT_RENAME |
| missing-vectorstore-auth | YES | NO | QUALIFIED_BUT_RENAME |
| missing-retrieved-context-validation | YES | NO | QUALIFIED_BUT_RENAME |
| missing-model-integrity | YES | NO | QUALIFIED_BUT_RENAME |

### Classification

- 14 are QUALIFIED_BUT_RENAME — they detect concrete behavior, not absence. Names are misleading.
- 1 is QUALIFIED_AS_IS — `missing-max-tokens` correctly detects absence of max_tokens parameter.
- 1 is QUALIFIED_WITH_PRECISION_REPAIR — `missing-max-tokens-js` fires on FP fixture.
- 1 is QUALIFIED_WITH_PRECISION_REPAIR — `missing-ai-auth-python` only matches Flask, not FastAPI.

**Not all missing-* rules overclaim absence.** `missing-max-tokens` genuinely detects absence. The others detect concrete behavior patterns and should be renamed.
