# Remote-CI Handoff Package (Phase 4C-A Part 19)

> Prepared for Phase 4C-B remote CI execution. NOT committed, NOT pushed.

## Files Requiring Commit

The following files were created or modified during Phase 4C-A and need to be
committed before remote CI can execute:

### Modified files:
1. `rules/public-core/manifest.json` — detector revision rc.5→rc.6 for api-key-in-error
2. `src/engines/ai-security/rulepack-provider.ts` — expected manifest digest update
3. `src/engines/ai-security/scan-receipt.ts` — filesSkippedByEngine excluded from digests
4. `README.md` — claim integrity update
5. `PHASES.md` — Phase 4C-A documentation
6. `scripts/c2r-kestrel-three-run-determinism.ts` — updated classification

### New files:
1. `.github/workflows/phase-4c-cross-platform.yml` — CI workflow
2. `docs/evidence/phase-4c/RELEASE-FREEZE-MANIFEST.json`
3. `docs/evidence/phase-4c/VERSION-IDENTITY-MATRIX.md`
4. `docs/evidence/phase-4c/PUBLIC-CORE-PROVENANCE-RELEASE-PACKET.md`
5. `docs/evidence/phase-4c/PARSER-FAILURE-CLASSIFICATION.md`
6. `docs/evidence/phase-4c/OFFLINE-VALIDATION.md`
7. `docs/evidence/phase-4c/kestrel-three-run-determinism.json`
8. `docs/architecture/HAIEC-DOWNSTREAM-OUTPUT-INTEGRITY-HANDOFF.md`
9. `scripts/phase-4c-receipt-stability.ts`

## CI Workflow

File: `.github/workflows/phase-4c-cross-platform.yml`

### Expected Matrix
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

- All 239 tests pass on all 9 OS×Node combinations
- Typecheck clean on all platforms
- npm audit: 0 vulnerabilities
- Tarball install succeeds and MCP initializes via stdio
- Offline scan completes without network access (Linux)
- Semgrep resolver lifecycle tests pass

## Failure Triage Steps

1. **Typecheck failure on specific OS/Node:**
   - Check for platform-specific path handling (Windows `\` vs POSIX `/`)
   - Check for Node version-specific API usage

2. **Test failure on specific OS:**
   - Check for path-separator assumptions in tests
   - Check for OS-specific process spawning behavior

3. **Offline scan failure:**
   - Verify Semgrep is installed before network isolation
   - Check if Semgrep attempts any network access despite `--metrics off`
   - Verify rulepack is bundled (not downloaded)

4. **Tarball install failure:**
   - Check `files` field in package.json includes all required files
   - Verify no absolute paths in built output

## Commands Founder May Authorize Later

```bash
# Stage all Phase 4C-A changes
git add -A

# Commit
git commit -m "Phase 4C-A: release candidate qualification

- Fix detector revision rc.5→rc.6 for api-key-in-error detectors
- Exclude filesSkippedByEngine from coverage/receipt digests
  (ENGINE_OPERATIONAL_NONDETERMINISM classification)
- Update README with accurate capability description
- Prepare cross-platform CI workflow
- Create Phase 4C evidence artifacts
- Document downstream output-integrity risks

Generated with [Devin](https://devin.ai)"

# Push (after founder authorization)
git pull origin main
git push origin main

# Tag (after remote CI passes)
git tag v0.1.0-rc.6
git push origin v0.1.0-rc.6
```

## Commit Candidate Identity

If a commit were created now, it would be based on:
- Current HEAD: `fd277140a9d8b6e18a8d0f5af0ea0bc15838a7b0`
- Working tree: dirty (8 modified, 39+ untracked)
- Branch: `main`

**Do NOT commit automatically. Do NOT push automatically.**
