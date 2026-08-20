# 10 — Cross-Rule Interference

## Methodology

All 4786 normalized findings were inspected for cases where one source construct causes multiple detectors to fire.

## Results

| Classification | Count |
|---|---|
| SAME_SECURITY_CHECK_DUPLICATE | 0 |
| VALID_SECONDARY_CHECK | 0 |
| OVERLAPPING_BUT_DISTINCT | 0 |
| WRONG_DETECTOR | 0 |
| FALSE_POSITIVE | 0 |

## Analysis

No cross-rule interference was detected in the real-repo corpus. This is because:

1. Each detector in the Public Core has a unique rule ID
2. Semgrep reports each rule separately
3. The normalization algorithm groups by securityCheckId, and no two detectors mapping to the same securityCheckId fired on the same evidence location

## Multi-Detector Findings

0 normalized findings had multiple detectors. This means no source construct triggered multiple detectors at the same location.

## Note on BLOCK Detectors

The two BLOCK-eligible detectors (`ai-tool-abuse-output-exec` and `dangerous-eval-exec-ai-output-python`) both detect AI output to eval/exec, but they map to different securityCheckIds. In the block-revalidation fixture, both fired on the same lines. This is expected behavior — they are separate detectors for the same security proposition. The normalization algorithm correctly preserves them as separate findings because they have different securityCheckIds.

In a future manifest consolidation, these could be merged into a single securityCheckId. For now, they remain separate.
