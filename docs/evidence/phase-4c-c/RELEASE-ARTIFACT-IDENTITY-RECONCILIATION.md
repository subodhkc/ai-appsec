# Release Artifact Identity Reconciliation

## Phase 4C-C — Part 15

## Commit Chain

| Label | Commit SHA | Description |
|-------|-----------|-------------|
| QUALIFIED_SOURCE_COMMIT | `b0eac0e` | `release: qualify HAIEC Agent Security v0.1.0 RC1` |
| (CI fix) | `ceb40ba` | `fix: install Semgrep in canonical-build before running tests` |
| (CI fix) | `c6b3ae9` | `fix: CI workflow — tarball glob, MCP client dep, supply-chain grep` |
| (CI fix) | `a443f65` | `fix: offline isolation — build Docker image with Semgrep pre-installed` |
| (CI fix) | `fc47e16` | `fix: unique matrix evidence filenames for cross-OS comparison` |
| LATEST_RELEASE_BRANCH_COMMIT | `b8a3ff7` | `evidence: Phase 4C-B remote qualification evidence + index` |

## Files Changed Since QUALIFIED_SOURCE_COMMIT

```
.github/workflows/phase-4c-cross-platform.yml
docs/evidence/phase-4c-b/PHASE-4C-B-REMOTE-QUALIFICATION.json
docs/evidence/phase-4c-b/phase-4c-b-evidence-index.json
```

## Package-Byte Impact Analysis

| Changed File | In npm `files`? | Package-byte-affecting? |
|-------------|-----------------|------------------------|
| `.github/workflows/phase-4c-cross-platform.yml` | NO | NO — CI workflow only |
| `docs/evidence/phase-4c-b/PHASE-4C-B-REMOTE-QUALIFICATION.json` | NO | NO — evidence doc only |
| `docs/evidence/phase-4c-b/phase-4c-b-evidence-index.json` | NO | NO — evidence index only |

## npm `files` Field (What Goes Into the Tarball)

```json
["dist", "rules/public-core", "LICENSE", "THIRD_PARTY_NOTICES.md", "TRADEMARKS.md"]
```

npm also always includes: `package.json`, `README.md` (if present),
`LICENSE` (if present), `CHANGELOG.md` (if present).

## Conclusion: Is the Phase 4C-B Tarball Still Byte-Current?

**YES — the Phase 4C-B canonical tarball is still byte-current RELATIVE TO
THE QUALIFIED_SOURCE_COMMIT.**

No package-included file (`dist/`, `rules/public-core/`, `LICENSE`,
`THIRD_PARTY_NOTICES.md`, `TRADEMARKS.md`, `package.json`, `README.md`)
was changed between `b0eac0e` and `b8a3ff7`.

The changes were:
- CI workflow fixes (not in tarball)
- Evidence documents (not in tarball)

## BUT: Phase 4C-C Will Change Package-Included Files

The following Phase 4C-C corrections WILL change package-included files:

| File | Change | In tarball? |
|------|--------|-------------|
| `package.json` | description, license, repository, homepage, bugs, keywords | YES |
| `README.md` | status update, tool presentation, test count, license section | YES |
| `THIRD_PARTY_NOTICES.md` | resolve MIT contradiction (if confirmed) | YES |
| `TRADEMARKS.md` | resolve MIT contradiction (if confirmed) | YES |
| `LICENSE` | confirm or change (human decision) | YES |
| `SECURITY.md` | post-release-ready wording | NO (not in `files`) |

## Tarball Status

**CURRENT** (relative to qualified source commit `b0eac0e`)

**WILL BECOME SUPERSEDED_FOR_PUBLICATION** when Phase 4C-C corrections
to package-included files are applied.

The Phase 4C-B canonical tarball SHA:
`sha256:7790ca18141830ead9b6d12dffb00415dec06d63db8ac0a8a37e2fbe7a1d9f29`

...is preserved as historical Phase 4C-B evidence. It is NOT the final
publication artifact.
