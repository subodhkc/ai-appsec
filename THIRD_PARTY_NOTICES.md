# Third-Party Notices

## HAIEC Agent Security MCP

This product includes the HAIEC Public Core rulepack (MIT licensed).

### External Dependencies

| Package | Version | License | Type |
|---------|---------|---------|------|
| @modelcontextprotocol/server | 2.0.0 | MIT | Runtime dependency |
| @modelcontextprotocol/client | 2.0.0 | MIT | Development dependency (tests only) |
| zod | 4.4.3 | MIT | Runtime dependency |
| canonicalize | 4.0.0 | MIT | Runtime dependency |
| typescript | 5.9.3 | Apache-2.0 | Development dependency |
| tsx | 4.23.12 | MIT | Development dependency |
| eslint | 10.8.1 | MIT | Development dependency |

### External Engine Prerequisite

Semgrep is an external analysis engine required for scanning. It is NOT
bundled with this package and is NOT HAIEC-owned software.

- **Name:** Semgrep
- **Required version:** 1.173.0
- **License:** GNU Lesser General Public License v2.1 (LGPL-2.1)
- **Website:** https://semgrep.dev
- **Source:** https://github.com/semgrep/semgrep
- **Installation:** Run `haiec-agent-security setup` or install manually

HAIEC owns the security checks (rule definitions, detector IDs, security
check IDs, manifest) but uses Semgrep as the execution engine. The Semgrep
engine is invoked as an external subprocess and is not embedded in the
HAIEC package.

### No Telemetry

This package does not emit telemetry. Semgrep is invoked with `--metrics off`.
No network calls are made during normal scan execution. The only network
activity occurs when the user explicitly runs `haiec-agent-security setup`.
