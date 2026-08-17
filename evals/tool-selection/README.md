# AI Tool-Selection Evaluation Corpus

## Status

This corpus is the **future empirical test source** for AI tool selection.
It does NOT yet prove real model selection — that requires running the
scenarios against actual AI coding agents (Cursor, Claude Code, Windsurf, VS Code).

## Structure

Each scenario contains:

| Field | Description |
|-------|-------------|
| `id` | Unique scenario ID (S001-S102) |
| `naturalLanguagePrompt` | The prompt text |
| `projectContext` | What kind of project |
| `expectedTool` | Expected tool selection (or NONE) |
| `allowedAlternatives` | Acceptable alternative selections |
| `forbiddenTools` | Tools that MUST NOT be selected |
| `reason` | Why this is the expected selection |
| `riskIfWrong` | Risk level if wrong (LOW/MEDIUM/HIGH/CRITICAL) |
| `hostApplicability` | Which hosts this applies to |
| `category` | Category from the 14 expanded categories |

## Categories (14)

| Category | Count | Description |
|----------|-------|-------------|
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

**Total: 102 scenarios**

## Critical Invariants

1. "Run a security scan" → `scan_ai_security` only (NOT LLMVerify, NOT tenant isolation)
2. "Check this LLM response for PII" → `verify_llm_content` only (NOT source scanners)
3. "Can tenant A read tenant B's rows?" → `scan_tenant_isolation` only
4. "Are these AI changes ready to release?" → `check_deploy_security`
5. "Fix the CSS padding" → NONE (no tool should be invoked)
6. "Check this" (ambiguous) → NONE (should ask for clarification)
