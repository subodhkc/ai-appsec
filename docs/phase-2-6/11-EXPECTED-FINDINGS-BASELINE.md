# 11 — Expected Findings Baseline

## File

```
baseline/semgrep-1.52/expected-findings.json
```

## Contents

165 normalized findings, each containing:

```json
{
  "detectorId": "ai-openai-import",
  "checkId": "ai-openai-import",
  "relativePath": "ai-openai-import.py",
  "startLine": 1,
  "severity": "INFO"
}
```

## Purpose

This is the behavioral baseline against which Phase 3 (Semgrep modernization) will compare. When the same rulepack runs on a newer Semgrep version, any difference in findings indicates a behavioral change.

## What Is NOT Included

- Rule bodies (patterns)
- Private HAIEC source code
- Customer code
- Full file paths (only relative filenames)

## Fixture Hashes

```
baseline/semgrep-1.52/fixture-hashes.json
```

107 fixture hashes (SHA-256) for deterministic verification that fixtures haven't changed between phases.
