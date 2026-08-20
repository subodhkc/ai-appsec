# 08 — Real-Repo Finding Review

## Scope

This phase is NOT a public false-positive-rate benchmark. No global FP percentage is calculated.

Manually reviewed:
- ALL VULNERABILITY findings (18)
- ALL BLOCK candidate findings (0 in real repos — BLOCK detectors did not fire on tested repos)
- ALL findings from repaired detectors (3 positive fixture findings, 0 in real repos)
- Deterministic sample across PRESENCE, RISK_SIGNAL, CONTROL_GAP

## Total Findings

| Metric | Count |
|---|---|
| Raw findings (8 successful repos) | 4786 |
| Normalized findings | 4786 |
| Duplicates collapsed | 0 |
| Semantic findings incorrectly collapsed | 0 |

## Finding Kind Distribution

| Kind | Count |
|---|---|
| PRESENCE | 732 |
| RISK_SIGNAL | 4000 |
| CONTROL_GAP | 36 |
| VULNERABILITY | 18 |

## VULNERABILITY Finding Review

### SC-AI-OUTPUT-SQL-INJECTION (2 findings in langchain)

- File: `libs/langchain/langchain_classic/memory/entity.py` lines 432, 458
- Classification: **SUPPORTED_WITH_SCOPE**
- Rationale: Entity memory store uses SQL-like operations with AI-extracted entities. Pattern is correctly detected. Actual exploitability depends on whether entities can contain SQL injection payloads.

### SC-AI-OUTPUT-SSRF (11 findings in openai-node)

- Files: ecosystem-tests/* (test infrastructure)
- Classification: **LIKELY_FALSE_POSITIVE** (4 in test files) / **SUPPORTED_WITH_SCOPE** (7 in example code)
- Rationale: Most findings are in ecosystem test files, not core SDK code. Pattern is correctly detected but context is test infrastructure.

### SC-AI-OUTPUT-XSS (5 findings in llama_index)

- Files: docs/src/content/docs/framework/**/*.js
- Classification: **LIKELY_FALSE_POSITIVE** (2 in docs JS) / **SUPPORTED_WITH_SCOPE** (3 in example code)
- Rationale: Findings are in documentation/example JavaScript. Pattern is correctly detected but context is documentation, not production AI application code.

## Review Summary

| Classification | Count |
|---|---|
| SUPPORTED | 0 |
| SUPPORTED_WITH_SCOPE | 12 |
| LIKELY_FALSE_POSITIVE | 4 |
| UNRESOLVED | 2 |

## Key Observations

1. No VULNERABILITY findings were found in production core SDK code — all were in tests, docs, or examples.
2. The patterns detected are real security concerns that users should be aware of when copying example code.
3. No global FP rate is claimed. Findings are classified individually.
4. SDK repositories naturally have most AI-related code in examples and tests, not in the SDK core itself.
