# 08 — Evidence Canonicalization Decision

> **Phase -0.5 document.** Rejects direct reuse of HAIEC's existing canonical JSON
> implementation. Evaluates RFC 8785 JCS as the preferred contract.

---

## Phase -1 Error

Phase -1 classified `lib/audit-orchestrator/fingerprint.ts`'s canonical JSON as
`REUSE_IMPLEMENTATION`, suggesting it was "directly reusable" for the Scan Receipt.

**This was too optimistic.** The existing implementation uses a custom
`sortedReplacer` function that sorts object keys recursively. While this produces
deterministic output, it is:
- Not a recognized standard
- Not externally verifiable
- Not tested against edge cases (number serialization, Unicode, nested structures)
- A shallow `Object.keys(root)`-only approach in some code paths

For cryptographic hashing where reproducibility and external verifiability matter,
a well-defined canonicalization contract is required.

---

## RFC 8785 JSON Canonicalization Scheme (JCS)

### What it is

RFC 8785 (published June 2020) defines a canonical representation of JSON data for
cryptographic operations (hashing, signing). It is an IETF Informational RFC.

### Key properties

| Property | JCS | HAIEC's `sortedReplacer` |
|----------|-----|--------------------------|
| Deterministic property sorting | YES — UTF-16 code unit order | YES — `localeCompare` or similar |
| Number serialization | YES — ECMAScript ToString (well-defined) | NO — uses `JSON.stringify` defaults |
| I-JSON subset constraint | YES — eliminates ambiguity | NO |
| External verifiability | YES — any JCS implementation produces same output | NO — custom implementation |
| Standardized | YES — RFC 8785 | NO — internal code |
| Array order preservation | YES — arrays preserve semantically meaningful order | YES |
| Nested object handling | YES — recursive | YES |

### Why JCS is preferred

1. **External verifiability:** A Scan Receipt's `resultDigest` should be reproducible
   by anyone with the same input data, not just someone running HAIEC's code. JCS
   is a published standard with multiple independent implementations.

2. **Number serialization:** JCS defines exact number serialization (e.g., `1.0` →
   `1`, `1e10` → `10000000000`). HAIEC's `JSON.stringify` may produce different
   output across JavaScript engines or Node versions.

3. **I-JSON constraint:** JCS constrains to I-JSON (RFC 7493), eliminating ambiguous
   constructs like duplicate keys, non-normalized numbers, and non-UTF-8 strings.

4. **Future-proof:** If HAIEC later needs signed receipts (cryptographic signatures),
   JCS is the standard approach. Using it from the start avoids migration.

---

## Requirements for HAIEC's Canonicalization

1. **Nested objects must be deterministic** — all object keys sorted at every depth
2. **Arrays must preserve semantically meaningful order** — arrays are NOT sorted
3. **Unordered collections must be normalized BEFORE canonicalization** — if HAIEC
   has Set-like data, convert to sorted array before hashing
4. **Timestamps must not affect deterministic result digest** — observational
   metadata excluded from digest input
5. **Execution metadata must remain separate** — `scanId`, `timestamp`, `duration`
   are NOT in the canonicalized input
6. **No shallow `Object.keys(root)`-only approach** — full recursive canonicalization

---

## Decision

**Classification: `REUSE_CONCEPT` + `REIMPLEMENT_HASHING`**

- **REUSE_CONCEPT:** The concept of canonical JSON for deterministic hashing is
  correct and reusable from HAIEC's existing implementation.
- **REIMPLEMENT_HASHING:** The actual canonicalization must be reimplemented using
  RFC 8785 JCS (or a JCS-compliant library), not HAIEC's custom `sortedReplacer`.

### Implementation plan (for Phase 0 or later)

1. Use a JCS-compliant JavaScript library (e.g., `canonicalize` from `@erigon/jcs`
   or similar) OR implement JCS serialization
2. Define the digest input schema (which fields enter the canonical form)
3. Canonicalize the digest input using JCS
4. Hash the canonical form with SHA-256
5. Test: same input → same digest across Node versions and platforms

### What NOT to do

- Do NOT copy `fingerprint.ts`'s `sortedReplacer` into the public repo
- Do NOT use `JSON.stringify` with a custom replacer as the canonicalization scheme
- Do NOT assume JavaScript number serialization is stable across engines

---

## Updated Classifications

| Component | Phase -1 | Phase -0.5 |
|-----------|----------|------------|
| `fingerprint.ts` canonical JSON | REUSE_IMPLEMENTATION | REUSE_CONCEPT + REIMPLEMENT_HASHING |
| `fingerprint.ts` hash chain | REUSE_IMPLEMENTATION | REUSE_CONCEPT (reimplement with JCS) |
| `evidence-integrity.ts` composite hash | REUSE_CONCEPT | REJECT (not deterministic, Prisma-coupled) |
| RFC 8785 JCS | Not evaluated | **ADOPT** as canonicalization contract |
