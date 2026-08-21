# Phase 4C-J — Stable v0.1.0 Release + Staged OIDC Publishing + 2FA Founder Approval + GitHub Release + Official MCP Registry Publication

## 1. Final Status

**AI_APPSEC_V0_1_0_PUBLIC_RELEASE_COMPLETE**

## 2. RC3 Source Baseline

`6613ab9e1824af8d08d4c46330baa840bbf30628`

## 3. Stable Branch

`release/ai-appsec-v0.1.0` — created from exact RC3 source

## 4. Stable Source SHA

`83ea5f6490f55e13509cba3de4b40744719f5e0e`

## 5. Version Migration Result

COMPLETE — 0.1.0-rc.3 → 0.1.0 across all current version-bearing surfaces:
- package.json, package-lock.json, .mcp/server.json, src/mcp/protocol.ts, tests/mcp/server-factory.test.ts
- Historical RC evidence files preserved unchanged

## 6. Stable README Result

COMPLETE — primary install changed from `@next` to stable:
- `npm install -g ai-appsec`
- `npx ai-appsec doctor`
- Prerelease channel note retained for `@next`

## 7. CHANGELOG Result

CREATED — CHANGELOG.md with 0.1.0 entry covering all features

## 8. Release Notes Result

CREATED — docs/release/V0.1.0-RELEASE-NOTES.md with full release notes

## 9. Claims Audit

PASS — no overclaiming. All claims supported by qualification evidence.
- No "complete compliance", "certification", "guaranteed security", "zero vulnerabilities"
- Honest limitations documented
- COMPLETE/PARTIAL/ERROR evidence semantics preserved

## 10. Bootstrap Token Status

USER_CONFIRMED_REVOKED — .env.local deleted, no GitHub NPM_TOKEN secret

## 11. .env.local Status

DELETED — no longer exists

## 12. Token Publishing Policy

HUMAN_CONFIRMED_SECURITY_SETTING — staged publishing via OIDC, 2FA approval required

## 13. Trusted Publisher Permissions

npm stage publish: ENABLED (used for stable publication)
npm publish: available (used for RC3 publication)

## 14. npm CLI Version Used for Staging

`npm@11.19.0` (supports npm stage publish, >= 11.15.0 required)

## 15. Local Stable Tests

PASS — 276/276 tests, 0 failures, typecheck PASS, build PASS, npm audit 0 vulnerabilities

## 16. Stable Qualification Run ID

`32447396236`

## 17. Stable Canonical Artifact

`ai-appsec-0.1.0.tgz` (147 files, 112.2 kB packed, 601.8 kB unpacked)

## 18. Stable Canonical SHA-256

`da6ff38dbd16e0da0b448aa06e1e57ff48fbab60485acb3cc9775c0167d0042a`

## 19-27. Remote Qualification (all 13 CI jobs)

| Gate | Result |
|------|--------|
| Windows Node 22/24 | PASS |
| Linux Node 22/24 | PASS |
| macOS Node 22/24 | PASS |
| Node 26 canary | PASS |
| Cross-OS equivalence | PASS |
| Hard offline | PASS |
| Process cleanup | PASS |
| Supply-chain review | PASS |
| npm audit | 0 vulnerabilities |

## 28. Stable Main Merge Result

MERGED — PR #5, Main at `8dbd597`

## 29. npm Stage Operation Result

SUCCESS — staged via OIDC Trusted Publishing from GitHub Actions
- Stage ID: `205b84bb-7dd6-497b-b2e8-9aa944aacb3e`
- SLSA provenance signed
- Run: `32447718792`

## 30. Stage ID

`205b84bb-7dd6-497b-b2e8-9aa944aacb3e`

## 31. Founder 2FA Approval Status

APPROVED — founder approved staged package with 2FA via npmjs.com

## 32. Stable npm Publication

PUBLISHED — `ai-appsec@0.1.0` is live on npm

## 33. Latest Dist-Tag

`latest` → `0.1.0` (correct — old RC1 latest replaced)

