# MCP Registry Readiness

## Phase 4C-C — Part 13

## Current Registry State

The MCP Registry is at `registry.modelcontextprotocol.io` and is in
preview/evolving state. The schema version referenced is `2025-12-11`
(latest found in examples). Requirements may change.

## Recommended mcpName

```
io.github.subodhkc/haiec-agent-security
```

This follows the reverse-DNS namespace convention:
- `io.github.subodhkc` — GitHub-based namespace (founder owns `subodhkc` on GitHub)
- `haiec-agent-security` — server name

## Prepared server.json (NOT PUBLISHED)

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.subodhkc/haiec-agent-security",
  "description": "Deterministic static security evidence for AI-agent code via MCP.",
  "title": "HAIEC Agent Security",
  "websiteUrl": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp",
  "repository": {
    "url": "https://github.com/subodhkc/haiec-ai-agent-security-free-mcp",
    "source": "github"
  },
  "version": "0.1.0",
  "packages": [
    {
      "registryType": "npm",
      "registryBaseUrl": "https://registry.npmjs.org",
      "identifier": "haiec-agent-security",
      "version": "0.1.0",
      "transport": {
        "type": "stdio"
      }
    }
  ],
  "_meta": {
    "io.modelcontextprotocol.registry/publisher-provided": {
      "tool": "manual",
      "version": "0.1.0"
    }
  }
}
```

## Validation Checklist

| Requirement | Status |
|-------------|--------|
| Schema version | `2025-12-11` (latest available) |
| Server name format | `io.github.subodhkc/haiec-agent-security` (reverse-DNS) |
| Description | Accurate v0.1 positioning |
| Repository URL | Matches public GitHub repo |
| Version | `0.1.0` (matches package.json) |
| npm package identifier | `haiec-agent-security` (matches package.json) |
| stdio transport | YES — MCP runs over stdio |
| Environment variables | NONE required for normal scanning |
| HAIEC API key required | NO — local-first, no API key |
| Registry base URL | `https://registry.npmjs.org` (official npm, required) |

## Important Notes

1. **No environment variables required.** This MCP requires no HAIEC API key
   for normal scanning. Do NOT invent environment variables.

2. **MCP Registry is downstream of npm publication.** The server.json
   references the npm package (`haiec-agent-security@0.1.0`). The npm
   package must be published first.

3. **Namespace authentication.** Publishing under `io.github.subodhkc/`
   requires proving ownership of the `subodhkc` GitHub account. The
   registry uses GitHub OAuth for authentication.

4. **Package ownership verification.** The publisher must prove they
   control the npm package referenced in `server.json`.

5. **Registry is preview/changeable.** Requirements may change. Validate
   against the current schema before submission using the `/v0.1/validate`
   endpoint.

## Status

**MCP_REGISTRY_METADATA_PREPARED** — NOT published. NOT validated against
live registry (npm package not yet published). Validate after npm publication.
