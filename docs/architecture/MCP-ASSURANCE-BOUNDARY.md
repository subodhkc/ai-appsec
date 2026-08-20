# MCP Assurance Boundary

> **Status:** Specification.
> **Purpose:** Document what the HAIEC MCP static scanner owns and does not own.
> **Positioning:** "HAIEC MCP produces deterministic, reproducible security
> evidence that can feed a broader assurance process."

---

## 1. MCP OWNS

The free MCP static scanner (`scan_ai_security`) owns:

| Capability | Description |
|------------|-------------|
| Local source scanning | Scans AI/LLM/agent source code locally. |
| Semgrep execution | Invokes Semgrep with `--metrics off`. No telemetry. |
| Rulepack/manifest identity | Public Core rulepack + manifest with deterministic digests. |
| Normalized findings | Canonical findings adapted from raw Semgrep output via manifest. |
| Security Concern grouping | Deterministic v0.1 grouping of findings into decision-quality concerns. |
| Concern Priority | Deterministic v0.1 lexicographic priority (no fuzzy scoring). |
| Coverage / completeness | Honest file-set accounting, completeness status, coverage digests. |
| Scan Receipt | Deterministic receipt with evidence digests. |
| Proof-of-fix comparison | Baseline-vs-rescan comparison with strict safety contract. |
| Bounded agent-facing output | Diversity-aware bounding at concern and finding level. |
| Accounting invariants | Exact totals preserved: instances, canonical findings, concerns, observations. |

---

## 2. MCP DOES NOT OWN

| Out-of-scope | Owned by |
|--------------|----------|
| SaaS persistence | HAIEC SaaS backend |
| Tenant isolation / RLS checks | `scan_tenant_isolation` (independent engine) |
| LLM content verification | `verify_llm_content` (LLMVerify, independent engine) |
| Release/deploy enforcement | `check_deploy_security` (future, not yet implemented) |
| Universal report orchestration | Future HAIEC report engine (Report Contract v1) |
| Native engine execution | Future native deterministic analysis engine (Phase 5) |
| Cloud fallback | N/A — MCP is local-only |
| Runtime behavioral assurance | Runtime tester (separate evidence producer) |
| Organizational control verification | Regulatory engine / compliance twin |
| Legal compliance / certification | N/A — MCP provides evidence, not legal conclusions |

---

## 3. What MCP Claims

MCP may claim:
- Deterministic, reproducible static security evidence for AI/LLM source code.
- Decision-quality Security Concerns with exact accounting.
- Coverage and completeness accounting.
- Proof-of-fix comparison under strict safety conditions.
- Local execution with no network requirements (scanner path).

MCP must NOT claim:
- Complete AI system assurance.
- Runtime behavioral assurance.
- Organizational control verification beyond scanned evidence.
- Legal compliance or certification.
- Complete regulatory assurance.
- Zero false positives or zero false negatives.

---

## 4. Future Integration

MCP output is designed to enter a future HAIEC Audit Orchestrator as
`STATIC` evidence. The Evidence Envelope v1 contract enables this without
runtime coupling:

- MCP produces an envelope conforming to Evidence Envelope v1.
- A future report engine consumes envelopes from MCP and other producers.
- No runtime dependency is created — the contract is the unification layer.

---

## 5. Tool Selection Boundary

`scan_ai_security` is selected ONLY for AI/LLM/agent source-code security
scanning. It is NOT selected for:
- Tenant isolation → `scan_tenant_isolation`
- LLM content verification → `verify_llm_content`
- Deployment gating → `check_deploy_security`
- Generic compliance questionnaires
- Generic non-AI source scanning where HAIEC has no applicable AI check

False invocation (selecting the wrong tool) is as important a defect as
missed invocation.
