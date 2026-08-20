# OSS / Dependency Legal Review Packet

## Phase 4C-B — Human Legal Review Required

Engineering has prepared this packet with factual information. Engineering does NOT make the final legal determination.

## HAIEC Package

- **Package name:** haiec-agent-security
- **Version:** 0.1.0
- **License:** See LICENSE file (to be confirmed by human review)
- **Package type:** public (private: false)

## Runtime Dependencies

| Dependency | Version | License | Notes |
|------------|---------|---------|-------|
| @modelcontextprotocol/server | 2.0.0 | MIT | MCP SDK |
| canonicalize | 4.0.0 | Apache-2.0 | JSON canonicalization (RFC 8785) |
| zod | 4.4.3 | MIT | Schema validation |

## Dev Dependencies (not in published package)

| Dependency | Version | License |
|------------|---------|---------|
| @modelcontextprotocol/client | ^2.0.0 | MIT |
| @types/node | 26.2.0 | MIT |
| tsx | 4.23.12 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| eslint | 10.8.1 | MIT |
| typescript-eslint | 8.67.0 | MIT |
| @eslint/js | 10.0.1 | MIT |

## Public Core Rules

- **Location:** rules/public-core/
- **License:** To be confirmed by human review
- **Authorship:** All rules authored by Subodh (subodhkc, subodh@haiec.com)
- **Provenance:** Phase 2.5 external similarity check completed — 0 strong/exact matches against external rule databases
- **Rule count:** 122 detectors, 79 security checks

## Semgrep Relationship

### What Semgrep IS

- Semgrep is a third-party open-source static analysis tool
- Developed by Semgrep, Inc. (formerly r2c)
- License: LGPL-2.1 with additional permissions for rules
- HAIEC uses Semgrep as its static analysis engine

### What HAIEC does NOT do with Semgrep

- HAIEC does NOT bundle Semgrep binaries in the npm package
- HAIEC does NOT redistribute Semgrep source code
- HAIEC does NOT modify Semgrep
- HAIEC does NOT install Semgrep automatically (user must install it)
- HAIEC does NOT require Semgrep metrics/telemetry

### How HAIEC obtains Semgrep

- User installs Semgrep independently: `pip install semgrep==1.173.0`
- Or user sets `HAIEC_SEMGREP_PATH` to point to an existing Semgrep installation
- HAIEC's SemgrepResolver checks for Semgrep on PATH or at the configured path
- If Semgrep is absent, HAIEC returns a setup-required error — it does NOT silently install

### Semgrep Notices/Obligations

- HAIEC should attribute Semgrep as the static analysis engine in documentation
- HAIEC's rules are original works, not derived from Semgrep's default rules
- The LGPL-2.1 license of Semgrep applies to Semgrep itself, not to HAIEC's rules
- HAIEC users must comply with Semgrep's license when they install Semgrep

## Questions for Human Legal Review

1. Is the selected HAIEC package license appropriate?
2. Are all third-party license obligations met?
3. Is the Semgrep attribution sufficient?
4. Are there any patent concerns with using Semgrep as the engine?
5. Is the Public Core rule license compatible with all dependencies?
6. Are required notices (THIRD_PARTY_NOTICES.md, TRADEMARKS.md) complete and accurate?

## Engineering Facts

- npm audit: 0 vulnerabilities
- No secrets, credentials, or private content in the package
- No Semgrep binaries bundled
- No Kestrel source code in the package
- No local absolute paths in the published package (only in dev scripts)
- The `files` field in package.json restricts published content to: dist, rules/public-core, LICENSE, THIRD_PARTY_NOTICES.md, TRADEMARKS.md
