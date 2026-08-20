# AI AppSec

Evidence-backed AppSec for AI applications and agents.

Powered by HAIEC.

Audit AI code for security risks before you commit, push, merge, or deploy.

## What AI AppSec Does

AI AppSec produces deterministic, reproducible static security evidence for
AI-agent and AI-application source code. It uses Semgrep 1.173.0 as its
execution engine with a bundled Public Core rulepack (122 detectors, 79
security checks).

Key properties:

- **Static analysis only** — does not execute target code
- **No network required for normal scans** (Semgrep setup may require network)
- **No HAIEC account or API key required**
- **Deterministic evidence** — Scan Receipts with SHA-256 digests
- **Fail-closed digests** — rulepack/manifest verified at runtime
- **Proof-of-fix** — rescan comparison with check-evaluation safety

## Quick Start

```bash
# Install
npm install -g ai-appsec

# Check Semgrep status
ai-appsec doctor

# Install Semgrep engine (requires network)
ai-appsec setup

# Start MCP server (stdio transport)
ai-appsec
```

Or use via npx without global install:

```bash
npx ai-appsec doctor
npx ai-appsec setup
```

## When to Use It

Use `scan_ai_security` when a developer asks to:

- "check this for security issues"
- "audit this task before I push"
- "review this change for security problems"
- "scan this AI agent" or "scan this AI app"
- "check my LLM application"
- "security review this PR"
- "is this safe to merge"
- "check this before deployment"
- "audit this code for vulnerabilities"
- "run a security scan"
- "check for security risks before commit"

## scan_ai_security

The MCP tool `scan_ai_security` is the only tool implemented in v0.1.

It scans AI/LLM/agent application source code for security risks including:

- Unsafe AI-output execution
- Secrets exposure
- RAG/model integration risks
- Insecure AI API usage
- Control gaps
- Prompt/input-related risk signals

### What scan_ai_security Does NOT Do

- Does not provide complete AI system assurance
- Does not provide runtime behavioral assurance
- Does not provide compliance certification
- Does not guarantee zero false positives
- Does not prove root causes for concern families
- Does not execute target code, install dependencies, or run package managers
- Does not perform compliance assessment (compliance requires additional HAIEC evidence)

## Findings

Findings are classified by:

- **Finding kind**: PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY
- **Severity**: CRITICAL, HIGH, MEDIUM, LOW, INFO
- **Disposition**: INFORMATIONAL, REVIEW, BLOCK

## Security Concern Families

Security Concern Families summarize semantically compatible finding instances
for decision-quality presentation. A concern family is a deterministic grouping
view — it is NOT necessarily one vulnerability, one material issue, or one root
cause. Underlying finding instances remain auditable.

Concern family count is not a vulnerability count. Top 20 / Top 50 are
presentation limits, not evidence limits.

## COMPLETE / PARTIAL / ERROR

- **COMPLETE**: All supported files in scope were successfully analyzed.
- **PARTIAL**: Some supported files could not be analyzed (e.g., parser failures).
  PARTIAL scans cannot prove absence of findings. Missing evidence is never
  interpreted as PASS.
- **ERROR**: The scan could not complete due to an engine error.

## Coverage

AI AppSec provides explicit coverage accounting:

- **DISCOVERED**: all files found beneath the target
- **INTENTIONALLY_EXCLUDED**: files excluded by scope policy
- **UNSUPPORTED**: files outside supported extensions (.py, .js, .jsx, .ts, .tsx)
- **TARGETED**: supported files intended for analysis
- **ENGINE_REPORTED_SCANNED**: files Semgrep reports as scanned
- **PARSE_FAILED**: files with parse errors
- **SUCCESSFULLY_ANALYZED**: scanned minus parse failures

## Scan Receipt

Every scan produces a tamper-evident Scan Receipt with SHA-256 digests for:

- Finding set
- Concern family set
- Coverage file sets
- Evaluated security checks and detectors
- Semantic receipt identity

COMPLETE scans produce reproducible receipts across processes and operating
systems. PARTIAL scans preserve run-specific coverage differences.

## Evidence Envelope

Each scan produces an Evidence Envelope that binds the receipt to the scan
execution context, including:

- Producer identity
- Target identity (scan input digest, git commit, dirty state)
- Execution status and completeness
- Semantic receipt digest
- Envelope digest

## Proof-of-fix

Rescan a target after a fix to compare receipts. The proof-of-fix comparison
is safe: it verifies that a specific security check's findings were resolved
without requiring the entire scan to be identical.

## Offline / Local Operation

Normal scanning operates fully offline after prerequisites are installed:

- No HAIEC cloud access required
- No account or API key required
- No rule download during scanning
- No telemetry emitted (Semgrep invoked with `--metrics off`)

Semgrep setup (`ai-appsec setup`) may require network access to install the
engine. Once installed, all scanning is local.

## Semgrep Prerequisite

`scan_ai_security` requires Semgrep 1.173.0 (exact version match).

```bash
# Check Semgrep status
ai-appsec doctor

# Install managed Semgrep (requires network)
ai-appsec setup
```

Semgrep is NOT bundled with this package. It is an external engine installed
separately. See THIRD_PARTY_NOTICES.md for details.

## Limitations

- Only `scan_ai_security` is implemented in v0.1
- Static analysis only — no runtime behavioral evidence
- No compliance certification or assessment
- No tenant isolation checking (roadmap)
- No LLM content verification (roadmap)
- No deploy security gating (roadmap)

## License

MIT License

Copyright (c) 2026 HAIEC

See [LICENSE](LICENSE) for the full license text.

## Security Reporting

If you believe you have found a security vulnerability:

1. **Do not disclose it publicly** before review.
2. Report via [GitHub private vulnerability reporting](https://github.com/subodhkc/ai-appsec/security/advisories/new).
3. For non-sensitive bugs, use [GitHub Issues](https://github.com/subodhkc/ai-appsec/issues).

No bug bounty program exists at this time. This project is maintained by a
small team. We appreciate responsible disclosure and patience.

## Roadmap

Future HAIEC capabilities (not yet implemented in this package):

- Tenant isolation checking (`scan_tenant_isolation`)
- LLM/runtime content verification (`verify_llm_content`)
- Deploy security gating (`check_deploy_security`)
- Native deterministic dataflow analysis
- Runtime evidence
- Inventory evidence
- Regulatory evidence
- Compliance/assurance integration
- Compliance Twin

These will remain independent products/engines. See the HAIEC architecture
principle: one workflow, four independent checks.

## HAIEC

AI AppSec is powered by HAIEC. HAIEC is the broader assurance platform that
may combine ai-appsec evidence with runtime, inventory, regulatory, and
external evidence for broader compliance and assurance in the future.

Founder-led development with HAIEC acting as the release gatekeeper for
provenance, licensing, and publication.

## Related Projects

- [LLMVerify](https://github.com/subodhkc/llmverify-npm) — LLM content
  verification (independent product, separate repository)
- [Tenant Isolation](https://github.com/subodhkc/mcp-tenant-isolation) —
  Cross-tenant boundary checks (independent product, separate repository)
