# 03 — Production Call Graph

## Actual Runtime Path

```
User requests scan
    ↓
POST /api/ai-security/scan (route.ts)
    ↓
Consent check → Authorization → State machine → Trigger Modal
    ↓
Modal scanner (modal_ai_security_scanner.py)
    ↓
setup_rules() → writes AI_SECURITY_RULES to temp YAML
    ↓
run_semgrep() → semgrep --config <yaml> --json --metrics=off <repo>
    ↓
[Pre-validation: semgrep --validate, strip bad rules if needed]
    ↓
parse_semgrep_results() → Finding objects with Pydantic validation
    ↓
Severity mapping (category-based refinement)
    ↓
Store findings in database
    ↓
API response → UI
```

## Key Observations

1. **No TypeScript post-processing**: The Next.js API route triggers Modal and stores results. It does NOT run any TypeScript-based false-positive filtering or deterministic analysis on the Semgrep findings.

2. **Pre-validation stripping**: The scanner runs `semgrep --validate` first. If rules fail validation, it strips bad rules and creates a cleaned rules file. This means in production, `ai-function-calling-js` would be stripped (its regex error would be caught).

3. **Severity remapping**: The scanner remaps Semgrep severity (ERROR/WARNING/INFO) to HAIEC severity (CRITICAL/HIGH/MEDIUM/LOW) based on category and CWE. This is post-processing but does NOT filter findings — it only changes severity labels.

4. **Confidence assignment**: Confidence is hardcoded by Semgrep severity level (ERROR=0.95, WARNING=0.80, INFO=0.65). This is NOT empirical confidence — it's a fixed mapping.

5. **No deduplication**: The scanner does not deduplicate findings. If multiple patterns in the same rule match the same code, multiple findings are produced.
