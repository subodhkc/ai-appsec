# Phase 4C-G — Final RC3 Release-Evidence Reconciliation + Exact-Source OIDC Provenance Proof

## 1. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

RC3 is requalified with corrected release infrastructure.
Three human actions remain before OIDC publication can proceed.

## 2. Main Current SHA

`ed865bbe16ca24aff686634181fd11e827883406`

## 3. RC3 Previous SHA

`d261f7af6e8ddedb7368486009749fea16b48e5c`

## 4. RC3 Final Source SHA

`07dc3b459753fa216617c3fd25ffaf25fc613084`

## 5. Stale Release Constants Found

3 stale references found in qualification workflow:
1. `"phase": "4C-B"` in canonical manifest — STALE_CURRENT → FIXED
2. `"packageVersion": "0.1.0"` in canonical manifest — STALE_CURRENT → FIXED
3. `phase: '4C-B'` in cross-OS evidence — STALE_CURRENT → FIXED

All 3 fixed with dynamic derivation and `qualificationProfile` replacement.

## 6. Canonical-Manifest Fix

COMPLETE — manifest now derives packageName and packageVersion dynamically
from package.json. Uses `qualificationProfile: AI_APPSEC_REMOTE_RELEASE_QUALIFICATION_V1`
instead of stale phase identifiers. Includes sourceCommit, workflowRunId,
workflowRunAttempt, repository.

## 7. Qualification Profile

`AI_APPSEC_REMOTE_RELEASE_QUALIFICATION_V1`

## 8. Dynamic Package Version Result

CI canonical-build derives:
- PACKAGE_NAME = ai-appsec (from package.json)
- PACKAGE_VERSION = 0.1.0-rc.3 (from package.json)

## 9. publish expected_source_sha Gate

COMPLETE — publish.yml accepts `expected_source_sha` input and verifies
`GITHUB_SHA == expected_source_sha` before any other step.

## 10. Qualification-Run Success Gate

COMPLETE — publish.yml fetches qualification run via GitHub API and verifies:
- status == completed
- conclusion == success

## 11. Qualification Head-SHA Gate

COMPLETE — publish.yml verifies `head_sha == expected_source_sha`.

## 12. Publish GITHUB_SHA Gate

COMPLETE — first step in publish job fails closed if
`GITHUB_SHA != expected_source_sha`.

## 13. Pinned Node Version

Node 24 (actions/setup-node@v4 with node-version: '24')

## 14. Pinned npm Version

`npm@11.5.1` (pinned, no unbounded `npm@latest`)

## 15. npm Trusted Publisher Status

**NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED**

`npm trust` CLI is not available in current npm version.
Configuration requires npm web UI:
1. https://www.npmjs.com/package/ai-appsec/access
2. Configure: GitHub Actions / subodhkc / ai-appsec / publish.yml / npm-release
3. Allowed action: npm publish

## 16. GitHub npm-release Environment Status

CONFIGURED — environment `npm-release` created via GitHub API.
Required-reviewer configuration requires GitHub UI:
https://github.com/subodhkc/ai-appsec/settings/environments

## 17. Latest-Tag State

`latest` → `0.1.0-rc.1` (INCORRECT — requires human 2FA removal)
**NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED**
This does NOT block RC3 OIDC publication.

## 18. New RC3 Qualification Run ID

`32440654437`

## 19. Qualification Conclusion

SUCCESS — all 13 jobs PASS

## 20. Canonical Manifest Package/Version

- packageName: ai-appsec
- packageVersion: 0.1.0-rc.3

## 21. Canonical Manifest Source Commit

`07dc3b459753fa216617c3fd25ffaf25fc613084`

## 22. Canonical RC3 Artifact

`ai-appsec-0.1.0-rc.3.tgz` (147 files, 112.1 kB packed, 601.8 kB unpacked)

## 23. Canonical CI SHA-256

`4b5b109a33dcb70bc0f8396c8337e5eff02ddd701de15410ee8a2f4a368d19ce`

## 24. Windows Result

PASS — Windows Node 22: SUCCESS, Windows Node 24: SUCCESS

## 25. Linux Result

PASS — Linux Node 22: SUCCESS, Linux Node 24: SUCCESS

## 26. macOS Result

PASS — macOS Node 22: SUCCESS, macOS Node 24: SUCCESS

## 27. Node26 Result

PASS — SUCCESS

## 28. Cross-OS Result

PASS — SUCCESS

## 29. Hard-Offline Result

PASS — SUCCESS

## 30. Supply-Chain Result

PASS — no tokens, no credentials, no private source

## 31. npm Audit

0 vulnerabilities

## 32. RC3 OIDC Publish Result

**NOT_YET_PUBLISHED** — awaiting:
1. npm Trusted Publisher configuration (human npm web UI)
2. GitHub npm-release required-reviewer setup (human GitHub UI)

After those human actions, trigger:
```
gh workflow run publish.yml \
  --ref release/ai-appsec-v0.1.0-rc3 \
  -f qualification_run_id=32440654437 \
  -f artifact_name=canonical-tarball \
  -f expected_sha256=4b5b109a33dcb70bc0f8396c8337e5eff02ddd701de15410ee8a2f4a368d19ce \
  -f expected_source_sha=07dc3b459753fa216617c3fd25ffaf25fc613084 \
  -f version=0.1.0-rc.3 \
  -f dist_tag=next
```

## 33. Publication Workflow Source SHA

Will be `07dc3b459753fa216617c3fd25ffaf25fc613084` (RC3 branch ref)

## 34. npm RC3 Integrity

PENDING — not yet published

## 35. Next Tag

`next` → `0.1.0-rc.2` (will become `0.1.0-rc.3` after OIDC publication)

## 36. Latest Tag

`latest` → `0.1.0-rc.1` (PRE_STABLE_DIST_TAG_CLEANUP_REMAINING)

## 37. npm Provenance Result

PENDING — requires OIDC publication

## 38. Provenance Source Commit

Will be `07dc3b459753fa216617c3fd25ffaf25fc613084`

## 39. npm Audit Signatures Result

PENDING — requires OIDC publication

## 40. Bootstrap-Token Revocation

PENDING — retire after OIDC RC3 publication verified

## 41. .env.local Deletion

PENDING — delete after token revocation

## 42. Repository Token Search

CLEAN — no NPM_TOKEN or NODE_AUTH_TOKEN in any workflow file

## 43. MCP Metadata Status

VALID — mcpName present in package.json, server.json conforms to 2025-12-11 schema

## 44. MCP Registry Validation

PREPARED — deferred to stable release

## 45. Stable 0.1.0 Status

NOT_PUBLISHED

## 46. MCP→SaaS Hold

ACTIVE — `MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD: ACTIVE`

## 47. Exact Remaining Blockers

1. **NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED** — configure via npm web UI
2. **GITHUB_ENVIRONMENT_REVIEWER_HUMAN_SETUP** — configure required reviewers on npm-release environment
3. **RC3_OIDC_PUBLICATION** — trigger publish.yml after above 2
4. **NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED** — remove `latest` via 2FA (does not block RC3)
5. **BOOTSTRAP_TOKEN_RETIREMENT** — after OIDC verified

## 48. Final Status

**RC3_READY_FOR_OIDC_PUBLICATION**

Release infrastructure is corrected and hardened.
RC3 is requalified with the corrected infrastructure.
Canonical manifest is dynamic and truthful.
publish.yml binds publication to exact source SHA.
Three human actions remain before OIDC publication.
