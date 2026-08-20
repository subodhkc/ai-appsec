# Normalized Public Finding Model Specification

## Two-Layer Architecture

### Layer 1: RAW DETECTOR FINDINGS
All underlying Semgrep detector results are preserved unmodified. Each raw finding contains:
- `check_id` (detector ID)
- `path` (repo-relative file path)
- `start_line`, `end_line`, `start_col`, `end_col`
- `severity`
- `message`
- `metadata` (rule_id, cwe, category, etc.)

Raw findings are never destroyed or modified.

### Layer 2: NORMALIZED HAIEC FINDINGS
User/MCP-facing findings grouped by semantic security check. Each normalized finding:
- `normalizedFindingId` (deterministic hash of grouping key)
- `securityCheckId` (from manifest)
- `canonicalName` (from manifest)
- `findingKind` (PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY)
- `defaultDisposition` (INFORMATIONAL, REVIEW, BLOCK)
- `path` (repo-relative file path)
- `lineRange` (start_line, end_line)
- `detectorIds[]` (list of detector IDs that fired at this location)
- `severity` (highest severity among raw findings)
- `message` (canonical message from manifest, not raw detector message)
- `evidenceFingerprint` (hash of raw finding details for provenance)

## Grouping Key

A normalized finding groups raw detector findings that:
1. Share the same `securityCheckId` (semantic check)
2. Occur at the same repo-relative file path
3. Overlap on line range (same line or adjacent lines within 3 lines)

## Deterministic Normalization

```
normalizedFindingId = SHA256(
  securityCheckId + ":" +
  path + ":" +
  min(start_line for all raw findings in group) + ":" +
  max(end_line for all raw findings in group)
)
```

## Duplicate Resolution

- Multiple raw findings from the SAME detector at the SAME location → collapse to one normalized finding (deduplication)
- Multiple raw findings from DIFFERENT detectors for the SAME security check at the SAME location → collapse to one normalized finding with `detectorIds[]` listing all contributing detectors
- Raw findings from different security checks at the same location → SEPARATE normalized findings (do not collapse different propositions)

## Severity Resolution

When multiple raw findings contribute to one normalized finding:
- `severity` = highest severity among raw findings (ERROR > WARNING > INFO)
- This is advisory metadata, not a deploy/block decision

## What This Does NOT Do

- Does NOT destroy raw evidence
- Does NOT collapse genuinely different security propositions
- Does NOT auto-suppress findings
- Does NOT make deploy/block decisions
- Does NOT calculate FP rates

## Testing

Normalization is tested by:
1. Running full-pack scan → raw findings
2. Applying normalization → normalized findings
3. Verifying: every raw finding is accounted for in exactly one normalized finding
4. Verifying: normalized finding IDs are deterministic across runs
5. Verifying: same-line duplicates are collapsed
