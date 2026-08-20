#!/usr/bin/env node
/**
 * HAIEC Agent Security MCP Server — stdio entrypoint.
 *
 * This is the bin entry point for the npm package.
 *
 * Subcommands:
 *   (no args)  — Start MCP server on stdio
 *   doctor     — Read-only diagnostic (no network, no mutation)
 *   doctor --json — JSON output
 *   setup      — Explicitly install Semgrep (network allowed)
 *   setup --json  — JSON output
 *
 * stdout: MCP protocol traffic ONLY (when running as server).
 * stderr: diagnostics (when running as server).
 * stdout: command output (when running doctor/setup).
 */
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { createServer } from './server-factory.js';
import { writeDiagnostic } from './protocol.js';
import { runDoctor, formatDoctorText } from '../cli/doctor.js';
import { runSetup, formatSetupText } from '../cli/setup.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Handle CLI subcommands
  if (args.length > 0) {
    const cmd = args[0];
    const jsonFlag = args.includes('--json');

    if (cmd === 'doctor') {
      const result = await runDoctor();
      if (jsonFlag) {
        process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      } else {
        process.stdout.write(formatDoctorText(result) + '\n');
      }
      // Exit code: 0 = ready, 1 = setup required, 2 = unsupported
      if (result.semgrep.readiness === 'READY') {
        process.exit(0);
      } else if (result.semgrep.setupAvailable) {
        process.exit(1);
      } else {
        process.exit(2);
      }
      return;
    }

    if (cmd === 'setup') {
      const result = await runSetup();
      if (jsonFlag) {
        process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      } else {
        process.stdout.write(formatSetupText(result) + '\n');
      }
      process.exit(result.action === 'INSTALLED' || result.action === 'ALREADY_READY' ? 0 : 1);
      return;
    }

    if (cmd === '--help' || cmd === '-h') {
      process.stdout.write([
        'HAIEC Agent Security — AI/LLM source code security scanning via MCP',
        '',
        'Usage:',
        '  haiec-agent-security             Start MCP server (stdio transport)',
        '  haiec-agent-security doctor       Run diagnostic check (read-only, offline)',
        '  haiec-agent-security doctor --json  JSON output',
        '  haiec-agent-security setup        Install Semgrep engine (network allowed)',
        '  haiec-agent-security setup --json   JSON output',
        '  haiec-agent-security --help       Show this help',
        '',
        'Semgrep 1.173.0 is required for scanning.',
        'Run "doctor" to check status, "setup" to install.',
      ].join('\n') + '\n');
      process.exit(0);
      return;
    }

    // Unknown command
    process.stderr.write(`Unknown command: ${cmd}. Run --help for usage.\n`);
    process.exit(1);
    return;
  }

  // No subcommand — start MCP server on stdio
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is now running on stdio — do NOT write to stdout
  writeDiagnostic('HAIEC Agent Security MCP server started (stdio)');
}

main().catch((err) => {
  writeDiagnostic(`Fatal error: ${err.message}`);
  process.exit(1);
});
