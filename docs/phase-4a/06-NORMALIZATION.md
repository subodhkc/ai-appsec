# Phase 4A — Normalization

## Manifest-driven mapping

The finding adapter consumes the canonical manifest rather than inventing
metadata. Each raw Semgrep finding is mapped to a canonical finding using:

- `securityCheckId` (from manifest detector → securityCheck mapping)
- `findingKind` (PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY)
- `canonicalSeverity` (from manifest, NOT Semgrep's default severity)
- `defaultDisposition` (INFORMATIONAL, REVIEW, BLOCK)
- `detectorIds` (which detector(s) produced this finding)

## Config-name prefix stripping

Semgrep prepends the config path to check_ids. The adapter strips this
prefix by taking everything after the last dot:
- `mvp-rc5.ai-sdk-together-python` → `ai-sdk-together-python`
- `C.Users....mvp-rc5.ai-sdk-together-python` → `ai-sdk-together-python`
- `scan.test-detector` → `test-detector`

This works because HAIEC detector IDs never contain dots.

## Unknown detector handling

If a Semgrep check_id does not match any manifest detector:
- The finding is NOT included in results
- The detector ID is recorded in `unknownDetectors`
- `manifestMismatch` is set to `true`
- No metadata is invented for unknown detectors

## Normalization rules

- **Collapse**: same `securityCheckId` + same `relativePath` + same
  `startLine` + same `evidenceHash` → merge detector IDs
- **Keep separate**: different securityCheckId, or different path, or
  different line, or different evidence hash
- **Raw count preserved**: `rawCount` always reflects pre-normalization count
- **Deterministic**: same input always produces same output

## Evidence hash

Computed from: `securityCheckId + relativePath + startLine + startColumn +
endLine + endColumn + message`. Uses SHA-256. Deterministic.

## Path handling

- Absolute paths converted to repository-relative
- Windows path separators normalized to forward slashes
- No absolute paths in output
- Suffix matching used when prefix matching fails (cross-platform)
