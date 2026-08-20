# Phase 4B — Input

## Prerequisites from Phase 4A

Phase 4A is complete. The `scan_ai_security` MCP tool is functional,
tested, and validated. The following are ready for Phase 4B:

- Scanner stack (rulepack provider, Semgrep resolver, runner, scope,
  adapter, normalizer, prioritizer, scanner)
- MCP tool registration
- Synthetic CI rulepack
- 159 passing tests
- Private-bundle smoke tests (small + medium repos)

## Recommended Phase 4B scope

1. **Rulepack distribution decision** — choose between bring-your-own,
   signed bundle, public+private, or SaaS-only. Implement the chosen
   mechanism.

2. **Medium-repository native-vs-Docker normalized comparison** —
   complete the execution reconciliation with normalized finding
   equivalence (not just count) on at least one medium repository.

3. **Large-repository smoke test** — test `langchainjs` or `crewAI`
   through the MCP path.

4. **Scan Receipt** — implement the deterministic scan receipt with
   reproducibility metadata (rulepack digest, Semgrep version, scope,
   input hash, timestamp-free fingerprint).

5. **Proof-of-fix** — implement the proof-of-fix artifact (before/after
   scan comparison, fix verification).

6. **Output schema validation** — add JSON schema validation for the
   agent-facing output to ensure contract compliance.

7. **CI integration** — update CI to run the synthetic rulepack tests
   on every push.

## What Phase 4B should NOT do

- Implement Tenant Isolation
- Implement LLMVerify
- Implement Deploy Gate
- Publish to npm
- Publish to MCP Registry
- Migrate HAIEC SaaS
- Commit private rule bodies
