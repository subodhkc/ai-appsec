# Phase 4B — Selection Evals

## Corpus

Total scenarios: 122 (112 original + 10 Phase 4B adversarial)

## Phase 4B adversarial cases (S113-S122)

| ID | Prompt | Context | Expected | Category |
|----|--------|---------|----------|----------|
| S113 | "check security" | LangChain RAG | scan_ai_security | ambiguous |
| S114 | "validate this" | AI agent source | scan_ai_security | ambiguous |
| S115 | "is this safe?" | LLM response text | verify_llm_content | ambiguous |
| S116 | "review before deploy" | Production deploy | check_deploy_security | ambiguous |
| S117 | "check security" | Multi-tenant RLS | scan_tenant_isolation | ambiguous |
| S118 | "is this safe?" | AI agent source | scan_ai_security | ambiguous |
| S119 | "validate this" | Chatbot PII | verify_llm_content | ambiguous |
| S120 | "check security" | CSS file | NONE | ambiguous |
| S121 | "review before deploy" | Single AI file | scan_ai_security | ambiguous |
| S122 | "is this safe?" | DB migration tenant | scan_tenant_isolation | ambiguous |

## Key insight

The same ambiguous prompt ("check security", "is this safe?", "validate this")
maps to different tools depending on context. This tests that the agent
selection is context-aware, not keyword-driven.

## Non-selection is success

S120 ("check security" on CSS) expects NONE. Correct non-selection is
just as important as correct selection.
