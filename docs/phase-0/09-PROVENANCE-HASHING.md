# 09 — Provenance Hashing

> Phase 0 document. RFC 8785 JCS canonicalization and SHA-256 digest.

## Implementation

### `src/provenance/canonicalize.ts`
- Wraps `canonicalize` package (v4.0.0, Apache-2.0)
- `canonicalizeForDigest(value)` — RFC 8785 JCS canonicalization
- Behind our interface — dependency can be replaced without changing contracts

### `src/provenance/digest.ts`
- `computeDigest(value)` — SHA-256 of canonicalized JSON
- `computeDigestOfString(value)` — SHA-256 of raw string
- `verifyDigest(value, expected)` — verification
- Uses Node built-in `crypto` only — no external hashing packages

## Design Decision (from Phase -0.5)

- REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS
- Do NOT copy HAIEC's existing shallow `JSON.stringify` hashing
- Observational metadata (timestamps, duration, execution ID) excluded from digests

## Test Vectors (15 tests, all pass)

### RFC 8785 Canonicalization (9 tests)
- ✔ Different property order → identical output
- ✔ Nested objects with different order → identical output
- ✔ Arrays preserve order (NOT sorted)
- ✔ Unicode handled correctly
- ✔ Numbers handled correctly
- ✔ Null handled correctly
- ✔ Deep nesting handled
- ✔ Empty objects and arrays
- ✔ Boolean values

### SHA-256 Digest (6 tests)
- ✔ Different property order → identical digest
- ✔ Different values → different digest
- ✔ 64-character hex output
- ✔ Raw string digest
- ✔ Digest verification
- ✔ Observational metadata excluded from digest
