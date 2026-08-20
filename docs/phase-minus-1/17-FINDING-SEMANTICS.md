# 17 — Finding Semantics

> **Phase -1 document.** Defines finding classification semantics. No rules
> changed. No implementation yet.

---

## Problem

Current scanner rules mix different types of findings:
- **Presence detection** — "OpenAI library imported" (INFO, just detects AI usage)
- **Risk signals** — "Prompt injection risk in API call" (WARNING, indicates potential risk)
- **Control gaps** — "Missing rate limiting on LLM API" (WARNING, missing security control)
- **Vulnerabilities** — "Hardcoded API key" (ERROR, strong vulnerability pattern)

These have different semantics but are currently all called "findings." Before
`check_deploy_security` can safely make verdicts, we need to distinguish them.

---

## Proposed Classification

### `findingKind`

| Kind | Definition | Example | Default disposition |
|------|------------|---------|---------------------|
| `PRESENCE` | Detects that something exists (AI usage, library import, API call). Not a vulnerability. Informational. | `ai-openai-import`, `ai-rest-openai`, `ai-sdk-cohere` | `INFORMATIONAL` |
| `RISK_SIGNAL` | Indicates a potential risk that warrants review. Not necessarily a vulnerability. | `ai-prompt-injection-openai`, `ai-context-overflow`, `ai-cot-exposure` | `REVIEW` |
| `CONTROL_GAP` | A security control is missing. The absence increases risk. | `missing-ai-auth-python`, `missing-llm-rate-limit-js`, `missing-cost-tracking`, `missing-max-tokens` | `REVIEW` |
| `VULNERABILITY` | A concrete vulnerability pattern. High confidence. | `hardcoded-api-key-python`, `dangerous-tool-shell`, `ai-sql-injection` | `BLOCK` |

### `defaultDisposition`

| Disposition | Meaning | Deploy impact |
|-------------|---------|---------------|
| `INFORMATIONAL` | Information only; no action required | Does not affect verdict |
| `REVIEW` | Requires human review before deploy | Contributes to `REVIEW` verdict |
| `BLOCK` | Should block deploy until fixed | Contributes to `BLOCK` verdict |

---

## Current Severity Distribution (from `04-RULEPACK-FORENSIC-INVENTORY.md`)

| Severity | Count | Proposed findingKind mapping |
|----------|-------|------------------------------|
| INFO | 36 | Mostly `PRESENCE` (detection rules) |
| WARNING | 35 | Mix of `RISK_SIGNAL` and `CONTROL_GAP` |
| ERROR | 20 | Mostly `VULNERABILITY` |

---

## Numeric Confidence Investigation

### Current behavior (verified)

`public-repo-scanner/scanner/analyzer.py:299-311`:
```python
def _calculate_confidence(self, result):
    metadata = result.get("extra", {}).get("metadata", {})
    confidence = metadata.get("confidence", "HIGH")
    confidence_map = {
        "HIGH": 0.9,
        "MEDIUM": 0.7,
        "LOW": 0.5,
    }
    return confidence_map.get(confidence.upper(), 0.8)
```

### Problem

These numeric values (0.9, 0.7, 0.5, 0.8) are **fabricated** — they are not
empirically calibrated probabilities. They map Semgrep's qualitative confidence
labels to arbitrary numbers. This is misleading because:
- 0.9 does not mean "90% likely to be a true positive"
- The values are not validated against any dataset
- Users may interpret them as statistical probabilities

### Recommendation

**Remove fabricated numeric confidence. Replace with qualitative evidence strength.**

| Evidence strength | Meaning | Replaces |
|-------------------|---------|----------|
| `DETERMINISTIC` | Pattern match is deterministic (Semgrep AST match) | "HIGH" → 0.9 |
| `PATTERN_MATCH` | Pattern-based detection, may have false positives | "MEDIUM" → 0.7 |
| `HEURISTIC` | Heuristic-based, higher false positive risk | "LOW" → 0.5 |

This is qualitative, not numeric, and does not imply a probability.

---

## Mapping Rules (for later implementation)

```
severity INFO  + category *_detection  → findingKind PRESENCE, disposition INFORMATIONAL
severity INFO  + category operational  → findingKind PRESENCE, disposition INFORMATIONAL
severity INFO  + category rest_api_*    → findingKind PRESENCE, disposition INFORMATIONAL
severity INFO  + category sdk_detection → findingKind PRESENCE, disposition INFORMATIONAL

severity WARNING + category prompt_injection → findingKind RISK_SIGNAL, disposition REVIEW
severity WARNING + category rag_*             → findingKind RISK_SIGNAL, disposition REVIEW
severity WARNING + category agent_safety      → findingKind RISK_SIGNAL, disposition REVIEW
severity WARNING + category missing_*         → findingKind CONTROL_GAP, disposition REVIEW
severity WARNING + category dangerous_tools   → findingKind VULNERABILITY, disposition REVIEW

severity ERROR + category secrets_exposure    → findingKind VULNERABILITY, disposition BLOCK
severity ERROR + category injection           → findingKind VULNERABILITY, disposition BLOCK
severity ERROR + category dangerous_tools     → findingKind VULNERABILITY, disposition BLOCK
```

> **Note:** This is a preliminary mapping based on severity + category. Each
> rule should be individually classified during the rule provenance audit. Do
> not auto-classify without review.
