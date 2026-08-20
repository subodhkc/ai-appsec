# HAIEC Agent Security

HAIEC MCP produces deterministic static-analysis findings with explicit
coverage and tamper-evident evidence receipts.

Qualified COMPLETE supported scans have demonstrated cross-process semantic
Receipt reproducibility.

PARTIAL scans preserve run-specific coverage differences instead of hiding
them.

## Status

**PRE-RELEASE — RELEASE CANDIDATE QUALIFICATION (Phase 4C-A4.1)**

This project is in release-candidate qualification. The `scan_ai_security`
engine is implemented and locally qualified. The package is not yet published
to npm.

## What This Project Is

HAIEC Agent Security is a control surface for AI agent security. It defines
four independent security checks that an AI coding agent can invoke when the
situation calls for them:

| Check | Purpose | Status |
|-------|---------|--------|
| `scan_ai_security` | Source-code security scanning for AI/LLM applications | **Implemented** (Public Core rc.6, 122 detectors) |
| `scan_tenant_isolation` | Cross-tenant boundary checks | Not yet integrated |
| `verify_llm_content` | LLM input/output verification | Not yet integrated |
| `check_deploy_security` | Release/deploy gate | Not yet integrated |

## One Workflow, Four Independent Checks

```
SCAN AI CODE            → scan_ai_security
CHECK TENANT BOUNDARIES → scan_tenant_isolation
CHECK MODEL INTERACTIONS → verify_llm_content
GATE THE RELEASE        → check_deploy_security
```

These checks are **independent**. HAIEC does not automatically cascade every
engine. Each check is selected on its own semantic merit:

- Source-code security → `scan_ai_security`
- Cross-tenant boundaries → `scan_tenant_isolation`
- Actual LLM input/output → `verify_llm_content`
- Merge/release/deploy → `check_deploy_security`

## What `scan_ai_security` Does

HAIEC MCP produces deterministic, reproducible static security evidence for
AI-agent code. It uses Semgrep 1.173.0 as its execution engine with a bundled
Public Core rulepack (122 detectors, 79 security checks).

Key properties:

- **Static analysis only** — does not execute target code
- **No network required for normal scans** (Semgrep setup may require network)
- **No HAIEC account or API key required**
- **Deterministic evidence** — Scan Receipts with SHA-256 digests
- **Fail-closed digests** — rulepack/manifest verified at runtime
- **Proof-of-fix** — rescan comparison with check-evaluation safety

## What `scan_ai_security` Does NOT Do

- Does not provide complete AI system assurance
- Does not provide runtime behavioral assurance
- Does not provide compliance certification
- Does not guarantee zero false positives
- Does not prove root causes for concern families
- Does not execute target code, install dependencies, or run package managers

## Security Concern Families

Security Concern Families summarize semantically compatible finding instances
for decision-quality presentation. A concern family is a deterministic grouping
view — it is NOT necessarily one vulnerability, one material issue, or one root
cause. Underlying finding instances remain auditable.

Concern family count is not a vulnerability count. Top 20 / Top 50 are
presentation limits, not evidence limits.

## PARTIAL Scans

A PARTIAL scan means HAIEC could not fully analyze the declared supported
scope. This can happen due to parser failures on supported file types. PARTIAL
scans cannot prove absence of findings. Missing evidence is never interpreted
as PASS.

## Architecture

```
haiec-ai-agent-security-free-mcp/
├── src/
│   ├── contracts/          # Shared types: findings, results, tools, verdicts
│   ├── mcp/                # MCP server factory and tool definitions
│   ├── security/           # Output sanitization, path boundaries, secret redaction
│   ├── provenance/         # Canonicalization and digest utilities
│   ├── engines/
│   │   ├── ai-security/        # AI source-code security engine (IMPLEMENTED)
│   │   ├── tenant-isolation/   # Tenant isolation engine (not yet integrated)
│   │   └── llmverify/          # LLM content verification engine (not yet integrated)
│   └── orchestration/
│       └── deploy-security/    # Release gate orchestration (not yet integrated)
├── tests/                  # Unit and architecture tests (239 tests)
├── evals/                  # AI tool-selection evaluations
└── rules/                  # Public Core rulepack (rc.6, 122 detectors)
```

## Engine Independence

Each engine is an independent product with its own execution path:

- `scan_ai_security` does NOT invoke LLMVerify or Tenant Isolation.
- `scan_tenant_isolation` does NOT invoke LLMVerify or AI security scanning.
- `verify_llm_content` does NOT invoke source scanning or tenant scanning.
- Only `check_deploy_security` may intentionally compose engines, and it must
  disclose which engines ran, which did not, and why.

## Installation

This package is not yet published to npm. It is intended for local development
only at this stage.

```bash
git clone https://github.com/subodhkc/haiec-ai-agent-security-free-mcp.git
cd haiec-ai-agent-security-free-mcp
npm ci
npm run build
npm test
```

## Semgrep Setup

`scan_ai_security` requires Semgrep 1.173.0 (exact version match). The package
can discover a managed Semgrep installation or use an existing one on PATH.

```bash
# Check Semgrep status
npx haiec-agent-security doctor

# Install managed Semgrep (requires network)
npx haiec-agent-security setup
```

## License

License decision pending. Until a license is added, this repository should not
be described as open source. The final license remains a founder/IP decision.

## Contributing

This project is in pre-release development. Contributions are not yet solicited
until the foundation stabilizes and a license is selected.

## Related Projects

- [LLMVerify](https://github.com/subodhkc/llmverify-npm) — LLM content
  verification (independent product, separate repository)
- [Tenant Isolation](https://github.com/subodhkc/mcp-tenant-isolation) —
  Cross-tenant boundary checks (independent product, separate repository)
