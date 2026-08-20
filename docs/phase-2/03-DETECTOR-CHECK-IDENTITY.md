# 03 — Detector ID vs Logical Check ID

## Two Stable Identities

### detectorId

Uniquely identifies an executable Semgrep detector definition.

Example: `ai-agent-loop-python`

- One detectorId per rule definition in the YAML
- 121 unique detectorIds in the production rulepack
- Stable: does not change unless the detector is renamed

### checkId

Groups detectors representing the same logical security check across languages.

Example: `R6.1`

- One checkId per logical check group
- 80 unique checkIds in the production rulepack
- Derived by stripping the language suffix (`-python`, `-js`) from the detectorId
- Stable: does not change when language splits are added or removed

## Why Two IDs?

The old system used a single ambiguous `ruleId` for both concepts. This led to the false claim that "121 rules = 121 security protections." In reality:

- 121 detector definitions
- 80 logical security checks
- 41 of the 121 detectors are language-specific variants of the same check

## Mapping Method

```
detectorId: ai-agent-loop-python  →  checkId: R6
detectorId: ai-agent-loop-js      →  checkId: R6
```

The checkId is assigned by sorting all unique check bases alphabetically and numbering them R1 through R80.

## Phase 0 Finding Contract Impact

The Phase 0 Finding contract currently uses `ruleId`. This phase recommends adding two additive fields:

```ts
interface Finding {
  // existing fields...
  detectorId?: string;  // additive, future
  checkId?: string;     // additive, future
}
```

This is a non-breaking, additive change. The existing `ruleId` field is preserved for backward compatibility.
