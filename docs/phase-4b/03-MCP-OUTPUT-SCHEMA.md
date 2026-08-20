# Phase 4B — MCP Output Schema

## Schema definition

The `outputSchema` is defined in `src/mcp/server-factory.ts` using Zod.
It validates the `structuredContent` returned by `scan_ai_security`.

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| schemaVersion | string | Output schema version |
| scanId | string | Deterministic scan identifier |
| verdict | enum | PASS \| REVIEW \| BLOCK \| ERROR |
| completeness | enum | COMPLETE \| PARTIAL \| UNSUPPORTED \| ERROR |
| completenessReasons | string[] | Why completeness is not COMPLETE |
| summary | object | File counts and finding totals |
| actionableFindings | array | Up to 20 actionable findings |
| observations | array | Up to 10 PRESENCE observations |
| limitations | string[] | Scan limitations |
| versions | object | Scanner/rulepack/manifest/Semgrep versions |
| truncation | object | Returned vs total counts |
| errors | array | Structured error objects |

### Finding fields

Each finding in `actionableFindings` and `observations`:

| Field | Type |
|-------|------|
| securityCheckId | string |
| canonicalName | string |
| findingKind | PRESENCE \| RISK_SIGNAL \| CONTROL_GAP \| VULNERABILITY |
| canonicalSeverity | CRITICAL \| HIGH \| MEDIUM \| LOW \| INFO |
| defaultDisposition | INFORMATIONAL \| REVIEW \| BLOCK |
| relativePath | string |
| startLine | number |
| startColumn | number |
| endLine | number |
| endColumn | number |
| detectorIds | string[] |
| message | string |
| evidenceHash | string |
| remediationClass | string |
| scope | PRODUCTION \| NON_PRODUCTION |

## Validation

The MCP SDK validates `structuredContent` against `outputSchema`. If
validation fails, `isError` is set to `true` and the error message is
returned in text content.

## Severity mapping

Manifest severity values are mapped to the canonical enum:
- `ERROR` → `CRITICAL`
- `WARNING` → `MEDIUM`
- `INFORMATIONAL` → `INFO`
