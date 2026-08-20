# Phase 4C-E — AI AppSec RC2 Final Report

## 1. Final Status

**AI_APPSEC_PRERELEASE_PUBLISHED_AND_TRUSTED_PUBLISHING_PREPARED**

RC2 is published. Trusted Publishing workflow is prepared but requires
human npm configuration. Bootstrap token retirement is pending.
The `latest` dist-tag requires human 2FA correction.

## 2. Current npm RC1 Status

PUBLISHED — `ai-appsec@0.1.0-rc.1` exists on npm

## 3. Current RC1 Integrity

`sha512-+HNfv6OWo40yplaSVOLrCDO4nQ62YcYtsuCAXPzoqmMOqefreFoIUunwhjjAkjwYQgkyipvBLT354yNWKLpYHw==`

## 4. Current Dist-Tags

```json
{
  "next": "0.1.0-rc.2",
  "latest": "0.1.0-rc.1"
}
```

## 5. Latest-Tag Correction Result

**NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED**

The granular automation token cannot remove the `latest` dist-tag (403 Forbidden).
This requires interactive npm authentication with 2FA.

Safe command (requires 2FA):
```bash
npm dist-tag rm ai-appsec latest
```

Or via npm web UI:
1. Go to https://www.npmjs.com/package/ai-appsec?activeTab=versions
2. Remove the `latest` tag from `0.1.0-rc.1`

Expected state after correction:
- `next` → `0.1.0-rc.2`
- `latest` → absent (until stable 0.1.0 is published)

## 6. Bootstrap Token Status

STORED locally in `.env.local` (gitignored). Used for RC1 and RC2 publication.
Pending retirement after Trusted Publishing is configured.

## 7. Trusted Publisher Configuration

**NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED**

Trusted Publishing requires interactive npm configuration via npm web settings.
The GitHub Actions workflow (`publish.yml`) is prepared with:
- `permissions: id-token: write`
- `environment: npm-release` (founder gate)
- Node 24
- `npm publish --provenance`

Human steps required:
1. Go to https://www.npmjs.com/package/ai-appsec/access
2. Under "Publishing access", configure Trusted Publisher:
   - Provider: GitHub Actions
   - Owner: subodhkc
   - Repository: ai-appsec
   - Workflow filename: publish.yml
3. Save configuration

## 8. Trusted Publisher Identity

- Provider: GitHub Actions
- Owner: subodhkc
- Repository: ai-appsec
- Workflow: publish.yml

## 9. GitHub Release Environment Result

Prepared in `publish.yml`:
- Environment: `npm-release`
- Requires manual approval (if repository tier supports it)
- If GitHub Free tier: environment exists but approval gating may require
  repository settings configuration via GitHub UI

Human setup (if needed):
1. Go to https://github.com/subodhkc/ai-appsec/settings/environments
2. Create environment `npm-release`
3. Enable "Required reviewers" and add yourself

## 10. Package mcpName Result

ADDED — `"mcpName": "io.github.subodhkc/ai-appsec"` in package.json

## 11. server.json Result

CREATED at `.mcp/server.json` with:
- Schema: `https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json`
- Name: `io.github.subodhkc/ai-appsec`
- Description: "Evidence-backed AppSec for AI applications and agents. Powered by HAIEC."
- Title: "AI AppSec"
- Repository: `https://github.com/subodhkc/ai-appsec`
- Version: `0.1.0-rc.2`
- Package: npm / ai-appsec / 0.1.0-rc.2
- Transport: stdio
- No environment variables (no HAIEC account, no API key)

## 12. MCP Schema Validation Result

**MCP_SERVER_JSON_VALID** — server.json conforms to the 2025-12-11 schema.
Schema URL matches official MCP Registry documentation.
All required fields present. No extra/invented fields.

## 13. RC2 Version

`0.1.0-rc.2`

## 14. RC2 Branch

`release/ai-appsec-v0.1.0-rc2`

## 15. RC2 Source Commit

`a8dc4fd` (CI-qualified commit)

## 16. RC2 Local Tests

276/276 PASS (0 failures, 0 cancelled, 0 skipped)

## 17. Canonical RC2 Tarball

`ai-appsec-0.1.0-rc.2.tgz` (147 files, 112.1 kB packed, 601.8 kB unpacked)

## 18. RC2 SHA-256

