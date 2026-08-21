# Phase 4C-F — Public Source Truth + Trusted Publishing Proof + RC3

## 1. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

Main is reconciled. publish.yml is corrected. RC3 is technically qualified.
Three human actions are required before OIDC publication can proceed.

## 2. Old Main SHA

`fd277140a9d8b6e18a8d0f5af0ea0bc15838a7b0`

## 3. Reconciled Main SHA

`7c1ffd40d7c816cf8ad58d1dbc282d1c9a2ccf9c`

## 4. Main Source-Truth Result

RECONCILED — Main now contains:
- AI AppSec README
- package identity ai-appsec (v0.1.0-rc.3)
- mcpName: io.github.subodhkc/ai-appsec
- 122 Public Core detectors
- scan_ai_security MCP tool
- MIT LICENSE
- THIRD_PARTY_NOTICES.md
- SECURITY.md
- TRADEMARKS.md
- .mcp/server.json
- qualification workflow (phase-4c-cross-platform.yml)
- corrected publish.yml (OIDC, no NPM_TOKEN)
- all historical evidence preserved

## 5. Main Protection Result

CONFIGURED via GitHub API:
- allow_force_pushes: false
- allow_deletions: false
- enforce_admins: false (founder can still administer)

## 6. Latest-Tag Correction

**NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED**

The granular automation token cannot remove dist-tags (403 Forbidden).
Requires interactive npm authentication with 2FA.

Safe command (requires 2FA):
```bash
npm dist-tag rm ai-appsec latest
```

Or via npm web UI:
https://www.npmjs.com/package/ai-appsec?activeTab=versions

## 7. Next Dist-Tag

`next` → `0.1.0-rc.2` (will become `0.1.0-rc.3` after OIDC publication)

## 8. publish.yml Token-Removal Result

COMPLETE — no NPM_TOKEN or NODE_AUTH_TOKEN in publish.yml.
Only OIDC (`id-token: write`) and `github.token` (for artifact download).

## 9. Cross-Workflow Artifact-Download Fix

COMPLETE — publish.yml uses `actions/download-artifact@v4` with:
- `github-token: ${{ github.token }}`
- `repository: ${{ github.repository }}`
- `run-id: ${{ inputs.qualification_run_id }}`
- explicit artifact name

## 10. SHA-256 Gate Result

COMPLETE — publish.yml computes SHA-256 of downloaded tarball and
fails closed if it doesn't match `expected_sha256` input.

## 11. Package-Identity Gate Result

COMPLETE — publish.yml inspects tarball contents and verifies:
- name == ai-appsec
- version == input version
- mcpName == io.github.subodhkc/ai-appsec
- license == MIT
- repository contains github.com/subodhkc/ai-appsec
- bin contains ai-appsec
- prerelease versions cannot use 'latest' dist-tag

## 12. GitHub npm-release Environment Result

PREPARED in publish.yml (`environment: npm-release`).
Human setup required via GitHub UI:
1. Go to https://github.com/subodhkc/ai-appsec/settings/environments
2. Create environment "npm-release"
3. Enable "Required reviewers" and add yourself

## 13. npm Trusted Publisher Status

**NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED**

publish.yml exists on Main (requirement for workflow_dispatch).
npm Trusted Publisher configuration requires interactive npm web UI.

Human steps:
1. Go to https://www.npmjs.com/package/ai-appsec/access
2. Under "Publishing access", configure Trusted Publisher:
   - Provider: GitHub Actions
   - Owner: subodhkc
   - Repository: ai-appsec
   - Workflow filename: publish.yml
   - Environment: npm-release
3. Save configuration

## 14. Trusted Publisher Identity

- Provider: GitHub Actions
- Owner: subodhkc
- Repository: ai-appsec
- Workflow: publish.yml
- Environment: npm-release

## 15. RC3 Branch

`release/ai-appsec-v0.1.0-rc3`

## 16. RC3 Source Commit

`d261f7a` (CI-qualified commit on RC3 branch)

## 17. RC3 Qualification Run ID

`32364984410` (all 13 jobs SUCCESS)

## 18. Canonical RC3 Tarball

