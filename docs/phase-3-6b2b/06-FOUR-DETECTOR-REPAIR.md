# 06 — Four Detector Repair

## Defect Family 1: API Key in Logs

### Problem (rc.3)

`api-key-in-logs-python` and `api-key-in-logs-js` used cosmetic metavariable names (`$API_KEY`) that matched ANY expression passed to logging calls. This caused false positives on non-secret logging.

### Fix (rc.4)

Replaced cosmetic metavariables with `metavariable-regex` constraint that requires the variable name to match secret-like patterns:

```yaml
patterns:
  - pattern-either:
      - pattern: logging.debug(..., $KEY, ...)
      - pattern: logging.info(..., $KEY, ...)
      - pattern: logger.debug(..., $KEY, ...)
      - pattern: logger.info(..., $KEY, ...)
      - pattern: print(..., $KEY, ...)
  - metavariable-regex:
      metavariable: $KEY
      regex: "(?i).*(api_key|apikey|api-key|secret|token|password|passwd|credential|private_key|access_key|auth_token).*"
```

### Test Results

| Fixture | rc.3 | rc.4 |
|---|---|---|
| Positive (api-key-in-logs-python.py) | FIRED | FIRED |
| Positive (api-key-in-logs-js.js) | FIRED | FIRED |
| Negative | NOT FIRED | NOT FIRED |
| Falsepos | FIRED (FP) | NOT FIRED (fixed) |

## Defect Family 2: Dangerous Eval/Exec on AI Output

### Problem (rc.3)

`dangerous-eval-exec-ai-output-python` and `dangerous-eval-exec-ai-output-js` used cosmetic metavariable names (`$LLM_OUTPUT`, `$RESPONSE`) that matched ANY expression passed to eval/exec. This caused false positives on `eval("1 + 2")` without any AI source.

### Fix (rc.4)

Replaced cosmetic metavariables with Semgrep taint mode that tracks from AI invocation sources to dangerous sinks:

```yaml
mode: taint
pattern-sources:
  - pattern: $LLM.invoke(...)
  - pattern: openai.chat.completions.create(...)
  - pattern: $CLIENT.chat.completions.create(...)
  - pattern: anthropic.messages.create(...)
  - pattern: $CHAIN.run(...)
  - pattern: $CHAIN.invoke(...)
  ...
pattern-sinks:
  - pattern: eval(...)
  - pattern: exec(...)
```

### Test Results

| Fixture | rc.3 | rc.4 |
|---|---|---|
| Positive (dangerous-eval-exec-ai-output.py) | FIRED | FIRED |
| Negative | NOT FIRED | NOT FIRED |
| Falsepos (eval("1 + 2")) | FIRED (FP) | NOT FIRED (fixed) |

## Requalification

All 4 repaired detectors pass:
- Positive fixture PASS
- Negative fixture PASS
- FP/adversarial fixture PASS
- Parser PASS
- Message accurate
- findingKind accurate (VULNERABILITY)
- securityCheck mapping accurate
- severity accurate (ERROR)
- disposition accurate (BLOCK for taint-proven, REVIEW for logs)

All 4 detectors re-enter Public Core.
