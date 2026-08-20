# 10 — Tool Independence Contract

> **Phase -1 document.** This is a binding architectural contract. No implementation
> yet. Every future phase MUST comply. Violations are product defects.

---

## 1. Principle

The four planned HAIEC Agent Security capabilities are **independent engines**.
Three of them (`scan_ai_security`, `scan_tenant_isolation`, `verify_llm_content`)
are standalone engines that MUST NOT invoke each other. Only
`check_deploy_security` is a composite orchestration layer, and even it must
explicitly report what ran and what was skipped.

This is not a style preference. It is a correctness invariant. If engines
silently cascade, we lose:
- reproducibility (which engine produced which finding?)
- AI tool-selection accuracy (the model can't reason about what will happen)
- user trust (a "source code scan" that secretly calls an LLM verifier is a
  privacy violation)
- engine independence (the standalone products lose their identity)

---

## 2. The Four Capabilities

| Tool | Engine | What it does | What it MUST NOT do |
|------|--------|-------------|---------------------|
| `scan_ai_security` | HAIEC AI static security engine | Static analysis of source code for AI/LLM security issues using Semgrep + HAIEC rulepack | MUST NOT call LLMVerify. MUST NOT call tenant isolation. MUST NOT call any LLM API. MUST NOT make network calls (local mode). |
| `scan_tenant_isolation` | Tenant isolation engine (`mcp-tenant-isolation`) | Static analysis of cross-tenant boundary patterns (Prisma queries, multi-tenancy logic) | MUST NOT call the general AI security scanner. MUST NOT call LLMVerify. MUST NOT call any LLM API. |
| `verify_llm_content` | LLMVerify (`llmverify-npm`) | Runtime verification of LLM input/output for prompt injection, PII, harmful content, hallucination risk | MUST ONLY invoke LLMVerify-related functionality. MUST NOT call security scanners. MUST NOT call tenant isolation. |
| `check_deploy_security` | Orchestration/gate layer | Composes applicable engines for a deploy/release decision. Explicitly reports which engines ran, which were skipped, and why. | MUST NOT silently cascade. MUST report per-engine status. MUST respect each engine's independence — it calls them, it does not merge them. |

---

## 3. Mandatory Invariants

```
INVARIANT 1: scan_ai_security MUST NOT call LLMVerify.
INVARIANT 2: scan_ai_security MUST NOT automatically call scan_tenant_isolation.
INVARIANT 3: scan_tenant_isolation MUST NOT call scan_ai_security.
INVARIANT 4: scan_tenant_isolation MUST NOT call verify_llm_content.
INVARIANT 5: verify_llm_content MUST ONLY invoke LLMVerify-related functionality.
INVARIANT 6: check_deploy_security is the ONLY composite/orchestration capability.
INVARIANT 7: check_deploy_security MUST report which engines ran, which did not, and why.
INVARIANT 8: No engine silently cascades into another engine.
INVARIANT 9: No additional public tools are added during Phase -1.
INVARIANT 10: Engine source code is never merged into HAIEC for convenience.
```

---

## 4. `check_deploy_security` Reporting Requirements

When `check_deploy_security` runs, its output MUST include, for each engine:

| Field | Required | Example |
|-------|----------|---------|
| `engine` | yes | `scan_ai_security` |
| `status` | yes | `PASSED` / `FINDINGS` / `NOT_APPLICABLE` / `PARTIAL` / `SKIPPED` / `FAILED` |
| `ran` | yes | `true` / `false` |
| `reason_ran` | yes if `ran: true` | `ai_security_policy_enabled` |
| `reason_skipped` | yes if `ran: false` | `no_source_code_changes` / `engine_not_configured` / `not_applicable` |
| `findings_count` | yes if `ran: true` | `3` |
| `engine_version` | yes if `ran: true` | `1.2.0` |
| `rulepack_version` | yes if applicable | `2.1.0` |

---

## 5. Enforcement Mechanism (future implementation requirements)

These are requirements for later phases, NOT implementations now:

1. **Code-level isolation:** Each engine must be a separate module/package boundary.
   The HAIEC MCP server imports each engine's programmatic API; it does not
   import engine internals.

2. **Test-level enforcement:** A test suite MUST verify that:
   - `scan_ai_security` never imports from `llmverify` or `tenant-isolation`
   - `scan_tenant_isolation` never imports from the AI security scanner or `llmverify`
   - `verify_llm_content` never imports from either scanner
   - `check_deploy_security` imports all three but calls them as black boxes

3. **Dependency-graph test:** An automated test should produce a module dependency
   graph and fail if any standalone engine has a dependency edge to another engine.

4. **Output-level evidence:** Every tool result must identify which engine produced
   it. A `scan_ai_security` result must never contain tenant-isolation findings or
   LLMVerify results.

---

## 6. What This Prevents

| Anti-pattern | Why it's forbidden |
|--------------|--------------------|
| "Run everything every time" | Destroys AI tool selection, wastes context, violates privacy (e.g., source code sent to LLM verifier when user only asked for static scan) |
| Silent LLM calls during static scan | Privacy violation — user didn't consent to LLM verification of their code |
| Tenant scanner calling general scanner | Confuses finding provenance; the model can't reason about what will run |
| Merging engine source for convenience | Destroys standalone product identity; couples independent release cycles |
| Adding hidden tools | Violates the "no additional public tools during Phase -1" rule and confuses AI selection |

---

## 7. Future Test Requirements (for Phase 0+)

- `tests/independence/ai-security-no-llmverify-import.test.ts`
- `tests/independence/ai-security-no-tenant-import.test.ts`
- `tests/independence/tenant-no-ai-security-import.test.ts`
- `tests/independence/tenant-no-llmverify-import.test.ts`
- `tests/independence/llmverify-only-llmverify.test.ts`
- `tests/independence/deploy-reports-all-engines.test.ts`
- `tests/independence/no-silent-cascade.test.ts`
- `tests/independence/dependency-graph-isolation.test.ts`

These tests MUST exist before any composite behavior is implemented.
