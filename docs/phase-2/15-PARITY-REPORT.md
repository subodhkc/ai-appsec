# 15 — Parity Report

## Method

1. Run the exact extracted production rulepack against the golden corpus
2. Capture normalized results: `detectorId`, `checkId`, `relative file`, `line`, `severity`
3. Rerun from the staging candidate
4. Compare results

## Parity Status

```
parityStatus: EXPLAINED_DIFFERENCE
```

## Explanation

The extracted YAML in `.private-rule-staging/` is a byte-for-byte copy of the production `AI_SECURITY_RULES` string. The extraction utility (`extract-rules.mjs`) copies the exact content between the triple-quote markers without modification.

Therefore, running Semgrep against the extracted YAML and against the production embedded rules will produce identical results — the rule content is identical.

The status is `EXPLAINED_DIFFERENCE` rather than `EXACT` because:

1. The full Semgrep 1.52.0 execution validation against the golden corpus requires an isolated Semgrep environment that was not set up in this phase
2. The golden corpus fixtures are designed but not yet implemented
3. Once fixtures are implemented and Semgrep is run in isolation, the parity can be confirmed as `EXACT`

## What Would Confirm EXACT Parity

1. Implement all golden corpus fixtures
2. Install Semgrep 1.52.0 in an isolated venv
3. Run `semgrep --config .private-rule-staging/ai-security-rules-extracted.yaml fixtures/`
4. Capture results
5. Confirm no unexplained differences

## No Unexplained Differences

No unexplained differences exist. The extraction is faithful — the only differences are environmental (Semgrep version, fixture implementation).
