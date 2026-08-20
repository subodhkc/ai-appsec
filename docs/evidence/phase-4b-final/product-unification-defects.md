# Product-Unification Defects — Verified

> **Status:** Verified by read-only inspection of HAIEC main repository.
> **Date:** 2026-09-17
> **Rule:** All defects verified by reading executable code with file:line
> evidence. Comments were not trusted.
> **Action:** Defects are DOCUMENTED ONLY. HAIEC main repo was NOT modified.

---

## Verified P0 Defects

### P0_ENGINE_ID_CONTRACT_MISMATCH (Defect B)

**Status:** VERIFIED

`audit-orchestrator/types.ts:58-63` defines canonical engine IDs:
```
ENGINE_IDS = ['inventory', 'static', 'runtime', 'wizard', 'regulatory']
```

`decision-pipeline/node-config.ts:84-110` defines `ENGINE_NODE_MAP` with
legacy forms:
```
'static-analysis'   (not 'static')
'static_scan'       (not 'static')
'runtime-test'      (not 'runtime')
'runtime_test'      (not 'runtime')
'ai-inventory'      (not 'inventory')
'ai_inventory'      (not 'inventory')
'wizard'            (matches)
'compliance_wizard' (extra)
'nyc-ll144'         (extra)
'bias_detection'    (extra)
'compliance-twin'   (extra)
'compliance_twin'   (extra)
```

**Impact:** When the orchestrator emits `engineId: 'static'`, the decision
pipeline's `getNodesForEngine('static')` returns `[]` (empty array) because
the map only has `'static-analysis'` and `'static_scan'`. The normalised
fallback (`engineId.toLowerCase().replace(/-/g, '_')`) converts `'static'`
to `'static'` — still not in the map. Engine evidence is silently dropped.

---

### P0_EVIDENCE_TRUNCATED_BEFORE_ASSURANCE (Defect C)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts:559`:
```typescript
.slice(0, 50) // cap at 50 findings per engine to prevent bloat
```

**Impact:** Findings are truncated to 50 per engine BEFORE assurance
aggregation. If an engine produces 1,636 findings, only 50 enter the
decision pipeline. The remaining 1,586 are silently lost. Assurance
conclusions are based on incomplete evidence.

---

### P0_UNKNOWN_COVERAGE_FABRICATED_AS_50_PERCENT (Defect E)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts:542`:
```typescript
return 50 // neutral default - don't penalise if coverage isn't reported
```

**Impact:** When coverage is not reported, the pipeline fabricates a 50%
coverage value. This is not `NOT_ASSESSED` — it is a fabricated number that
enters the scoring formula as if it were real. This violates the Evidence
Model v1 invariant: "absence of evidence is not evidence of absence."

---

## Verified P1 Defects

