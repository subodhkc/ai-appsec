# 10 — AI Selection Evals

> Phase 0 document. AI tool-selection evaluation corpus statistics.

## Corpus Location

`evals/tool-selection/scenarios.json`

## Statistics

- **Total scenarios:** 102
- **Categories:** 14
- **NONE (negative) scenarios:** 34

## Category Breakdown

| Category | Count | Expected Tool |
|----------|-------|---------------|
| security_review_after_ai_code_gen | 10 | scan_ai_security |
| tenant_db_modifications | 8 | scan_tenant_isolation |
| rag_implementation | 7 | scan_ai_security |
| mcp_server_creation | 7 | scan_ai_security |
| tool_function_calling | 7 | scan_ai_security |
| secret_config_changes | 7 | scan_ai_security |
| deploy_merge_release_intent | 8 | check_deploy_security |
| ordinary_coding | 10 | NONE |
| ui_css | 7 | NONE |
| documentation | 5 | NONE |
| generic_debugging | 5 | NONE |
| llm_response_evaluation | 8 | verify_llm_content |
| ambiguous_phrases | 7 | NONE |
| explicit_security_scan | 6 | mixed |

## Critical Invariants (validated by tests)

1. "Run a security scan" → `scan_ai_security` (NOT LLMVerify, NOT tenant isolation)
2. "Check this LLM response for PII" → `verify_llm_content` (NOT source scanners)
3. "Fix the CSS padding on the login page" → NONE
4. "Can tenant A read tenant B's rows?" → `scan_tenant_isolation`
5. "Are these AI changes ready to release?" → `check_deploy_security`

## Schema

Each scenario has: id, naturalLanguagePrompt, projectContext, expectedTool,
allowedAlternatives, forbiddenTools, reason, riskIfWrong, hostApplicability, category.

## Status

This corpus is the future empirical test source. It does NOT yet prove real
model selection — that requires running against actual AI coding agents.
