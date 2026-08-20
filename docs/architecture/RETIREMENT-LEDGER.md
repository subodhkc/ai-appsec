# HAIEC Retirement Ledger

> **Status:** Living document. Tracks components flagged for retirement.
> **Rule:** No deletion in this phase. Retirement requires explicit
> migration prerequisites being met.

---

## Status Legend

| Status | Meaning |
|--------|---------|
| ACTIVE | In production use. |
| SHADOW | Exists alongside canonical, not called in production. |
| DEPRECATED | Marked deprecated. No new callers. |
| NO_NEW_CALLERS | Still called but frozen. No new callers allowed. |
| MIGRATED | Replacement is live; old code still present for reference. |
| REMOVED | Deleted from codebase. |

---

## Retirement Candidates

### 1. `compliance-twin/compliance-engine.ts`

| Field | Value |
|-------|-------|
| Status | DEPRECATED → ready for REMOVED |
| Purpose | Legacy compliance engine with 10 static rules |
| Current production path | NONE — not imported anywhere |
| Replacement | rulepack-engine + delta-engine (compliance twin) |
| Migration prerequisite | None — no callers exist |
| Evidence | Self-declared `@deprecated` at line 2; no imports found |
| Verified | 2026-09-17 via `Select-String` across `lib/**/*.ts` and `app/**/*.ts*` |
| Action | Safe to retire in Platform U8 |

### 2. `context-aware-aggregation.ts` (overlap with `aggregation.ts`)

| Field | Value |
|-------|-------|
| Status | SHADOW (partially wired) |
| Purpose | Context-aware finding aggregation |
| Current production path | Partially called; overlaps with `aggregation.ts` |
| Replacement | `aggregation.ts` (canonical) after reconciliation |
| Migration prerequisite | Reconcile semantic differences between the two implementations |
| Action | Consolidate in Platform U3 (Static evidence unification) |

### 3. Legacy numeric confidence/scoring formulas

| Field | Value |
|-------|-------|
| Status | ACTIVE (in decision pipeline) |
| Purpose | Decision Integrity Score (DIS) with numeric confidence penalties |
| Current production path | `decision-pipeline/scoring.ts` → `aggregation.ts` |
| Replacement | Qualitative assurance states (Evidence Model v1) |
| Migration prerequisite | Platform U4 (Decision Pipeline repair) |
| Action | DO NOT port to MCP. Retire from decision pipeline in U4. |

### 4. `compliance-evidence-generator.ts` zero-rules-means-PASS logic

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Generates compliance evidence from scan results |
| Current production path | Called by scan-completion-handler |
| Replacement | Control Evidence Contracts (Platform U5) with explicit NOT_ASSESSED |
| Migration prerequisite | Platform U5 |
| Action | Fix in Platform U5 — replace `PASS` with `NOT_ASSESSED` when no rules evaluated |

### 5. Decision pipeline `outputHash` (nodeType + score only)

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Tamper detection for pipeline output |
| Current production path | `decision-pipeline/aggregation.ts:369` |
| Replacement | Full evidence digest (Evidence Envelope v1) |
| Migration prerequisite | Platform U4 |
| Action | Fix in Platform U4 — hash full evidence payload, not just nodeType+score |

### 6. Decision pipeline `Date.now()` freshness

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Freshness validation |
| Current production path | `decision-pipeline/aggregation.ts:392, 459` |
| Replacement | Deterministic freshness (snapshot-based, not wall-clock) |
| Migration prerequisite | Platform U4 |
| Action | Fix in Platform U4 — use snapshot timestamp, not Date.now() |

### 7. Decision pipeline finding truncation (`.slice(0, 50)`)

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Cap findings at 50 per engine |
| Current production path | `decision-pipeline/aggregation.ts:559` |
| Replacement | Security Concern grouping (deterministic view, no deletion) |
| Migration prerequisite | Platform U4 |
| Action | Fix in Platform U4 — replace truncation with concern-level bounding |

### 8. Decision pipeline coarse deduplication

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Deduplicate findings by `engineId:ruleId/title` |
| Current production path | `decision-pipeline/aggregation.ts:580-588` |
| Replacement | Security Concern grouping (preserves instances) |
| Migration prerequisite | Platform U4 |
| Action | Fix in Platform U4 — replace deletion-based dedup with view-based grouping |

### 9. ENGINE_NODE_MAP legacy engine IDs

| Field | Value |
|-------|-------|
| Status | ACTIVE (defective) |
| Purpose | Map engine IDs to pipeline nodes |
| Current production path | `decision-pipeline/node-config.ts:84-110` |
| Replacement | Canonical engine IDs from `audit-orchestrator/types.ts` |
| Migration prerequisite | Platform U1 |
| Action | Fix in Platform U1 — align engine IDs across orchestrator and pipeline |

### 10. Native analysis incomplete components

| Field | Value |
|-------|-------|
| Status | SHADOW (architecturally present, functionally incomplete) |
| Purpose | CFG, def-use, taint, alias, heap, call graph analysis |
| Current production path | Instantiated but `cfg = undefined` |
| Replacement | Phase 5 implementation |
| Migration prerequisite | Phase 5 qualification |
| Action | Do NOT retire. Complete in Phase 5. |

---

## Parallel Canonicalization/Hashing Implementations

Multiple hashing implementations exist:

1. `lib/audit/hash.ts` — `sha256()` using `crypto.createHash('sha256')` (CANONICAL)
2. `lib/audit-orchestrator/fingerprint.ts` — `hashEngineOutput()` delegating to `sha256()`
3. `lib/platform/evidence-hash-verifier.ts` — referenced in fingerprint.ts comments
4. MCP `scan-receipt.ts` — `computeFileSetDigest`, `computeReceiptDigest` (independent)

**Action:** Reconcile in Platform U2 (HAIEC Evidence Core specification).
MCP's independent implementation is correct for standalone operation — it
must not be coupled to SaaS, but the canonical hash semantics must align.

---

## Superseded Evidence (Phase 4B-C2R RECONCILIATION)

The following evidence artifacts from prior C2R runs are SUPERSEDED by the
C2R RECONCILIATION pass. They are NOT deleted — they remain as historical
evidence. The superseding artifacts are the canonical current evidence.

| Artifact | Status | Superseded By | Reason |
|----------|--------|---------------|--------|
| `kestrel-qualification.json` | SUPERSEDED | `kestrel-full-forensics.json` | Used dirty working tree; rule fix changed counts |
| `kestrel-qualification-report.md` | SUPERSEDED | C2R RECONCILIATION report (PHASES.md) | Used dirty working tree; old terminology |
| `three-run-determinism.json` | SUPERSEDED | `kestrel-three-run-determinism.json` | Used MCP repo, not immutable Kestrel snapshot |
| `direct-vs-packaged-equivalence.json` | SUPERSEDED | `direct-vs-tarball-equivalence.json` | Used built package, not actual npm tarball |
| Prior rulepack digest `sha256:33b4a0dd...` | SUPERSEDED | `sha256:013e2da0...` | Rule fix (api-key-in-error metavariable-regex) |
| Prior manifest digest `sha256:0f9247ab...` | SUPERSEDED | `sha256:6d68142f...` | Version bump to rc.6 |
| Prior `evidence-index.json` `sha256:63aa097b...` | SUPERSEDED | New evidence index (pending) | All underlying evidence changed |

**Note:** The `timeout-process-tree.json` and `semgrep-fingerprint.json` artifacts
remain ACTIVE — they are not superseded by this reconciliation pass.
