# HAIEC Coverage Contract v0.1

## Purpose

Defines the authoritative coverage categories for `scan_ai_security`.
Every scan produces a Receipt that must truthfully represent what was
targeted, what was analyzed, what was excluded, what failed parsing,
and what was unsupported.

## Coverage Categories

### TARGETED

Files HAIEC intended to evaluate under the declared scan profile and
scope policy.

- **Derivation point:** Pre-execution — the set of files matching the
  target path after applying HAIEC scope/exclusion policy but before
  Semgrep execution.
- **Source data:** Filesystem walk of target path, filtered by
  supported extensions, minus intentionally excluded paths.
- **Precedence:** Defining — TARGETED is the universe from which all
  other categories are derived.
- **Overlap:** Mutually exclusive with INTENTIONALLY_EXCLUDED.
  TARGETED = ANALYZED ∪ PARSE_FAILED ∪ UNSUPPORTED.
- **Accounting invariant:** See below.
- **Completeness implication:** If TARGETED is empty → UNSUPPORTED.
- **Proof-of-fix implication:** A check not evaluated on any targeted
  file cannot establish absence of the vulnerability.

### ANALYZED

Targeted files successfully submitted and evaluated under the qualified
engine contract.

- **Derivation point:** Post-execution — from Semgrep `paths.scanned`.
- **Source data:** `rawResult.paths.scanned` (Semgrep JSON output).
- **Precedence:** Authoritative for engine success.
- **Overlap:** Mutually exclusive with PARSE_FAILED and UNSUPPORTED.
- **Accounting invariant:** ANALYZED ⊆ TARGETED.
- **Completeness implication:** ANALYZED = TARGETED ∧ no parse failures
  → COMPLETE.
- **Proof-of-fix implication:** Findings from ANALYZED files are
  trustworthy evidence.

### INTENTIONALLY_EXCLUDED

Files deliberately omitted under explicit HAIEC scope/exclusion policy.

- **Derivation point:** Pre-execution — files matching exclude patterns
  (node_modules, .git, dist, build, vendor, generated, etc.).
- **Source data:** Filesystem walk minus TARGETED set.
- **Precedence:** Policy-defined, not engine-defined.
- **Overlap:** Mutually exclusive with TARGETED.
- **Accounting invariant:** INTENTIONALLY_EXCLUDED ∩ TARGETED = ∅.
- **Completeness implication:** Does NOT cause PARTIAL. These files are
  outside the security evaluation scope by policy.
- **Proof-of-fix implication:** No claim is made about excluded files.

### PARSE_FAILED

Targeted supported files that the engine could not successfully parse
or analyze.

- **Derivation point:** Post-execution — from Semgrep `errors[]` with
  non-null `path` fields.
- **Source data:** `rawResult.errors[].path`.
- **Precedence:** Engine-defined.
- **Overlap:** Mutually exclusive with ANALYZED. Subset of TARGETED.
- **Accounting invariant:** PARSE_FAILED ⊆ TARGETED.
  PARSE_FAILED ∩ ANALYZED = ∅.
- **Completeness implication:** PARSE_FAILED ≠ ∅ → PARTIAL.
- **Proof-of-fix implication:** Absence of a finding in a parse-failed
  file does NOT prove the vulnerability is absent.

### UNSUPPORTED

Targeted candidate files that HAIEC explicitly identifies as outside
the supported language/file-analysis contract.

- **Derivation point:** Pre-execution — files in the target path with
  extensions not in the supported language set.
- **Source data:** Filesystem walk, filtered by unsupported extensions.
- **Precedence:** Contract-defined.
- **Overlap:** Mutually exclusive with ANALYZED and PARSE_FAILED.
  Subset of TARGETED.
- **Accounting invariant:** UNSUPPORTED ⊆ TARGETED.
  UNSUPPORTED ∩ ANALYZED = ∅.
- **Completeness implication:** If TARGETED = UNSUPPORTED → UNSUPPORTED
  completeness. Does NOT cause PARTIAL by itself.
- **Proof-of-fix implication:** No claim is made about unsupported files.

## Accounting Invariant

```
TARGETED_ROOT = all files in target path (filesystem walk)

INTENTIONALLY_EXCLUDED = files matching exclude patterns
TARGETED = TARGETED_ROOT − INTENTIONALLY_EXCLUDED

TARGETED = ANALYZED + PARSE_FAILED + UNSUPPORTED

(Mutually exclusive: ANALYZED ∩ PARSE_FAILED = ∅,
 ANALYZED ∩ UNSUPPORTED = ∅, PARSE_FAILED ∩ UNSUPPORTED = ∅)
```

## UNKNOWN / NOT_TRACKED Policy

If a category cannot be derived from available data, it MUST be
represented as `UNKNOWN` / `NOT_TRACKED` in the Receipt, NOT as an
empty-set digest (which would imply `KNOWN_EMPTY`).

For v0.1:
- `targetedFileSet`: Derivable from filesystem walk. If not implemented,
  represent as `NOT_TRACKED`.
- `unsupportedFileSet`: Derivable from extension filtering. If not
  implemented, represent as `NOT_TRACKED`.
- `analyzedFileSet`: Derivable from Semgrep `paths.scanned`. Implemented.
- `parseFailureFileSet`: Derivable from Semgrep `errors[].path`.
  Implemented.
- `intentionallyExcludedFileSet`: Derivable from exclude pattern
  matching. If not implemented, represent as `NOT_TRACKED`.

## coverageDigest Contract

`coverageDigest` MUST change whenever material coverage identity
changes. It is computed from:

```
coverageContractVersion
scanProfile
scopePolicyDigest
targetedFileSetDigest
analyzedFileSetDigest
intentionallyExcludedFileSetDigest
parseFailureFileSetDigest
unsupportedFileSetDigest
completeness
```

It MUST NOT include:
- timestamps
- duration
- PID
- filesSkippedByEngine diagnostic count

Required regressions:
- Same counts + different parse-failure file → different coverageDigest
- Same analyzed set + different target set → different coverageDigest
- Same counts + different unsupported set → different coverageDigest

## Completeness Derivation

| Condition | Completeness |
|-----------|-------------|
| ANALYZED = TARGETED, no parse failures | COMPLETE |
| PARSE_FAILED ≠ ∅ | PARTIAL |
| Timeout occurred (with partial results) | PARTIAL |
| TARGETED = ∅ | UNSUPPORTED |
| TARGETED = UNSUPPORTED | UNSUPPORTED |
| Engine error (no results) | ERROR |
