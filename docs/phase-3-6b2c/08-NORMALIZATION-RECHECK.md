# 08 — Normalization Recheck

## After Semantic Changes

Phase 2C made two changes affecting normalization:
1. Merged 2 BLOCK checks into 1 (HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION)
2. Fixed XSS/SSRF JS detectors with taint mode (rc.5)

## Recheck Results

Normalization was rerun on the focused real-repo reruns (openai-node, llama_index with rc.5):

| Repo | Raw Findings | Normalized | Duplicates Collapsed | Wrongly Collapsed |
|---|---|---|---|---|
| openai-node (rc.5) | 276 | 276 | 0 | 0 |
| llama_index (rc.5) | 703 | 703 | 0 | 0 |

## Analysis

- 0 duplicates collapsed — each finding maps to a unique (securityCheckId, path, line, evidence) combination
- 0 semantic findings wrongly collapsed
- The merged BLOCK check (HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION) has 3 detectors, but they fire on different languages (Python vs JS/TS), so no cross-detector duplicates occur on the same repo

## Cross-Rule Interference After Merge

| Classification | Count |
|---|---|
| SAME_SECURITY_CHECK_DUPLICATE | 0 |
| VALID_SECONDARY_CHECK | 0 |
| OVERLAPPING_BUT_DISTINCT | 0 |
| WRONG_DETECTOR | 0 |
| FALSE_POSITIVE | 0 |

The 3 detectors mapping to HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION target different languages, so they cannot fire on the same file. No interference.

## Conclusion

Normalization remains semantically valid after semantic consolidation and detector repairs. Zero semantic findings were incorrectly collapsed.
