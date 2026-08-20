# Phase 4B — Scope Accounting Truth

## Problem

Phase 4A reduced Semgrep CLI excludes (to avoid glob parser limitations)
and moved some filtering to post-processing. This means some files ARE
scanned by Semgrep but their findings are filtered out afterward.

We must NOT claim those files were "not scanned."

## Current accounting fields

| Field | Source | Meaning |
|-------|--------|---------|
| filesAnalyzed | Semgrep `paths.scanned` | Files actually analyzed by Semgrep |
| filesWithFindings | Derived from findings | Unique files with at least one finding |
| filesSkippedByEngine | Semgrep parse errors | Files Semgrep could not parse |
| filesUnscannedDueToTimeout | -1 if timeout, 0 otherwise | Files not reached due to timeout |
| findingsExcludedByReportingScope | Pre-filter minus post-filter count | Findings filtered by scope mode |

## What we do NOT report

- `filesTargeted` — Semgrep doesn't reliably report this
- `filesIntentionallyExcluded` — Would require knowing what WOULD have been scanned
- `filesUnscannedDueToError` — Semgrep doesn't separate this from parse errors

## Example

anthropic-sdk-python (DEFAULT_PRODUCTION):
- filesAnalyzed: 1137 (Semgrep scanned all these)
- findingsExcludedByReportingScope: 90 (findings from non-production paths filtered out)
- actionableTotal: 379 (after scope filtering)

The 90 excluded findings came from files that WERE scanned by Semgrep.
We do not claim those files were "not scanned" — they were scanned, but
their findings were excluded from the production report.
