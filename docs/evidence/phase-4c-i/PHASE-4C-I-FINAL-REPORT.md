# Phase 4C-I — Execute RC3 Trusted Publication + Verify OIDC Provenance + Retire Bootstrap Credential + Declare Stable Readiness

## 1. Final Status

**RC3_OIDC_PROVENANCE_VERIFIED_TOKEN_RETIREMENT_HUMAN_ACTION_REQUIRED**

RC3 is published via token-free OIDC Trusted Publishing.
npm provenance is verified (SLSA v1).
External install and MCP smoke test pass.
Bootstrap token retirement requires human npm web UI action.

## 2. RC3 Source SHA

`6613ab9e1824af8d08d4c46330baa840bbf30628`

## 3. Qualification Run

`32443737779`

## 4. Qualification Status

completed / success (all 13 jobs PASS)

## 5. npm Trusted Publisher Status

CONFIGURED (user-confirmed) — Trusted Publishing accepted the OIDC identity

## 6. Trusted Publisher Exact Identity

- Provider: GitHub Actions
- Owner: subodhkc
- Repository: ai-appsec
- Workflow: publish.yml
- Environment: npm-release

## 7. Trusted Publisher Permissions

npm publish: ALLOWED (confirmed by successful OIDC publication)

## 8. Excess Stage-Publish Permission Status

UNKNOWN — requires npm web UI verification at https://www.npmjs.com/package/ai-appsec/access
If stage publish is enabled: TRUST_PERMISSION_HARDENING_REMAINING
Preferred: npm publish = YES, npm stage publish = NO

## 9. npm-release Environment

