# Human Review Escalation Policy

## Phase 4C-C

## Standard Review Path

**Condition:**
- `originEvidence = STRONG`
- `licenseDisposition = HAIEC_CAN_LICENSE`
- No ownership ambiguity
- No third-party-source ambiguity

**Action:** Standard human release review.

**Who:** Founder or designated reviewer with IP/OSI knowledge.

**Scope:** Methodology approval + copyright holder confirmation + license selection.

---

## Specialist IP/OSS Review Path

**Condition (any one):**
- `originEvidence = MODERATE`
- `originEvidence = INCOMPLETE`
- `licenseDisposition = ATTRIBUTION_REQUIRED`
- `licenseDisposition = REVIEW_REQUIRED`
- Contributor-rights ambiguity
- Third-party-source ambiguity

**Action:** Specialist IP/OSS review required.

**Who:** Legal counsel with open-source licensing expertise.

**Scope:** Detailed examination of origin, attribution, and licensing obligations.

---

## Current Classification

All 122 detectors: **Standard Review Path** (STRONG + HAIEC_CAN_LICENSE + no ambiguity).

The Semgrep relationship: **Specialist IP/OSS Review Path** (third-party tool,
LGPL-2.1, subprocess invocation — legal interpretation required).

---

## Decision Authority

| Decision | Engineering | Human Reviewer | Founder | Legal Counsel |
|----------|-------------|----------------|---------|---------------|
| Set APPROVED | NO | YES | YES | YES |
| Set APPROVED_WITH_NOTICES | NO | YES | YES | YES |
| Set BLOCKED | NO | YES | YES | YES |
| Recommend | YES | YES | YES | YES |
| Set PENDING_HUMAN_REVIEW | YES | N/A | N/A | N/A |

**Engineering tooling may recommend but cannot sign.**

Only a human can set: `APPROVED`, `APPROVED_WITH_NOTICES`, `BLOCKED`.

---

## Escalation Flow

```
Engineering (PENDING_HUMAN_REVIEW)
  → Standard Review (founder/reviewer)
    → If clean: APPROVED
    → If concerns: escalate to Specialist IP/OSS Review
      → Specialist review: APPROVED_WITH_NOTICES or BLOCKED
```

No detector or legal disposition may skip the human review step.
