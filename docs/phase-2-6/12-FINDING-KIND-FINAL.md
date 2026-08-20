# 12 — Finding Kind Final

## Distribution (After Behavioral Review)

| Finding Kind | Count |
|--------------|-------|
| PRESENCE | 44 |
| RISK_SIGNAL | 26 |
| CONTROL_GAP | 26 |
| VULNERABILITY | 25 |

## Changes from Phase 2.5

| Detector | Old Kind | New Kind | Reason |
|----------|----------|----------|--------|
| `ai-prompt-injection-langchain` | VULNERABILITY | PRESENCE | Fires on LangChain imports, not injection |

## Why Only 1 Change

The behavioral scan confirmed that most findingKind classifications from Phase 2.5 were correct. The one change (`ai-prompt-injection-langchain`) was reclassified because scan data showed it fires on `from langchain.chat_models import ChatOpenAI` — a simple import, not a vulnerability.

## What the Scan Revealed About FindingKind

### PRESENCE (44)
- All import detectors (`ai-openai-import`, `ai-anthropic-import`, `ai-langchain-import`) correctly classified
- Prompt injection detectors that fire on API calls are PRESENCE, not VULNERABILITY
- The scan confirmed: these detectors fire on ANY API call, not just dangerous ones

### VULNERABILITY (25)
- Reduced by 1 (prompt-injection-langchain reclassified)
- Remaining VULNERABILITY detectors include hardcoded keys, eval/exec, injection patterns
- However, NONE passed BLOCK validation — they are VULNERABILITY in kind but REVIEW in disposition

### CONTROL_GAP (26)
- 17 are invalid (pattern cannot prove absence) — REDESIGN_REQUIRED
- 9 are valid (configuration-based gaps)

### RISK_SIGNAL (26)
- Unchanged — all correctly classified
- These detect patterns that introduce risk without being confirmed vulnerabilities
