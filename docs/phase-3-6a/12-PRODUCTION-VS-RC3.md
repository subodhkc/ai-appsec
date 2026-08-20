# 12 — Production vs RC3

## Explicit Separation

### CURRENT_PRODUCTION

| Field | Value |
|-------|-------|
| Detector count | 121 (91 core AI + 30 SOC2) |
| Security-check count | 81 (semantic) |
| Display-ID count | 78 (legacy) |
| Semgrep version | 1.52.0 |
| Rulepack version | 121-rules-v4-soc2 |
| Scanner version | 3.28.0 (Modal env fallback) / 3.27.0 (Next.js config) |
| Known issues | ai-function-calling-js parser error; hardcoded API key matches placeholders; subprocess FP; duplicate findings; severity conflicts; trust page defaults to implemented; "82 rules" in report; "violates compliance" overclaim |
| Status | DEPLOYED (Modal) |

### RC3_CANDIDATE

| Field | Value |
|-------|-------|
| Detector count | 122 (121 + 1 eval/exec split) |
| Security-check count | 81 (semantic) |
| Display-ID count | 78 (legacy) |
| Semgrep version | 1.173.0 |
| Rulepack version | rc.3 (private) |
| Rulepack SHA-256 | 8d9596b57ef2bbb6c461884a8ec2a22c03b6db6a3f03e6a45e5e00dcaecfc8e9 |
| Manifest SHA-256 | 4418ebb2f5a6736eb8de47c68e8ff3603dea2f834dbb2b9de1bfb26c6c8ab5bd |
| Fixes | ai-function-calling-js parser fix; eval/exec language split; API key placeholder exclusion; subprocess sink removal; 23 duplicate normalization; 11 severity conflict resolution |
| Known limitations | Subprocess shell sink detection removed; 7 REDESIGN_REQUIRED; 29 READY_AFTER_RULE_REPAIR; 14 READY_AFTER_METADATA_FIX |
| Status | PRIVATE_CANDIDATE (not deployed) |

### FUTURE_CANONICAL

| Field | Value |
|-------|-------|
| Detector count | TBD (from manifest) |
| Security-check count | TBD (from manifest) |
| Display-ID count | TBD (from manifest) |
| Semgrep version | TBD (pinned at deployment) |
| Rulepack version | canonical (from manifest) |
| Rulepack digest | SHA-256 of canonical YAML |
| Manifest version | semantic version of manifest |
| Manifest digest | SHA-256 of manifest JSON |
| Status | NOT_YET_BUILT |

## Rules

1. **Never say production has an rc.3 fix until deployed.** Production still has the parser error, placeholder FP, subprocess FP, duplicates, and severity conflicts.
2. **Never say rc.3 has a production defect if rc.3 repaired it.** The parser error, placeholder FP, and subprocess FP are FIXED in rc.3.
3. **Never say production has 122 detectors.** Production has 121. rc.3 has 122.
4. **Never say production uses Semgrep 1.173.0.** Production pins 1.52.0. rc.3 was qualified on 1.173.0.
5. **The canonical bundle does not exist yet.** It is a future architecture.
