# 10 — Public MVP Rulepack Strategy

## Recommendation: Ship a smaller high-confidence subset first

### Rationale

Based on Phase 2.6 behavioral data:

- Only 23/80 logical checks have measured positive coverage
- 0/9 BLOCK candidates passed fixture validation
- 87/121 detectors did not fire on any fixture
- 33 detectors are REDESIGN_REQUIRED
- 52/107 fixtures had UNEXPECTED_FINDING (wrong detector fired)

Shipping all 121 detectors would publish rules that:
- Don't fire on their intended targets
- Fire on wrong targets (broad over-matching)
- Cannot distinguish real secrets from placeholders
- Claim prompt injection but detect API calls
- Cannot prove absence of controls

### Proposed MVP Subset

Ship only detectors that:
1. Have measured positive fixture coverage
2. Fired the correct detector on the correct fixture
3. Did not trigger on false-positive fixtures
4. Have clear, accurate messages

Based on the 23/80 checks with positive coverage, the initial MVP would likely be **15-25 logical checks** (after filtering out those with false-positive issues).

### Benefits of Smaller Pack

- **Trust:** Users see rules that actually work
- **Maintenance:** Fewer rules to maintain
- **False-positive burden:** Lower for users
- **Organic growth:** Add rules as they're validated
- **Honesty:** Don't claim 121 protections when only 23 work

### Against Shipping All 121

- 87 don't fire — useless to users
- 33 need redesign — would publish broken rules
- 0 can BLOCK — can't claim deployment safety
- Broad detectors over-match — high false-positive burden
- Marketing "121 rules" would be misleading
