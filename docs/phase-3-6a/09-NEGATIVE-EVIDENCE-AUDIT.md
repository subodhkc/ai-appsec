# 09 — Negative Evidence / Clean Result Audit

## Current Behavior

### cleanRules Calculation

**Path:** `lib/reports/transformers/ai-security-transformer.ts:27-39`

```typescript
function calculateCleanRules(rulesEvaluated: any): number {
  const parsed = JSON.parse(rulesEvaluated)
  const evaluated = Object.values(parsed) as any[]
  const triggered = evaluated.filter((r: any) => r.triggered).length
  return evaluated.length - triggered
}
```

**Problem:** "Clean rules" = rules evaluated - rules triggered. A rule that didn't fire is counted as "passed." But absence of a finding does NOT mean the control is implemented — it could mean:
- The scan didn't cover the relevant code
- The pattern didn't match the specific implementation
- The rule has known blind spots
- The code uses a pattern the rule doesn't recognize

### Report Display

**Path:** `lib/ai-security/report-generator.ts:373-375`

```typescript
if (data.cleanRules > 0) {
  const percentage = data.totalRules > 0 ? Math.round((data.cleanRules / data.totalRules) * 100) : 0
  signals.push(`${percentage}% of security rules passed (${data.cleanRules} of ${data.totalRules} rules)`)
}
```

**Problem:** "X% of security rules passed" is an overclaim. "Did not trigger" ≠ "passed."

### Executive Summary Positive Findings

**Path:** `lib/reports/engines/ai-security-report.ts:225-229`

```typescript
const positiveFindings = this.assessmentData.bestPractices.length > 0
  ? this.assessmentData.bestPractices.slice(0, 3)
  : [
      `${this.assessmentData.cleanRules} security rules passed without violations`,
      'No hardcoded API keys detected in scanned files',
      'Code structure supports security best practices'
    ]
```

**Problem:** When there are no best practices detected, the report falls back to claiming "rules passed" and "no hardcoded API keys detected" — both are negative evidence overclaims.

### Trust Page

**Path:** `lib/ai-security/outputs/trust-page.ts:79-120`

All 8 controls default to `'implemented'` with 0 evidence. (See 04-TRUST-PAGE-AUDIT.md for details.)

## Required Future States

| State | Meaning | When to Use |
|-------|---------|-------------|
| FINDING | A detector fired | Rule matched a pattern |
| NO_FINDING_WITHIN_SCOPE | Detector evaluated applicable code and found nothing | Rule ran, code was in scope, no match |
| NOT_APPLICABLE | Rule doesn't apply to this codebase | e.g., Python rule on JS-only repo |
| PARTIAL | Some instances checked, others not | e.g., 3 of 10 files scanned |
| UNSUPPORTED | Rule couldn't evaluate (parser error, etc.) | Semgrep parse error on file |
| ERROR | Rule execution failed | Internal error |
| SKIPPED | Rule was skipped (profile exclusion, etc.) | Profile didn't include this rule |

**Current code only distinguishes: triggered vs. not-triggered. It treats all "not-triggered" as "passed."**

## Recommendations (do NOT implement yet)

1. `rulesEvaluated` should include: `triggered`, `applicable`, `evaluated`, `skipped`, `error`
2. "Clean rules" should only count rules where `applicable=true AND evaluated=true AND triggered=false`
3. Report should say "X rules evaluated, Y findings, Z rules not applicable" instead of "X% passed"
4. Trust page controls should default to `'unknown'`, not `'implemented'`
5. Positive findings should require positive evidence (e.g., a best-practice detector fired), not absence of negative evidence