`220767864D7D9B6645A08F659E21519D284A8DFA3674B1F76E276DF4CEC4BDEA`

## 19. Windows Qualification

PASS — Windows Node 22: SUCCESS, Windows Node 24: SUCCESS

## 20. Linux Qualification

PASS — Linux Node 22: SUCCESS, Linux Node 24: SUCCESS

## 21. macOS Qualification

PASS — macOS Node 22: SUCCESS, macOS Node 24: SUCCESS

## 22. Node26 Canary

PASS — SUCCESS

## 23. Cross-OS Semantic Equality

PASS — SUCCESS

## 24. Hard Offline Result

PASS — SUCCESS

## 25. npm Audit

0 vulnerabilities

## 26. Supply-Chain Result

PASS — no tokens, no credentials, no .env files, no private HAIEC source,
no Kestrel source, no absolute local paths, no debug artifacts

## 27. RC2 npm Publication Status

**PUBLISHED** — `ai-appsec@0.1.0-rc.2` is live on npm

## 28. Next Dist-Tag

`next` → `0.1.0-rc.2` (correct)

## 29. Latest Dist-Tag

`latest` → `0.1.0-rc.1` (INCORRECT — requires human 2FA removal)

## 30. npm Provenance Result

**NOT_AVAILABLE** — RC2 was published with bootstrap token, not OIDC.
Provenance requires Trusted Publishing via GitHub Actions OIDC.

## 31. Exact Source→Workflow→Artifact→npm Chain

- Source commit: `a8dc4fd` on `release/ai-appsec-v0.1.0-rc2`
- CI workflow run: `32362565608` (all 13 jobs SUCCESS)
- Canonical tarball: `ai-appsec-0.1.0-rc.2.tgz`
- SHA-256: `220767864D7D9B6645A08F659E21519D284A8DFA3674B1F76E276DF4CEC4BDEA`
- npm integrity: `sha512-K6PLLC8S9UInkHZBGLfX/Pv2U+Y1DixRqyO8fmdPvXUB6xTj460Mzg/dtoYs3GehZNSf6hPhzVdGi7unf2riDQ==`
- npm URL: https://registry.npmjs.org/ai-appsec/-/ai-appsec-0.1.0-rc.2.tgz

## 32. Bootstrap Token Revocation Result

**PENDING** — token still active. Must be revoked after Trusted Publishing is configured.
See BOOTSTRAP-NPM-TOKEN-RETIREMENT.md for the retirement plan.

## 33. .env.local Removal Result

**PENDING** — .env.local still exists. Will be deleted after token revocation.
Confirmed gitignored via `.env.*` pattern.

## 34. MCP Registry Validation Result

**MCP_REGISTRY_RC2_VALIDATED** — server.json is valid against the 2025-12-11 schema.
Package.json contains `mcpName`. npm package with `mcpName` exists.
Registry publication is deferred (stable release only).

## 35. Stable 0.1.0 Status

NOT_PUBLISHED — stable 0.1.0 must not be published in this phase

## 36. MCP→SaaS Hold

ACTIVE — `MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD: ACTIVE`

## 37. Confirmation Main Not Merged

CONFIRMED — Main remains at `fd27714`. No merge performed.

## 38. Confirmation No Stable Tag

CONFIRMED — zero tags exist. No tag created.

## 39. Remaining Blockers

1. **NPM_LATEST_TAG_HUMAN_ACTION_REQUIRED** — remove `latest` tag via interactive 2FA
2. **NPM_TRUSTED_PUBLISHER_HUMAN_AUTH_REQUIRED** — configure Trusted Publishing via npm web UI
3. **BOOTSTRAP_TOKEN_RETIREMENT** — revoke token after Trusted Publishing is verified
4. **NPM_PROVENANCE** — requires OIDC publication to generate provenance attestation
5. **GitHub Environment** — configure `npm-release` environment with required reviewers

## 40. Final Status

**AI_APPSEC_PRERELEASE_PUBLISHED_AND_TRUSTED_PUBLISHING_PREPARED**

RC2 is technically qualified and published.
Trusted Publishing workflow is prepared but requires human npm configuration.
Bootstrap token retirement is pending Trusted Publishing verification.
The `latest` dist-tag requires human 2FA correction.
Stable 0.1.0 remains unpublished.
