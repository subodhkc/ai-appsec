# Phase 4B — NPM Package Audit

## package.json

| Field | Value |
|-------|-------|
| name | haiec-agent-security |
| version | 0.0.0 |
| private | true (must be changed before public publish) |
| type | module |
| engines.node | >=22 |
| bin | haiec-agent-security → dist/mcp/index.js |
| files | ["dist"] |

## npm pack --dry-run

| Metric | Value |
|--------|-------|
| Total files | 66 (before build) / 110 (after build) |
| Package size | 20.2KB (before) / 48.9KB (after) |
| Unpacked size | 65.9KB (before) / ~130KB (after) |

## Private file leakage check

- No `.private-rule-staging` files
- No private rc.5 YAML
- No `.env` files
- No secrets
- No local machine paths
- No large irrelevant test corpora

## Dependencies

| Type | Count |
|------|-------|
| Production | 3 (@modelcontextprotocol/server, canonicalize, zod) |
| Development | 5 (eslint, tsx, typescript, typescript-eslint, @modelcontextprotocol/client) |

## Install scripts

- postinstall: NONE
- preinstall: NONE
- No download at install time
- No telemetry at install time
- No environment modification

## npm audit

0 vulnerabilities.
