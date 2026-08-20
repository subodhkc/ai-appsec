# Public Package Positioning Correction

## Phase 4C-C — Part 8

## Current Description (OVERSTATED)

```
"Agent-native AI security orchestration layer for MCP-compatible coding agents"
```

## Problem

The v0.1 MCP owns **STATIC SECURITY EVIDENCE** only.
It does NOT own full HAIEC orchestration/system assurance.

Calling it an "orchestration layer" exceeds the v0.1 product boundary.
Only `scan_ai_security` is implemented. The other three tools are
contract-only.

## Recommended Description

```
"Deterministic static security evidence for AI-agent code via MCP."
```

Alternative (slightly more descriptive):

```
"Local-first static security evidence for AI-agent code with coverage,
Receipts, and concern-family grouping."
```

## Forbidden Positioning for v0.1

- "complete assurance platform"
- "full orchestration layer"
- "compliance engine"
- "runtime assurance system"
- "production ready"
- "enterprise ready"

## Status

**RECOMMENDATION_PREPARED** — The description change is a package-byte-affecting
change. It will be applied in RC2 after human review confirms the wording.
