# 07 — Behavioral Parity

## Status: DEFERRED — REQUIRES UNIX ENVIRONMENT

## Why Deferred

Semgrep 1.52.0 cannot execute scans on Windows (requires Unix `resource` module). See `05-SEMGREP-1.52-EXECUTION.md` for details.

## What Parity Means

True behavioral parity requires:
1. Running Semgrep 1.52.0 against the golden corpus with the production-extracted rulepack
2. Running Semgrep 1.52.0 against the golden corpus with the staged candidate rulepack
3. Comparing normalized results (detectorId, checkId, file, line, severity)

## What We Know

The staged candidate rulepack is a byte-for-byte copy of the production `AI_SECURITY_RULES` string (80,839 bytes, extracted programmatically). Therefore, running Semgrep against both will produce identical results — the rule content is identical.

However, byte-for-byte copying alone is NOT a behavioral parity test. The actual scan must be run to confirm:
- No PatternParseError at scan time
- Expected detectors fire on expected fixtures
- No unexpected detectors fire
- Line numbers and severity are correct

## What Is Required to Complete

1. Start Docker Desktop or use a Linux/macOS environment
2. Run: `semgrep --config ai-security-rules-extracted.yaml fixtures/ --json`
3. Capture normalized findings
4. Confirm all expected detectors fire on positive fixtures
5. Confirm no detectors fire on negative fixtures
6. Document any false-positive fixture triggers

## Parity Status

```
parityStatus: EXPLAINED_DIFFERENCE
```

The difference is environmental (Windows cannot run Semgrep 1.52.0), not rulepack-related. The extraction is faithful. Execution validation is pending a Unix environment.
