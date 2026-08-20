# 16 — Rule Quality Backlog

## Important

This phase establishes behavioral parity. Rule quality issues are documented, NOT fixed. Fixes belong in a future phase.

## P0 — Before Public Release

| Issue | Detectors Affected | Description |
|-------|-------------------|-------------|
| Prompt injection patterns too broad | `ai-prompt-injection-*` (7) | Patterns detect any OpenAI/Anthropic API call, not actual prompt injection. Should use taint analysis. |
| PRESENCE rules with ERROR severity | 30 detectors | Presence detectors had ERROR/WARNING severity, overstating significance. recommendedSeverity: INFO. |
| Missing taint/data-flow analysis | `ai-prompt-injection-*`, `ai-tool-output-injection-*` | Static patterns cannot track data flow from user input to AI prompt. Should use Semgrep taint mode. |
| `missing-*` control-gap rules | 26 detectors | Detect absence of controls by looking for their presence — high false-negative risk. Pattern-based "missing" detection is inherently unreliable. |

## P1 — Before GA

| Issue | Detectors Affected | Description |
|-------|-------------------|-------------|
| Obsolete SDK syntax | `ai-sdk-*` | SDK patterns may not match current SDK versions. Need version-specific patterns. |
| Framework version drift | `ai-langchain-import`, `ai-llamaindex-*` | Framework import paths may have changed. Need verification against current versions. |
| Duplicated logical checks | `ai-tool-abuse-dangerous` vs `dangerous-tool-*` | Overlapping coverage between agent tool abuse and dangerous tool categories. |
| Messages overstate findings | Several PRESENCE detectors | Messages say "review for prompt injection" when the pattern only detects an import. |
| `ai-rest-*` detectors | 17 detectors | Detect HTTP calls to AI provider URLs — high false-positive rate on non-AI REST calls. |

## P2 — Future Improvement

| Issue | Detectors Affected | Description |
|-------|-------------------|-------------|
| Add Semgrep taint mode | All injection-related detectors | Track data flow from source to sink for accurate injection detection. |
| Language-specific pattern optimization | All language-split detectors | Patterns may be suboptimal for each language — review per-language patterns. |
| Metadata completeness | 4 detectors without CWE | Add CWE mappings where appropriate. |
| Compliance mapping verification | All 121 detectors | Verify each CWE, OWASP, and compliance mapping individually. |
| False-positive benchmarking | All detectors | Run against real-world codebases to measure false-positive rates. |
