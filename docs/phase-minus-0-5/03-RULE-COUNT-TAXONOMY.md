# 03 — Rule Count Taxonomy

> **Phase -0.5 document.** Defines separate, unambiguous metrics for rule counts.
> The product must stop using one ambiguous "rule count."

---

## The Problem

HAIEC currently uses "rule count" to mean different things in different contexts:
- Semgrep rule definitions in a YAML file
- Semgrep rule definitions embedded in Python
- TypeScript RuleMeta objects (metadata)
- Display ID mappings
- Logical user-facing checks
- Rules that actually execute

These are NOT the same. Conflating them leads to false claims.

---

## Defined Metrics

### 1. `detectorDefinitions`
**Definition:** Individual Semgrep rule definitions (YAML `id:` entries) that contain
actual pattern-matching logic.

- `semgrep_rules.yaml`: 91 detector definitions
- `AI_SECURITY_RULES` (Python embedded): 121 detector definitions
- These are different sets — the Python embedded set has language-specific splits

### 2. `logicalChecks`
**Definition:** Distinct security concepts checked, regardless of language variants.

- A single logical check (e.g., "detect prompt injection in OpenAI calls") may have
  multiple detector definitions (e.g., `ai-prompt-injection-openai` for Python +
  `ai-prompt-injection-openai-js` for JavaScript)
- `semgrep_rules.yaml`: ~91 logical checks (one rule per concept, multi-language)
- `AI_SECURITY_RULES` (Python): ~91 logical checks (same concepts, but split into
  121 detector definitions with language variants)

### 3. `displayRules`
**Definition:** Unique display rule IDs (`metadata.rule_id` values) shown to users.

- `semgrep_rules.yaml`: 72 unique display IDs (from 91 rules, due to aliasing)
- `AI_SECURITY_RULES` (Python): needs verification (likely similar aliasing)

### 4. `rulesEvaluated`
**Definition:** Detector definitions that Semgrep actually evaluates during a scan.

- Modal production scan: 121 `ai-*` detector definitions (from `AI_SECURITY_RULES`)
- Public-repo-scanner: 91 `ai-*` detector definitions (from `semgrep_rules.yaml`)
- SOC2: 0 detector definitions evaluated

### 5. `rulesApplicable`
**Definition:** Detector definitions that could match given the target's languages.

- If scanning a Python-only repo, JavaScript-specific rules are loaded but won't match
- This is a subset of `rulesEvaluated` based on target languages

### 6. `rulesExecuted`
**Definition:** Detector definitions that actually produced at least one finding.

- This is a runtime metric, not a static count
- Depends on the target repository's code

### 7. `findingsProduced`
**Definition:** Total number of findings (rule matches) in a scan result.

- This is the output count, not the rule count
- One rule can produce multiple findings

---

## Recommended Public Metrics

HAIEC should eventually expose these metrics separately:

| Metric | What to show users | What NOT to say |
|--------|--------------------|-----------------|
| `detectorDefinitions` | "121 Semgrep detector definitions" | Don't call them "rules" without qualification |
| `logicalChecks` | "~91 distinct security checks" | Don't conflate with detector count |
| `displayRules` | "72 display rule categories" | Don't call them "rules" if they're display groupings |
| `rulesEvaluated` | "121 detectors evaluated in this scan" | Don't claim SOC2 rules were evaluated |
| `rulesApplicable` | "85 detectors applicable to your languages" | Don't claim all rules apply to all projects |
| `rulesExecuted` | "12 detectors produced findings" | Don't claim all rules found issues |
| `findingsProduced` | "34 findings" | Don't call findings "rules" |

---

## What HAIEC Should NOT Say

| Claim | Why it's wrong |
|-------|----------------|
| "121 rules" (without qualification) | Ambiguous — 121 detectors, ~91 logical checks, 0 SOC2 |
| "91 core + 30 SOC2 = 121" | FALSE — the 121 are all `ai-*` detectors, 0 SOC2 execute |
| "27 SOC2 rules" | FALSE — only 21 RuleMeta objects exist, and none execute |
| "30 SOC2 rules" | FALSE — 0 SOC2 rules execute; 30 is a phantom mapping count |
| "118 rules" | FALSE — based on `docs/RULE-COUNT-REFERENCE.md` which references non-existent files |

---

## Current Verified Counts

| Metric | Modal production | Public-repo-scanner | YAML file |
|--------|-----------------|---------------------|-----------|
| `detectorDefinitions` | 121 (embedded) | 91 (from YAML) | 91 |
| `logicalChecks` | ~91 | ~91 | ~91 |
| `displayRules` | needs verification | 72 | 72 |
| `rulesEvaluated` (typical scan) | 121 | 91 | N/A |
| SOC2 `detectorDefinitions` | 0 | 0 | 0 |
| SOC2 `rulesEvaluated` | 0 | 0 | 0 |
| SOC2 TypeScript `RuleMeta` objects | N/A | N/A | N/A (21 in separate file) |