## 34. Next Dist-Tag

`next` → `0.1.0-rc.3` (prerelease channel preserved)

## 35. Stable npm Integrity

`sha512-Bi5xPuD2SRlDjRGREqDBAjrhGihRx8t4mIb8NOUr8ekgK3Q7ksg9FbnFoDhaATBJD8fH7If/bQ07qwPjQD67eQ==`

## 36. Stable npm Provenance

VERIFIED — SLSA provenance v1 with sigstore

## 37. Provenance Source Identity

- Repository: subodhkc/ai-appsec
- Workflow: publish.yml
- Ref: refs/heads/release/ai-appsec-v0.1.0
- Environment: npm-release
- Runner: github-hosted
- Source SHA: 83ea5f6490f55e13509cba3de4b40744719f5e0e

## 38. External Stable Install

PASS — `npm install ai-appsec` in clean temp directory, version 0.1.0

## 39. Doctor Result

PASS — Semgrep READY, AI AppSec home detected

## 40. MCP Initialize

PASS — server: ai-appsec, version: 0.1.0

## 41. tools/list

PASS — 1 tool returned

## 42. scan_ai_security Result

CONFIRMED — scan_ai_security is the registered MCP tool

## 43. v0.1.0 Git Tag

CREATED — annotated tag `v0.1.0` at commit `83ea5f6490f55e13509cba3de4b40744719f5e0e`

## 44. GitHub Release

CREATED — https://github.com/subodhkc/ai-appsec/releases/tag/v0.1.0
Title: AI AppSec v0.1.0

## 45. MCP Registry Schema Validation

VALID — `mcp-publisher validate` passed against https://registry.modelcontextprotocol.io

## 46. MCP Registry Publication

PUBLISHED — via `mcp-publisher publish` with GitHub OIDC from GitHub Actions
Run: `32449269836`

## 47. MCP Registry Production Verification

VERIFIED — server `io.github.subodhkc/ai-appsec` v0.1.0 is live on the official MCP Registry
- Status: active
- Published: 2026-08-21T05:05:37Z
- Name: io.github.subodhkc/ai-appsec
- Version: 0.1.0
- Transport: stdio
- npm package: ai-appsec

## 48. Discovery Validation

- npm: `ai-appsec@0.1.0` live, `latest` → 0.1.0
- MCP Registry: `io.github.subodhkc/ai-appsec` searchable and active
- GitHub: repository `subodhkc/ai-appsec` with Release v0.1.0
- Keywords: ai-security, ai-appsec, application-security, ai-agent-security, mcp, mcp-security, sast, llm-security, security-audit, security-scan, security-evidence

## 49. Final Security Posture

- Bootstrap token: revoked (user-confirmed)
- .env.local: deleted
- Token publishing: staged OIDC with 2FA approval
- Trusted Publisher: configured for GitHub Actions OIDC
- No NPM_TOKEN in any workflow
- No NODE_AUTH_TOKEN in any workflow
- Main: protected (no force-push)
- Release Actions: SHA-pinned (immutable)
- npm stable provenance: verified (SLSA v1)
- Git tag: v0.1.0 at exact stable source
- GitHub Release: exists
- MCP Registry: stable entry published

## 50. MCP→SaaS Hold

ACTIVE — MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD preserved

## 51. Exact Remaining Blockers

None for stable v0.1.0 release.

Optional future hardening (non-blocking):
1. Remove npm stage-publish permission if not needed for future releases
2. Configure required reviewers for npm-release environment (GitHub Pro)
3. Remove old `latest` → `0.1.0-rc.1` (already replaced by stable 0.1.0)

## 52. Final Status

**AI_APPSEC_V0_1_0_PUBLIC_RELEASE_COMPLETE**

All release gates passed:
- npm stable complete (latest → 0.1.0)
- stable provenance verified (SLSA v1)
- clean install verified
- Git tag exists (v0.1.0)
- GitHub Release exists
- Official MCP Registry entry published
- release credentials hardened
- MCP→SaaS hold remains active
