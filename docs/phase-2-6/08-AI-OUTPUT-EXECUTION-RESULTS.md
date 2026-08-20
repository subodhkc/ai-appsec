# 08 — AI Output Execution Results

## Detectors Inspected

```
ai-tool-abuse-output-exec
dangerous-eval-exec-ai-output
```

## `ai-tool-abuse-output-exec`

### Pattern Analysis
The detector is supposed to find AI output flowing to code execution (subprocess, shell, etc.).

### Scan Behavior
- **Fired in scan:** YES (4 findings)
- **Positive fixture:** PASS — fired on `subprocess.run(ai_output, shell=True)`
- **Negative fixture:** FAIL — `ai-openai-import` and `ai-prompt-injection-openai` fired on the negative fixture (which uses `print()` not execution)
- **False-positive fixture:** FAIL — same broad detectors fired

### Does It Establish AI-Controlled Output → Execution?

**Partially.** The detector fires on `subprocess.run(ai_output, shell=True)` which does show AI output going to execution. However:
- It does NOT use taint analysis to track that `ai_output` actually came from an LLM
- It would fire on any variable named `ai_output` even if it's hardcoded
- The negative fixture failure is caused by OTHER detectors, not this one

### Classification: `REDESIGN_BEFORE_BLOCK`

The detector itself has reasonable semantics but:
1. Cannot prove the data is AI-controlled (no taint tracking)
2. The overall scan environment produces too many false positives from broad detectors
3. BLOCK requires all fixture tests to pass, and the negative/FP fixtures fail (due to other detectors)

## `dangerous-eval-exec-ai-output`

### Pattern Analysis
The detector is supposed to find AI output flowing to `eval()` or `exec()`.

### Scan Behavior
- **Fired in scan:** YES (1 finding)
- **Positive fixture:** FAIL — `ai-prompt-injection-openai` and `ai-openai-import` fired instead of this detector
- **No negative or FP fixtures** for this specific detector

### Does It Establish AI-Controlled Output → Execution?

**No.** The detector did not fire on its own positive fixture. The fixture contains:
```python
response = openai.ChatCompletion.create(...)
code = response.choices[0].message.content
eval(code)
```

But `ai-prompt-injection-openai` fired instead (because it matches any OpenAI API call). The eval detector's pattern likely doesn't match this specific code structure.

### Classification: `REDESIGN_BEFORE_BLOCK`

The detector:
1. Does not use taint analysis
2. Does not fire on its intended positive fixture
3. Cannot prove the eval'd content is AI-controlled

## Comparison with External Rules

The external semgrep-rules repo has `llm-output-to-exec-python` which uses **taint mode**:
```yaml
mode: taint
pattern-sources:
  - pattern: $CLIENT.chat.completions.create(...)
pattern-sinks:
  - pattern: eval($SINK)
```

This is the correct approach. HAIEC rules should be redesigned to use taint mode.
