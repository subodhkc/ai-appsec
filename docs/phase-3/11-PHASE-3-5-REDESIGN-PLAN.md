# 11 — Phase 3.5 Redesign Plan

## Logical Check Classification

Based on Phase 2.6 behavioral data and Phase 3 engine comparison:

| Classification | Count | Description |
|----------------|-------|-------------|
| KEEP_AS_IS_CANDIDATE | ~23 | Has measured positive coverage, correct behavior |
| REPAIR | ~20 | Pattern syntax issues, minor message fixes |
| REWRITE | ~15 | Fundamental pattern approach is wrong |
| MERGE | ~5 | Language variants should be single taint rule |
| DEPRECATE | ~10 | Cannot work with pattern matching, no viable fix |
| REPLACE_WITH_TAINT_RULE | ~7 | Prompt injection, AI output to exec |
| REPLACE_WITH_DIFFERENT_ANALYSIS | ~10 | Control gaps, missing-* rules |

## Priority Redesign Groups

### 1. Prompt Injection (7 detectors → REPLACE_WITH_TAINT_RULE)

**Current:** Detect any AI API call, label as "prompt injection"
**Problem:** Fires on all API calls, not injection
**Future:** Use Semgrep taint mode:
```yaml
mode: taint
pattern-sources:
  - pattern: request.$INPUT
  - pattern: input(...)
pattern-sinks:
  - pattern: $LLM.chat($PROMPT)
  - pattern: $LLM.messages.create(messages=[..., {"role": "user", "content": $PROMPT}])
```
Track: untrusted source → prompt construction → LLM sink

### 2. Secrets (9 detectors → REPAIR + REWRITE)

**Current:** Match any string in API key parameter
**Problem:** Cannot distinguish real keys from placeholders
**Future:**
- Add `metavariable-regex` with key format patterns (`^sk-proj-`, `^sk-ant-`, `^AIza`)
- Exclude placeholders (`YOUR_API_KEY`, `example`, `sk-xxxx`, `test`)
- Consider entropy for unknown formats
- Use `pattern-not` to exclude test/documentation contexts

### 3. CONTROL_GAP / missing-* (17 detectors → REPLACE_WITH_DIFFERENT_ANALYSIS or DEPRECATE)

**Current:** Detect API call without nearby control, claim control is "missing"
**Problem:** Cannot prove repository-wide absence
**Future options:**
- **Repository-wide analysis:** Scan for control patterns across entire repo (not single-file)
- **Configuration analysis:** Check config files for control settings
- **Deprecate:** Remove rules that cannot work with pattern matching
- **Reclassify:** Change from CONTROL_GAP to RISK_SIGNAL with "consider adding" message

### 4. AI Output → Execution (2 detectors → REPLACE_WITH_TAINT_RULE)

**Current:** Detect eval/exec near AI API call
**Problem:** No data flow tracking; fires on any eval in file with API call
**Future:** Use Semgrep taint mode:
```yaml
mode: taint
pattern-sources:
  - pattern: $CLIENT.chat.completions.create(...)
  - pattern: $CLIENT.messages.create(...)
pattern-sinks:
  - pattern: eval($SINK)
  - pattern: exec($SINK)
  - pattern: subprocess.run($SINK, ..., shell=True)
  - pattern: os.system($SINK)
```

## Phase 3.5 Scope

1. Fix `ai-prompt-injection-langchain` pattern syntax (Python, not JS)
2. Fix `ai-function-calling-js` regex (already fixed by modern engine)
3. Redesign prompt injection rules with taint mode
4. Redesign AI output execution rules with taint mode
5. Add metavariable-regex to secret detection rules
6. Reclassify or deprecate missing-* control gap rules
7. Build MVP subset (15-25 high-confidence checks)
8. Expand golden corpus for redesigned rules
9. Validate MVP against fixtures
10. Do NOT integrate MCP yet
