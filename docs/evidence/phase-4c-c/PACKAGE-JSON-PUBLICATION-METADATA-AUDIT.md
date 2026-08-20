# Package.json Publication Metadata Audit

## Phase 4C-C — Part 12

## Current package.json State

```json
{
  "name": "haiec-agent-security",
  "version": "0.1.0",
  "description": "Agent-native AI security orchestration layer for MCP-compatible coding agents",
  "type": "module",
  "private": false,
  "engines": { "node": ">=22" },
  "bin": { "haiec-agent-security": "dist/mcp/index.js" },
  "keywords": ["mcp", "ai-security", "agent-security", "llm-security", "prompt-injection", "tenant-isolation", "static-analysis", "model-context-protocol"],
  "files": ["dist", "rules/public-core", "LICENSE", "THIRD_PARTY_NOTICES.md", "TRADEMARKS.md"],
  "dependencies": { "@modelcontextprotocol/server": "2.0.0", "canonicalize": "4.0.0", "zod": "4.4.3" },
  "devDependencies": { ... }
}
```

## Field-by-Field Audit

| Field | Current | Required for Publication | Status |
|-------|---------|--------------------------|--------|
| name | `haiec-agent-security` | Correct, confirmed AVAILABLE on npm | OK |
| version | `0.1.0` | Correct for first release | OK |
| description | "Agent-native AI security orchestration layer..." | OVERSTATED — see Part 8 | NEEDS UPDATE |
| license | MISSING | Required for npm publication | **HUMAN_DECISION_REQUIRED** |
| repository | MISSING | Required for npm trusted publishing/provenance | NEEDS ADDITION |
| homepage | MISSING | Recommended | NEEDS ADDITION |
| bugs | MISSING | Recommended | NEEDS ADDITION |
| author | MISSING | Recommended for copyright clarity | **HUMAN_DECISION_REQUIRED** |
| keywords | Present | Remove "tenant-isolation" (not in v0.1) | NEEDS UPDATE |
| engines | `>=22` | Correct | OK |
| bin | Present | Correct | OK |
| files | Present | Correct — no private content included | OK |
| publishConfig | MISSING | May be needed for provenance | NEEDS EVALUATION |
| mcpName | Not standard npm field | See MCP Registry section | N/A for npm |

## Recommended Additions (After Human Decisions)

```json
{
  "description": "Deterministic static security evidence for AI-agent code via MCP.",
  "license": "SEE_HUMAN_DECISION",
  "repository": {
    "type": "git",
    "url": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp.git"
  },
  "homepage": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp#readme",
  "bugs": {
    "url": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp/issues"
  },
  "author": "SEE_HUMAN_DECISION",
  "keywords": ["mcp", "ai-security", "agent-security", "llm-security", "prompt-injection", "static-analysis", "model-context-protocol", "semgrep", "security-scanning"]
}
```

## Critical: License Field

**Do NOT set `license` until the human license decision is explicit.**

If MIT is confirmed: `"license": "MIT"`
If Apache-2.0 is chosen: `"license": "Apache-2.0"`
If decision is still pending: leave unset (but npm may warn)

## repository.url Requirement

`repository.url` must exactly match the public GitHub repository:
`https://github.com/subodhkc/haiec-ai-agent-security-free-mcp.git`

This is required for npm trusted publishing/provenance attestation.

## Keywords Correction

Remove `"tenant-isolation"` — this capability is not in v0.1.
Add `"semgrep"` and `"security-scanning"` for discoverability.

## Status

**AUDIT_COMPLETE** — Changes are package-byte-affecting. Will be applied in RC2
after human decisions on license and author.
