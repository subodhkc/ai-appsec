# Phase 4C-H — Final Release Supply-Chain Hardening + RC3 Token-Free OIDC Publication + Provenance Verification + Legacy Token Retirement

## 1. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

All release infrastructure is hardened. RC3 is requalified.
One human action remains: npm Trusted Publisher configuration.

## 2. Starting Main SHA

`ed865bbe16ca24aff686634181fd11e827883406`

## 3. Starting RC3 SHA

`07dc3b459753fa216617c3fd25ffaf25fc613084`

## 4. RC3 Final Publication Source SHA

`9acae82782d5fe3205be58285295be939e14a545`

## 5. npm-release Environment

EXISTS — created via GitHub API. Environment ID: 20300129133.

## 6. Environment Branch Restrictions

CONFIGURED — `custom_branch_policies: true` with branch pattern `release/*`.
Only `release/*` branches can trigger deployments to this environment.
Arbitrary feature branches and PR merge refs are excluded.

## 7. Required Reviewer

**GITHUB_FREE_PLAN_LIMITATION** — required reviewers for environments
requires GitHub Pro/Team/Enterprise. The API endpoint returns 404 on
GitHub Free. The `workflow_dispatch` trigger itself serves as the
explicit founder gate (only repo collaborators can dispatch).

Human step for GitHub Pro upgrade if required-reviewer gating is needed:
1. Upgrade to GitHub Pro
2. Go to https://github.com/subodhkc/ai-appsec/settings/environments
3. Enable "Required reviewers" on npm-release

## 8. Prevent Self-Review State

N/A — required reviewers not available on GitHub Free.
When configured on GitHub Pro, "Prevent self-review" must remain OFF
so the founder who dispatches can approve.

## 9. Mutable GitHub Actions References Found

31 mutable `@v4` references found across 3 workflow files:
- publish.yml: 3 references
- phase-4c-cross-platform.yml: 26 references
- ci.yml: 2 references

## 10. Immutable Action Pinning Result

COMPLETE — all 31 references replaced with immutable 40-char commit SHAs:
- actions/checkout → `11d5960a326750d5838078e36cf38b85af677262` # v4
- actions/setup-node → `49933ea5288caeca8642d1e84afbd3f7d6820020` # v4
- actions/upload-artifact → `ea165f8d65b6e75b540449e92b4886f43607fa02` # v4
- actions/download-artifact → `d3f86a106a0bac45b974a628896c90dbdf5c8093` # v4

## 11. Action Dependency Manifest

Created at `docs/release/ACTION-DEPENDENCY-PINS.md` with:
- action name, release version, immutable SHA, upstream repository, verification date

## 12. Canonical Build Cache Result

CONFIGURED — canonical-build job has `cache: ''` (disabled).
Clean `npm ci` install on every canonical build. No restored dependency
cache can influence the release artifact.

## 13. Exact-One-Tarball Gate

COMPLETE — publish.yml fails closed if artifact contains 0 or >1 tarball.
Only proceeds when exactly one `*.tgz` is present.

## 14. Canonical-Manifest Publish Gate

COMPLETE — publish.yml parses `CANONICAL-REMOTE-PACKAGE-MANIFEST.json`
and verifies all fields before publishing:
- qualificationProfile == AI_APPSEC_REMOTE_RELEASE_QUALIFICATION_V1
- repository == subodhkc/ai-appsec
- sourceCommit == expected_source_sha
- workflowRunId == qualification_run_id
- packageName == ai-appsec
- packageVersion == input version
- tarballFilename == actual tarball filename
- tarballSHA256 == sha256:<actual computed SHA256>
- semgrepVersion == 1.173.0

## 15. Trusted Publisher Configuration

**NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED**

`npm trust` CLI is not available (npm 11.6.2).
Configuration requires npm web UI:
1. Go to https://www.npmjs.com/package/ai-appsec/access
2. Under "Publishing access", configure Trusted Publisher:
   - Provider: GitHub Actions
   - Owner: subodhkc
   - Repository: ai-appsec
   - Workflow filename: publish.yml (filename only, NOT .github/workflows/publish.yml)
   - Environment: npm-release
   - Allowed action: npm publish
3. Save

## 16. Trusted Publisher Verification

PENDING — awaiting human npm web UI configuration.

