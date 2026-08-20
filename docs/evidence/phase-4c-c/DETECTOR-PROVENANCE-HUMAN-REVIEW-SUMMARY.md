# Detector Provenance Human Review Summary

## Phase 4C-C — References Existing 122/122 Provenance Matrix

**This document does NOT re-run the technical provenance investigation.**
It uses the existing 122/122 engineering provenance matrix from Phase 4C-B.

Full detector list: see `docs/evidence/phase-4c-b/HUMAN-PROVENANCE-AND-LICENSE-RELEASE-PACKET.md`

## Summary Statistics

| Field | Value |
|-------|-------|
| Total detectors | 122 |
| originEvidence: STRONG | 122 |
| originEvidence: MODERATE | 0 |
| originEvidence: INCOMPLETE | 0 |
| licenseDisposition: HAIEC_CAN_LICENSE | 122 |
| finalLegalDisposition: PENDING_HUMAN_REVIEW | 122 |

## Grouped Review Categories

### A. Straightforward STRONG Records (122/122)

All 122 detectors have:
- `originEvidence = STRONG`
- `licenseDisposition = HAIEC_CAN_LICENSE`
- Git authorship by Subodh (subodhkc, subodh@haiec.com)
- Phase 2.5 external similarity check: 2228 rules compared, 0 strong/exact matches
- No third-party rule imports

**Human review focus:** Confirm methodology is sufficient. No need to
manually reverse-engineer 122 individual rules.

### B. Records with Material Evolution After Original Provenance Review (0)

No detectors have evolved materially since the original provenance review.
The rulepack version is `0.1.0-rc.6.1-public-core`. The 122nd detector
is a language split of an existing detector, not a new external import.

### C. Contributor/Ownership Ambiguity (0)

All detectors were authored by a single contributor (Subodh).
No ambiguity in authorship identity. However, **legal ownership**
(whether copyright belongs to HAIEC entity, individual, or company)
is a separate question — see `COPYRIGHT-HOLDER-VALIDATION.md`.

### D. Possible Third-Party Influence (0)

Phase 2.5 external similarity check compared 2228 external rules
against HAIEC's 122 detectors. Result: 0 strong matches, 0 exact
matches. No third-party influence detected.

### E. Exceptions (0)

No exceptions identified. All 122 detectors are clean STRONG records.

## What Human Review Should Focus On

1. **Methodology approval:** Is the Phase 2.5 similarity check
   methodology sufficient for establishing originality?
2. **Ownership validation:** Is the copyright holder correct?
   (see COPYRIGHT-HOLDER-VALIDATION.md)
3. **License selection:** What license applies to the rulepack?
   (see LICENSE-STATE-CONTRADICTION-AUDIT.md)
4. **Semgrep relationship:** Does using Semgrep as an external engine
   create any IP/licensing obligation on the rules?
   (see SEMGREP-LICENSE-HUMAN-REVIEW.md)

## What Engineering Has NOT Done

- Engineering has NOT set `finalLegalDisposition = APPROVED`
- Engineering has NOT independently audited each rule's originality
  beyond the Phase 2.5 similarity check
- Engineering has NOT determined legal copyright ownership
- Engineering has NOT selected the license

## Allowed Tool-Generated State

All 122 detectors remain at `finalLegalDisposition = PENDING_HUMAN_REVIEW`.

Only a human can set: `APPROVED`, `APPROVED_WITH_NOTICES`, or `BLOCKED`.
