# ADR-001: Future Engine Migration — Semgrep to Tree-sitter/ast-grep

## Status

PROPOSED — Roadmap, not a public capability claim.

## Context

HAIEC v1 uses qualified native Semgrep 1.173.0 as its analysis engine.
Semgrep is an execution dependency, not HAIEC's product moat. HAIEC's
value is in its security checks (rule definitions, detector IDs,
security check IDs, manifest, normalization, prioritization, verdict).

Long-term objective: one HAIEC package with no external Semgrep
requirement, while preserving deterministic local execution.

## v1 Decision

HAIEC uses qualified native Semgrep 1.173.0.

- Semgrep is an execution dependency
- Semgrep is not HAIEC's product moat
- Exact-version qualification for v1
- No compatibility version range in v1
- No Semgrep vendoring/repackaging in npm package
- No silent Semgrep download at runtime

## Post-v1 Investigation

Prototype a HAIEC-owned execution engine based on:

- Tree-sitter as parsing foundation
- ast-grep and/or HAIEC-native structural matching where useful

### Initial migration targets

- Python
- JavaScript/TypeScript

### Migration classification

For every security check, classify migration status:

| Status | Meaning |
|--------|---------|
| EQUIVALENT | Same findings on same inputs |
| EQUIVALENT_WITH_DOCUMENTED_DIFFERENCE | Same semantics, documented behavioral difference |
| UNSUPPORTED | Cannot be expressed in new engine |
| REGRESSION | New engine misses findings or adds FPs |

### Migration rule

No detector/check moves away from Semgrep until qualification proves
EQUIVALENT or intentionally improved semantics (EQUIVALENT_WITH_DOCUMENTED_DIFFERENCE
with explicit approval).

### Evidence-driven

Migration must be per-security-check and evidence-driven. Each check
must be validated against:
- Positive fixtures (must fire)
- Negative fixtures (must not fire)
- False-positive fixtures (must not fire)
- Real-repository smoke test (same finding count or documented difference)

## Non-goals

- Do NOT implement the migration now
- Do NOT claim Tree-sitter/ast-grep support publicly
- Do NOT set a timeline
- This ADR is a roadmap, not a public capability claim
