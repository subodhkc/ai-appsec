# 07 — Batch Results

## Calibration Test Results (Semgrep 1.52.0, Docker Linux)

### A. `ai-tool-abuse-output-exec` (TAINT)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Positive: AI output → os.system | YES | ✓ Correct |
| Negative: fixed `os.system("ls -la")` | NO | ✓ Correct |
| Negative: safe print of AI response | NO | ✓ Correct |
| Negative: unrelated AI call + fixed shell | NO | ✓ Correct |
| **BUT:** `subprocess.run("ls -la", shell=True)` (no AI) | YES | ✗ FALSE POSITIVE |
| **BUT:** `subprocess.run(cmd, shell=True)` (func param, no AI) | YES | ✗ FALSE POSITIVE |

**RULE STATUS:** WORKS_BUT_TOO_BROAD
**Root cause:** Semgrep 1.52.0 taint mode fires `subprocess.run(..., shell=True, ...)` sink regardless of taint flow when `...` is used in arguments. The `os.system(...)` and `eval(...)` sinks work correctly (require taint).
**TEST STATUS:** HISTORICAL_TEST_WRONG (expected `os.system("ls -la")` to fire — wrong reasoning, though `subprocess.run` would fire for wrong reason)

### B. `dangerous-eval-exec-ai-output` (PATTERN)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Positive: `eval(code)` where code is AI output | NO (in isolation) | ✗ Should fire |
| Negative: `eval("1+1")` | NO | ✓ Correct |

**RULE STATUS:** NEEDS_REPAIR
**Root cause:** Rule has `new Function($AI_OUTPUT)` (JavaScript syntax) in a `languages: [python, javascript, typescript]` rule. This causes a parse error in Python that invalidates the entire rule in isolation. In the full rulepack, Semgrep skips the invalid pattern and uses the valid ones.
**TEST STATUS:** PHASE26_FIXTURE_WRONG (fixture didn't account for the multi-language parse error)

### C. `ai-prompt-injection-openai` (PATTERN, not taint)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Safe API call (no user input) | YES (2 findings) | ✗ Over-matches |
| User input to prompt | YES (2 findings) | ✓ Correct |

**RULE STATUS:** WORKS_BUT_MESSAGE_OVERSTATES
**Root cause:** Pattern matches ANY `openai.chat.completions.create(...)` call. Cannot distinguish safe usage from injection. Message says "review for prompt injection" which is technically a review recommendation, but the rule name implies injection detection.
**TEST STATUS:** PHASE26_FIXTURE_CORRECT (fixture correctly showed the rule fires on API calls)

### D. `missing-data-minimization-python` (PATTERN)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Positive: `json.dumps(user.__dict__)` in prompt | YES | ✓ Correct |
| Negative: specific fields only | NO | ✓ Correct |

**RULE STATUS:** WORKS_BUT_NAME_MISLEADING
**Root cause:** Rule correctly detects entire object serialization to LLM. Name "missing-data-minimization" implies absence detection, but it actually detects concrete behavior.
**TEST STATUS:** PHASE26_FIXTURE_CORRECT

### E. `missing-max-tokens` (PATTERN)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Without max_tokens | YES | ✓ Correct |
| With max_tokens=100 | NO | ✓ Correct |

**RULE STATUS:** WORKS_AS_DESIGNED
**Root cause:** Pattern `openai.chat.completions.create(model=..., messages=...)` matches calls with EXACTLY model and messages (no additional args). When max_tokens is added, the pattern no longer matches.
**TEST STATUS:** PHASE26_FIXTURE_WRONG (Phase 2.6 classified this as LOGIC_ERROR/REDESIGN_REQUIRED — incorrect)

### F. `hardcoded-api-key-python` (PATTERN)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| Real key (`sk-proj-...`) | YES | ✓ Correct |
| Placeholder (`YOUR_API_KEY`) | YES | ✗ FALSE POSITIVE |
| Example key (`example-key`) | YES | ✗ FALSE POSITIVE |
| Env var (`os.environ.get(...)`) | NO | ✓ Correct |

**RULE STATUS:** WORKS_BUT_TOO_BROAD
**Root cause:** Pattern `API_KEY = "..."` matches any string literal, including placeholders. Needs `metavariable-regex` to validate key format.
**TEST STATUS:** PHASE26_FIXTURE_CORRECT

### G. `missing-ai-auth-python` (PATTERN)

| Test Case | Fired? | Correct? |
|-----------|--------|----------|
| No auth (FastAPI `@app.post`) | NO | ✗ Should fire |
| With decorator auth (FastAPI) | NO | ✓ Correct |

**RULE STATUS:** WORKS_BUT_TOO_NARROW
**Root cause:** Pattern only matches Flask-style `@app.route(...)`, not FastAPI-style `@app.post(...)` or `@app.get(...)`.
**TEST STATUS:** PHASE26_FIXTURE_WRONG (fixture used FastAPI but rule only supports Flask)

## Preliminary Full Classification

| Rule Status | Count | Notes |
|-------------|-------|-------|
| WORKS_AS_DESIGNED | ~101 | Most rules work correctly for their pattern syntax |
| WORKS_BUT_NAME_MISLEADING | 15 | `missing-*` rules that detect concrete behavior |
| WORKS_BUT_MESSAGE_OVERSTATES | 3 | Prompt injection rules that detect API calls |
| WORKS_BUT_TOO_BROAD | 1 | `hardcoded-api-key-python` (matches placeholders) |
| LOGIC_ERROR | 1 | `missing-max-tokens` — RECLASSIFIED to WORKS_AS_DESIGNED |
| NEEDS_REPAIR | 1 | `dangerous-eval-exec-ai-output` (JS pattern in Python rule) |
| PARSER_ERROR | 1 | `ai-function-calling-js` (regex error in 1.52, fixed in modern) |

**Note:** The `ai-tool-abuse-output-exec` taint false-positive issue is a Semgrep 1.52.0 engine behavior, not a rule logic error. The rule is correctly written; the engine's taint mode has a bug with `...` in sink arguments.
