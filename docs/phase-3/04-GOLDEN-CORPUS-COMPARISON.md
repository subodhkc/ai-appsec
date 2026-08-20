# 04 — Golden Corpus Comparison

## Results

| Metric | Semgrep 1.52.0 | Semgrep 1.173.0 |
|--------|----------------|-----------------|
| Total findings | 165 | 165 |
| Unique findings | 143 | 143 |
| Errors | 1 | 1 |
| Detectors fired | 34 | 34 |

## Finding Identity

All 143 unique findings are **identical** between the two engines:

- Same detectorId
- Same relativePath
- Same startLine
- Same severity

**Zero differences in finding output.**

## Duplicate Findings

22 findings are duplicates (same detector+file+line+severity appearing multiple times). These duplicates exist in both engines equally — they are caused by the rulepack having overlapping patterns, not by engine behavior.

## Detectors Fired

Both engines fired the exact same 34 detectors. No detector was gained or lost.
