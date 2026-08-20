# Reuse / Abandonment Audit — HAIEC Main Repository (Read-Only)

> **Status:** Forensic read-only audit of `Haiec Website` repository.
> **Date:** 2026-09-17
> **Rule:** Comments were NOT trusted. All classifications verified by
> reading executable code and tracing callers.

---

## Classification Legend

| Class | Meaning |
|-------|---------|
| CANONICAL | Authoritative implementation, actively used, no replacement needed. |
| ACTIVE | In production use, functioning as designed. |
| ACTIVE_BUT_UNDERUTILIZED | In use but with more capability than is exercised. |
| PARTIALLY_WIRED | Exists and partially connected; some paths are dead. |
| DUPLICATE_IMPLEMENTATION | Overlaps another implementation; needs consolidation. |
| SUPERSEDED | Replaced by a newer implementation; should be retired. |
| DEPRECATED | Marked deprecated; no new callers should be added. |
| DEAD | No callers; not imported anywhere. |
| UNKNOWN | Insufficient evidence to classify. |
| FUTURE_REUSE | Not currently used but valuable for future phases. |
| DO_NOT_PORT | Should not be carried into any new implementation. |

---

## Static Aggregation

| Component | Classification | Purpose | Production path | Replacement | Retirement prereq |
|-----------|---------------|---------|-----------------|-------------|-------------------|
| `aggregation.ts` | ACTIVE | Aggregates static scan findings into normalized form | Called by scan-completion-handler | None yet | Needs alignment with Evidence Model v1 |
| `context-aware-aggregation.ts` | PARTIALLY_WIRED | Context-aware finding aggregation | Partially called | aggregation.ts overlaps | Reconcile overlap with aggregation.ts |
| `aggregation-persistence.ts` | ACTIVE | Persists aggregation results to DB | Called by completion handler | None | Needs evidence-ref population |
| `scan-completion-handler.ts` | ACTIVE | Handles scan completion → aggregation → persistence | Called by orchestrator | None | Needs alignment with Evidence Envelope v1 |
| `baseline/` | ACTIVE | Baseline comparison for drift detection | Called by aggregation | None | Needs alignment with proof-of-fix |
| `scoring/` | ACTIVE | Numeric scoring for static findings | Called by aggregation | None | DO NOT port numeric confidence to MCP |
| `evidence/` | ACTIVE_BUT_UNDERUTILIZED | Evidence record storage | Partially wired | None | evidenceRefs remain empty (defect F) |
| uncertainty tracker | ACTIVE | Tracks uncertainty in findings | Called by aggregation | None | Needs alignment with assurance states |
| `compliance-evidence-generator.ts` | ACTIVE | Generates compliance evidence from scan results | Called by completion handler | None | Defect K: zero rules → PASS |

## Orchestration

| Component | Classification | Purpose | Production path | Replacement | Retirement prereq |
|-----------|---------------|---------|-----------------|-------------|-------------------|
| `audit-orchestrator/types.ts` | CANONICAL | Defines engine IDs, states, contracts | Used everywhere | None | Engine IDs are canonical (inventory, static, runtime, wizard, regulatory) |
| `engine-registry.ts` | ACTIVE | Registers engines | Called by orchestrator | None | None |
| `engine-contracts.ts` | ACTIVE | Engine interface contracts | Used by registry | None | None |
| `engine-adapters.ts` | ACTIVE | Adapts engine outputs | Called by orchestrator | None | None |
| `orchestrator.ts` | CANONICAL | Main orchestration loop | Called by API routes | None | None |
| `evidence-status-rules.ts` | ACTIVE | Rules for evidence status | Called by orchestrator | None | Needs alignment with assurance states |
| `fingerprint.ts` | CANONICAL | SHA-256 hashing for provenance | Called by orchestrator | None | Uses sha256 — cryptographic (defect L NOT verified) |
| `freshness-validator.ts` | ACTIVE | Validates evidence freshness | Called by orchestrator | None | Defect H: uses Date.now() |

## Assurance (Decision Pipeline)

