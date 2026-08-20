# HAIEC Evidence Model v1

> **Status:** DRAFT_REFERENCE
> **Purpose:** Define the canonical concepts that every HAIEC evidence producer
> and report consumer must align with. This is a contract unification layer —
> it does NOT create a runtime dependency between repositories.
> **Conformance:** MCP currently conforms to relevant static-evidence portions.
> Platform U0/U1 will reconcile this document against HAIEC main architecture.
> Authoritative product-level specifications will be established there.
> No runtime coupling is introduced by this document.
> **Rule:** No new HAIEC subsystem may define a new meaning of finding,
> evidence, concern, risk, confidence, coverage, control state, canonical hash,
> or assurance status without first reconciling with this model.

---

## 1. Principles

1. **One HAIEC product semantically; independent evidence producers operationally.**
2. **No evidence producer is required merely so another producer can finish.**
3. **A report can complete using ANY available subset of valid evidence sources.**
4. **Missing evidence is explicitly represented — never interpreted as PASS.**
5. **Evidence identity is deterministic and content-sensitive.**
6. **Operational metadata (timestamps, durations, PIDs) must not silently alter
   deterministic evidence identity.**

---

## 2. Canonical Concepts

### 2.1 OBSERVATION

Something directly observed by an evidence producer.

- An observation is raw sensor output — it has not yet been interpreted as
  security-relevant.
- Example: "Semgrep rule `ai-unsafe-exec-001` matched at `src/agent.py:42`."
- Observations are producer-specific. They carry producer identity and
  provenance.

### 2.2 EVIDENCE RECORD

A provenance-wrapped observation.

- An evidence record adds: producer identity, producer version, run identity,
  deterministic digest, timestamp (operational, not identity), and limitations.
- Evidence records are the atomic unit of evidence exchange.
- An evidence record is NOT yet a finding — it is an observed fact with
  provenance.

### 2.3 FINDING

A security-relevant interpretation of one or more evidence records.

- A finding applies a security check's semantics to observations.
- A finding has: securityCheckId, findingKind, canonicalSeverity,
  defaultDisposition, location, evidenceHash, remediationClass.
- Findings are canonical — the same underlying observation produces the same
  finding identity regardless of producer (when producers share the same
  security-check contract).
- Findings are NOT concerns — a finding is a single interpreted instance.

### 2.4 SECURITY CONCERN

A deterministic decision-quality grouping of compatible findings.

- A concern groups findings that share the same securityCheckId, findingKind,
  disposition, and severity (v0.1 conservative grouping).
- Grouping is a VIEW, not deletion. Every finding remains accounted for.
- Never merge across securityCheckId merely because titles look similar.
- Never merge semantically distinct findings merely to reduce volume.
- When uncertain: KEEP SEPARATE.
- No LLM grouping. All grouping is deterministic.
- A concern carries: concernId, instanceCount, affectedFileCount,
  affectedDetectorCount, representative findings, remediation class.
- Issue Aggregation Version: `0.1.0`

### 2.5 CONTROL CLAIM

A statement that evidence may support or contradict.

- Example: "AI outputs are not executed without explicit validation."
- A control claim is a proposition, not a measurement.
- Control claims map to frameworks (NIST, OWASP, ISO) and to security checks.
- A control claim's assurance state depends on the available evidence.

### 2.6 CONTROL EVIDENCE SET

Supporting, contradicting, missing, stale, or insufficient evidence related to a
control claim.

- A control evidence set aggregates all evidence records relevant to a claim.
- The set may be empty (no evidence evaluated) — this is NOT PASS.
- The set may be partial (some checks evaluated, others not) — this is PARTIAL.
- The set may be contradictory (some evidence supports, some contradicts).

### 2.7 ASSURANCE STATE

The defensible state supported by available evidence.

Canonical assurance states:

| State | Meaning |
|-------|---------|
| `VERIFIED` | Evidence supports the claim under complete relevant coverage. |
| `PARTIALLY_VERIFIED` | Evidence supports the claim but coverage is incomplete. |
| `NOT_VERIFIED` | Evidence was evaluated but does not support the claim. |
| `NOT_ASSESSED` | No evidence was evaluated for this claim. |
| `CONTRADICTED` | Evidence actively contradicts the claim. |
| `STALE` | Evidence exists but is outdated beyond freshness thresholds. |
| `ERROR` | Evidence evaluation failed — state is indeterminate. |

**Critical invariant:** `NOT_ASSESSED` is NEVER equivalent to `PASS` or
`VERIFIED`. Absence of evidence is not evidence of absence.

### 2.8 ASSURANCE SNAPSHOT

A point-in-time set of assurance states.

- A snapshot binds: evidence producer identities, evidence digests, control
  claims, assurance states, coverage, completeness, and provenance.
- Snapshots are deterministic in their evidence identity (digests) but may
  carry operational metadata (timestamps) that is explicitly non-identity.
- Snapshots are the unit of comparison for proof-of-fix and delta analysis.

### 2.9 REPORT

A consistent presentation of available evidence and assurance.

- A report consumes 1..N evidence envelopes (see Evidence Envelope v1).
- A report does NOT require any particular evidence producer.
- A report preserves source independence and source-specific limitations.
- A report distinguishes verified, partial, not-assessed, and contradicted
  areas explicitly.
- See HAIEC Report Contract v1 for the report-level invariants.

---

## 3. Relationship to Existing HAIEC Concepts

| HAIEC main-repo concept | Model v1 concept | Status |
|--------------------------|------------------|--------|
| Scanner finding | FINDING | Aligned |
| Aggregated finding | SECURITY CONCERN (partial) | Needs alignment |
| Compliance evidence | CONTROL EVIDENCE SET | Needs alignment |
| Decision pipeline score | ASSURANCE STATE (partial) | Needs reconciliation |
| Audit orchestrator engine | EVIDENCE PRODUCER | Aligned conceptually |
| Scan receipt | EVIDENCE RECORD envelope | Aligned (MCP) |

---

## 4. Versioning

- Evidence Model version: `1.0.0` (this specification)
- Issue Aggregation version: `0.1.0` (Security Concern grouping semantics)
- Concern Priority version: `0.1.0` (deterministic priority ordering)
- These versions are independent. A producer may adopt the Evidence Model
  without adopting Concern Priority.

---

## 5. Non-Goals

- This model does NOT define a runtime library or shared package.
- This model does NOT couple MCP to HAIEC SaaS or any other engine.
- This model does NOT define numeric risk/confidence scores.
- This model does NOT mandate a specific report format (see Report Contract v1).
- This model does NOT require all producers to implement all concepts.
