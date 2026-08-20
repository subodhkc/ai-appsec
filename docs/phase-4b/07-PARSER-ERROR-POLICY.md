# Phase 4B — Parser Error Policy

## Observed parser errors

anthropic-sdk-typescript: 2 parse errors → PARTIAL completeness

## Policy

1. Parse errors are reported as `filesSkippedByEngine` in summary
2. Parse errors are reported as limitations: "2 files had parse errors"
3. Completeness is set to PARTIAL (not ERROR — most files scanned successfully)
4. Raw parser stack traces are NOT dumped to the agent
5. The user receives a meaningful limitation message

## Error classification

| Type | Handling |
|------|----------|
| Unsupported syntax | PARTIAL, limitation message |
| Generated file | PARTIAL, limitation message |
| Semgrep parser defect | PARTIAL, limitation message |
| Invalid source | PARTIAL, limitation message |
| Rule-specific parser issue | PARTIAL, limitation message |

All types result in PARTIAL completeness with a limitation message.
We do not attempt to classify the parser error type automatically —
Semgrep does not provide this metadata reliably.