| Component | Classification | Purpose | Production path | Replacement | Retirement prereq |
|-----------|---------------|---------|-----------------|-------------|-------------------|
| `decision-pipeline/types.ts` | ACTIVE | Pipeline types | Used by pipeline | None | Engine ID mismatch (defect B) |
| `decision-pipeline/aggregation.ts` | ACTIVE | Aggregates engine results into nodes | Called by pipeline | None | Defects C, D, F, G, H |
| `decision-pipeline/scoring.ts` | ACTIVE | Decision Integrity Score (DIS) formula | Called by aggregation | None | Legacy numeric confidence (defect I) |
| `decision-pipeline/node-config.ts` | ACTIVE | Maps engines to pipeline nodes | Called by aggregation | None | Defect B: legacy engine IDs |
| `decision-pipeline/drift-detection.ts` | ACTIVE | Detects drift between runs | Called by pipeline | None | None |
| persistence / API routes | ACTIVE | Persists and serves pipeline results | Called by API | None | None |

## Compliance Twin

| Component | Classification | Purpose | Production path | Replacement | Retirement prereq |
|-----------|---------------|---------|-----------------|-------------|-------------------|
| rulepack-engine | ACTIVE | Manages compliance rule packs | Called by compliance twin | None | None |
| control-normalizer | ACTIVE | Normalizes control mappings | Called by compliance twin | None | None |
| snapshot-engine | ACTIVE | Snapshots compliance state | Called by compliance twin | None | None |
| delta-engine | ACTIVE | Computes deltas between snapshots | Called by compliance twin | None | None |
| provenance-engine | ACTIVE | Tracks compliance provenance | Called by compliance twin | None | None |
| regression-engine | ACTIVE | Regression testing for compliance | Called by compliance twin | None | None |
| `compliance-engine.ts` | DEAD | Legacy compliance engine | NOT imported anywhere (self-declared @deprecated) | rulepack-engine + delta-engine | Safe to retire |

## Native Analysis

| Component | Classification | Purpose | Production path | Replacement | Retirement prereq |
|-----------|---------------|---------|-----------------|-------------|-------------------|
| `flow-graph.ts` | PARTIALLY_WIRED | Flow graph builder | Instantiated by deterministic-engine | None | CFG construction gap (TODO at line 106) |
| `cfg-builder.ts` | FUTURE_REUSE | CFG builder from AST | Not fully wired (flow-graph leaves cfg undefined) | None | Needs AST-to-control-flow extraction |
| `cfg-reachability.ts` | FUTURE_REUSE | CFG reachability analysis | Not called (depends on cfg) | None | Depends on cfg-builder completion |
| `data-flow-analysis.ts` | FUTURE_REUSE | Data flow analysis | Not called (depends on cfg) | None | Depends on cfg-builder completion |
| `deterministic-taint.ts` | PARTIALLY_WIRED | Deterministic taint analysis | References cfg reachability, alias, heap | None | Depends on flow-graph completion |
| `deterministic-engine.ts` | PARTIALLY_WIRED | Orchestrates native analysis | Instantiates FlowGraphBuilder | None | Depends on flow-graph completion |
| `python-ast-ir-adapter.ts` | FUTURE_REUSE | Adapts Python AST to IR | Not fully wired | None | Needed for cfg-builder |
| `alias-analysis.ts` | FUTURE_REUSE | Alias analysis | Not called (depends on points-to) | None | Depends on flow-graph completion |
| `heap-analysis.ts` | FUTURE_REUSE | Heap analysis | Not called (depends on heap graph) | None | Depends on flow-graph completion |
| `call-graph-builder.ts` | FUTURE_REUSE | Call graph builder | Not fully wired | None | Needed for interprocedural analysis |

---

## Key Findings

1. **Native analysis is architecturally present but not functionally complete.**
   The FlowGraphBuilder is instantiated but `this.cfg = undefined` (line 108).
   This is a known gap documented in ADR-002.

2. **Compliance engine is dead code.** `compliance-engine.ts` is self-declared
   `@deprecated` and not imported anywhere.

3. **Decision pipeline has multiple P0 defects** (see
   `product-unification-defects.md` for details).

4. **`fingerprint.ts` uses SHA-256** (cryptographic). Defect L (legacy
   non-cryptographic fingerprint) was NOT verified for the orchestrator
   fingerprint. However, the decision-pipeline `outputHash` covers only
   `nodeType + score` (defect G), which is a separate semantic weakness.

5. **Static aggregation and context-aware aggregation overlap.** Both perform
   finding aggregation with different semantics — needs consolidation.
