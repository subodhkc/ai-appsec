# ADR-002: Native Deterministic Analysis Integration

## Status

ACCEPTED — Roadmap record, not a public capability claim.

## Context

HAIEC's main repository (`lib/ai-security/`) contains substantial native
deterministic analysis infrastructure:

- Python AST extractor (function definitions, control-flow nodes, returns,
  breaks, continues, assignments, allocation/field information)
- CFGBuilder (control flow graph construction)
- CFGReachability (reachability analysis)
- DataFlowAnalysis (def-use analysis)
- AliasAnalysis (points-to analysis)
- HeapAnalysis (heap graph)
- CallGraphBuilder (call graph infrastructure)
- DeterministicTaint (taint analysis combining CFG + data flow + alias + heap)
- DeterministicSecurityEngine (orchestration)

However, read-only inspection on 2026-08-19 confirmed critical integration gaps:

1. **FlowGraphBuilder explicitly leaves `cfg = undefined`** (line 108 of `flow-graph.ts`)
   — the CFG is not actually built from the IR.
2. **Deterministic CFG path falls back** because cfg is undefined.
3. **Core IR does not carry all AST control-flow/heap metadata cleanly.**
4. **CFGs are function-specific**, not one repository-wide CFG.
5. **DeterministicTaint accepts a single CFG** — no interprocedural taint.
6. **DeterministicSecurityEngine does not pass the call graph to FlowGraphBuilder.**
7. **Alias and heap graphs are passed to DeterministicTaint but not incorporated
   into its proof.**
8. **Data-flow variable scope handling is not yet sound enough for strong proof claims.**
9. **CFG implementation requires correctness hardening** before being used as
   proof infrastructure.
10. **Old documentation overstated production readiness.**

## Decision

### v1 (current)

HAIEC uses qualified native Semgrep 1.173.0. The native deterministic engine
is NOT used in the public MCP product. The gaps above are NOT fixed in this phase.

### CLAIM HOLD

HAIEC must NOT broadly claim:
- Mathematically proven dataflow
- Full CFG-backed taint
- Alias-backed deterministic proof
- Heap-backed deterministic proof
- Full interprocedural deterministic taint

...until Phase 5 qualification provides evidence.

### Phase 5 (future)

Consolidate and qualify the native analysis engine through phases 5A-5F
(see HAIEC-MASTER-ROADMAP.md). Each sub-phase requires evidence before
progressing.

### Phase 6 (future)

Investigate Tree-sitter / ast-grep as parsing frontends to reduce Semgrep
dependence. Migration per-check with semantic equivalence proof.

## Consequences

- The public MCP product (v1) uses Semgrep, not the native engine
- The native engine code exists but is not production-qualified
- Any claims about deterministic analysis must wait for Phase 5
- The ADR preserves this finding for future engineering sessions
