# npm Publishing Security Plan

## Phase 4C-C

## Recommended Architecture: Trusted Publishing

```
GitHub Actions (release workflow)
  → OIDC token exchange
  → npm Trusted Publisher
  → npm publish
  → automatic provenance attestation
```

This eliminates long-lived npm publish tokens. The publish action
authenticates via short-lived OIDC tokens issued by GitHub Actions.

## Prerequisites

| Requirement | Status |
|-------------|--------|
| npm CLI (latest) | Required at publish time |
| Node >=22 | Already required |
| Public GitHub repository | YES — `subodhkc/haiec-ai-agent-security-free-mcp` |
| Public package (`private: false`) | YES — package.json `private: false` |
| `repository.url` in package.json | MUST BE ADDED — must match GitHub URL exactly |
| GitHub-hosted runner | YES — `ubuntu-latest` |
| `id-token: write` permission | Must be set in publish workflow |
| npm account | Founder must have npm account |
| npm package pre-creation | First publication may require manual `npm publish` before trusted publishing can be configured |

## First Publication Constraint

npm trusted publishing may require the package to already exist before
it can be configured as a trusted publisher. If so:

1. First publication: manual `npm publish` with a short-lived token
2. Configure trusted publishing for future publications
3. All subsequent publications: via GitHub Actions OIDC

This is a known npm limitation. The founder should verify current
npm trusted-publishing requirements before first publication.

## Human Setup Steps (Separate from Automation)

1. Create npm account if not existing (founder only)
2. Verify package name availability (confirmed: `haiec-agent-security` is AVAILABLE)
3. Configure npm trusted publishing linking:
   - GitHub repository: `subodhkc/haiec-ai-agent-security-free-mcp`
   - Workflow file: `.github/workflows/publish.yml` (to be created)
   - Environment: `release` (recommended)
4. Add `repository` field to package.json:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp.git"
   }
   ```
5. Add `publishConfig` if needed for scoped publishing
6. First publish: either manual or via trusted publishing (verify npm current requirements)

## Provenance Attestation

With trusted publishing and `id-token: write`, npm automatically
generates provenance attestation. This creates a verifiable link
between the published package and the GitHub Actions workflow that
built it.

Consumers can verify:
```bash
npm audit signatures
npm view haiec-agent-security --json | jq '.dist.attestations'
```

## What NOT to Do

- Do NOT store long-lived npm tokens in GitHub Secrets
- Do NOT use `npm config set //registry.npmjs.org/:_authToken` with a persistent token
- Do NOT publish from a local machine (no provenance)
- Do NOT configure npm account settings automatically without explicit founder authorization

## Status

**PLAN_PREPARED** — Not executed. Founder must complete human setup steps
before this plan can be used.
