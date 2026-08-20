# Bootstrap NPM Token Retirement Plan

## Phase 4C-E — Part 3

## Current State

- A granular npm access token was used to bootstrap-publish `ai-appsec@0.1.0-rc.1`
- The token is stored locally in `.env.local` (gitignored via `.env.*` pattern)
- The token has limited permissions (publish only) but is plaintext locally
- npm Trusted Publishing has NOT yet been configured

## Retirement Plan

```
1. Trusted Publisher configured on npm
   ↓
2. OIDC publishing verified via GitHub Actions
   ↓
3. Bootstrap token revoked in npm settings
   ↓
4. Local .env.local deleted
   ↓
5. Shell environment variable cleared
   ↓
6. Verify .env.local absent
   ↓
7. Verify git continues ignoring .env.*
   ↓
8. Verify no token entered repository history
```

## Token Security Notes

- Token is NEVER printed in any evidence document
- Token is NEVER committed to git
- Token is NEVER included in logs
- `.env.local` is gitignored (confirmed via `git check-ignore .env.local`)
- Token was only used for bootstrap publication of RC1
- Token should NOT be reused for RC2 publication (use OIDC instead)

## Status

**PENDING** — Trusted Publishing must be configured and verified before
token revocation. Revoking the token before OIDC is proven would lock
out all publication access.
