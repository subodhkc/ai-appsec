# 10 — Final Public Core

## Final Public Core (rc.5)

| Metric | Value |
|---|---|
| Candidate version | 0.1.0-rc.5 |
| Detector count | 122 |
| Security-check count | 79 |
| Legacy display ID count | 71 |
| Parser errors | 0 |
| Known qualification-fixture FP failures | 0 |
| Unresolved VULNERABILITY findings | 0 |
| Excluded detectors | 0 |

## Finding Kind Distribution

| Kind | Count |
|---|---|
| PRESENCE | 19 |
| RISK_SIGNAL | 37 |
| CONTROL_GAP | 11 |
| VULNERABILITY | 12 |

## Disposition Distribution

| Disposition | Count |
|---|---|
| INFORMATIONAL | 19 |
| REVIEW | 59 |
| BLOCK | 1 |

## BLOCK Check

**HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION**
- Detectors: ai-tool-abuse-output-exec, dangerous-eval-exec-ai-output-python, dangerous-eval-exec-ai-output-js
- Proposition: AI/LLM model output flows to dynamic code execution sinks
- Taint-proven, 7/7 test scenarios passed, no known FP

## Changes from Phase 2B Public Core

1. Semantic consolidation: 80 → 79 checks (merged 2 BLOCK checks into 1)
2. FP closure: ai-xss-js and ai-ssrf-js fixed with taint mode
3. Provenance closure: all 3 review-required detectors cleared
4. BLOCK count: 2 → 1

## Provenance Status

| Status | Count |
|---|---|
| PROVENANCE_CLEAR | 122 |
| PROVENANCE_REVIEW_REQUIRED | 0 |
| EXCLUDED | 0 |

## Contracts Defined

- target-scope-contract.json
- semgrep-dependency-contract.json
- agent-output-contract.json
- completeness-contract.json (from Phase 2B)

## Local-First Configuration

- Local HAIEC rule file: YES
- Semgrep metrics disabled: YES
- No login: YES
- No registry config: YES
- No community rule download: YES
- Network-none compatible: YES
- Native execution preferred: YES
