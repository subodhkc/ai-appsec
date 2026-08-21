# MCP Directory Distribution Research

## Official MCP Registry (Primary)

- **URL**: https://registry.modelcontextprotocol.io
- **Status**: PUBLISHED (both packages)
  - `io.github.subodhkc/ai-appsec` v0.1.0 — active
  - `io.github.subodhkc/mcp-tenant-isolation` v1.6.2 — active
- **Auto-ingests**: No (this IS the source)
- **Downstream sync**: Glama, mcp.directory, PulseMCP, ClaudePluginHub auto-ingest from here

## Directory Research Results

### 1. Glama (glama.ai)
- **Status**: AUTO_INGESTS_OFFICIAL_REGISTRY
- **ai-appsec**: Indexed under OLD name `haiec-ai-agent-security-free-mcp` — needs re-indexing
- **mcp-tenant-isolation**: Indexed, A quality score, active
- **Value**: HIGH_VALUE (37,800+ servers, largest MCP directory)
- **Action**: Wait for auto-ingestion to pick up new `ai-appsec` identity from Official Registry. Optionally submit at https://glama.ai/mcp/servers to claim/update.

### 2. Smithery (smithery.ai)
- **Status**: MANUAL_FORM (requires GitHub OAuth login)
- **Value**: HIGH_VALUE (6,000+ servers, one-click install)
- **Action**: HUMAN_ACTION_REQUIRED — submit at https://smithery.ai/new
  - GitHub URL: https://github.com/subodhkc/ai-appsec
  - Description: Evidence-backed AppSec for AI applications and agents.
  - Also submit: https://github.com/subodhkc/mcp-tenant-isolation

### 3. PulseMCP (pulsemcp.com)
- **Status**: AUTO_INGESTS_OFFICIAL_REGISTRY
- **Value**: MEDIUM_VALUE (1,200 curated servers, editorial review)
- **Action**: No manual submission needed — auto-syncs from Official Registry

### 4. mcp.so
- **Status**: MANUAL_FORM (paid $39 for premium)
- **Value**: MEDIUM_VALUE (10,000+ servers, but paid listing)
- **Action**: DEFERRED — paid listing with reported quality issues. Not worth $39 for current stage.

### 5. awesome-mcp-servers (punkpeye/awesome-mcp-servers)
- **Status**: GITHUB_PR (requires Glama listing first)
- **Value**: HIGH_VALUE (92,582 stars, community-curated)
- **Action**: HUMAN_ACTION_REQUIRED
  1. Ensure ai-appsec is listed on Glama with quality score
  2. Submit PR to https://github.com/punkpeye/awesome-mcp-servers with Glama badge
  3. Also submit mcp-tenant-isolation (already on Glama with A score)

### 6. mcp.directory
- **Status**: AUTO_INGESTS_OFFICIAL_REGISTRY
- **Value**: MEDIUM_VALUE
- **Action**: No manual submission needed — auto-imports from Official Registry

### 7. ClaudePluginHub
- **Status**: AUTO_DISCOVERS_FROM_GITHUB
- **Value**: MEDIUM_VALUE (65K plugins)
- **Action**: No manual submission needed — auto-discovers from GitHub

### 8. TensorBlock/awesome-mcp-servers
- **Status**: ISSUE_FORM
- **Value**: MEDIUM_VALUE
- **Action**: Submit via issue form at https://github.com/TensorBlock/awesome-mcp-servers/issues/new?template=add-mcp-server.yml

## Summary

| Directory | Ingestion | Value | Action |
|-----------|-----------|-------|--------|
| Official MCP Registry | Manual (done) | Authoritative | COMPLETE |
| Glama | Auto from Registry | HIGH | Wait for re-index |
| Smithery | Manual form | HIGH | HUMAN_ACTION_REQUIRED |
| PulseMCP | Auto from Registry | MEDIUM | Auto |
| mcp.so | Paid form | MEDIUM | DEFERRED |
| awesome-mcp-servers | GitHub PR | HIGH | HUMAN_ACTION_REQUIRED (after Glama) |
| mcp.directory | Auto from Registry | MEDIUM | Auto |
| ClaudePluginHub | Auto from GitHub | MEDIUM | Auto |
| TensorBlock | Issue form | MEDIUM | Optional |
