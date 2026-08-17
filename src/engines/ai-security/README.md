# AI Security Engine

This directory will contain the AI security engine adapter.

## Phase 0 Status

**NOT INTEGRATED.** This directory contains no implementation in Phase 0.

## Future Purpose

The AI security engine will provide source-code security scanning for AI/LLM
applications, including:
- Prompt injection detection
- RAG security risks
- Agent/tool safety
- AI API misuse
- Production security patterns

## Independence Constraint

This engine MUST NOT import from:
- `../tenant-isolation/`
- `../llmverify/`
- `../../orchestration/deploy-security/`

Only `orchestration/deploy-security/` may eventually depend on this engine's adapter.
