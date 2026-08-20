# 13 — Final Public Core

## Final Public Core (rc.4)

| Metric | Value |
|---|---|
| Detector count | 122 |
| Security-check count | 80 |
| Parser errors | 0 |
| Known qualification-fixture FP failures | 0 |
| Excluded detectors | 0 (all repaired in rc.4) |

## Changes from Phase 2A Public Core

Phase 2A Public Core had 118 detectors (4 excluded). Phase 2B repaired all 4 excluded detectors, bringing the final Public Core to 122 detectors.

## Finding Kind Distribution

| Kind | Count |
|---|---|
| PRESENCE | 19 |
| RISK_SIGNAL | 37 |
| CONTROL_GAP | 11 |
| VULNERABILITY | 13 |

## Disposition Distribution

| Disposition | Count |
|---|---|
| INFORMATIONAL | 19 |
| REVIEW | 59 |
| BLOCK | 2 |

## BLOCK Checks

1. `SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT` (ai-tool-abuse-output-exec)
2. `SC-EVAL-EXEC-COSMETIC-METAVAR` (dangerous-eval-exec-ai-output-python/js)

## Qualification Evidence

- Fixture tests: 0 parser errors, 0 known FP
- Real-repo tests: 8/12 FULL_SUCCESS, 4 TIMEOUT (harness limitation)
- Network-none: 6/6 NETWORK_EQUIVALENT
- Reproducibility: 3/3 repos 5/5 IDENTICAL
- Bundle validator: 0 errors
- Provenance: 119 clear, 3 review-required

## Local-First Configuration

- Local HAIEC rule file: YES
- Semgrep metrics disabled: YES
- No login: YES
- No registry config: YES
- No community rule download: YES
- Network-none validated: YES
