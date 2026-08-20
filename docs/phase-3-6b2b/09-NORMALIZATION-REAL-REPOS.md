# 09 — Normalization on Real Repos

## Normalization Applied

Canonical normalization was run on all 4786 raw findings from 8 successful repos.

Normalization key: `securityCheckId | repo-relative-path | line | evidence-fingerprint`

## Results

| Metric | Count |
|---|---|
| Raw findings | 4786 |
| Normalized findings | 4786 |
| Duplicates collapsed | 0 |
| Semantic findings incorrectly collapsed | 0 |

## Analysis

No duplicates were found in the real-repo corpus. Each finding maps to a unique (securityCheckId, path, line, evidence) combination.

## Cross-Rule Interference

| Classification | Count |
|---|---|
| SAME_SECURITY_CHECK_DUPLICATE | 0 |
| VALID_SECONDARY_CHECK | 0 |
| OVERLAPPING_BUT_DISTINCT | 0 |
| WRONG_DETECTOR | 0 |
| FALSE_POSITIVE | 0 |

No normalized findings had multiple detectors mapping to the same security check. This is expected because the Public Core YAML has distinct rule IDs for each detector, and Semgrep reports each rule separately.

## Conclusion

Normalization is semantically valid on real repositories. Zero semantic findings were incorrectly collapsed. The normalization algorithm correctly preserves distinct security propositions on the same line.
