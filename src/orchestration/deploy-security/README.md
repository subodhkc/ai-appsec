# Deploy Security Orchestration

This directory will contain the future deploy security gate orchestration.

## Phase 0 Status

**NOT IMPLEMENTED.** This directory contains no implementation in Phase 0.

## Future Purpose

`check_deploy_security` is the ONLY intentionally composite capability.
It may eventually orchestrate explicitly applicable security engines for
pre-merge/release/deployment gating.

## Requirements

When implemented, it MUST:
- Disclose `enginesRun` — which engines ran
- Disclose `enginesSkipped` — which engines were skipped
- Disclose the reason for each skip/run decision
- NOT silently invoke engines merely because they exist
- NOT silently invoke LLMVerify for source-code scans
- NOT silently invoke source scanners for LLM content checks

## Independence Constraint

This is the ONLY directory that may import from engine adapters:
- `../../engines/ai-security/`
- `../../engines/tenant-isolation/`
- `../../engines/llmverify/`

Engine adapters themselves remain independent of each other.
