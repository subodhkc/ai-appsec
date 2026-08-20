# 04 — Contracts

> Phase 0 document. Summary of shared contract types.

## Finding (`src/contracts/finding.ts`)

Canonical finding representation with:
- `schemaVersion`, `findingId`, `findingFingerprint?`
- `engine`, `engineVersion`, `ruleId`, `ruleRevision?`
- `findingKind`: PRESENCE | RISK_SIGNAL | CONTROL_GAP | VULNERABILITY
- `severity`: CRITICAL | HIGH | MEDIUM | LOW | INFO
- `defaultDisposition`: INFORMATIONAL | REVIEW | BLOCK
- `location`: relativePath, line/column range
- `evidence`: sanitizedSummary?, evidenceHash?
- `references`: cwe[], owasp[], other[]
- No uncalibrated numeric confidence
- No absolute paths

## EngineResult (`src/contracts/result.ts`)

- `status`: PASSED | FINDINGS | NOT_APPLICABLE | PARTIAL | SKIPPED | FAILED
- `coverage`: scope + limitations
- `findings`, `errors`
- `observational`: scanStartedAt?, durationMs?, executionId? (excluded from digests)

## Verdict (`src/contracts/verdict.ts`)

- `level`: PASS | REVIEW | BLOCK | ERROR
- 0 findings does NOT automatically equal PASS
- `enginesContributing`, `enginesSkipped` with reasons
- `requiresHumanReview`

## Tool (`src/contracts/tool.ts`)

Four tool descriptors with positive/negative use cases, read-only annotations.
All marked `implemented: false` in Phase 0.

## Error (`src/contracts/errors.ts`)

12 error codes: ENGINE_NOT_INTEGRATED, ENGINE_UNAVAILABLE, UNSUPPORTED_SCOPE,
PATH_OUTSIDE_ROOT, SYMLINK_ESCAPE, INVALID_INPUT, UNSUPPORTED_LANGUAGE,
PARTIAL_COVERAGE, SCAN_FAILED, DEPENDENCY_MISSING, RATE_LIMITED, INTERNAL_ERROR.

## Artifact (`src/contracts/artifact.ts`)

ArtifactRef contract for future SCAN_RECEIPT, FINDINGS, SARIF, SUMMARY.
No implementation — contract only.
