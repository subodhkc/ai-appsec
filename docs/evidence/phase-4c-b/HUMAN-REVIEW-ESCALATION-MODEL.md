# Human Review Escalation Model

## Phase 4C-B — Release Governance Policy

## Engineering Evidence States

| State | Meaning |
|-------|---------|
| STRONG | Multiple independent evidence sources agree; authorship verified; no external similarity matches |
| MODERATE | Some evidence present but gaps remain; partial authorship verification |
| INCOMPLETE | Evidence is missing or contradictory; cannot make a determination |

## License Disposition States

| State | Meaning |
|-------|---------|
| HAIEC_CAN_LICENSE | Engineering evidence supports HAIEC's right to license this detector |
| ATTRIBUTION_REQUIRED | HAIEC can license but must attribute a third party |
| REVIEW_REQUIRED | Ownership or license compatibility is uncertain |

## Human Release Disposition States

| State | Meaning |
|-------|---------|
| APPROVED | Human reviewer approves release |
| APPROVED_WITH_NOTICES | Human reviewer approves with required notices/attribution |
| BLOCKED | Human reviewer blocks release |

## Escalation Rules

### Standard Path (no escalation needed)

```
STRONG + HAIEC_CAN_LICENSE
  → human release review (standard)
  → can proceed to APPROVED or APPROVED_WITH_NOTICES
```

### Specialist Review Required (escalation)

```
MODERATE or INCOMPLETE
  OR
ATTRIBUTION_REQUIRED
  OR
REVIEW_REQUIRED
  OR
ownership ambiguity
  → specialist IP/OSS legal review required BEFORE release
  → cannot proceed to APPROVED until specialist clears
```

## Current HAIEC State (as of Phase 4C-A4.1)

- 122/122 detectors: originEvidence = STRONG
- 122/122 detectors: licenseDisposition = HAIEC_CAN_LICENSE
- 122/122 detectors: finalLegalDisposition = PENDING_HUMAN_REVIEW

All 122 detectors are on the standard path. No specialist escalation is required based on engineering evidence. However, the human review itself is still required — engineering evidence does not constitute legal approval.

## Automation Prohibition

**Automated tooling must NEVER set finalLegalDisposition to APPROVED.**

Only a human reviewer with IP/legal authority can set:
- APPROVED
- APPROVED_WITH_NOTICES
- BLOCKED

Engineering tooling can only set:
- PENDING_HUMAN_REVIEW (default)
- Engineering evidence states (STRONG, MODERATE, INCOMPLETE)
- Engineering license assessments (HAIEC_CAN_LICENSE, ATTRIBUTION_REQUIRED, REVIEW_REQUIRED)