`ai-appsec-0.1.0-rc.3.tgz` (147 files, 112.1 kB packed, 601.8 kB unpacked)

## 19. RC3 SHA-256

`4B5B109A33DCB70BC0F8396C8337E5EFF02DDD701DE15410EE8A2F4A368D19CE`

## 20. Local Tests

276/276 PASS

## 21. Windows Qualification

PASS — Windows Node 22: SUCCESS, Windows Node 24: SUCCESS

## 22. Linux Qualification

PASS — Linux Node 22: SUCCESS, Linux Node 24: SUCCESS

## 23. macOS Qualification

PASS — macOS Node 22: SUCCESS, macOS Node 24: SUCCESS

## 24. Node26 Result

PASS — SUCCESS

## 25. Cross-OS Result

PASS — SUCCESS

## 26. Hard-Offline Result

PASS — SUCCESS

## 27. Supply-Chain Result

PASS — no tokens, no credentials, no private source, no absolute paths

## 28. npm Audit

0 vulnerabilities

## 29. RC3 OIDC Publication

**NOT_YET_PUBLISHED** — awaiting:
1. npm Trusted Publisher configuration (human npm web UI)
2. GitHub npm-release environment configuration (human GitHub UI)
3. latest dist-tag removal (human 2FA)

After those three human actions, trigger:
```
gh workflow run publish.yml \
  -f qualification_run_id=32364984410 \
  -f artifact_name=canonical-tarball \
  -f expected_sha256=4B5B109A33DCB70BC0F8396C8337E5EFF02DDD701DE15410EE8A2F4A368D19CE \
  -f version=0.1.0-rc.3 \
  -f dist_tag=next
```

## 30. npm Next Tag

`next` → `0.1.0-rc.2` (will become `0.1.0-rc.3` after OIDC publication)

## 31. npm Latest Tag

`latest` → `0.1.0-rc.1` (INCORRECT — requires human 2FA removal)

## 32. npm Provenance Result

PENDING — requires OIDC publication to generate provenance attestation

## 33. Source→Qualification→Artifact→Publish→npm Chain

- Source: `d261f7a` on `release/ai-appsec-v0.1.0-rc3` (merged to Main `7c1ffd4`)
- Qualification: CI run `32364984410` (all 13 SUCCESS)
- Artifact: `canonical-tarball` uploaded by qualification workflow
- SHA-256: `4B5B109A33DCB70BC0F8396C8337E5EFF02DDD701DE15410EE8A2F4A368D19CE`
- Publish: pending OIDC Trusted Publishing via publish.yml
- npm: pending

## 34. Bootstrap Token Revocation

PENDING — retire after OIDC RC3 publication is verified

## 35. .env.local Deletion

PENDING — delete after token revocation

## 36. Repository Token Search

CLEAN — no NPM_TOKEN or NODE_AUTH_TOKEN in any workflow file.
Only reference is in .pr-body.md (description text, not code).

## 37. MCP Metadata Validation

VALID — package.json contains mcpName, server.json conforms to 2025-12-11 schema

## 38. MCP Registry Readiness

PREPARED — server.json valid, mcpName present, npm package exists.
Registry publication deferred (stable release only).

## 39. Stable 0.1.0 Status

NOT_PUBLISHED — stable release is a separate founder-authorized phase

## 40. MCP→SaaS Hold

ACTIVE — `MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD: ACTIVE`

## 41. Remaining Blockers

1. **NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED** — configure via npm web UI
2. **NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED** — remove `latest` via interactive 2FA
3. **GITHUB_ENVIRONMENT_HUMAN_SETUP_REQUIRED** — configure `npm-release` environment
4. **RC3_OIDC_PUBLICATION** — trigger publish.yml after above 3 are done
5. **BOOTSTRAP_TOKEN_RETIREMENT** — revoke after OIDC publication verified

## 42. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

Main is reconciled and protected.
publish.yml is corrected (OIDC, SHA-256 gate, identity gate, cross-workflow artifact).
RC3 is technically qualified (276/276 local, 13/13 remote CI).
Three human actions are required before OIDC publication can proceed.
