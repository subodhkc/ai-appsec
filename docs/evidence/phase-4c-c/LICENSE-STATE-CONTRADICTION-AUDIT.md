# License State Contradiction Audit

## Phase 4C-C — Contradiction Identified

### Findings

| Source | Statement | Implication |
|--------|-----------|-------------|
| `LICENSE` file | MIT License, Copyright (c) 2026 HAIEC | Package is MIT licensed |
| `THIRD_PARTY_NOTICES.md` line 5 | "This product includes the HAIEC Public Core rulepack (MIT licensed)." | Public Core is MIT licensed |
| `THIRD_PARTY_NOTICES.md` line 26 | Semgrep license: "GNU Lesser General Public License v2.1 (LGPL-2.1)" | Semgrep is LGPL-2.1 (third-party) |
| `TRADEMARKS.md` lines 5-7 | "The MIT license applied to this package's source code and bundled Public Core rulepack..." | Asserts MIT as the chosen license |
| `README.md` line 149 | "License decision pending. Until a license is added, this repository should not be described as open source." | License is NOT decided |
| `package.json` | No `license` field present | No SPDX license metadata |
| Rulepack `manifest.json` | No `license` or `copyright` field | No license metadata in rulepack |

### Contradiction Summary

1. **LICENSE file says MIT** — but README says "license decision pending"
2. **THIRD_PARTY_NOTICES says Public Core is MIT** — but README says not open source yet
3. **TRADEMARKS says "The MIT license applied"** — but package.json has no license field
4. **LICENSE has "Copyright (c) 2026 HAIEC"** — but no validation that HAIEC is the correct copyright holder

### Root Cause

The LICENSE file, THIRD_PARTY_NOTICES, and TRADEMARKS were created during
Phase 4C-A as scaffolding with placeholder MIT text. The README was
written to defer the license decision. These two positions contradict
each other. The RC branch was pushed with this contradiction publicly
visible.

### Human Decisions Required

**A. MCP/package license**
- Current state: MIT text present in LICENSE, but README says "pending"
- Question: Is MIT the intended license for the HAIEC Agent Security MCP package?
- If YES: confirm and add `"license": "MIT"` to package.json
- If NO: replace LICENSE file, update THIRD_PARTY_NOTICES, TRADEMARKS, and README
- **HUMAN_DECISION_REQUIRED**

**B. Public Core rulepack license**
- Current state: THIRD_PARTY_NOTICES says "MIT licensed"
- Question: Is MIT the intended license for the Public Core rulepack?
- If YES: confirm and add license metadata to manifest.json
- If NO: state the intended license
- **HUMAN_DECISION_REQUIRED**

**C. Whether both use the same license**
- Current state: both appear to use MIT, but this was not explicitly decided
- Question: Should the package and rulepack use the same license?
- **HUMAN_DECISION_REQUIRED**

**D. Copyright holder**
- Current state: "Copyright (c) 2026 HAIEC"
- Question: Is "HAIEC" the correct legal entity? Is it a registered company, a trade name, or an individual?
- **HUMAN_DECISION_REQUIRED** (see COPYRIGHT-HOLDER-VALIDATION.md)

**E. Contributor/IP ownership basis**
- Current state: All git commits by "Subodh" (subodhkc, subodh@haiec.com)
- Question: Is the IP ownership based on individual authorship, work-for-hire, or company ownership?
- **HUMAN_DECISION_REQUIRED**

**F. Whether current public RC branch licensing was intentional**
- Current state: LICENSE file with MIT was committed to `release/mcp-v0.1.0-rc1` and pushed publicly
- Question: Was it intentional to push the MIT LICENSE to a public branch before the license decision was finalized?
- **HUMAN_DECISION_REQUIRED** (see PUBLIC-RC-LICENSE-EXPOSURE-REVIEW.md)

### Engineering Cannot Resolve

Engineering cannot choose the license, validate the copyright holder, or
determine whether the public MIT exposure was intentional. These are
legal/founder decisions.
