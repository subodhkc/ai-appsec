# Remote-CI Handoff Package (Phase 4C-A3)

> Updated with exact v0.1.0 final candidate identity.
> NOT committed, NOT pushed, NOT published.

## Exact Remote Validation Candidate

| Field | Value |
|-------|-------|
| Package name | `haiec-agent-security` |
| Package version | `0.1.0` |
| Private flag | `false` (publication-equivalent candidate) |
| Tarball filename | `haiec-agent-security-0.1.0.tgz` |
| Tarball SHA-256 | `sha256:df9b24e5c5e63cb7eb6cf47613bcc98228f89a142f117a3c89a163d648630151` |
| Tarball size | 106,146 bytes |
| Tarball file count | 143 |
| Rulepack version | `0.1.0-rc.6.1-public-core` |
| Rulepack SHA-256 | `sha256:23338e814d3efad9f2c70f0eac2ac17028a7ee7dd27b741e1ed10b86bed0ac92` |
| Manifest SHA-256 | `sha256:205ea6b336953a9cefdfe16800d8ad117ddbc4ab77495a8e51528b67d3fae85f` |
| Semgrep version | `1.173.0` |
| Receipt contract version | `0.1.0` |
| Evidence Envelope version | `0.1.0` |

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

- All tests pass on all 9 OS×Node combinations
- Typecheck clean on all platforms
- npm audit: 0 vulnerabilities
- Tarball install succeeds and MCP initializes via stdio
- Offline scan completes without network access (Linux)
- Semgrep resolver lifecycle tests pass

## MCP→SaaS Integration Hold

**ACTIVE** — MCP evidence must NOT be wired into HAIEC SaaS until Platform U0-U6.

## Phase 4C-B Gates

1. Remote CI execution on Windows/Linux/macOS × Node 20/22/24
2. Hard-network-isolation Linux scan
3. Human/legal provenance approval
4. Founder publication authorization
