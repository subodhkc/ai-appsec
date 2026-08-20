# 00 — Reconciliation Summary

> **Phase -0.5 summary document.** Overview of all corrections made to Phase -1
> conclusions. The Phase -1 audit was useful but several conclusions were stronger
> than the evidence supported.

---

## Why This Phase Exists

Phase -1 produced 24 decision-pack documents. Several conclusions were stated with
more certainty than the evidence warranted. Before those conclusions become
architectural truth for Phase 0+, we must correct them.

The most important correction: the rule-count conclusion.

---

## Top 10 Corrections

### 1. Rule Count (MOST CRITICAL)

| Phase -1 | Phase -0.5 |
|----------|------------|
| "121 rules is FALSE; actual count is 91" | 121 detector definitions execute in Modal (all `ai-*`); 91 in YAML file; 0 SOC2 rules execute |

**Evidence:** `AI_SECURITY_RULES` in `modal_ai_security_scanner.py:989-3358` contains
121 unique `ai-*` Semgrep rule IDs. `semgrep_rules.yaml` contains 91. The 30 extra
are language-specific splits, NOT SOC2 rules. SOC2 rules are phantom — 0 execute.

### 2. SOC2 Rules

| Phase -1 | Phase -0.5 |
|----------|------------|
| "30 SOC2 rules not found in any YAML" | "0 SOC2 rules execute anywhere. 30 phantom mappings, 21 metadata-only TypeScript objects, 0 Semgrep definitions" |

### 3. Rule Provenance

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Provenance UNKNOWN for all 91 rules" | "~63 PROVEN_HAIEC_ORIGINAL, ~28 STRONG_HAIEC_ORIGIN_EVIDENCE" (based on git history) |

### 4. LLMVerify stdio

| Phase -1 | Phase -0.5 |
|----------|------------|
| "LLMVerify is not MCP-stdio-safe" | "MCP_STDIO_FIRST_RUN_RISK — untested, not confirmed broken" |

### 5. Tenant Isolation

| Phase -1 | Phase -0.5 |
|----------|------------|
| "No MCP coupling" | "Includes MCP, but `scan()` bypasses the MCP wrapper" |

### 6. Evidence Canonicalization

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Directly reusable" | "REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS" |

### 7. Competitive Claims

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Unique differentiator — no other free scanner has this" | "COMPETITIVE_VALIDATION_REQUIRED — potential differentiation is the combination" |

### 8. MCP Architecture

| Phase -1 | Phase -0.5 |
|----------|------------|
| "MCP 2026 is stateless" | "stdio is long-lived; HTTP is stateless; dual-era SDK handles both" |

### 9. MCP Client Compatibility

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Client spec unknown = P0 blocker" | "Build-time: dual-era SDK; host validation deferred to pre-Beta" |

### 10. AI Discovery

| Phase -1 | Phase -0.5 |
|----------|------------|
| Conflated SEO/indexing with tool selection | Separated into 4 categories: search/indexing, installation, tool selection, host-native activation |

---

## Documents Created

- `docs/phase-minus-0-5/00-RECONCILIATION-SUMMARY.md` (this file)
- `docs/phase-minus-0-5/01-AUDIT-CORRECTIONS.md`
- `docs/phase-minus-0-5/02-RULE-EXECUTION-INVENTORY.md`
- `docs/phase-minus-0-5/03-RULE-COUNT-TAXONOMY.md`
- `docs/phase-minus-0-5/04-SOC2-RULE-EXECUTION-TRACE.md`
- `docs/phase-minus-0-5/05-RULE-PROVENANCE-UPDATE.md`
- `docs/phase-minus-0-5/06-LLMVERIFY-STDIO-RISK-CORRECTION.md`
- `docs/phase-minus-0-5/07-TENANT-INTEGRATION-CORRECTION.md`
- `docs/phase-minus-0-5/08-EVIDENCE-CANONICALIZATION-DECISION.md`
- `docs/phase-minus-0-5/09-COMPETITIVE-CLAIMS-CORRECTION.md`
- `docs/phase-minus-0-5/10-MCP-V2-COMPATIBILITY-DECISION.md`
- `docs/phase-minus-0-5/11-AI-DISCOVERY-CHANNEL-MAP.md`
- `docs/phase-minus-0-5/12-AI-TOOL-SELECTION-EVAL-REVIEW.md`
- `docs/phase-minus-0-5/13-PHASE-0-ENTRY-DECISION.md`

## Phase -1 Documents Updated

- `docs/phase-minus-1/00-EXECUTIVE-SUMMARY.md`
- `docs/phase-minus-1/02-CLAIMS-LEDGER.md`
- `docs/phase-minus-1/03-VERSION-DRIFT-AUDIT.md`
- `docs/phase-minus-1/04-RULEPACK-FORENSIC-INVENTORY.md`
- `docs/phase-minus-1/24-PHASE-0-ENTRY-DECISION.md`

---

## Decision

**READY_FOR_PHASE_0**

All overstrong conclusions have been corrected. The verified truth base is now
stronger and more defensible. Phase 0 may begin with the revised scope defined in
`13-PHASE-0-ENTRY-DECISION.md`.
