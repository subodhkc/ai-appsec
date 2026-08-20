# 14 — Baseline Freeze

## Baseline ID

```
haiec-ai-security-semgrep152-baseline-v1
```

## Hashes

| Artifact | Hash (SHA-256, first 16 chars) |
|----------|-------------------------------|
| Production rulepack | `9c148cce0b4eaf9d` |
| Candidate manifest | `363fff2aaa5fa705` |
| Fixture set | 107 files (hashes in `fixture-hashes.json`) |
| Expected findings | 165 findings (in `expected-findings.json`) |

## Baseline Directory

```
baseline/semgrep-1.52/
  baseline-metadata.json
  environment.json
  expected-findings.json
  fixture-hashes.json
  performance.json
```

## What This Baseline Represents

The state of HAIEC AI Security rules as executed on Semgrep 1.52.0 in a Linux Docker container on 2026-08-16. This is the **behavioral truth** for modernization comparison.

## What Phase 3 Will Do with This

1. Run the same fixtures against the current stable Semgrep version (verified at Phase 3 time)
2. Compare findings against `expected-findings.json`
3. Identify any behavioral changes (new findings, missing findings, different line numbers)
4. Document migration impact

## Important Note

This is NOT a security certification. It is a behavioral baseline for engineering comparison.
