# 12 — AI Tool Selection Eval Review

> **Phase -0.5 document.** Reviews the 100-scenario eval corpus and defines
> required fields for each scenario.

---

## Phase -1 Eval Corpus Status

Phase -1 created `12-AI-TOOL-SELECTION-EVALS.json` with 100 scenarios. However,
the scenario schema was minimal:
- `id`
- `category`
- `prompt`
- `expected`
- `note` (some scenarios)

This is insufficient for rigorous AI tool-selection testing.

---

## Required Scenario Schema (revised)

Each scenario MUST contain:

```typescript
interface EvalScenario {
  id: string;                          // e.g., "P001", "N001", "A001"
  naturalLanguagePrompt: string;       // The actual prompt text
  projectContext: string;              // What kind of project (e.g., "Next.js app with OpenAI integration")
  expectedTool: 'scan_ai_security' | 'scan_tenant_isolation' | 'verify_llm_content' | 'check_deploy_security' | 'NONE';
  allowedAlternative?: string;         // Acceptable alternative tool selection
  forbiddenTools: string[];            // Tools that MUST NOT be selected
  reason: string;                      // Why this is the expected selection
  riskIfWrong: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hostApplicability: string[];         // Which hosts this applies to (e.g., ["cursor", "claude-code", "windsurf", "vscode"])
  category: string;                    // Category from the expanded list below
}
```

---

## Expanded Categories

Phase -1 had 7 categories. Phase -0.5 expands to 14:

| Category | Count target | Description |
|----------|-------------|-------------|
| security_review_after_ai_code_gen | 10 | Review AI-generated code for security |
| tenant_db_modifications | 8 | Tenant-related DB/query changes |
| rag_implementation | 7 | RAG implementation/review |
| mcp_server_creation | 7 | Building MCP servers |
| tool_function_calling | 7 | Tool/function calling implementation |
| secret_config_changes | 7 | Secret/config management |
| deploy_merge_release_intent | 8 | Deploy/merge/release decisions |
| ordinary_coding | 10 | Regular coding tasks (negative) |
| ui_css | 7 | UI/CSS work (negative) |
| documentation | 5 | Documentation tasks (negative) |
| generic_debugging | 5 | Debugging tasks (negative) |
| llm_response_evaluation | 8 | LLM output verification |
| ambiguous_phrases | 7 | Ambiguous prompts like "check this" |
| explicit_security_scan | 6 | Explicit security scan requests |

**Total: ~100 scenarios**

---

## Critical Invariants

### Invariant 1: "Run a security scan" must NOT invoke LLMVerify or tenant isolation

```
Prompt: "Run a security scan on my code"
Expected: scan_ai_security
Forbidden: verify_llm_content, scan_tenant_isolation
Reason: "Security scan" in a code context means source-code security, not LLM content verification or tenant isolation
```

### Invariant 2: "Check this LLM response for PII" must NOT run source scanners

```
Prompt: "Check this LLM response for PII"
Expected: verify_llm_content
Forbidden: scan_ai_security, scan_tenant_isolation
Reason: LLM response content verification is not source-code analysis
```

### Invariant 3: "Check tenant isolation" must NOT run AI security scanner

```
Prompt: "Check my multi-tenant app for data isolation"
Expected: scan_tenant_isolation
Forbidden: scan_ai_security, verify_llm_content
Reason: Tenant isolation is a specific concern distinct from AI security
```

### Invariant 4: "Fix the CSS" must NOT invoke any HAIEC tool

```
Prompt: "Fix the CSS spacing on the login page"
Expected: NONE
Forbidden: scan_ai_security, scan_tenant_isolation, verify_llm_content, check_deploy_security
Reason: CSS work has no security relevance
```

---

## Migration Plan

The existing 100 scenarios in `12-AI-TOOL-SELECTION-EVALS.json` need to be:
1. Augmented with the required fields (`projectContext`, `forbiddenTools`, `reason`, `riskIfWrong`, `hostApplicability`)
2. Recategorized into the 14 expanded categories
3. Expanded with additional scenarios for new categories (MCP server creation, RAG, tool/function calling)

This work is deferred to Phase 0 (eval harness structure) or a dedicated eval phase.

**Do NOT implement the eval harness yet.** This document defines the schema and
requirements only.
