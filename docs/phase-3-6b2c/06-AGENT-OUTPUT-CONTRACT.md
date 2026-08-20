# 06 — Agent Output Contract

## Architecture: Two Layers

### RAW EVIDENCE LAYER
- Complete raw Semgrep findings
- Preserved internally
- Not returned to agent by default
- Future pagination/detail tooling may expose subsets

### AGENT DECISION LAYER
- Bounded, prioritized, normalized findings
- Returned in MCP tool response
- Summary + actionable findings + observations + limitations

## Output Structure

```
summary
  scanStatus: COMPLETE | PARTIAL | UNSUPPORTED | ERROR
  completenessReasons: string[]
  vulnerabilityCount: exact
  controlGapCount: exact
  riskSignalCount: exact
  presenceCount: exact
  blockCount: exact
  reviewCount: exact
  informationalCount: exact
  totalNormalizedFindings: exact
  rawFindingCount: exact
  filesTargeted / filesScanned / filesIntentionallyExcluded
  filesSkippedByEngine / filesUnscannedDueToTimeout / filesUnscannedDueToError
  durationSeconds
  engineVersion / rulepackVersion / rulepackDigest

actionableFindings[]  (max 50)
  securityCheckId / canonicalName / findingKind
  canonicalSeverity / defaultDisposition
  path / line / detectorIds[] / message
  remediationClass / scope (PRODUCTION | NON_PRODUCTION)

observations[]  (max 20, PRESENCE only)
  securityCheckId / canonicalName / path / line / message

limitations[]
  limitation / impact
```

## Key Design Decisions

1. **PRESENCE findings are NOT in actionableFindings.** They are inventory observations (e.g., "OpenAI SDK imported"). They go in observations[] with a separate count in summary.

2. **Summary counts are ALWAYS exact.** Even when actionable findings are truncated, the summary reports the true total.

3. **Raw evidence is NOT discarded.** rawFindingCount is always reported. Raw findings are preserved internally.

4. **No hidden AI scoring.** Prioritization is deterministic and reproducible.
