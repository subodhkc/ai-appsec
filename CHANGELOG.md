# Changelog

## 0.1.0

First stable AI AppSec release.

- `scan_ai_security` MCP tool for AI-application and AI-agent source-code security auditing
- 122 Public Core detectors (Semgrep-based)
- 79 semantic security checks
- Security Concern Families for organized finding classification
- COMPLETE / PARTIAL / ERROR evidence semantics with explicit coverage
- Scan Receipts with SHA-256 digests for deterministic reproducibility
- Evidence Envelopes for structured evidence output
- Proof-of-fix rescan comparison with check-evaluation safety
- Local/offline normal scanning after Semgrep prerequisites are installed
- MCP stdio transport support
- Node 22 and Node 24 support
- Node 26 canary qualification
- MIT license

### Installation

```bash
npm install -g ai-appsec
```

### Prerequisites

- Node.js >= 22
- Semgrep engine (installed via `ai-appsec setup`)
