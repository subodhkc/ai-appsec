# Phase 3.4 — Canonical Source-of-Truth Architecture

## Part 11: Canonical HAIEC Static Security Rulepack Architecture

### Product Identity vs Implementation Engine

**Product identity:**
- HAIEC AI Security Checks
- HAIEC AI Security Scanner
- HAIEC Agent Security
- HAIEC security detectors

**Technical implementation:**
- "HAIEC-owned security checks executed using the Semgrep analysis engine"
- "powered by the Semgrep analysis engine"
- "HAIEC-owned checks executed by Semgrep"

**NOT acceptable:**
- "91 Semgrep rules"
- "our Semgrep rules"
- "Semgrep scanner" as product identity

### Canonical Architecture

```
                 HAIEC CANONICAL STATIC SECURITY RULEPACK
                 (rules/haiec-ai-security.yml + manifest.json)
                              |
                  +-----------+-----------+
                  |                       |
                  v                       v
          HAIEC hosted/static       HAIEC Agent Security
              scanner                    MCP/local
                  |                       |
                  +-----------+-----------+
                              |
                    same version + hash
```

### manifest.json Schema

```json
{
  "schemaVersion": "1.0.0",
  "rulepackVersion": "0.1.0-rc.2",
  "rulepackDigest": "sha256:...",
  "engineCompatibility": {
    "engine": "semgrep",
    "minVersion": "1.52.0",
    "verifiedStable": "1.173.0",
    "verifiedDigest": "sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a"
  },
  "securityChecks": [
    {
      "securityCheckId": "SC-001",
      "name": "OpenAI SDK import detected",
      "securityProposition": "Code imports the OpenAI AI SDK",
      "scope": "Single-file presence detection",
      "limitations": ["Does not prove vulnerability"],
      "detectorIds": ["ai-openai-import"],
      "remediationClass": "INFORMATIONAL"
    }
  ],
  "detectors": [
    {
      "detectorId": "ai-openai-import",
      "securityCheckId": "SC-001",
      "languages": ["python"],
      "findingKind": "PRESENCE",
      "defaultDisposition": "INFORMATIONAL",
      "severity": "INFO",
      "category": "ai_detection",
      "revision": 1,
      "publicStatus": "PUBLIC_READY",
      "provenance": "haiec-website/modal_ai_security_scanner.py"
    }
  ]
}
```

### Migration Contract (Phase 4.5)

1. The manifest, NOT scattered constants, drives:
   - Scanner metadata
   - UI rule/check counts
   - Rule library
   - SARIF metadata
   - Docs
   - llms.txt / llms-ai-security.txt
   - MCP metadata
   - Scan Receipt
   - Policy decisions

2. No duplicated handwritten rule counts.

3. The manifest is the single source of truth for:
   - What checks exist
   - What detectors implement them
   - What engine runs them
   - What version/digest is current

4. Migration steps (future phase):
   a. Generate manifest.json from qualified detectors
   b. Replace hardcoded counts in haiec-website with manifest-driven values
   c. Update llms.txt from manifest
   d. Update MCP metadata from manifest
   e. Update SARIF output from manifest

## Part 12: Semgrep as Implementation Detail

### Preferred Public Wording

| Use This | Not This |
|----------|----------|
| "HAIEC AI Security Scanner" | "Semgrep scanner" |
| "HAIEC security checks" | "Semgrep rules" |
| "HAIEC detectors" | "our Semgrep rules" |
| "local static security analysis" | "Semgrep analysis" |
| "deterministic static analysis under a pinned rulepack" | "Semgrep scan" |

### Technical Documentation Wording

- "powered by the Semgrep analysis engine"
- "HAIEC-owned checks executed by Semgrep"

### Separation

- PRODUCT IDENTITY = HAIEC AI Security Checks
- IMPLEMENTATION ENGINE = Semgrep (attribution retained, not hidden)

## Part 13: Engine Ownership Boundaries

### STATIC AI SECURITY (this engine)
- Source-code AI/agent security
- AI output → dangerous execution
- Secrets in source code
- RAG implementation risks
- Model/dependency integrity
- AI data-flow implementation risk

### TENANT ISOLATION (separate engine)
- Tenant scoping
- IDOR
- RLS
- Shared caches
- Namespace separation
- Organization/workspace/account boundaries

### LLMVERIFY (separate engine)
- Actual supplied LLM inputs/outputs
- Prompt-injection indicators in content
- PII/content-risk signals
- Hallucination-risk signals

### RUNTIME/ACTION ENGINE (future)
- Live agent action authorization
- Action preflight
- Runtime security behavior
- Runtime abuse

### DEPLOY GATE (future)
- Policy/orchestration only
- Composes applicable engines
- Does not create duplicate detectors

### Cross-Engine Gap Corrections from Phase 3.3

Phase 3.3 listed "Cross-tenant data access in AI flows" as CROSS_ENGINE_SHARED_CONCERN.
This is actually primarily owned by TENANT_ISOLATION, with STATIC as secondary.

Phase 3.3 listed "Runtime prompt injection detection" as RUNTIME/ACTION_ENGINE_SHOULD_OWN.
Corrected: LLMVERIFY should own content-level prompt injection detection. RUNTIME should own action-level injection consequences.

### No Duplication

No capability is duplicated across engines to increase coverage. Each engine owns its scope exclusively.