## 17. Node Version

Node 24 (pinned in both workflows)

## 18. npm Version

`npm@11.5.1` (pinned in publish.yml)

## 19. Final RC3 Qualification Run ID

`32443390406`

## 20. Final Qualification Result

SUCCESS — all 13 jobs PASS

## 21. Canonical RC3 Artifact

`ai-appsec-0.1.0-rc.3.tgz` (147 files, 112.1 kB packed, 601.8 kB unpacked)

## 22. Canonical RC3 SHA-256

`4b5b109a33dcb70bc0f8396c8337e5eff02ddd701de15410ee8a2f4a368d19ce`

CANONICAL_BYTES_UNCHANGED — same as previous qualification (source code
unchanged, only workflow files modified).

## 23. Canonical Manifest Result

VERIFIED — CI-generated manifest contains:
- qualificationProfile: AI_APPSEC_REMOTE_RELEASE_QUALIFICATION_V1
- packageName: ai-appsec (derived dynamically)
- packageVersion: 0.1.0-rc.3 (derived dynamically)
- sourceCommit: 9acae82782d5fe3205be58285295be939e14a545

## 24-31. Remote Qualification (all 13 CI jobs)

| Gate | Result |
|------|--------|
| Canonical build | PASS |
| Windows Node 22/24 | PASS |
| Linux Node 22/24 | PASS |
| macOS Node 22/24 | PASS |
| Node 26 canary | PASS |
| Cross-OS equivalence | PASS |
| Hard offline | PASS |
| Process cleanup | PASS |
| Supply-chain review | PASS |
| Package name check | PASS |
| npm audit | 0 vulnerabilities |

## 32. RC3 OIDC Publication Result

**NOT_YET_PUBLISHED** — awaiting npm Trusted Publisher configuration.

After configuration, trigger:
```
gh workflow run publish.yml `
  --ref release/ai-appsec-v0.1.0-rc3 `
  -f qualification_run_id=32442974942 `
  -f artifact_name=canonical-tarball `
  -f expected_sha256=4b5b109a33dcb70bc0f8396c8337e5eff02ddd701de15410ee8a2f4a368d19ce `
  -f expected_source_sha=9acae82782d5fe3205be58285295be939e14a545 `
  -f version=0.1.0-rc.3 `
  -f dist_tag=next
```

## 33. Token-Free Auth Verification

PENDING — requires OIDC publication

## 34-36. npm RC3 Integrity / Tags

PENDING — requires OIDC publication

## 37-38. External Install / MCP Smoke Test

PENDING — requires OIDC publication

## 39-40. npm Provenance / Source Identity

PENDING — requires OIDC publication

## 41-43. Bootstrap Token / .env.local / GitHub Token Cleanup

PENDING — retire after OIDC publication verified

## 44. Legacy npm Token Publishing Status

PENDING — disable token-based publishing after OIDC proven

## 45. MCP Registry Validation

VALID — mcpName present, server.json conforms to 2025-12-11 schema

## 46. Stable 0.1.0 Status

NOT_PUBLISHED

## 47. MCP→SaaS Hold

ACTIVE

## 48. Exact Remaining Blockers

1. **NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED** — configure via npm web UI
2. **RC3_OIDC_PUBLICATION** — trigger publish.yml after Trusted Publisher is configured
3. **NPM_PROVENANCE_VERIFICATION** — verify after OIDC publication
4. **BOOTSTRAP_TOKEN_RETIREMENT** — revoke after OIDC verified
5. **LEGACY_TOKEN_PUBLISHING_DISABLED** — disable token-based publishing after OIDC
6. **NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED** — remove `latest` via 2FA (non-blocking)
7. **GITHUB_PRO_UPGRADE** — optional, for required-reviewer environment gating

## 49. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

All release infrastructure is hardened:
- GitHub Actions pinned to immutable SHAs
- Canonical build uses clean install (no cache)
- publish.yml has exact-one-tarball gate
- publish.yml has canonical manifest verification
- publish.yml has source-SHA binding
- publish.yml has qualification-run verification
- npm-release environment has branch policy (release/*)
- No NPM_TOKEN or NODE_AUTH_TOKEN in any workflow

RC3 is requalified with the hardened infrastructure.
One human action remains: npm Trusted Publisher configuration via web UI.
