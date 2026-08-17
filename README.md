# HAIEC Agent Security

Security checks for AI coding agents before code reaches production.

## Status

**PRE-RELEASE — UNDER ACTIVE DEVELOPMENT**

This project is in early development. No security scanning capability is
functional yet. Do not rely on this repository for production security checks.

## What This Project Is

HAIEC Agent Security is a control surface for AI agent security. It defines
four independent security checks that an AI coding agent can invoke when the
situation calls for them:

| Check | Purpose | Status |
|-------|---------|--------|
| `scan_ai_security` | Source-code security scanning for AI/LLM applications | Not yet integrated |
| `scan_tenant_isolation` | Cross-tenant boundary checks | Not yet integrated |
| `verify_llm_content` | LLM input/output verification | Not yet integrated |
| `check_deploy_security` | Release/deploy gate | Not yet integrated |

## One Workflow, Four Independent Checks

```
SCAN AI CODE          → scan_ai_security
CHECK TENANT BOUNDARIES → scan_tenant_isolation
CHECK MODEL INTERACTIONS → verify_llm_content
GATE THE RELEASE      → check_deploy_security
```

These checks are **independent**. HAIEC does not automatically cascade every
engine. Each check is selected on its own semantic merit:

- Source-code security → `scan_ai_security`
- Cross-tenant boundaries → `scan_tenant_isolation`
- Actual LLM input/output → `verify_llm_content`
- Merge/release/deploy → `check_deploy_security`

## Architecture

```
haiec-ai-agent-security-free-mcp/
├── src/
│   ├── contracts/          # Shared types: findings, results, tools, verdicts
│   ├── mcp/                # MCP server factory and tool definitions
│   ├── security/           # Output sanitization, path boundaries, secret redaction
│   ├── provenance/         # Canonicalization and digest utilities
│   ├── engines/
│   │   ├── ai-security/        # AI source-code security engine (not yet integrated)
│   │   ├── tenant-isolation/   # Tenant isolation engine (not yet integrated)
│   │   └── llmverify/          # LLM content verification engine (not yet integrated)
│   └── orchestration/
│       └── deploy-security/    # Release gate orchestration (not yet integrated)
├── tests/                  # Unit and architecture tests
├── evals/                  # AI tool-selection evaluations
└── rules/                  # Rulepack metadata (no rule bodies published yet)
```

## Engine Independence

Each engine is an independent product with its own execution path:

- `scan_ai_security` does NOT invoke LLMVerify or Tenant Isolation.
- `scan_tenant_isolation` does NOT invoke LLMVerify or AI security scanning.
- `verify_llm_content` does NOT invoke source scanning or tenant scanning.
- Only `check_deploy_security` may intentionally compose engines, and it must
  disclose which engines ran, which did not, and why.

## Current Capabilities

What exists today:

- TypeScript package scaffolding with MCP v2 structure
- Shared contracts (findings, results, tools, verdicts)
- Tool metadata with semantic "when to use" / "when not to use" descriptions
- Engine independence enforcement (architectural tests)
- Path boundary validation
- Secret redaction in outputs
- Output sanitization
- Canonicalization and provenance helpers
- AI tool-selection evaluations
- CI workflow

What does NOT exist yet:

- No security scanning engine is integrated
- No MCP tool is registered for execution
- No rule bodies are published
- No npm package is published
- No security guarantee is provided

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

## License

License decision pending. Until a license is added, this repository should not
be described as open source. The final license remains a founder/IP decision.

## Contributing

This project is in pre-release development. Contributions are not yet solicited
until the foundation stabilizes and a license is selected.

## Related Projects

- [LLMVerify](https://github.com/subodhkc/llmverify-npm) — LLM content
  verification (independent product, separate repository)
