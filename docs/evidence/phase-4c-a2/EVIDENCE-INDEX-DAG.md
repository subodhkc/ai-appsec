# Evidence Index DAG (Phase 4C-A2)

> Part 11 — Evidence dependency model. No circular hash dependencies.

## DAG Structure

```
Finalize all test evidence
        ↓
Finalize all reports
        ↓
Finalize RELEASE-CANDIDATE-MANIFEST (does NOT contain EvidenceIndexDigest)
        ↓
DO NOT modify any indexed artifact afterward
        ↓
Generate phase-4c-a2-evidence-index.json
        ↓
Compute EvidenceIndexDigest
        ↓
STOP — return EvidenceIndexDigest in final report only
```

## Key Rule

RELEASE-CANDIDATE-MANIFEST must NOT contain the EvidenceIndexDigest if that
manifest itself is included in the evidence index. This avoids circular hash
dependencies.

The final user-facing phase report may reference EvidenceIndexDigest without
being an indexed artifact.

## Indexed Artifacts (phase-4c-a2/)

1. RC6-CHANGED-RULE-FIXTURE-QUALIFICATION.json
2. CROSS-SESSION-REPRODUCIBILITY.json
3. independent-process-session-1.json
4. independent-process-session-2.json
5. independent-process-session-3.json
6. direct-vs-tarball-comparison.json
7. PROVENANCE-TERMINOLOGY-CORRECTION.md
8. RELEASE-CANDIDATE-MANIFEST.json
9. EVIDENCE-INDEX-DAG.md (this file)

## Non-Indexed (final report only)

- EvidenceIndexDigest — computed last, reported in final report only
- Final interactive report — not an indexed artifact
