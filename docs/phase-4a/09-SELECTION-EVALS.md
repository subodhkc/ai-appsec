# Phase 4A — Selection Evals

## Eval corpus

The eval corpus at `evals/tool-selection/scenarios.json` contains 112
scenarios (102 original + 10 Phase 4A-specific).

## Phase 4A scenarios

### Positive (should select scan_ai_security)

| ID | Prompt | Context |
|----|--------|---------|
| S103 | "Review this AI agent before I merge it" | LangGraph agent |
| S104 | "Check this LangChain application for security problems" | LangChain.js |
| S105 | "Validate this LLM code before deployment" | OpenAI integration |
| S106 | "Look for unsafe AI output reaching privileged code" | exec/eval |
| S107 | "Security review this RAG application" | Pinecone + OpenAI |

### Negative (should NOT select scan_ai_security)

| ID | Prompt | Expected | Reason |
|----|--------|----------|--------|
| S108 | "Check whether tenant A can read tenant B data" | scan_tenant_isolation | Cross-tenant |
| S109 | "Check this actual model response for PII" | verify_llm_content | LLM response |
| S110 | "Is this company SOC 2 compliant?" | NONE | Compliance questionnaire |
| S111 | "Format this README" | NONE | Documentation |
| S112 | "Run security checks before release" | check_deploy_security | Deploy gate |

## Results

- **Positive selection**: all 5 positive scenarios correctly expect
  `scan_ai_security` and forbid `verify_llm_content` and
  `scan_tenant_isolation`
- **Negative/non-selection**: all 5 negative scenarios correctly do NOT
  select `scan_ai_security`
- **Cross-tool selection errors**: 0 — no scenario incorrectly selects
  `scan_ai_security` when another tool is expected

## Test coverage

The `tests/evals/phase4a-selection.test.ts` file verifies:
- At least 5 positive cases
- At least 5 negative cases
- Cross-tool correctness (tenant, LLM, deploy prompts forbid scan_ai_security)
