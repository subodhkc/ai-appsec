# Rules

Rulepack extraction occurs in a later approved phase.

## Status

**No rules are published in this repository.**

## Why

1. **Provenance resolution pending:** ~28 generic-pattern rules need manual
   comparison against public rule packs before publication.
2. **Legal review pending:** HAIEC-authored rules require IP/employment
   agreement confirmation before release under an open-source license.
3. **SOC2 rules are non-functional:** 0 SOC2 rules execute in the HAIEC
   production scanner. Do not claim SOC2 rule counts.
4. **Rule count taxonomy:** Use the taxonomy from
   `docs/phase-minus-0-5/03-RULE-COUNT-TAXONOMY.md` — do not use a single
   ambiguous "rule count."

## What NOT to do

- Do not copy `semgrep_rules.yaml` from the private HAIEC repository.
- Do not copy `AI_SECURITY_RULES` from the Modal scanner.
- Do not copy SOC2 rules (they are non-functional metadata only).
- Do not make public marketing claims from private-rule counts.
- Do not claim "121 rules," "91 rules," or "30 SOC2 rules" without
  qualification using the rule-count taxonomy.
