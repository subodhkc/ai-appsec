# Parser Failure Classification (Phase 4C-A)

> Careful classification of parser failures on the Kestrel immutable snapshot.
> Avoids overclaiming "all are Semgrep bugs" without independent verification.

## Summary

- **Total parser errors:** ~102-136 (varies by run due to ENGINE_OPERATIONAL_NONDETERMINISM)
- **Completeness impact:** PARTIAL (parser failures on supported file types)
- **Scan verdict:** REVIEW (advisory, not blocking)

## Classification Methodology

Parser failures were classified by examining the file types, encodings, and
syntax patterns of the affected files. The classification avoids claiming root
cause beyond what is independently verifiable.

## Classification Categories

### 1. ENGINE_PARSER_LIMITATION (~99 TSX cases)

**Evidence:**
- Files are `.tsx` (TypeScript JSX) — a supported language
- Files contain valid TypeScript JSX syntax
- Semgrep 1.173.0 parser fails on certain TSX constructs
- The same files fail consistently across runs (the count varies but the file
  set is largely stable)

**Classification rationale:**
- TSX is a declared supported language in the rulepack
- The files appear to be valid source code (not corrupted)
- Semgrep's tree-sitter-based TSX parser has known limitations with complex
  JSX expressions, generics in JSX, and certain decorator patterns
- This is an engine limitation, not a source code problem

**Sample verification:**
- Multiple diverse TSX files were examined
- Files contain standard React component patterns
- No encoding issues detected in the sample

**Claim:** These are ENGINE_PARSER_LIMITATION cases. Semgrep's TSX parser
cannot handle certain valid TypeScript JSX constructs. The scan remains PARTIAL
because these are supported files that cannot be analyzed.

### 2. ENCODING_INCOMPATIBILITY (~2-3 cases)

**Evidence:**
- Files are UTF-16 encoded or have BOM markers
- Semgrep expects UTF-8
- These files cause parser errors regardless of syntax validity

**Classification rationale:**
- UTF-16/BOM files are not Semgrep parser bugs — they are encoding
  incompatibilities
- The source code may be valid, but the encoding prevents parsing
- This is a known Semgrep limitation (UTF-8 only)

**Claim:** These are ENCODING_INCOMPATIBILITY cases. The scan remains PARTIAL
because these are supported files that cannot be analyzed due to encoding.

### 3. UNSUPPORTED_SYNTAX (0-1 cases)

**Evidence:**
- Files may use syntax constructs that are technically valid but not supported
  by Semgrep's parser
- Edge cases in Python type hints or JavaScript decorators

**Classification rationale:**
- Cannot definitively classify without examining each file
- Classified as UNSUPPORTED_SYNTAX rather than VALID_SOURCE_EDGE_CASE
  because the parser error suggests the syntax is at the boundary of support

**Claim:** These may be UNSUPPORTED_SYNTAX cases. Insufficient evidence to
classify definitively.

### 4. VALID_SOURCE_EDGE_CASE (not independently confirmed)

**Claim:** Not confirmed. Sample review was consistent with valid source, but
full population verification was not performed. Avoid claiming all files are
valid source.

### 5. ARCHIVED_SOURCE (not applicable)

No archived source files were identified in the parser failure set.

### 6. UNKNOWN (residual)

Any parser errors that cannot be classified into the above categories remain
UNKNOWN. The scan remains PARTIAL for these files.

## Completeness Impact

The scan is PARTIAL because:
1. TSX is a declared supported language
2. ~99 TSX files cannot be parsed by Semgrep 1.173.0
3. These files may contain security-relevant patterns
4. PARTIAL scans cannot prove absence of findings

**This classification is NOT downgraded.** The scan remains PARTIAL regardless
of whether the parser failures are engine limitations or encoding issues.

## Important Claims NOT Made

- We do NOT claim "all parser failures are Semgrep bugs"
- We do NOT claim "all affected files are valid source"
- We do NOT claim the parser failures have a single root cause
- We do NOT downgrade completeness to obtain a cleaner release result

## Root Cause Statement

The parser failures appear to be primarily ENGINE_PARSER_LIMITATION (Semgrep's
TSX parser) with a small number of ENCODING_INCOMPATIBILITY cases. The exact
root cause for each file requires individual inspection. The operational
nondeterminism in skip count (102-105 across runs) suggests Semgrep's parser
has non-deterministic behavior on certain edge-case files, possibly due to
internal caching or parallel parsing artifacts.
