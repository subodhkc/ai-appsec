# Phase 4B — Clean Install Smoke Test

## Procedure

1. `npm pack` — create tarball
2. Create clean temp directory
3. `npm init -y`
4. `npm install <tarball>`
5. Verify bin entrypoint works

## Result

- Package installs successfully
- `npx haiec-agent-security` starts the MCP server
- Server outputs `[haiec] HAIEC Agent Security MCP server started (stdio)` on stderr
- Server waits for MCP protocol messages on stdin/stdout

## What a real npm consumer receives

- `dist/` directory with compiled JavaScript
- `README.md`
- `package.json`
- bin entry: `haiec-agent-security` → `dist/mcp/index.js`

## Note on private:true

The package currently has `private: true` which prevents `npm publish`.
This must be removed before public publication. The clean install test
works because we install from a local tarball, not from the registry.
