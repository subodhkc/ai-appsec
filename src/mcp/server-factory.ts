/**
 * MCP server factory — creates the HAIEC Agent Security MCP server.
 *
 * Uses MCP TypeScript SDK v2 with serveStdio() for dual-era compatibility.
 *
 * Phase 0: The server can initialize safely but does NOT register
 * functional tool handlers. Tool descriptors exist as contracts only.
 *
 * stdout is MCP protocol traffic ONLY. Diagnostics go to stderr.
 */
import { McpServer } from '@modelcontextprotocol/server';
import { SERVER_NAME, SERVER_VERSION } from './protocol.js';

/**
 * Create the HAIEC Agent Security MCP server.
 *
 * The server is created but tools are NOT registered with handlers in Phase 0.
 * This allows safe initialization testing without advertising fake capabilities.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Phase 0: No tool handlers are registered.
  // Tool descriptors exist in src/contracts/tool.ts as data only.
  // When handlers are implemented in a future phase, they will be registered here.

  return server;
}
