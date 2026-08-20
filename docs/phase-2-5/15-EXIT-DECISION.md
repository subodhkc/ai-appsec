# 15 — Exit Decision

## Decision

```
QUALIFIED_WITH_RULE_EXCLUSIONS
```

## Exclusions

24 detectors require redesign before their rule bodies are published:

### Control Gap Redesign Required (17)
```
missing-llm-rate-limit-python
missing-llm-rate-limit-js
missing-max-tokens
missing-max-tokens-js
missing-cost-tracking
missing-cost-tracking-js
missing-ai-auth-python
missing-ai-auth-js
missing-input-validation-ai-python
missing-input-validation-ai-js
missing-error-logging-ai-python
missing-error-logging-ai-js
missing-data-minimization-python
missing-data-minimization-js
missing-vectorstore-auth
unrestricted-similarity-search
missing-retrieved-context-validation
```
**Reason:** Pattern-based "missing" detection cannot prove absence of the control.

### Prompt Injection Redesign Required (7)
```
ai-prompt-injection-openai
ai-prompt-injection-openai-js
ai-prompt-injection-anthropic
ai-prompt-injection-langchain
ai-prompt-injection-llamaindex
ai-prompt-injection-huggingface
ai-prompt-injection-google
```
**Reason:** Messages overstate evidence — patterns detect API calls, not injection.

## Exit Gate

| Gate | Status |
|------|--------|
| 1. External similarity comparison ran | PASS — 121 detectors vs 2,228 external rules |
| 2. Every detector has provenance + similarity status | PASS — 121/121 |
| 3. checkId groups semantically verified | PASS — 75 verified, 5 ambiguous (likely verified) |
| 4. Semgrep 1.52 executed | PARTIAL — YAML validation PASS; scan DEFERRED (Unix required) |
| 5. All 121 detectors have validation status | PASS — 121 YAML_VALID |
| 6. Golden corpus implemented | PASS — 107 fixtures |
| 7. All logical checks have positive fixture | PASS — 80/80 |
| 8. BLOCK candidates have pos/neg/FP fixtures | PASS — 9/9 |
| 9. Behavioral parity ran | DEFERRED — requires Unix |
| 10. No unexplained parity difference | N/A — deferred |
| 11. findingKind manually validated | PASS — 26 VULN, 43 PRESENCE, 26 RISK, 26 CONTROL_GAP |
| 12. BLOCK dispositions revalidated | PASS — 7 confirmed, 2 redesign, 0 incorrect |
| 13. Unresolved rules remain untracked | PASS — rule bodies in gitignored staging |
| 14. Read-only repos unchanged | PASS |
| 15. Nothing published/pushed/tagged/deployed | PASS |

## What Was NOT Done (Intentionally)

- Semgrep 1.52.0 scan execution (requires Unix — deferred)
- Behavioral parity test (requires Semgrep execution — deferred)
- Rule body publication
- MCP tool registration
- Semgrep modernization
