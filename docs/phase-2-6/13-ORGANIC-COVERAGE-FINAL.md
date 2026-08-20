# 13 — Organic Coverage Final

## Qualification (After Behavioral Validation)

| Category | Detectors | Qualification | Reason |
|----------|-----------|---------------|--------|
| AI API / Authentication | 34 | PARTIAL_COVERAGE | Many REST detectors don't fire on fixtures |
| Agent / Tool Execution | 23 | WEAK_COVERAGE | Most tool detectors don't fire; broad detectors over-match |
| Secrets & Credentials | 11 | WEAK_COVERAGE | Most secret detectors don't fire; placeholders trigger false positives |
| Production Controls | 12 | WEAK_COVERAGE | All `missing-*` detectors are invalid CONTROL_GAP |
| Output Handling | 9 | WEAK_COVERAGE | XSS/SQL/SSRF detectors don't fire on fixtures |
| RAG / Retrieval Security | 8 | WEAK_COVERAGE | Most RAG detectors don't fire on fixtures |
| Prompt Injection Exposure | 7 | DO_NOT_MARKET_YET | Detectors fire on API calls, not injection |
| AI Data Exposure | 7 | WEAK_COVERAGE | PII/data detectors don't fire on fixtures |
| Model / Supply Integrity | 5 | PARTIAL_COVERAGE | Some model detectors fire correctly |
| Multimodal / File Handling | 5 | WEAK_COVERAGE | Multimodal detectors don't fire on fixtures |

## Major Changes from Phase 2.5

| Category | Phase 2.5 | Phase 2.6 | Reason |
|----------|-----------|-----------|--------|
| AI API / Authentication | STRONG | PARTIAL | Many REST detectors don't fire |
| Agent / Tool Execution | STRONG | WEAK | Most tool detectors don't fire |
| Secrets & Credentials | STRONG | WEAK | Placeholders trigger false positives |
| Prompt Injection Exposure | WEAK | DO_NOT_MARKET_YET | Confirmed: fires on API calls |

## DO_NOT_MARKET_YET

The following claims must NOT be made in public materials:

1. "Detects prompt injection" — detectors fire on API calls, not injection
2. "121 security protections" — only 34 detectors fired, and many on wrong fixtures
3. "BLOCK deployment on security issues" — zero BLOCK candidates passed validation
4. "Comprehensive AI security coverage" — only 23/80 checks have measured positive coverage
5. "Secret detection" — secret detectors cannot distinguish real keys from placeholders

## What CAN Be Said

1. "Catalog of 121 AI security detector definitions" (metadata only)
2. "80 logical security checks across 10 categories" (taxonomy)
3. "Semgrep 1.52.0 compatible" (with 1 pattern error to fix)
4. "Open-source candidate pending qualification" (honest status)
