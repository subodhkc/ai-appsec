# Version Identity Matrix

> Phase 4C-A — Explicit version identity reconciliation for release candidate qualification.

## Version Domains

The HAIEC Agent Security MCP has FOUR distinct version domains. They may differ
and the relationship must be explicit.

### 1. PACKAGE VERSION

| Field | Value | Location |
|-------|-------|----------|
| package.json `version` | `0.0.0` | `package.json` |
| package.json `private` | `true` | `package.json` |
| MCP `SERVER_VERSION` | `0.0.0` | `src/mcp/protocol.ts:17` |
| MCP `SERVER_NAME` | `haiec-agent-security` | `src/mcp/protocol.ts:12` |

**Note:** Package version `0.0.0` is intentional for pre-release. It will be
bumped to `0.1.0` at publication time (Phase 4C-B, not yet authorized).

### 2. PUBLIC CORE RULEPACK VERSION

| Field | Value | Location |
|-------|-------|----------|
| `rulepackVersion` | `0.1.0-rc.6-public-core` | `rules/public-core/manifest.json` |
| `PUBLIC_CORE_VERSION` | `0.1.0-rc.6-public-core` | `src/engines/ai-security/rulepack-provider.ts:44` |
| `PUBLIC_CORE_EXPECTED_RULEPACK_DIGEST` | `sha256:013e2da0...` | `src/engines/ai-security/rulepack-provider.ts:40-41` |
| `PUBLIC_CORE_EXPECTED_MANIFEST_DIGEST` | `sha256:2117f9b9...` | `src/engines/ai-security/rulepack-provider.ts:42-43` |
| `manifestSchemaVersion` | `1.0.0` | `rules/public-core/manifest.json` |
| `manifestVersion` | `1.0.0` | `rules/public-core/manifest.json` |

**Per-detector revision tracking:**
- 120 detectors: `revision: "rc.5"` (unchanged from rc.5)
- 2 detectors: `revision: "rc.6"` (changed in C2R — `api-key-in-error-js`, `api-key-in-error-python`)

**Relationship:** The rulepack version tracks the overall rulepack release.
Individual detector revisions track when each detector last had a semantic
change. This is a valid per-detector revision model.

### 3. MCP CONTRACT VERSION

| Field | Value | Location |
|-------|-------|----------|
| `SERVER_NAME` | `haiec-agent-security` | `src/mcp/protocol.ts:12` |
| `SERVER_VERSION` | `0.0.0` | `src/mcp/protocol.ts:17` |
| MCP SDK | `@modelcontextprotocol/server` 2.0.0 | `package.json` |

### 4. SCAN RECEIPT VERSION

| Field | Value | Location |
|-------|-------|----------|
| `RECEIPT_SCHEMA_VERSION` | `0.1.0` | `src/engines/ai-security/scan-receipt.ts:16` |
| `RECEIPT_VERSION` | `0.1.0` | `src/engines/ai-security/scan-receipt.ts:19` |
| `SCANNER_VERSION` | `0.1.0` | `src/engines/ai-security/scanner.ts:163` |

### 5. AGGREGATION / PRIORITY / PROOF-OF-FIX VERSIONS

| Field | Value | Location |
|-------|-------|----------|
| `ISSUE_AGGREGATION_VERSION` | `0.1.0` | `src/engines/ai-security/security-concern.ts:38` |
| `CONCERN_PRIORITY_VERSION` | `0.1.0` | `src/engines/ai-security/concern-priority.ts:20` |
| `PROOF_OF_FIX_SCHEMA_VERSION` | `0.1.0` | `src/engines/ai-security/proof-of-fix.ts:59` |

### 6. SEMGREP ENGINE VERSION

| Field | Value | Location |
|-------|-------|----------|
| `REQUIRED_SEMGREP_VERSION` | `1.173.0` | `src/engines/ai-security/semgrep-resolver.ts:31` |
| `verifiedDigest` | `sha256:67319956...` | `rules/public-core/manifest.json` |
| `verifiedPlatform` | `linux/amd64` | `rules/public-core/manifest.json` |

## Stale Reference Audit

### rc.5 references in documentation (HISTORICAL — correct)

- `PHASES.md:706` — historical note about rc.5 private == public core
- `PHASES.md:938` — documents the rc.5 → rc.6 bump (historical)
- `PHASES.md:940` — documents manifest digest update (historical)

### rc.5 references in manifest.json (PER-DETECTOR — correct for unchanged)

- 120 detectors retain `revision: "rc.5"` — their semantics did not change
- 2 detectors updated to `revision: "rc.6"` — their semantics changed in C2R

### No stale rc.5 references found in:
- README.md (no version references)
- doctor.ts (uses runtime values, no hardcoded rc.5)
- setup.ts (uses runtime values, no hardcoded rc.5)
- MCP structured output (uses runtime values from scanner)
- Scan Receipt (uses runtime values from scanner)

## Version Relationship Summary

```
Package Version:     0.0.0 (pre-release, private:true)
                     ↓
Rulepack Version:    0.1.0-rc.6-public-core
                     ↓
MCP Contract:        0.0.0 (matches package)
                     ↓
Scan Receipt:        0.1.0 (stable contract version)
                     ↓
Aggregation:         0.1.0 (stable contract version)
Priority:            0.1.0 (stable contract version)
Proof-of-Fix:        0.1.0 (stable contract version)
```

**Conclusion:** Version identity is consistent. No stale rc.5 semantics are
presented as current rc.6 semantics. The per-detector revision model is valid
and correctly reflects which detectors changed in rc.6.
