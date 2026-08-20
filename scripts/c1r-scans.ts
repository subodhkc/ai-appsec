/**
 * C1R validation scans — Kestrel + HAIEC self-scan through actual MCP protocol.
 *
 * Uses the bundled Public Core (no private rulepack env vars needed).
 * Uses the HAIEC-managed Semgrep (installed by `haiec-agent-security setup`).
 */
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../src/mcp/server-factory.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

interface ScanEvidence {
  readonly repository: string;
  readonly commit: string;
  readonly branch: string;
  readonly dirtyState: boolean;
  readonly duration: string;
  readonly verdict: string;
  readonly completeness: string;
  readonly completenessReasons: string[];
  readonly summary: any;
  readonly truncation: any;
  readonly errors: any[];
  readonly limitations: any[];
  readonly versions: any;
  readonly responseBytes: number;
  readonly isError: boolean;
}

async function runScan(repoPath: string, label: string): Promise<ScanEvidence> {
  console.error(`\n=== ${label} ===`);

  // Get git info
  let commit = 'unknown';
  let branch = 'unknown';
  let dirtyState = false;
  try {
    const { execSync } = await import('node:child_process');
    commit = execSync('git rev-parse HEAD', { cwd: repoPath, encoding: 'utf-8' }).trim();
    branch = execSync('git branch --show-current', { cwd: repoPath, encoding: 'utf-8' }).trim();
    const status = execSync('git status --short', { cwd: repoPath, encoding: 'utf-8' }).trim();
    dirtyState = status.length > 0;
  } catch { /* not a git repo or git not available */ }

  console.error(`Repository: ${repoPath}`);
  console.error(`Commit: ${commit}`);
  console.error(`Branch: ${branch}`);
  console.error(`Dirty: ${dirtyState}`);

  // Create MCP server with default (bundled Public Core) provider
  const server = createServer();
  const client = new Client(
    { name: 'c1r-scan', version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any, // 10 min timeout for large repos
  );

  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const startTime = Date.now();

  const result = await client.callTool({
    name: 'scan_ai_security',
    arguments: {
      targetPath: repoPath,
      timeout: 300,
    },
  }, { timeout: 600000 } as any); // 10 min per-request timeout

  const duration = Date.now() - startTime;
  const sc = (result as any).structuredContent;
  const textContent = result.content?.find((c: any) => c.type === 'text');
  const responseBytes = JSON.stringify(sc).length + (textContent ? (textContent as any).text.length : 0);

  const evidence: ScanEvidence = {
    repository: label,
    commit,
    branch,
    dirtyState,
    duration: `${duration}ms`,
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    completenessReasons: sc?.completenessReasons ?? [],
    summary: sc?.summary,
    truncation: sc?.truncation,
    errors: sc?.errors ?? [],
    limitations: sc?.limitations ?? [],
    versions: sc?.versions,
    responseBytes,
    isError: (result as any).isError,
  };

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${sc?.verdict}`);
  console.error(`Completeness: ${sc?.completeness}`);
  console.error(`Raw findings: ${sc?.summary?.rawFindingCount ?? 0}`);
  console.error(`Actionable: ${sc?.summary?.actionableTotal ?? 0}`);
  console.error(`Observations: ${sc?.summary?.presenceTotal ?? 0}`);
  console.error(`Files analyzed: ${sc?.summary?.filesAnalyzed ?? 0}`);
  console.error(`Response bytes: ${responseBytes}`);
  console.error(`isError: ${(result as any).isError}`);

  await client.close();
  return evidence;
}

async function main(): Promise<void> {
  const results: Record<string, ScanEvidence> = {};

  // 1. Kestrel scan
  const kestrelPath = 'C:/Users/Subodh Kc/Desktop/App Building/Github/kestrel/AI-Service-Call-Agent-';
  if (fs.existsSync(kestrelPath)) {
    results.kestrel = await runScan(kestrelPath, 'kestrel-AI-Service-Call-Agent');
  } else {
    console.error('Kestrel repo not found at:', kestrelPath);
  }

  // 2. HAIEC self-scan
  const haiecPath = path.resolve(__dirname, '..');
  results.haiecSelfScan = await runScan(haiecPath, 'haiec-ai-agent-security-self');

  // Write evidence
  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });

  const evidencePath = path.join(evidenceDir, 'c1r-scans.json');
  fs.writeFileSync(evidencePath, JSON.stringify(results, null, 2));

  // Compute digest
  const evidenceContent = fs.readFileSync(evidencePath);
  const digest = `sha256:${crypto.createHash('sha256').update(evidenceContent).digest('hex')}`;
  console.error(`\nEvidence written to: ${evidencePath}`);
  console.error(`Evidence digest: ${digest}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
