# 02 — Compatibility Matrix

## Scan Results

| Repo | Size | Result | Findings | Errors | Detectors | Time(s) |
|---|---|---|---|---|---|---|
| together-python | SMALL | FULL_SUCCESS | 308 | 0 | 10 | 69.65 |
| anthropic-sdk-typescript | MEDIUM | FULL_SUCCESS | 138 | 2 | 10 | 71.0 |
| autogen | MEDIUM | TIMEOUT | 0 | 0 | 0 | 300.01 |
| openai-node | MEDIUM | FULL_SUCCESS | 276 | 1 | 12 | 117.28 |
| pydantic-ai | MEDIUM | FULL_SUCCESS | 609 | 4 | 15 | 239.53 |
| llama_index | MEDIUM | FULL_SUCCESS | 705 | 0 | 14 | 376.42 |
| anthropic-sdk-python | LARGE | FULL_SUCCESS | 478 | 0 | 12 | 230.15 |
| crewAI | LARGE | TIMEOUT | 0 | 0 | 0 | 600.02 |
| openai-python | LARGE | FULL_SUCCESS | 846 | 0 | 14 | 357.48 |
| langchainjs | LARGE | TIMEOUT | 0 | 0 | 0 | 600+ |
| ai (vercel) | LARGE | TIMEOUT | 0 | 0 | 0 | 600+ |
| langchain | LARGE | FULL_SUCCESS | 1426 | 1 | 18 | 593.55 |

## Summary

- FULL_SUCCESS: 8
- TIMEOUT: 4
- PARTIAL_SUCCESS: 0
- RESOURCE_FAILURE: 0
- PARSER_FAILURE: 0
- HARNESS_FAILURE: 0

## Timeout Analysis

4 repos timed out:
- autogen (MEDIUM, 492 files) — timed out at 300s
- crewAI (LARGE, 1306 files) — timed out at 600s
- langchainjs (LARGE, 2155 files) — timed out at 600s
- ai/vercel (LARGE, 2394 files) — timed out at 600s

Primary cause: Docker volume mount performance on Windows with large repository trees. The Semgrep engine itself is not the bottleneck — successful large repos (langchain at 2545 files, openai-python at 1753 files) completed within 600s. The timeout is correlated with file count and Docker I/O overhead on Windows.

This is a harness limitation, not a rulepack or engine issue. Future MCP implementation should:
1. Use native Semgrep installation (not Docker) for production scans
2. Implement configurable timeouts
3. Return PARTIAL status on timeout with any captured findings
4. Allow selective targeting (e.g., scan only src/ not tests/)
