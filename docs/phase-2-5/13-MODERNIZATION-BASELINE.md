# 13 — Modernization Baseline

## Baseline Directory

```
baseline/semgrep-1.52/
  baseline-metadata.json
  fixture-hashes.json
```

## Baseline Metadata

| Field | Value |
|-------|-------|
| baselineVersion | 0.1.0-candidate.1 |
| semgrepVersion | 1.52.0 |
| sourceCommit | d0ed945d |
| sourceRulepackHash | 9c148cce0b4eaf9d... |
| manifestHash | 22e4897bb3a5a86b... |
| detectorCount | 121 |
| logicalCheckCount | 80 |
| fixtureCount | 107 |
| semgrepExecutionStatus | DEFERRED_REQUIRES_UNIX |

## What Is Tracked

- Fixture hashes (107 synthetic fixtures)
- Normalized expected findings (pending Semgrep execution)
- Detector IDs and check IDs
- Semgrep version
- Candidate rulepack hash

## What Is NOT Tracked

- Rule bodies (remain in `.private-rule-staging/`)
- Private HAIEC source code
- Customer code

## How Phase 3 Will Use This

Phase 3 (Semgrep modernization) will:
1. Run the same fixtures against the current stable Semgrep version
2. Compare results against this 1.52.0 baseline
3. Identify any behavioral changes
4. Document migration impact

## Important Note for Phase 3

The current stable Semgrep version must be verified **at the time Phase 3 runs**. Do not hardcode a remembered future version.