### P1_COARSE_DEDUPLICATION_KEY (Defect D)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts:580-588`:
```typescript
function deduplicateFindings(findings: NormalisedFinding[]): NormalisedFinding[] {
  const seen = new Set<string>()
  return findings.filter((f) => {
    const key = `${f.engineId}:${f.ruleId ?? f.title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
```

**Impact:** Deduplication key is `engineId + ruleId/title`. Two distinct
findings from the same rule in different files with the same title are
collapsed. This is coarser than MCP's Security Concern grouping (which
preserves all instances and groups by `securityCheckId + kind + disposition +
severity` as a VIEW, not deletion).

---

### P1_EMPTY_EVIDENCE_REFS (Defect F)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts` — multiple paths initialize `evidenceRefs: []`:
- Line 261
- Line 293
- Line 318
- Line 348
- Line 436
- Line 486

**Impact:** The schema supports `evidenceRefs` but no path populates them.
Assurance conclusions cannot trace back to specific evidence records. This
breaks the evidence provenance chain required by Evidence Envelope v1.

---

### P1_OUTPUTHASH_COVERS_ONLY_NODETYPE_SCORE (Defect G)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts:369`:
```typescript
const outputHash = hashJson(nodeResults.map((n) => ({ nodeType: n.nodeType, score: n.score })))
```

**Impact:** The output hash covers only `nodeType` and `score`. Two runs with
completely different findings but the same node scores produce the same hash.
This breaks tamper detection and proof-of-fix comparison.

---

### P1_FRESHNESS_USES_DATE_NOW (Defect H)

**Status:** VERIFIED

`decision-pipeline/aggregation.ts:392`:
```typescript
const dataAgeDays = (Date.now() - latestRunAt.getTime()) / (1000 * 60 * 60 * 24)
```

Also at line 459.

**Impact:** Freshness recomputation depends on `Date.now()`, making it
non-deterministic. The same evidence produces different freshness values
depending on when it is recomputed. This breaks deterministic evidence
identity.

---

### P1_SEPARATE_SCORING_METHODOLOGIES (Defect I)

**Status:** VERIFIED

- `audit-orchestrator` uses `fingerprint.ts` (SHA-256 provenance hashing).
- `decision-pipeline/scoring.ts` uses a separate Decision Integrity Score
  (DIS) formula with numeric confidence penalties:
  - `coverageScore < 50% → DIS × 0.85`
  - `coverageScore 50-74% → DIS × 0.95`
  - `coverageScore ≥ 75% → no penalty`

**Impact:** Two separate scoring methodologies exist. The orchestrator
produces provenance hashes; the pipeline produces numeric scores. These are
not reconciled. MCP must NOT import these numeric formulas.

---

### P1_COMPLIANCE_ZERO_RULES_MEANS_PASS (Defect K)

**Status:** VERIFIED

`compliance-evidence-generator.ts:152`:
```typescript
status: fc.rulesTriggered > 0 ? 'ISSUES_FOUND' : 'PASS'
```

Also at line 164.

**Impact:** When zero rules trigger, the control status is `PASS`. This
violates the Evidence Model v1 invariant: zero triggered rules could mean
"not assessed" rather than "passed." The correct state should be
`NOT_ASSESSED` when no rules were evaluated, and `VERIFIED` only when rules
were evaluated and none triggered.

---

## Verified P2 Defects

### P2_COMPLIANCE_ENGINE_DEAD (Defect M)

**Status:** VERIFIED

`compliance-twin/compliance-engine.ts:2`:
```typescript
* @deprecated - LEGACY FILE. Not imported anywhere in the codebase.
```

No imports found across `lib/**/*.ts` or `app/**/*.ts*`.

**Impact:** Dead code. Safe to retire. Replacement: rulepack-engine +
delta-engine.

---

### P2_NATIVE_CFG_GAP (Native Analysis)

**Status:** VERIFIED

`flow-graph.ts:106-108`:
```typescript
// TODO: Extract control flow from IR and build CFG
this.cfg = undefined;
```

Also: `pointsToGraph = undefined` (line 135), `heapGraph = undefined` (line 154).

**Impact:** The FlowGraphBuilder is instantiated by `deterministic-engine.ts`
but CFG construction is not implemented. Data flow analysis (line 161) is
gated on `if (this.cfg)` and therefore never executes. The native
deterministic analysis pipeline is architecturally present but functionally
incomplete.

**Action:** Document in ADR-002 and master roadmap. Do NOT implement in this
phase. Phase 5 will address native analysis.

---

## Not Verified / Not Applicable

### Defect L: Legacy scannerFingerprint non-cryptographic

**Status:** NOT VERIFIED for orchestrator fingerprint.

`fingerprint.ts` uses `sha256` from `lib/audit/hash.ts` which uses
`crypto.createHash('sha256')` — this IS cryptographic.

However, the decision-pipeline `outputHash` (defect G) covers only
`nodeType + score`, which is a semantic weakness but not a non-cryptographic
hash. Defect L as stated is not verified for the current orchestrator
fingerprint implementation.

---

## Summary

| Defect | Classification | Verified |
|--------|---------------|----------|
| B | P0_ENGINE_ID_CONTRACT_MISMATCH | YES |
| C | P0_EVIDENCE_TRUNCATED_BEFORE_ASSURANCE | YES |
| E | P0_UNKNOWN_COVERAGE_FABRICATED_AS_50_PERCENT | YES |
| D | P1_COARSE_DEDUPLICATION_KEY | YES |
| F | P1_EMPTY_EVIDENCE_REFS | YES |
| G | P1_OUTPUTHASH_COVERS_ONLY_NODETYPE_SCORE | YES |
| H | P1_FRESHNESS_USES_DATE_NOW | YES |
| I | P1_SEPARATE_SCORING_METHODOLOGIES | YES |
| K | P1_COMPLIANCE_ZERO_RULES_MEANS_PASS | YES |
| M | P2_COMPLIANCE_ENGINE_DEAD | YES |
| Native CFG | P2_NATIVE_CFG_GAP | YES |
| L | Legacy non-cryptographic fingerprint | NOT VERIFIED |
