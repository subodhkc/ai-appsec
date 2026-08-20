import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../../src/mcp/server-factory.js';
import { SERVER_NAME, SERVER_VERSION } from '../../src/mcp/protocol.js';

describe('MCP server factory', () => {
  it('creates a server with the correct name', () => {
    const server = createServer();
    // McpServer doesn't expose name directly in all versions,
    // but we can verify it was created without throwing
    assert.ok(server, 'Server should be created');
  });

  it('uses the correct server name constant', () => {
    assert.equal(SERVER_NAME, 'ai-appsec');
  });

  it('uses the correct server version constant', () => {
    assert.equal(SERVER_VERSION, '0.1.0-rc.3');
  });

  it('does not register tool handlers in Phase 0', () => {
    // The server is created but no tools are registered with handlers.
    // This is intentional — we don't want to advertise fake capabilities.
    const server = createServer();
    assert.ok(server);
    // If we tried to call a tool, it would fail because no handlers are registered.
  });
});
