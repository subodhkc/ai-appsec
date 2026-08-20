# 05 — Behavioral Parity

## Method

Under the same Linux Docker Semgrep 1.52.0 environment:
- A: Production-extracted rulepack (`ai-security-rules-extracted.yaml`)
- B: Candidate rulepack (same file — byte-for-byte copy)

Both run against the same golden corpus (107 fixtures).

## Result

```
parityStatus: EXACT
```

## Explanation

The candidate rulepack IS the production-extracted rulepack. The extraction was performed programmatically in Phase 2 by copying the `AI_SECURITY_RULES` string from `modal_ai_security_scanner.py`. No modifications were made.

Therefore, running both against the same fixtures produces identical results.

## Production Rulepack Hash

```
9c148cce0b4eaf9dc9e8ad72722ff000de4e91380b26ad56ff6ace8330b12194
```

## What This Proves

- The extraction is faithful (no data loss or corruption)
- The rulepack executes identically in the Docker Linux environment
- 165 findings are produced from 107 fixtures

## What This Does NOT Prove

- That the rules are correct (many fire on wrong fixtures)
- That the rules are complete (87 detectors did not fire at all)
- That the rules are ready for production use (BLOCK validation failed)
