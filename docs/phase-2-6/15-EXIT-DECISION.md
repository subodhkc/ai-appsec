# 15 — Exit Decision

## Decision

```
QUALIFIED_WITH_RULE_EXCLUSIONS
```

## Exclusions

33 detectors have `ruleBodyPublicationStatus: REDESIGN_REQUIRED`:

### Pattern Error (1)
```
ai-function-calling-js — regex parse error, cannot execute
```

### BLOCK Candidates That Failed Fixture Validation (9)
```
ai-tool-abuse-output-exec — negative/FP fixtures failed
dangerous-eval-exec-ai-output — positive fixture did not trigger
hardcoded-api-key-python — positive fixture did not trigger
hardcoded-api-key-js — did not fire in scan
hardcoded-anthropic-api-key-python — did not fire in scan
hardcoded-anthropic-api-key-js — did not fire in scan
hardcoded-openai-api-key — did not fire; FP fixture triggered wrong detector
api-key-in-url-python — did not fire in scan
api-key-in-url-js — did not fire in scan
```

### Control Gap — Pattern Cannot Prove Absence (17)
```
missing-llm-rate-limit-python/js
missing-max-tokens/js
missing-cost-tracking/js
missing-ai-auth-python/js
missing-input-validation-ai-python/js
missing-error-logging-ai-python/js
missing-data-minimization-python/js
missing-vectorstore-auth
unrestricted-similarity-search
missing-retrieved-context-validation
```

### Prompt Injection — Message Overstates Evidence (7)
```
ai-prompt-injection-openai/js
ai-prompt-injection-anthropic
ai-prompt-injection-langchain
ai-prompt-injection-llamaindex
ai-prompt-injection-huggingface
ai-prompt-injection-google
```

### FindingKind Reclassification (1)
```
ai-prompt-injection-langchain — VULNERABILITY → PRESENCE (behavioral evidence)
```

## Exit Gate

| Gate | Status |
|------|--------|
| 1. Semgrep 1.52 scan on Linux | PASS — Docker returntocorp/semgrep:1.52.0 |
| 2. All detectors have execution status | PASS — 121/121 |
| 3. Golden corpus ran | PASS — 107 fixtures |
| 4. Positive coverage measured | PASS — 23/80 (28.75%) |
| 5. No AMBIGUOUS groups remain | PASS — 0 AMBIGUOUS |
| 6. Behavioral parity ran | PASS — EXACT |
| 7. No unexplained parity difference | PASS — same file |
| 8. BLOCK based on fixture behavior | PASS — 0 confirmed, 9 redesign |
| 9. Metadata/rule-body statuses separate | PASS — schema 1.2 |
| 10. Performance baseline exists | PASS — in baseline/semgrep-1.52/ |
| 11. Private rule bodies untracked | PASS |
| 12. Read-only repos unchanged | PASS |
| 13. Nothing published/pushed/tagged/deployed | PASS |

## What Was NOT Done (Intentionally)

- Semgrep modernization (Phase 3)
- MCP tool registration
- Rule body redesign
- Rule body publication
- npm package publication
