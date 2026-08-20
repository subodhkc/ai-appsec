# README Release-Contract Reconciliation

## Phase 4C-C — Part 9

## Stale Items Found in Current README

| Line | Stale Content | Current Truth |
|------|---------------|---------------|
| 14 | "PRE-RELEASE — RELEASE CANDIDATE QUALIFICATION (Phase 4C-A4.1)" | Phase 4C-B is complete. Status is PHASE_4C_B_TECHNICALLY_QUALIFIED. |
| 17 | "locally qualified" | Now remotely qualified across 6 OS/Node combinations. |
| 28 | "Public Core rc.6, 122 detectors" | Rulepack version is rc.6.1. |
| 106 | "239 tests" | Now 276 tests. |
| 149-150 | "License decision pending. Until a license is added, this repository should not be described as open source." | LICENSE file contains MIT, but decision still pending. Contradiction. |
| 22-31 | Four-tool table with all four tools presented equally | Only `scan_ai_security` is implemented. Others must be moved to Roadmap. |
| 33-48 | "One Workflow, Four Independent Checks" section | Overstated for v0.1. Only one check is available. |

## Required README Changes for RC2

1. **Status section**: Update to "TECHNICALLY QUALIFIED RELEASE CANDIDATE"
   — do NOT imply publication already happened.

2. **Tool presentation**: Focus on `scan_ai_security` as the only available
   tool. Move `scan_tenant_isolation`, `verify_llm_content`,
   `check_deploy_security` to a "Roadmap / Related Products" section.

3. **Test count**: Update from "239 tests" to "276 tests".

4. **Rulepack version**: Update from "rc.6" to "rc.6.1".

5. **License section**: Resolve contradiction — either confirm MIT or
   keep "pending" but remove the LICENSE file's MIT text. This is a
   human decision.

6. **Phase history**: Do not expose internal phase history prominently
   to normal package users. Remove "Phase 4C-A4.1" references.

7. **Installation section**: Note that package is not yet published to npm.
   Keep git clone instructions for now.

8. **Architecture section**: Keep the directory tree but mark only
   `ai-security` as implemented. Others as "not yet integrated".

## What NOT to Change

- Keep the PARTIAL scan distinction.
- Keep the concern-family disclaimers.
- Keep the "What scan_ai_security Does NOT Do" section.
- Keep the Semgrep setup instructions.
- Keep the engine independence principle.

## Status

**RECONCILIATION_PLAN_PREPARED** — README changes are package-byte-affecting.
Will be applied in RC2 after human license decision is known.
