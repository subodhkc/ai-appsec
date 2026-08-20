# Phase 4C — Input

## Prerequisites from Phase 4B

Phase 4B is complete. The `scan_ai_security` MCP tool is a release candidate:
- Protocol correctness validated (initialize, tools/list, tools/call)
- outputSchema defined and validated
- structuredContent + TextContent working
- Process tree safety implemented and tested
- Completeness model canonical (COMPLETE/PARTIAL/UNSUPPORTED/ERROR)
- Scope accounting honest
- NPM package audited (no private leakage, 0 vulnerabilities)
- Clean install smoke test passes

## Recommended Phase 4C scope

1. **Founder rulepack distribution decision** — approve or reject bundling
   Public Core rules. This is the primary blocker for public packaging.

2. **License decision** — choose code license and rulepack license.
   Create LICENSE and NOTICE files.

3. **Large-repository MCP smoke test** — test langchainjs or crewAI through
   the MCP path.

4. **Diversity-aware bounding** — implement per-check finding limits so
   one check doesn't monopolize the 20-finding cap.

5. **Scan Receipt** — implement deterministic scan receipt with
   reproducibility metadata.

6. **Proof-of-fix** — implement before/after scan comparison artifact.

7. **Public packaging** — remove `private: true`, publish to npm,
   publish to MCP Registry.

## What Phase 4C should NOT do

- Implement Tenant Isolation
- Implement LLMVerify
- Implement Deploy Gate
- Migrate HAIEC SaaS
- Add telemetry
- Add cloud fallback
