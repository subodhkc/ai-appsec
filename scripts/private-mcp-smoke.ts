/**
 * Private-bundle MCP E2E smoke test.
 *
 * Runs scan_ai_security through the actual MCP protocol path
 * (Client → InMemoryTransport → McpServer → scanner → Semgrep)
 * against real repositories using the gitignored rc.5 rulepack.
 *
 * NOT a unit test — this is a smoke test run manually.
 */
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../src/mcp/server-factory.js';
import { PrivateLocalRulepackProvider } from '../src/engines/ai-security/rulepack-provider.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const SEMGREP_PATH = process.env.AI_APPSEC_SEMGREP_PATH;
const RULEPACK_PATH = process.env.HAIEC_RULEPACK_PATH;
const MANIFEST_PATH = process.env.HAIEC_MANIFEST_PATH;

if (!RULEPACK_PATH || !MANIFEST_PATH || !SEMGREP_PATH) {
  console.error('Usage: HAIEC_RULEPACK_PATH=... HAIEC_MANIFEST_PATH=... AI_APPSEC_SEMGREP_PATH=... npx tsx scripts/private-mcp-smoke.ts <repo-path>');
  process.exit(1);
}

async function runMcpScan(repoPath: string, label: string): Promise<void> {
  console.log(`\n=== ${label} ===`);

  const provider = new PrivateLocalRulepackProvider(RULEPACK_PATH, MANIFEST_PATH);
  const server = createServer({
    rulepackProvider: provider,
    semgrepPath: SEMGREP_PATH,
  });

  const client = new Client(
    { name: 'smoke-client', version: '1.0.0' },
    { capabilities: {} },
  );

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  const startTime = Date.now();

  const result = await client.callTool({
    name: 'scan_ai_security',
    arguments: {
      targetPath: repoPath,
      timeout: 300,
    },
  });

  const duration = Date.now() - startTime;

  const structured = (result as any).structuredContent;
  const textContent = result.content?.find((c: any) => c.type === 'text');

  // Debug: log raw result keys
  console.error('Raw result keys:', Object.keys(result));
  console.error('isError:', (result as any).isError);
  console.error('structuredContent type:', typeof structured);
  if (!structured) {
    console.error('text content:', textContent ? (textContent as any).text.substring(0, 500) : 'none');
  }

  const structuredBytes = structured ? JSON.stringify(structured).length : 0;
  const textBytes = textContent ? (textContent as any).text.length : 0;
  const totalBytes = structuredBytes + textBytes;

  console.log(JSON.stringify({
    duration: `${duration}ms`,
    verdict: structured.verdict,
    completeness: structured.completeness,
    completenessReasons: structured.completenessReasons,
    summary: structured.summary,
    truncation: structured.truncation,
    errors: structured.errors,
    limitations: structured.limitations,
    versions: structured.versions,
    responseSize: {
      structuredBytes,
      textBytes,
      totalBytes,
      totalKB: Math.round(totalBytes / 1024),
    },
    isError: (result as any).isError,
  }, null, 2));

  await client.close();
}

async function main(): Promise<void> {
  const repos = process.argv.slice(2);
  if (repos.length === 0) {
    // Default repos
    const stagingDir = path.resolve(__dirname, '..', '.private-rule-staging', 'real-repos');
    repos.push(
      path.join(stagingDir, 'together-python'),
      path.join(stagingDir, 'anthropic-sdk-python'),
      path.join(stagingDir, 'anthropic-sdk-typescript'),
    );
  }

  const labels = ['small (together-python)', 'medium (anthropic-sdk-python)', 'medium (anthropic-sdk-typescript)'];

  for (let i = 0; i < repos.length; i++) {
    await runMcpScan(repos[i], labels[i] ?? `repo ${i}`);
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
