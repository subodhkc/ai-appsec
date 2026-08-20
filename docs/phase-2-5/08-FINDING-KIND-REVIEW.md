# 08 — Finding Kind Review

## Manual Semantic Review

Each logical check was reviewed for correct findingKind classification.

## Finding Kind Distribution (after review)

| Finding Kind | Count |
|--------------|-------|
| PRESENCE | 43 |
| RISK_SIGNAL | 26 |
| CONTROL_GAP | 26 |
| VULNERABILITY | 26 |

## Key Review Findings

### Prompt Injection Detectors (7) — MESSAGE_OVERSTATES_EVIDENCE

All 7 `ai-prompt-injection-*` detectors are classified as `VULNERABILITY` but their patterns only detect API calls, not actual injection.

**Current message:** "OpenAI API call detected - review for prompt injection vulnerabilities"
**Actual detection:** OpenAI API call exists
**Correct findingKind:** Should be `RISK_SIGNAL` or `PRESENCE`
**Action:** `REDESIGN_REQUIRED` — message overstates the evidence

### PRESENCE Detectors (43) — Verified

All PRESENCE detectors correctly detect imports, SDK usage, API calls, or framework presence. None are misclassified.

### VULNERABILITY Detectors (26) — Reviewed

- `hardcoded-*-api-key-*` (5): Correct — hardcoded secrets are concrete exposures
- `api-key-in-*` (6): Correct — secret exposure in logs/errors/URLs
- `ai-tool-abuse-output-exec`: Correct — AI output to code execution
- `dangerous-eval-exec-ai-output`: Correct — AI output to eval
- `ai-xss-*`, `ai-sql-injection-*`, `ai-ssrf-*` (6): Correct — injection patterns
- `ai-prompt-injection-*` (7): **Incorrect** — should be RISK_SIGNAL (see above)

### CONTROL_GAP Detectors (26) — 17 Invalid

17 `missing-*` detectors cannot actually establish the absence of the control. See `09-CONTROL-GAP-REVIEW.md`.

### RISK_SIGNAL Detectors (26) — Verified

All RISK_SIGNAL detectors correctly identify patterns that introduce risk without being confirmed vulnerabilities.
