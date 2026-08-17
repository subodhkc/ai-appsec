/**
 * MCP protocol constants and helpers.
 *
 * stdout is MCP protocol traffic ONLY.
 * Diagnostics go to stderr.
 * No console.log anywhere in MCP runtime paths.
 */

/**
 * The MCP server name advertised to clients.
 */
export const SERVER_NAME = 'haiec-agent-security';

/**
 * The MCP server version.
 */
export const SERVER_VERSION = '0.0.0';

/**
 * Write a diagnostic message to stderr (never stdout).
 */
export function writeDiagnostic(message: string): void {
  process.stderr.write(`[haiec] ${message}\n`);
}
