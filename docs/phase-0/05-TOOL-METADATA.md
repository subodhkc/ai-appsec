# 05 — Tool Metadata

> Phase 0 document. Summary of the four MCP tool descriptors.

## Tools

### scan_ai_security
- **Title:** Scan AI/LLM Source Code Security
- **Engine:** ai-security
- **Positive:** AI source code security, AI-generated code review, RAG/agent/tool security
- **Negative:** Tenant isolation, LLM response evaluation, generic code review, CSS/UI

### scan_tenant_isolation
- **Title:** Scan Tenant Isolation Security
- **Engine:** tenant-isolation
- **Positive:** Multi-tenant SaaS, RLS gaps, cross-tenant data exposure, shared cache scoping
- **Negative:** General AI security, LLM content verification, non-tenant issues

### verify_llm_content
- **Title:** Verify LLM Input/Output Content
- **Engine:** llmverify
- **Positive:** LLM response PII check, prompt injection detection, content safety
- **Negative:** Source-code scanning, tenant isolation, deploy gating

### check_deploy_security
- **Title:** Check Deploy/Release Security Gate
- **Engine:** deploy-security
- **Positive:** Pre-merge gate, release readiness, deploy verification
- **Negative:** Individual scans (use specific tools)
- **Note:** Not yet implemented

## Quality Checks (validated by tests)

- Unique names
- Non-empty titles and descriptions
- Positive AND negative use cases
- No promotional superiority claims
- No rule-count claims
- No "always use HAIEC" instructions
- Specialized tools don't describe each other's domains
- All marked not-implemented in Phase 0
- All read-only and non-destructive
