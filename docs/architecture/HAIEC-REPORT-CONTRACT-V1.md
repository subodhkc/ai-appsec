# HAIEC Report Contract v1

> **Status:** DRAFT_REFERENCE
> **Purpose:** Define a unified report contract that can consume independent
> evidence envelopes from any subset of HAIEC evidence producers.
> **Conformance:** MCP currently conforms to relevant static-evidence portions.
> Platform U0/U1 will reconcile this document against HAIEC main architecture.
> Authoritative product-level specifications will be established there.
> No runtime coupling is introduced by this document.
> **Rule:** The report engine is NOT implemented in this phase. This contract
> locks the invariants that any future report engine must satisfy.

---

## 1. Locked Invariants

### 1.1 Source independence

A report accepts 1..N valid Evidence Envelopes (v1). No particular evidence
producer is required merely to generate a report.

### 1.2 Missing evidence is never PASS

Missing evidence is explicitly represented using:

| State | Meaning |
|-------|---------|
| `NOT_VERIFIED` | Evidence was evaluated but does not support the claim. |
| `NOT_ASSESSED` | No evidence was evaluated for this claim/category. |
| `PARTIAL` | Some evidence was evaluated but coverage is incomplete. |

**Absence of evidence is never interpreted as `PASS` or `VERIFIED`.**

### 1.3 Report status terminology

A report has separate status fields to prevent "complete report" from being
misread as "complete assurance":

```
reportGenerationStatus:
  GENERATED     — report was successfully generated
  ERROR         — report generation failed

evidenceCoverageStatus:
  COMPLETE      — all relevant evidence sources evaluated with full coverage
  PARTIAL       — some evidence evaluated but coverage is incomplete
  UNKNOWN       — coverage could not be determined
  NOT_ASSESSED  — no evidence was evaluated for this claim/category

assuranceState:
  (separate field, derived from evidence evaluation)
```

`reportGenerationStatus = GENERATED` with `evidenceCoverageStatus = PARTIAL`
is a valid state. A report can be structurally generated while the underlying
evidence is partial. These are separate concepts.

### 1.4 Schema stability

The same report schema is used regardless of the number of evidence sources.
Adding an evidence source enriches or revises assurance conclusions through
explicit evidence evaluation — it does not change the schema.

### 1.5 No denominator re-normalization

The absence of one evidence source must NOT automatically improve a score by
denominator re-normalization. If a category was not assessed, it remains
`NOT_ASSESSED` — it does not disappear from the denominator.

### 1.6 Source-specific limitations survive aggregation

If producer A reports `PARTIAL` due to timeout, that limitation appears in the
final report even if producer B reports `COMPLETE` for a different category.

### 1.7 Evidence sources are listed explicitly

The report lists all evidence sources used AND all material categories not
evaluated.

---

## 2. Preferred Report Sections

| Section | Purpose |
|---------|---------|
| Executive conclusion | Verdict + key concerns in agent-decision-quality form. |
| Evidence profile | Which producers contributed, what they covered. |
| Priority concerns | Top material Security Concerns with rationale. |
| Assurance state | Per-control-claim assurance states. |
| Coverage | What was analyzed, what was not, why. |
| Verified areas | Claims with `VERIFIED` state and supporting evidence. |
| Not-verified areas | Claims with `NOT_VERIFIED`, `NOT_ASSESSED`, or `PARTIAL`. |
| Evidence sources | Producer identities, versions, digests. |
| Representative evidence | Bounded representative findings per concern. |
| Remediation | Remediation classes and guidance. |
| Control mappings | Mappings to frameworks (NIST, OWASP, ISO). |
| Provenance | Full provenance chain for each evidence source. |
| Limitations | All limitations from all sources, preserved. |
| Revalidation / proof-of-fix | Baseline comparison and resolution status. |

---

## 3. Decision-Quality Output Rules

1. The primary output communicates material concerns, not raw alert noise.
2. Wording like "14 material security concerns supported by 1,636 finding
   instances" is preferred over "1,636 findings."
3. Every canonical finding remains accounted for — grouping is a view, not
   deletion.
4. Exact totals are preserved: `detectorInstancesFound`,
   `canonicalFindingsFound`, `materialConcernsFound`, `observationsFound`.
5. Concern Priority (v0.1) determines presentation order — not a fuzzy risk
   score.
6. BLOCK/CRITICAL concerns never get outranked by volume of lower-priority
   instances.

---

## 4. Future MCP / SaaS Alignment

- MCP evidence envelopes can be ingested by a future SaaS report engine
  without runtime coupling.
- SaaS evidence envelopes can be ingested by a future MCP-adjacent report
  without runtime coupling.
- The contract is the unification layer. Runtime independence is preserved.
- No new HAIEC subsystem may define a new meaning of finding, evidence,
  concern, risk, confidence, coverage, control state, canonical hash, or
  assurance status without first reconciling with the canonical contracts
  (Evidence Model v1, Evidence Envelope v1, this document).

---

## 5. Non-Goals

- This contract does NOT implement the report engine.
- This contract does NOT mandate a specific serialization format.
- This contract does NOT define numeric risk/confidence scores.
- This contract does NOT require all sections to be present in every report —
  sections may be omitted when the underlying evidence is absent (with
  `NOT_ASSESSED` explicitly noted).
