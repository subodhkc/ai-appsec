# Third-Party Notices

## AI AppSec

### HAIEC-Owned Components

The following components are authored by HAIEC and licensed under the MIT
license (same as the package):

- AI AppSec MCP server source code (`dist/`)
- HAIEC Public Core rulepack (`rules/public-core/`) — 122 detectors, 79 security
  checks

These are NOT third-party components. They are HAIEC-owned and MIT licensed.

### Third-Party Runtime Dependencies

| Package | Version | License | Type |
|---------|---------|---------|------|
| @modelcontextprotocol/server | 2.0.0 | MIT | Runtime dependency |
| @modelcontextprotocol/core | 2.0.0 | MIT | Runtime dependency (transitive) |
| zod | 4.4.3 | MIT | Runtime dependency |
| canonicalize | 4.0.0 | Apache-2.0 | Runtime dependency |

### Development Dependencies (Not in Published Package)

| Package | Version | License | Type |
|---------|---------|---------|------|
| @modelcontextprotocol/client | 2.0.0 | MIT | Development dependency (tests only) |
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
- **Installation:** Run `ai-appsec setup` or install manually

Facts about Semgrep usage:

- Semgrep is invoked as an external subprocess (not linked, not imported)
- Semgrep is NOT bundled in the npm tarball
- Semgrep is NOT modified by HAIEC
- Normal scan can operate without network once Semgrep is installed
- Setup (`ai-appsec setup`) may require network to install Semgrep
- Semgrep metrics are disabled (`--metrics off`)
- HAIEC rules are original YAML configurations, not derivative works of
  Semgrep source code
- HAIEC does NOT redistribute a Semgrep binary

### No Telemetry

This package does not emit telemetry. Semgrep is invoked with `--metrics off`.
No network calls are made during normal scan execution. The only network
activity occurs when the user explicitly runs `ai-appsec setup`.
