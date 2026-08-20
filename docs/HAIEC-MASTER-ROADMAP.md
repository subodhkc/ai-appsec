# HAIEC Master Roadmap

> Single source of truth for HAIEC product phase progression.
> Updated at the end of each phase. Historical reports remain as evidence.

## Current Position

**Phase 4B-C2R RECONCILIATION** — Evidence Accounting + Concern Semantics + Proof-of-Fix + Kestrel Determinism

**Status:** TECHNICALLY_READY_FOR_PHASE_4C (local mandatory gates passed)
**Prior status:** PHASE_4B_C2_PARTIAL (corrected — prior "GO for Phase 4C" was contradictory)

## Phase Sequence

```
Phase 4B-C2R RECONCILIATION (current — local mandatory gates passed)
  Accounting reconciliation (5 hard invariants)
  Concern family terminology correction
  Rule quality fix (api-key-in-error false positive elimination)
  Immutable Kestrel snapshot (git worktree)
  Parser error classification (102 errors, all Semgrep limitations)
  Proof-of-fix check-evaluation safety (scenario 14)
  Kestrel three-run determinism (finding-level PASS)
  Direct vs actual tarball equivalence
  Architecture spec DRAFT_REFERENCE status
  ↓
Phase 4C (NOT STARTED)
  Explicit public-release gate:
  - remote Windows/Linux CI
  - final runtime matrix
  - final legal/provenance review
  - offline-release verification (firewall-level)
  - private:true decision
  - npm publication decision
  - MCP Registry decision
  - tagging/release docs
  ↓
PLATFORM U0
  Architecture Truth Map
  ↓
PLATFORM U1
  Canonical contract and engine-identity repair
  ↓
PLATFORM U2
  HAIEC Evidence Core specification
  ↓
PLATFORM U3
  Static evidence unification
  ↓
PLATFORM U4
  Decision Pipeline repair
  ↓
PLATFORM U5
  Control Evidence Contracts
  ↓
PLATFORM U6
  Unified source-independent report model
  ↓
PLATFORM U7
  Compliance Twin temporal assurance integration
  ↓
PLATFORM U8
  Legacy retirement
  ↓
Phase 5
  HAIEC Native Analysis Engine Consolidation
  ↓
Phase 6
  Tree-sitter / ast-grep / HAIEC-native frontend investigation
```

## Architectural Invariant

**"One HAIEC product semantically; independent evidence producers operationally."**

No new HAIEC subsystem may define a new meaning of finding, evidence,
concern, risk, confidence, coverage, control state, canonical hash, or
assurance status without first reconciling with the canonical HAIEC contracts:

- `docs/architecture/HAIEC-EVIDENCE-MODEL-V1.md`
- `docs/architecture/HAIEC-EVIDENCE-ENVELOPE-V1.md`
- `docs/architecture/HAIEC-REPORT-CONTRACT-V1.md`

## Phase 5 — HAIEC Native Analysis Engine Consolidation

### Phase 5A: Canonical Program Analysis IR
- Function identity
- Lexical scope
- Control-flow metadata
- Heap metadata
- Call-site metadata
- Source/sink ownership

### Phase 5B: Function-specific CFG correctness
- Branches, nested branches
- Loops/back edges
- Returns
- Try/except/finally
- Function-end coverage
- Dominance/post-dominance
- Source/sink block mapping

### Phase 5C: Sound intraprocedural def-use and taint
- Lexical scopes
- Shadowing
- Redefinition
- Assignments
- Branches
- Sanitization/validation dominance

### Phase 5D: Interprocedural analysis
- Call graph
- Parameters
- Return values
- Caller/callee transitions
- Bounded recursion

### Phase 5E: Alias + heap proof integration
- Actual use of points-to graph
- Object fields
- Arrays
- Nested fields
- Alias uncertainty

### Phase 5F: Qualification
- Known positive corpus
- Known negative corpus
- Branch-sensitive corpus
- Alias/heap corpus
- Interprocedural corpus
- False-positive review
- Performance
- Determinism
- Evidence

**Estimated:** ~6-9 focused engineering/qualification sessions for a defensible Python implementation.

## Phase 6 — Tree-sitter / ast-grep / HAIEC-native frontend investigation

**Objective:** Standardize parsing across Python + JS/TS and progressively reduce Semgrep dependence.

**Migration rule:** Per-check semantic equivalence:
- EQUIVALENT
- INTENTIONALLY_IMPROVED
- UNSUPPORTED
- REGRESSION

Only qualified checks migrate. Do NOT replace Semgrep based on code completion alone.

