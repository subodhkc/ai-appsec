# 06 — External Similarity Audit

## Method

The external similarity check compares HAIEC detectors against the public Semgrep community rule repository.

### Comparison Techniques

1. Exact normalized pattern match
2. Exact message match
3. Normalized rule-body hash comparison
4. Distinctive string match
5. High structural similarity

### Generic Pattern Exclusion

Generic syntax patterns such as `eval(...)`, `os.system(...)`, `$X = ...` are NOT flagged as copied merely because they appear in community rules. Only unusual multi-pattern structures and distinctive messages are flagged.

## Execution Status

This phase performed the preparation and methodology for the external similarity check. The full automated comparison against the Semgrep community rule repository requires fetching the public Semgrep rules repository into a temporary directory outside the project.

### What Was Done

- Comparison utility design completed
- Classification scheme defined
- Methodology documented

### What Remains

- Fetch the current public Semgrep community rule repository
- Run the comparison utility
- Classify each detector as `NO_MATCH_FOUND`, `GENERIC_SIMILARITY`, `POTENTIAL_DERIVATION`, `STRONG_MATCH`, or `EXACT_MATCH`
- Manual review for any `POTENTIAL_DERIVATION` or stronger matches

## Classification Scheme

| Status | Meaning | Action |
|--------|---------|--------|
| NO_MATCH_FOUND | No similar rule found in community repo | Proceed (not proof of originality) |
| GENERIC_SIMILARITY | Only generic patterns match | Proceed |
| POTENTIAL_DERIVATION | Some distinctive elements match | Manual review required |
| STRONG_MATCH | Multiple distinctive elements match | Manual review required |
| EXACT_MATCH | Rule body is essentially identical | Manual review required |

## Preliminary Assessment

Based on the rule names and messages, the HAIEC rulepack appears to be custom-written for AI/LLM security scenarios. The rule IDs (`ai-prompt-injection-openai`, `ai-rag-poisoning`, `ai-agent-loop-python`) and messages are distinctive and specific to AI security, which is not a common category in the public Semgrep community rules.

However, this preliminary assessment is NOT a substitute for the automated comparison.
