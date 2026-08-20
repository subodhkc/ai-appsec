# 06 — Risk Score Audit

## Formulas Found (3)

### Formula 1: Aggregation v1 (Primary)

**Path:** `lib/ai-security/aggregation.ts:336-356`

```
riskScoreContribution = SEVERITY_WEIGHTS[severity] * min(log(instanceCount+1), log(maxInstances+1)*capMultiplier)
```

**Inputs:**
- `severity` — CRITICAL/HIGH/MEDIUM/LOW/INFO
- `instanceCount` — number of findings for this ruleId+category+severity group
- `maxInstances` — default 10
- `capMultiplier` — default 1.5

**Severity Weights:**
| Severity | Weight |
|----------|--------|
| CRITICAL | 10 |
| HIGH | 7 |
| MEDIUM | 4 |
| LOW | 2 |
| INFO | 1 |

**Duplicate Handling:** Findings are grouped by `ruleId + category + severity`. Duplicate findings from the SAME rule inflate `instanceCount` but log-scaling caps the impact. However, duplicate findings from DIFFERENT rules detecting the same issue (e.g., R1 and R1.1 both firing on the same line) are NOT deduplicated — they create separate aggregation groups and their risk contributions ADD UP.

**Normalization:** None. Raw findings are aggregated without deduplication of overlapping rules.

**Max Score:** Unbounded (sum of all group contributions). The scan completion handler caps the final stored score at 0-100.

**Stored In:** `ai_security_scans.riskScore`

**Displayed In:** Dashboard, executive summary, report, email, trust page, AI inventory (divided by 10)

### Formula 2: Context-Aware v2

**Path:** `lib/ai-security/context-aware-aggregation.ts`

v1 score adjusted by context gating pipeline:
- Repo profile detection (startup/smb/mid-market/enterprise)
- Exploitability scoring per finding
- Governance observations
- Conservative mode for uncertain repos

**Inputs:** v1 aggregation + fileTree + fileContents + repoProfile

**Duplicate Handling:** Same as v1 plus context-based severity downgrades.

**Stored In:** `ai_security_scans.riskScore` with `riskScoreVersion='v2'`

### Formula 3: AI Inventory Risk Calculator

**Path:** `lib/ai-inventory/risk-calculator.ts`

Separate risk calculation for AI inventory systems. Inherits scan riskScore via `ai-security-sync.ts` (divided by 10 for 0-10 scale).

**Stored In:** `risk_assessments.riskScore`

## Duplicate-Finding Risk-Score Impact

**CONFIRMED: Same underlying issue can inflate score through duplicate detectors.**

Example: If R1 (Prompt Injection) and R1.1 (OpenAI Prompt Injection) both fire on the same line of code:
- R1 creates aggregation group: CRITICAL × log(2) ≈ 10 × 0.69 = 6.9
- R1.1 creates aggregation group: CRITICAL × log(2) ≈ 10 × 0.69 = 6.9
- Total: 13.8 (should be 6.9 for one issue)

**rc.3 Impact:** rc.3 normalization removes 23 duplicate findings and 11 severity conflicts BEFORE aggregation. This means:
- Risk score will be LOWER with rc.3 (more accurate)
- Duplicate inflation is eliminated by normalization layer
- Score becomes more reproducible

## Recommendations (do NOT implement yet)

1. Normalization layer (from Phase 3.5 spec) should run BEFORE aggregation
2. Risk score should include a `normalizationVersion` field
3. `riskScoreVersion` should distinguish v1-raw, v1-normalized, v2-raw, v2-normalized
4. AI inventory sync should validate riskScore is in 0-100 range before dividing by 10
5. Max score capping logic should be documented and tested
