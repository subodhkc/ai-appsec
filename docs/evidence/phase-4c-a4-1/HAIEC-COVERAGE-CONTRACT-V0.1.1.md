# HAIEC Coverage Contract v0.1.1

## Version History

- **v0.1.0** — Initial coverage contract. Had internal contradiction: TARGETED was defined as "supported files" while UNSUPPORTED was defined as "targeted files with unsupported extensions." Also assumed ANALYZED and PARSE_FAILED were mutually exclusive without empirical proof.
- **v0.1.1** — Corrected ontology. Fixes the contradiction by introducing DISCOVERED as the root set. Empirically qualifies Semgrep path semantics. Documents that PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED.

## Canonical File-Set Ontology

### Pre-Engine Partition (Mutually Exclusive)

```
DISCOVERED = INTENTIONALLY_EXCLUDED + UNSUPPORTED + TARGETED
```

These three categories are mutually exclusive and complete. Every discovered file belongs to exactly one.

#### DISCOVERED

All files observed by HAIEC deterministic filesystem traversal beneath the declared target before analysis policy is applied.

- **Derivation:** `walkDirectory(targetRoot)` in `coverage-collector.ts`
- **Source data:** Filesystem
- **Produced:** Before Semgrep execution
- **Normalization:** Relative to target root, forward slashes

#### INTENTIONALLY_EXCLUDED

Discovered files deliberately excluded by explicit HAIEC scope/exclusion policy.

- **Derivation:** `matchesExcludePattern(file, getSemgrepExcludes())`
- **Source data:** HAIEC exclude patterns (node_modules, .git, dist, build, vendor, etc.)
- **Produced:** Before Semgrep execution
- **Normalization:** Relative to target root, forward slashes

#### UNSUPPORTED

Discovered, non-excluded files outside the current supported language/file-analysis contract.

- **Derivation:** `DISCOVERED - INTENTIONALLY_EXCLUDED - supportedExtensionFiles`
- **Source data:** Filesystem + supported extensions (.py, .js, .jsx, .ts, .tsx)
- **Produced:** Before Semgrep execution
- **Normalization:** Relative to target root, forward slashes
- **NOT:** "Targeted files with unsupported extensions" (that was the v0.1.0 contradiction)

#### TARGETED

Discovered, non-excluded, supported files HAIEC intends the static engine to evaluate.

- **Derivation:** `DISCOVERED - INTENTIONALLY_EXCLUDED - UNSUPPORTED`
- **Source data:** Filesystem + supported extensions
- **Produced:** Before Semgrep execution
- **Normalization:** Relative to target root, forward slashes

### Engine Outcome Sets (May Overlap)

#### ENGINE_REPORTED_SCANNED

Files Semgrep reports in `paths.scanned`. Semantics: "files Semgrep attempted to scan."

- **Derivation:** `rawResult.paths?.scanned` from Semgrep JSON output
- **Source data:** Semgrep engine
- **Produced:** After Semgrep execution
- **Normalization:** Relative to target root, forward slashes
- **NOT:** "successfully analyzed" — files with parse errors also appear here

#### PARSE_FAILED

Files Semgrep reports in `errors[].path` with non-null paths.

- **Derivation:** `rawResult.errors[].path` filtered to non-null
- **Source data:** Semgrep engine
- **Produced:** After Semgrep execution
- **Normalization:** Relative to target root, forward slashes
- **Empirically proven:** `PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED` (see SEMGREP-PATH-SEMANTICS-QUALIFICATION.json)

### Derived Set

#### SUCCESSFULLY_ANALYZED

Files Semgrep attempted to scan minus files that had parse errors.

- **Derivation:** `ENGINE_REPORTED_SCANNED - PARSE_FAILED`
- **Source data:** Semgrep engine (derived)
- **Produced:** After Semgrep execution
- **Normalization:** Relative to target root, forward slashes
- **Qualified:** Empirically proven derivable because PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED

## Accounting Invariants

### Pre-Engine Invariant (Proven by Tests)

```
DISCOVERED = INTENTIONALLY_EXCLUDED ∪ UNSUPPORTED ∪ TARGETED
(mutually exclusive, complete)
```

### Engine Overlap (Documented, Not Forbidden)

```
PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED
(overlap is expected and documented)
```

### NOT Claimed

```
TARGETED ≠ ENGINE_REPORTED_SCANNED + PARSE_FAILED
(sets overlap; this equation is false)
```

## Coverage Digest Inputs (v0.1.1)

```
coverageDigest = SHA-256(
  completeness
  coverageContractVersion
  scopePolicyDigest
  discoveredFileSetDigest
  intentionallyExcludedFileSetDigest
  unsupportedFileSetDigest
  targetedFileSetDigest
  engineReportedScannedFileSetDigest
  parseFailureFileSetDigest
  successfullyAnalyzedFileSetDigest
)
```

Excludes: timestamps, duration, PID, filesSkippedByEngine count.

## Implications

- **Completeness:** COMPLETE requires all targeted files to be successfully analyzed with no parse failures.
- **Proof-of-fix:** A fix is only proven when the finding disappears AND coverage remains comparable.
- **Partial coverage:** PARTIAL honestly represents that some targeted files had parse failures.
- **Unsupported files:** Do not affect completeness (they were never targeted for analysis).