EXISTS — environment ID 20300129133, branch policy release/*

## 10. release/* Restriction

ACTIVE — custom_branch_policies: true, pattern release/*

## 11. Required Reviewer

NOT_CONFIGURED_VIA_API — deployment-protection-rules API returns 404 on GitHub Free.
Human step: https://github.com/subodhkc/ai-appsec/settings/environments → npm-release → Required reviewers → add subodhkc

## 12. Prevent Self-Review State

N/A — required reviewers not yet configured. When configured, must remain OFF.

## 13. Publish Workflow Run ID

`32444952404`

## 14. Environment Approval Result

NO_APPROVAL_REQUIRED — environment has no required reviewers configured.
Workflow proceeded directly (workflow_dispatch serves as founder gate).

## 15. Token-Free OIDC Result

**RC3_OIDC_PUBLICATION_VERIFIED**

All 14 workflow steps SUCCESS:
- GITHUB_SHA gate: PASS
- Qualification run verification: PASS
- Cross-workflow artifact download: PASS
- Exact-one-tarball gate: PASS
- SHA-256 gate: PASS
- Canonical manifest verification: PASS
- Package identity inspection: PASS
- npm publish via OIDC: SUCCESS (no NPM_TOKEN, no NODE_AUTH_TOKEN)
- Publication verification: PASS

## 16. RC3 npm Publication

PUBLISHED — `ai-appsec@0.1.0-rc.3` is live on npm

## 17. RC3 npm Integrity

`sha512-Kh+xBk/509XafZCg7c2Tv+NcGn6NuH4T8DY3rrsCayiXbWnVufIZa+15nGmhKGIho6k6RNAmkuW84J8gs95zuw==`

## 18. npm Tarball URL

https://registry.npmjs.org/ai-appsec/-/ai-appsec-0.1.0-rc.3.tgz

## 19. Next Tag

`next` → `0.1.0-rc.3` (correct)

## 20. Latest Tag

`latest` → `0.1.0-rc.1` (PRE_STABLE_DIST_TAG_CLEANUP_REMAINING — requires human 2FA)

## 21. External Install Result

PASS — `npm install ai-appsec@next` in clean temp directory
- Installed version: 0.1.0-rc.3
- mcpName: io.github.subodhkc/ai-appsec

## 22. Doctor Result

PASS — `npx ai-appsec@next doctor`
- Semgrep engine: READY (v1.173.0)
- AI AppSec home: detected

## 23. MCP Initialize Result

PASS — server name: ai-appsec, server version: 0.1.0-rc.3

## 24. tools/list Result

PASS — 1 tool returned

## 25. scan_ai_security Presence

CONFIRMED — scan_ai_security is the registered tool

## 26. npm Provenance Result

**NPM_PROVENANCE_VERIFIED**

SLSA provenance v1 attestation present:
- predicateType: https://slsa.dev/provenance/v1
- attestation URL: https://registry.npmjs.org/-/npm/v1/attestations/ai-appsec@0.1.0-rc.3
- sigstore bundle with OIDC certificate

## 27. Provenance Source Repository

`subodhkc/ai-appsec` (confirmed in OIDC certificate)

## 28. Provenance Workflow/Source Identity

- Workflow: publish.yml
- Ref: refs/heads/release/ai-appsec-v0.1.0-rc3
- Environment: npm-release
- Runner: github-hosted
- Trigger: workflow_dispatch
- Source SHA: 6613ab9e1824af8d08d4c46330baa840bbf30628

## 29. Complete Source→npm Chain

```
RC3 source commit: 6613ab9e1824af8d08d4c46330baa840bbf30628
  ↓
qualification run: 32443737779 (13/13 SUCCESS)
  ↓
canonical artifact: ai-appsec-0.1.0-rc.3.tgz
  ↓
SHA-256: 4b5b109a33dcb70bc0f8396c8337e5eff02ddd701de15410ee8a2f4a368d19ce
  ↓
OIDC publish workflow run: 32444952404 (14/14 steps SUCCESS)
  ↓
npm: ai-appsec@0.1.0-rc.3
  ↓
npm integrity: sha512-Kh+xBk/509XafZCg7c2Tv+NcGn6NuH4T8DY3rrsCayiXbWnVufIZa+15nGmhKGIho6k6RNAmkuW84J8gs95zuw==
  ↓
npm provenance: SLSA v1 (sigstore, OIDC-verified)
```

No gap. Every link verified.

## 30. Bootstrap Token Revocation

**NPM_BOOTSTRAP_TOKEN_REVOCATION_HUMAN_ACTION_REQUIRED**

Granular tokens cannot be revoked via `npm token revoke` CLI.
Human step:
1. Go to https://www.npmjs.com/settings/kingcaliber/tokens
2. Find the granular bootstrap token
3. Revoke/delete it

## 31. .env.local Deletion

PENDING — must not delete until token is revoked (per phase instructions).
.env.local exists locally, is gitignored (.env.*), and is NOT in git history.

## 32. GitHub npm-secret Cleanup

CLEAN — no GitHub secrets exist (`gh secret list` returns empty).

## 33. Legacy Token Publishing Status

**NPM_DISABLE_TOKEN_PUBLISHING_HUMAN_ACTION_REQUIRED**

After token revocation, disable token-based publishing via npm web UI:
1. Go to https://www.npmjs.com/package/ai-appsec/access
2. Set "Require two-factor authentication" for publishing
3. Disallow token-based publishing
4. Trusted Publishing OIDC must remain functional

## 34. Trusted Publisher Least-Privilege Status

TRUST_PERMISSION_HARDENING_REMAINING — verify via npm web UI:
- npm publish: should remain YES
- npm stage publish: should be NO (remove if enabled)

## 35. MCP Registry Validation

VALID — package.json mcpName = io.github.subodhkc/ai-appsec,
server.json name = io.github.subodhkc/ai-appsec, version = 0.1.0-rc.3,
npm identifier = ai-appsec, transport = stdio

## 36. Stable 0.1.0 Status

NOT_PUBLISHED — stable release is a separate founder-authorized phase

## 37. MCP→SaaS Hold

ACTIVE — MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD: ACTIVE

## 38. Exact Remaining Blockers

1. **NPM_BOOTSTRAP_TOKEN_REVOCATION_HUMAN_ACTION_REQUIRED** — revoke granular token via npm web UI
2. **.env.local deletion** — after token revocation
3. **NPM_DISABLE_TOKEN_PUBLISHING_HUMAN_ACTION_REQUIRED** — disable token-based publishing via npm web UI
4. **NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED** — remove `latest` via 2FA (or stable 0.1.0 will replace it)
5. **TRUST_PERMISSION_HARDENING_REMAINING** — remove stage-publish permission if enabled
6. **GITHUB_ENVIRONMENT_REVIEWER_HUMAN_SETUP** — configure required reviewers (optional, GitHub UI)

## 39. Final Status

**RC3_OIDC_PROVENANCE_VERIFIED_TOKEN_RETIREMENT_HUMAN_ACTION_REQUIRED**

RC3 is published via token-free OIDC Trusted Publishing.
npm SLSA v1 provenance is verified.
External install and MCP smoke test pass.
Bootstrap token retirement requires human npm web UI action.
After token retirement and .env.local deletion, stable readiness can be declared.
