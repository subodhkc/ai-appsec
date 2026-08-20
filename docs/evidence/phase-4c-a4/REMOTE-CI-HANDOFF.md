# Remote-CI Handoff Package (Phase 4C-A4)

> Updated with exact v0.1.0 final candidate identity.
> NOT committed, NOT pushed, NOT published.

## Exact Remote Validation Candidate

| Field | Value |
|-------|-------|
| Package name | `haiec-agent-security` |
| Package version | `0.1.0` |
| Private flag | `false` (publication-equivalent candidate) |
| Tarball filename | `haiec-agent-security-0.1.0.tgz` |
| Tarball SHA-256 | `sha256:702b40f5b937340ee2032b846790a139d7361d384767f7585d0725f257e33868` |
| Tarball size | 109,966 bytes |
| Tarball file count | 147 |
| Rulepack version | `0.1.0-rc.6.1-public-core` |
| Rulepack SHA-256 | `sha256:23338e814d3efad9f2c70f0eac2ac17028a7ee7dd27b741e1ed10b86bed0ac92` |
| Manifest SHA-256 | `sha256:205ea6b336953a9cefdfe16800d8ad117ddbc4ab77495a8e51528b67d3fae85f` |
| Semgrep version | `1.173.0` |
| Receipt contract version | `0.1.0` |
| Evidence Envelope version | `0.1.0` |
| Coverage contract version | `0.1.0` |

## Critical: Remote CI Must Test This Exact Tarball

Remote CI must NOT rebuild a semantically different tarball and call it
equivalent. The exact tarball SHA-256 above must be validated.

## Two-Corpus Qualification Model

### COMPLETE_GOLDEN_CORPUS
- Purpose: semantic reproducibility qualification
- Expected: COMPLETE, all Receipt digests identical across processes
- Location: `tests/fixtures/complete-golden-corpus/` (must be placed outside repo for Semgrep)

### KESTREL_PARTIAL_CORPUS
- Purpose: real-world limitation / truthful coverage qualification
- Expected: PARTIAL, coverageDigest and semanticReceiptDigest may differ
- Location: external Kestrel repository worktree

## CI Workflow

File: `.github/workflows/phase-4c-cross-platform.yml`

### Matrix
| OS | Node 20 | Node 22 | Node 24 |
|----|---------|---------|---------|
| windows-latest | ✓ | ✓ | ✓ |
| ubuntu-latest | ✓ | ✓ | ✓ |
| macos-latest | ✓ | ✓ | ✓ |

## MCP→SaaS Integration Hold

**ACTIVE** — MCP evidence must NOT be wired into HAIEC SaaS until Platform U0-U6.

## Phase 4C-B Gates

1. Remote CI execution on Windows/Linux/macOS × Node 20/22/24
2. Hard-network-isolation Linux scan
3. Human/legal provenance approval (PENDING_HUMAN_REVIEW for all 122 detectors)
4. Founder publication authorization
