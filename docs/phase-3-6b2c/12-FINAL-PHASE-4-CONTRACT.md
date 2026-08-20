# 12 — Final Phase 4 Contract

## Phase 4 Scope

Phase 4 may implement ONLY: `scan_ai_security`

## Input Bundle

| Artifact | Path | Digest |
|---|---|---|
| Canonical YAML | `.private-rule-staging/canonical-static-security-final/haiec-ai-security.yml` | sha256:33b4a0dd4a188f38afb6a4576df1b4840b1a21c51d79a037dfe5ba2dd9ae29c1 |
| Manifest | `.private-rule-staging/canonical-static-security-final/manifest.json` | sha256:a3f702f240e1b49282e864f037ce8e9e426cabac633157dcfcb267920834ad5f |
| Public Core YAML | `.private-rule-staging/canonical-static-security-final/public-core/public-core.yml` | (same as canonical) |
| Semgrep engine | 1.173.0 | sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a |

## Counts

- 122 detector IDs
- 79 securityCheck IDs
- 1 BLOCK check (HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION)

## Contracts Phase 4 Must Follow

1. **Target scope contract** (`target-scope-contract.json`): Default production scope, path class policies, file counting model
2. **Semgrep dependency contract** (`semgrep-dependency-contract.json`): Native execution preferred, exact version 1.173.0, no silent installs
3. **Agent output contract** (`agent-output-contract.json`): Raw evidence separated from agent output, bounded (50 actionable + 20 observations), deterministic prioritization
4. **Completeness contract** (from Phase 2B): COMPLETE/PARTIAL/UNSUPPORTED/ERROR statuses, timeout-unscanned ≠ skipped

## Phase 4 Must NOT Implement

- Tenant Isolation handler
- LLMVerify handler
- Deploy Gate handler
- Scan Receipt (separate future phase)
- Proof-of-fix artifact (separate future phase)

## Agent Selection Requirements

`scan_ai_security` tool description must state:

**Tool identity:** Source-code security analysis for AI/LLM/agent applications

**Should trigger for:**
- "review this AI code for security"
- "validate this agent before merge"
- "check LLM application security"
- "security review before deployment"
- "inspect unsafe AI code patterns"

**Should NOT be selected for:**
- Actual LLM response content verification (→ verify_llm_content)
- Tenant-boundary analysis (→ scan_tenant_isolation)
- Generic non-AI code security where HAIEC has no applicable AI checks
- Compliance questionnaire work

Detailed live agent-selection testing remains a later phase.

## Local-First Constraints

- Local HAIEC rule file only
- Semgrep metrics disabled (`--metrics off`)
- No login, no registry config, no community rule download
- Network-none compatible
- Native execution preferred

## Timeout Behavior

- Configurable per scan
- Default: 300s
- On timeout: return PARTIAL with reason='scan_timeout'
- Do NOT silently return COMPLETE on timeout

## Error Behavior

- On parser error: return PARTIAL with reason='parser_error'
- On harness failure: return ERROR with reason='harness_failure'
- On missing Semgrep: return ERROR with reason='semgrep_missing'