**Long-term objective:** Single HAIEC-owned deterministic analysis pipeline with reduced external engine friction.

**Potential future MCP v1.1:** Same `scan_ai_security` tool with an optional qualified deeper HAIEC-native analysis layer. Do NOT expose this capability before qualification.

## CLAIM HOLD

HAIEC must NOT broadly claim:
- Mathematically proven dataflow
- Full CFG-backed taint
- Alias-backed deterministic proof
- Heap-backed deterministic proof
- Full interprocedural deterministic taint

...until Phase 5 qualification provides evidence.

## Confirmed Native Engine Gaps (2026-08-19)

From read-only inspection of `lib/ai-security/` in the HAIEC main repository:

1. **FlowGraphBuilder leaves cfg undefined** — `this.cfg = undefined` at line 108 of `flow-graph.ts`
2. **Deterministic CFG path falls back** — because cfg is undefined
3. **Core IR does not carry all AST control-flow/heap metadata cleanly**
4. **CFGs are function-specific**, not one repository-wide CFG
5. **Deterministic taint accepts a single CFG** — not interprocedural
6. **DeterministicSecurityEngine does not pass the call graph to FlowGraphBuilder**
7. **Alias and heap graphs passed into deterministic taint but not incorporated into its proof**
8. **Data-flow variable scope handling not yet sound enough for strong proof claims**
9. **CFG implementation requires correctness hardening** before being used as proof infrastructure
10. **Old documentation overstated production readiness**

These gaps are the scope of Phase 5. They are NOT being fixed in this phase.

## Verified Product-Unification Defects (2026-09-17, C2R)

From read-only inspection of the HAIEC main repository. See
`docs/evidence/phase-4b-final/product-unification-defects.md` for full evidence.

### P0 Defects (Platform U1/U4 scope)

1. **P0_ENGINE_ID_CONTRACT_MISMATCH** — Audit orchestrator uses canonical IDs
   (`inventory, static, runtime, wizard, regulatory`) but decision pipeline
   maps legacy forms (`static-analysis, runtime-test, ai-inventory`). Engine
   evidence is silently dropped when IDs don't match.
   → `lib/decision-pipeline/node-config.ts:84-110`

2. **P0_EVIDENCE_TRUNCATED_BEFORE_ASSURANCE** — Decision pipeline truncates
   findings to 50 per engine before assurance aggregation. 1,586 of 1,636
   findings would be silently lost.
   → `lib/decision-pipeline/aggregation.ts:559`

3. **P0_UNKNOWN_COVERAGE_FABRICATED_AS_50_PERCENT** — Missing coverage
   defaults to 50%, entering scoring as if real. Violates "absence ≠ pass."
   → `lib/decision-pipeline/aggregation.ts:542`

### P1 Defects (Platform U1/U4 scope)

4. **P1_COARSE_DEDUPLICATION_KEY** — Dedup by `engineId:ruleId/title` collapses
   distinct findings. → `lib/decision-pipeline/aggregation.ts:580-588`
5. **P1_EMPTY_EVIDENCE_REFS** — `evidenceRefs: []` in all aggregation paths.
   → `lib/decision-pipeline/aggregation.ts` lines 261, 293, 318, 348, 436, 486
6. **P1_OUTPUTHASH_COVERS_ONLY_NODETYPE_SCORE** — Tamper detection broken.
   → `lib/decision-pipeline/aggregation.ts:369`
7. **P1_FRESHNESS_USES_DATE_NOW** — Non-deterministic freshness.
   → `lib/decision-pipeline/aggregation.ts:392, 459`
8. **P1_SEPARATE_SCORING_METHODOLOGIES** — Orchestrator vs pipeline scoring
   not reconciled. Numeric confidence formulas must NOT be ported to MCP.
9. **P1_COMPLIANCE_ZERO_RULES_MEANS_PASS** — Zero triggered rules → PASS
   instead of NOT_ASSESSED. → `lib/ai-security/compliance-evidence-generator.ts:152,164`

### P2 Defects (Platform U8 scope)

10. **P2_COMPLIANCE_ENGINE_DEAD** — `compliance-engine.ts` is `@deprecated`,
    not imported anywhere. Safe to retire.
11. **P2_NATIVE_CFG_GAP** — FlowGraphBuilder leaves `cfg = undefined`. Native
    deterministic analysis is architecturally present but functionally
    incomplete. Phase 5 scope.

### Retirement Candidates (Platform U8)

See `docs/architecture/RETIREMENT-LEDGER.md` for the full retirement ledger.
