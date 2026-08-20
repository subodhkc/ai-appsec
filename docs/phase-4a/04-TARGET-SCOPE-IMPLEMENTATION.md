# Phase 4A — Target Scope Implementation

## Scope modes

### DEFAULT_PRODUCTION

Includes: application source, server code, API routes, agent/tool/RAG code,
configuration.

Excludes: tests, documentation, examples, generated code, vendor code.

Exceptions:
- Secrets detectors scan test files (test files may contain hardcoded secrets)
- `VULNERABILITY` detectors scan docs/examples (users may copy vulnerable code)

### EXTENDED_SECURITY

Includes: everything except always-excluded (node_modules, .git, build
artifacts, vendor directories).

## Semgrep exclude handling

Only essential excludes are passed to Semgrep's `--exclude` flag:
`node_modules`, `.git`, `dist`, `build`, `.next`, `__pycache__`, `.cache`,
`vendor`, `third_party`.

This is intentional: Semgrep 1.173.0 has a glob parser limitation that
causes "Failed to obtain target files from semgrep-core" errors when too
many `--exclude` patterns with `**` segments are used.

Non-production filtering (tests, docs, examples) is handled in
post-processing scope filtering, which is more flexible and avoids the
Semgrep glob parser limitation.

## Scope semantics

| Term | Meaning |
|------|---------|
| `filesTargeted` | Files selected by the scope contract |
| `filesScanned` | Files actually passed to Semgrep |
| `filesIntentionallyExcluded` | Files excluded by policy |
| `filesUnscannedDueToTimeout` | Files not scanned due to timeout |
| `filesUnscannedDueToError` | Files not scanned due to parse errors |
| `filesSkippedByEngine` | Files skipped by Semgrep engine |

## Post-processing scope filter

After Semgrep returns findings, each finding is classified:
- `classifyPath(relativePath)` → `PRODUCTION` or `NON_PRODUCTION`
- `shouldIncludeFinding(path, kind, mode)` → boolean

In `DEFAULT_PRODUCTION`:
- Non-production paths: only `VULNERABILITY` findings included
- Production paths: all finding kinds included

In `EXTENDED_SECURITY`:
- All paths: all finding kinds included
