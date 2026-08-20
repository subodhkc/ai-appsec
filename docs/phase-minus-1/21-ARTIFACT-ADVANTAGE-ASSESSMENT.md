# 21 — Artifact Advantage Assessment

> **Phase -1 document.** Evaluates which HAIEC artifact/evidence concepts give
> the free Agent Security product a meaningful advantage without importing SaaS
> complexity.

---

## Artifacts Evaluated

### 1. HAIEC Scan Receipt

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Medium — schema design + digest computation + serialization | Reuse canonical hash pattern from `fingerprint.ts` |
| Security value | HIGH — reproducible evidence, tamper-evident | Enables CI evidence, audit trails |
| Developer value | HIGH — shareable, comparable, machine-readable | Developers can prove what was scanned |
| AI-agent value | HIGH — model can compare receipts before/after fix | Enables AI repair loops |
| Organic-growth value | HIGH — unique differentiator vs other scanners | No other free scanner has receipts |
| Future HAIEC paid-platform value | HIGH — receipt is the ingestion format for cloud | Natural upgrade path |

**Classification: BUILD_IN_V0.1**

The Scan Receipt is the signature feature. It differentiates HAIEC from every
other free security scanner. Build it from the start.

---

### 2. Proof-of-fix / NEW-EXISTING-RESOLVED lifecycle

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Low — requires baseline file + finding fingerprint comparison | Built on top of Scan Receipt |
| Security value | MEDIUM — demonstrates fixes, not just findings | Compliance evidence |
| Developer value | HIGH — "you fixed 3 issues" is motivating and clear | Progress tracking |
| AI-agent value | HIGH — model can verify its own fixes | Self-repair loop |
| Organic-growth value | HIGH — shareable "before/after" proof | Developers share fix proof |
| Future HAIEC paid-platform value | HIGH — aggregated fix history across orgs | Trend analysis |

**Classification: BUILD_IN_V0.1**

The NEW/EXISTING/RESOLVED lifecycle is lightweight (baseline file + fingerprint
comparison) and gives massive value for AI repair loops and developer motivation.

---

### 3. SARIF output

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Low — SARIF 2.1.0 already implemented in tenant-isolation engine | Reuse pattern |
| Security value | MEDIUM — standard format for GitHub Code Scanning | CI integration |
| Developer value | HIGH — inline PR annotations | Low friction |
| AI-agent value | LOW — SARIF is for CI, not model consumption | |
| Organic-growth value | HIGH — GitHub Code Scanning integration is a major channel | |
| Future HAIEC paid-platform value | MEDIUM — standard format | |

**Classification: BUILD_IN_V0.1**

SARIF is required for GitHub Code Scanning integration. Low effort, high distribution value.

---

### 4. Markdown security summary

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Low — template + finding data | |
| Security value | LOW — human-readable summary | |
| Developer value | MEDIUM — readable in PR comments, terminal | |
| AI-agent value | LOW — model prefers structured data | |
| Organic-growth value | MEDIUM — shareable in PRs | |
| Future HAIEC paid-platform value | LOW | |

**Classification: BUILD_IN_V0.1**

Markdown summary is low-effort and useful for PR comments and terminal output.

---

### 5. JSON structured result

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Low — serialize Scan Receipt to JSON | |
| Security value | MEDIUM — machine-readable for CI | |
| Developer value | HIGH — programmatic consumption | |
| AI-agent value | HIGH — `structuredContent` in MCP 2026-07-28 | |
| Organic-growth value | MEDIUM | |
| Future HAIEC paid-platform value | HIGH — ingestion format | |

**Classification: BUILD_IN_V0.1**

JSON structured result is the primary output format for MCP `structuredContent`.

---

### 6. Rule resources/documentation

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | Medium — per-rule docs generation from metadata | |
| Security value | LOW | |
| Developer value | HIGH — understanding what was found and how to fix | |
| AI-agent value | HIGH — model can reference remediation guidance | |
| Organic-growth value | HIGH — SEO + backlinks | |
| Future HAIEC paid-platform value | MEDIUM | |

**Classification: BUILD_IN_V0.1**

Per-rule documentation is critical for developer trust and AI remediation. Generate from rule metadata.

---

### 7. Future signed/hosted receipt

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | HIGH — cryptographic signing, key management, hosting | |
| Security value | HIGH — verifiable provenance | |
| Developer value | MEDIUM — most devs don't need signed receipts | |
| AI-agent value | LOW | |
| Organic-growth value | LOW | |
| Future HAIEC paid-platform value | HIGH — differentiator for enterprise | |

**Classification: ARCHITECT_NOW_BUILD_LATER**

Design the receipt schema to support a future `signature` field, but don't
implement signing in v0.1. This is a natural paid-platform feature.

---

### 8. Future cloud history

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | HIGH — cloud storage, API, auth | |
| Security value | MEDIUM | |
| Developer value | MEDIUM — trend tracking | |
| AI-agent value | LOW | |
| Organic-growth value | LOW | |
| Future HAIEC paid-platform value | HIGH — recurring revenue | |

**Classification: DEFER**

Cloud history is a paid-platform feature. The receipt schema should support it
(includes `scanId`, `timestamp`, `resultDigest` for aggregation), but don't build
cloud infrastructure in the free product.

---

### 9. Future organizational evidence aggregation

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Engineering effort | HIGH — multi-repo, multi-team aggregation | |
| Security value | HIGH — compliance evidence | |
| Developer value | LOW (individual) / HIGH (org) | |
| AI-agent value | LOW | |
| Organic-growth value | LOW | |
| Future HAIEC paid-platform value | HIGH — enterprise compliance | |

**Classification: DEFER**

Org-level aggregation is a paid-platform feature. The receipt format enables it
but the free product doesn't build it.

---

## Summary

| Artifact | Classification | Rationale |
|----------|----------------|-----------|
| HAIEC Scan Receipt | BUILD_IN_V0.1 | Signature differentiator; enables AI repair loops, CI evidence, sharing |
| Proof-of-fix (NEW/EXISTING/RESOLVED) | BUILD_IN_V0.1 | Lightweight; high AI-agent and developer value |
| SARIF output | BUILD_IN_V0.1 | Required for GitHub Code Scanning; low effort |
| Markdown security summary | BUILD_IN_V0.1 | Low effort; PR comments, terminal |
| JSON structured result | BUILD_IN_V0.1 | Primary MCP output format |
| Rule resources/documentation | BUILD_IN_V0.1 | Developer trust, AI remediation, SEO |
| Signed/hosted receipt | ARCHITECT_NOW_BUILD_LATER | Design schema to support; build in paid platform |
| Cloud history | DEFER | Paid-platform feature |
| Organizational evidence aggregation | DEFER | Paid-platform feature |

---

## Key Insight

The Scan Receipt + proof-of-fix lifecycle is the **primary competitive advantage**
of the free HAIEC Agent Security Scanner. No other free scanner offers:
- Reproducible, deterministic scan receipts
- NEW/EXISTING/RESOLVED finding lifecycle
- AI-agent-readable structured output with evidence hashes
- Per-rule remediation guidance

These features are lightweight to build but create significant differentiation.
They also create a natural upgrade path to the HAIEC paid platform (signed
receipts, cloud history, org aggregation) without building SaaS complexity into
the free product.
