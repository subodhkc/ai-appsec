# LLMVerify Engine

This directory will contain the LLMVerify engine adapter.

## Phase 0 Status

**NOT INTEGRATED.** This directory contains no implementation in Phase 0.

## Future Purpose

The LLMVerify engine will verify LLM input/output content for:
- Prompt injection indicators
- PII exposure
- Harmful content patterns
- Other LLMVerify-supported risk signals

## Independence Constraint

This engine MUST NOT import from:
- `../ai-security/`
- `../tenant-isolation/`
- `../../orchestration/deploy-security/`

Only `orchestration/deploy-security/` may eventually depend on this engine's adapter.
