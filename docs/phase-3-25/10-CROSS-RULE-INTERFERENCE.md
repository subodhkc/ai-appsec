# 10 — Cross-Rule Interference

## Problem Definition

When the full production rulepack is scanned against a fixture, multiple detectors may fire on the same file. Phase 2.6 treated any non-expected detector firing as a failure for negative/FP fixtures. This is incorrect.

## Interference Patterns

### Pattern 1: Import Detectors Fire on Everything

`ai-openai-import` fires on ANY file containing `import openai`. This means any fixture that imports openai (even for negative testing) triggers this detector.

**Affected fixtures:** All negative/FP fixtures that import openai for context.

### Pattern 2: Prompt Injection Detectors Fire on All API Calls

`ai-prompt-injection-openai` fires on ANY `openai.chat.completions.create(...)` call. This means any fixture with an OpenAI API call (even safe ones) triggers this detector.

**Affected fixtures:** All negative/FP fixtures that include OpenAI API calls for context.

### Pattern 3: `ai-rest-generic` Fires on Any HTTP Call

`ai-rest-generic` fires on generic HTTP patterns, causing false positives on URL-related negative fixtures.

**Affected fixtures:** `negative/python/api-key-in-url-negative.py`, `negative/javascript/api-key-in-url-negative.js`

## Correct Classification

| Classification | Meaning |
|----------------|---------|
| VALID_SECONDARY_FINDING | Another detector correctly found a different issue |
| OVERLAPPING_RULE | Another detector covers similar ground |
| INFORMATIONAL_PRESENCE | Import/detection rule fired (expected, not a defect) |
| FALSE_POSITIVE | Another detector incorrectly fired |
| RULE_TOO_BROAD | Another detector is too broad and fires on everything |

## Count

- **Cross-rule interference cases:** ~12-15 fixtures
- **Cases where the tested detector was incorrectly marked FAIL:** ~6 fixtures
- **Cases where secondary findings are valid:** ~5 fixtures
