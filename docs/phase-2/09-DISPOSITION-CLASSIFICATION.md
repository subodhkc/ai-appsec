# 09 — Disposition Classification

## Categories

| Disposition | Count | Meaning |
|-------------|-------|---------|
| INFORMATIONAL | 43 | Report only; no action required |
| REVIEW | 69 | Requires human review before action |
| BLOCK | 9 | Sufficient evidence to stop a deployment |

## Mandatory Safety Rule

**PRESENCE rules must not default to BLOCK.**

All 43 PRESENCE detectors are assigned `INFORMATIONAL` — they report that AI technology is in use but do not indicate a security defect.

## BLOCK Candidates (9)

| Detector ID | Check ID | Justification |
|-------------|----------|---------------|
| `ai-tool-abuse-output-exec` | R40 | AI output flows to code/shell execution — confirmed command injection risk |
| `dangerous-eval-exec-ai-output` | R47 | AI output passed to eval/exec — confirmed code injection risk |
| `hardcoded-api-key-python` | R57 | Hardcoded API key in source — confirmed secret exposure |
| `hardcoded-api-key-js` | R57 | Hardcoded API key in JS/TS — confirmed secret exposure |
| `hardcoded-anthropic-api-key-python` | R56 | Hardcoded Anthropic key — confirmed secret exposure |
| `hardcoded-anthropic-api-key-js` | R56 | Hardcoded Anthropic key — confirmed secret exposure |
| `hardcoded-openai-api-key` | R58 | Hardcoded OpenAI key — confirmed secret exposure |
| `api-key-in-url-python` | R45 | API key in URL parameter — confirmed exposure in logs/referrers |
| `api-key-in-url-js` | R45 | API key in URL parameter — confirmed exposure in logs/referrers |

### Known False-Positive Scenarios for BLOCK Candidates

- **Hardcoded API keys:** Test files, example code, documentation snippets may contain non-functional keys
- **API key in URL:** Some APIs legitimately require key in URL (e.g. download endpoints with signed URLs)
- **AI output to exec:** Test/sandbox environments where AI output execution is intentional and contained

### Safe Remediation for BLOCK Candidates

- **Hardcoded keys:** Move to environment variables or secrets manager
- **API key in URL:** Use Authorization header instead
- **AI output to exec:** Remove execution path; sanitize and validate AI output before any execution

## Why Not More BLOCKs?

- `ai-xss`, `ai-sql-injection`, `ai-ssrf` are classified as `VULNERABILITY` but assigned `REVIEW` not `BLOCK` — the patterns detect potential injection points but static analysis alone cannot confirm exploitability without data flow analysis
- `ai-prompt-injection-*` detectors are `REVIEW` — prompt injection detection via patterns is not reliable enough to block deployment
- All `CONTROL_GAP` detectors are `REVIEW` — a missing control is a finding to review, not necessarily a deployment blocker
