# Founder Release Decision Sheet

## Phase 4C-C — Human Decisions Required

**Do NOT fill human decision automatically.**

---

### Decision 1: Intended Package License

| Field | Value |
|-------|-------|
| Recommended option | MIT (already in LICENSE file) |
| Alternative | Apache-2.0, or other |
| Reason | MIT is permissive, simple, compatible with all runtime deps. LICENSE file already contains MIT text. |
| Risk | If MIT was not intentional, public exposure on RC branch may have created recipient rights. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 2: Intended Public Core License

| Field | Value |
|-------|-------|
| Recommended option | MIT (same as package) |
| Alternative | Separate license for rules |
| Reason | THIRD_PARTY_NOTICES already states "MIT licensed". Simpler to use one license. |
| Risk | If rules need different licensing (e.g., for future commercial tiers), separate now. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 3: Correct Copyright Owner

| Field | Value |
|-------|-------|
| Recommended option | "Copyright (c) 2026 HAIEC" (current) |
| Alternative | Individual name, registered company name, or other |
| Reason | Current LICENSE says HAIEC. Git authorship is "Subodh". |
| Risk | If HAIEC is not a legal entity, copyright may be invalid. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 4: Approval of Detector Provenance Methodology

| Field | Value |
|-------|-------|
| Recommended option | APPROVE methodology (122/122 STRONG, Phase 2.5 similarity check) |
| Alternative | Request deeper review of specific detectors |
| Reason | All 122 detectors have STRONG origin evidence. External similarity check found 0 matches. |
| Risk | Methodology has not been independently audited by external IP counsel. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 5: Approval/Escalation of Provenance Exceptions

| Field | Value |
|-------|-------|
| Recommended option | APPROVE — no exceptions identified |
| Alternative | Escalate if any detector raises concern |
| Reason | 0 exceptions found. All 122 are STRONG + HAIEC_CAN_LICENSE. |
| Risk | None identified. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 6: Approval of Semgrep Usage/Licensing Interpretation

| Field | Value |
|-------|-------|
| Recommended option | APPROVE — Semgrep used as external subprocess, not bundled |
| Alternative | Seek specialist IP/OSS legal opinion on LGPL-2.1 subprocess use |
| Reason | Semgrep is invoked via spawn(), not linked, not bundled, not modified. Rules are original YAML. |
| Risk | LGPL-2.1 interpretation for subprocess use is a legal question, not engineering. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 7: Required Third-Party Notices

| Field | Value |
|-------|-------|
| Recommended option | APPROVE current THIRD_PARTY_NOTICES.md as sufficient |
| Alternative | Add more detailed notices, add NOTICE file, add per-dependency license text |
| Reason | Current notices list all deps with licenses. Semgrep is attributed. |
| Risk | Apache-2.0 deps (canonicalize) may require source availability notice. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 8: npm Package Identity

| Field | Value |
|-------|-------|
| Recommended option | `haiec-agent-security` (current name, confirmed AVAILABLE) |
| Alternative | Different scope/name |
| Reason | Name is available on npm. Matches package.json. |
| Risk | None identified. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 9: MCP Registry Identity

| Field | Value |
|-------|-------|
| Recommended option | `io.github.subodhkc/haiec-agent-security` |
| Alternative | Other registry name format |
| Reason | Follows MCP Registry naming convention (io.github.<owner>/<name>). |
| Risk | Registry naming requirements may change. Validate before submission. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 10: Trusted-Publishing Strategy

| Field | Value |
|-------|-------|
| Recommended option | GitHub Actions OIDC → npm Trusted Publisher → provenance attestation |
| Alternative | Long-lived npm token |
| Reason | Eliminates long-lived secrets. Automatic provenance attestation. |
| Risk | First publication may require manual setup before trusted publishing can be configured. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

### Decision 11: Public Release Authorization

| Field | Value |
|-------|-------|
| Recommended option | NOT YET — wait until RC2 passes remote requalification |
| Alternative | Authorize after RC2 |
| Reason | RC2 will have corrected metadata. Current RC1 has license contradictions. |
| Risk | Publishing RC1 as-is would expose contradictory license state. |
| Human decision | _______________ |
| Reviewer | _______________ |
| Date | _______________ |

---

## Summary

All 11 decisions are **UNSIGNED**. Engineering has provided recommendations
but cannot make these decisions. The founder/legal reviewer must complete
each decision before RC2 can be prepared and publication can proceed.
