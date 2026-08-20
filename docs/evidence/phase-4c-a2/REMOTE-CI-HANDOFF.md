# Remote-CI Handoff Package (Phase 4C-A2)

> Updated with exact v0.1.0 publication-equivalent candidate identity.
> NOT committed, NOT pushed, NOT published.

## Exact Remote Validation Candidate

| Field | Value |
|-------|-------|
| Package name | `haiec-agent-security` |
| Package version | `0.1.0` |
| Private flag | `false` (publication-equivalent candidate) |
| Tarball filename | `haiec-agent-security-0.1.0.tgz` |
| Tarball SHA-256 | `sha256:3ff2a6a27c7eadcbb04d7ac47d5186ee5b21d26c5f6a862bb5406fdd30b259dd` |
| Tarball size | 102,096 bytes |
| Tarball file count | 139 |
| Rulepack SHA-256 | `sha256:013e2da09d22ceb9786109a2c04f82a80288213a42427d85c1a301ad5640289e` |
| Manifest SHA-256 | `sha256:1aecdab24032115c1cb454d06261689db64efd416290de3b9af2867aa0a16712` |
| Semgrep version | `1.173.0` |

## Critical: Remote CI Must Test This Exact Tarball

Remote CI must NOT rebuild a semantically different tarball and call it
equivalent. The exact tarball SHA-256 above must be validated.

## CI Workflow

File: `.github/workflows/phase-4c-cross-platform.yml`

### Matrix
| OS | Node 20 | Node 22 | Node 24 |
|----|---------|---------|---------|
| windows-latest | ✓ | ✓ | ✓ |
| ubuntu-latest | ✓ | ✓ | ✓ |
| macos-latest | ✓ | ✓ | ✓ |

### Jobs
1. `cross-platform` — typecheck, build, test, audit (9 combinations)
2. `tarball-install` — clean install from tarball + MCP initialization (3 OS)
3. `offline-scan` — network-isolated scan test (Linux only)
4. `semgrep-resolver` — resolver lifecycle tests (Linux)

## Expected PASS Criteria

- All tests pass on all 9 OS×Node combinations (excluding pre-existing
  no-semgrep-recovery tests that require Semgrep NOT installed)
- Typecheck clean on all platforms
- npm audit: 0 vulnerabilities
- Tarball install succeeds and MCP initializes via stdio
- Offline scan completes without network access (Linux)
- Semgrep resolver lifecycle tests pass

## MCP→SaaS Integration Hold

**ACTIVE** — MCP evidence must NOT be wired into HAIEC SaaS until Platform U0-U6.

## Commands Founder May Authorize Later

```bash
# Stage all Phase 4C-A2 changes
git add -A

# Commit
git commit -m "Phase 4C-A2: final local release-candidate reconciliation

- Add dedicated rc.6 rule fixtures (api-key-in-error-js/python)
- Implement dual-digest receipt model (semanticReceiptDigest + receiptDocumentDigest)
- Add parseFailureFileSetDigest to receipt
- Correct provenance terminology (HAIEC_ASSERTED, INCOMPLETE evidence)
- Prepare v0.1.0 publication-equivalent candidate
- Verify cross-session Kestrel reproducibility (3 independent processes)
- Verify direct-vs-tarball EXACT_MATCH
- Fix evidence index DAG (no circular dependencies)

Generated with [Devin](https://devin.ai)"

# Push (after founder authorization)
git pull origin main
git push origin main

# Tag (after remote CI passes)
git tag v0.1.0
git push origin v0.1.0
```
