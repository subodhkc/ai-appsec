# 09 — Competitive Claims Correction

> **Phase -0.5 document.** Corrects the Phase -1 claim that "Scan Receipt +
> proof-of-fix is a unique differentiator — no other free scanner has this."

---

## Phase -1 Error

Phase -1 stated: "Scan Receipt + proof-of-fix is a unique differentiator — no
other free scanner has this."

**This was made without competitive evidence.** Existing security ecosystems
already have concepts such as:
- Baseline/diff findings (Semgrep, CodeQL, Snyk)
- Stable finding fingerprints (SARIF `fingerprints` field)
- New/fixed issue lifecycle (GitHub Code Scanning)
- SARIF fingerprints for deduplication and tracking

The proof-of-fix lifecycle (NEW/EXISTING/RESOLVED) is not novel — it's a standard
pattern in security tooling.

---

## Corrected Assessment

### What HAIEC's combination MIGHT differentiate

The potential differentiation is NOT any single feature, but the COMBINATION of:

1. **AI-specific static security** — rules targeting AI/LLM patterns
2. **Tenant isolation analysis** — cross-tenant boundary detection
3. **Agent-native tool invocation** — MCP tools designed for AI agent selection
4. **Explicit coverage/completeness** — what was scanned, what wasn't, why
5. **Deterministic scan provenance** — reproducible receipt with JCS digest
6. **Deploy verdict** — explicit PASS/REVIEW/BLOCK/ERROR recommendation
7. **Multi-engine normalized receipt** — one receipt covering multiple engines
8. **Proof-of-fix lifecycle** — NEW/EXISTING/RESOLVED tracking

### Corrected wording

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Unique differentiator — no other free scanner has this" | "Potential differentiation: a unified agent-native security receipt combining HAIEC-specific engines, coverage and finding lifecycle" |
| "No other free scanner offers..." | "COMPETITIVE_VALIDATION_REQUIRED — must survey existing tools before claiming uniqueness" |

---

## Competitive Claims We Must NOT Make

| Claim | Why |
|-------|-----|
| "No other free scanner has proof-of-fix" | SARIF fingerprints + GitHub Code Scanning already provide this |
| "Unique differentiator" | Must validate against existing tools first |
| "First AI security scanner" | May not be true — must survey landscape |
| "Most comprehensive" | Promotional, not verified |
| "Only scanner with receipts" | Must verify — other tools may have equivalent features |

---

## What We CAN Say (after validation)

- "HAIEC provides a deterministic scan receipt with multi-engine normalized findings"
- "HAIEC combines AI-specific static analysis, tenant isolation, and LLM content verification"
- "HAIEC is designed for agent-native invocation via MCP"

These are factual descriptions of what HAIEC does, not comparative claims about
what others don't do.

---

## Action Required

Before making ANY competitive claim:
1. Survey existing free/open-source security scanners for equivalent features
2. Document what each tool offers
3. Only claim differentiation where verified
4. Mark all competitive claims as `COMPETITIVE_VALIDATION_REQUIRED` until validated

**Do NOT publish competitor-comparison claims yet.**
