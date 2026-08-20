/**
 * C2R Kestrel qualification — immutable corpus scan + finding forensics.
 *
 * Runs scan_ai_security against the immutable Kestrel committed tree.
 * Captures:
 * - immutable corpus identity (commit, tree, file-set digest)
 * - scan result with Security Concerns
 * - finding distribution by check, detector, severity, disposition, kind, file
 * - PARTIAL root cause analysis
 *
 * Uses the bundled Public Core (no private rulepack env vars needed).
 * Uses the HAIEC-managed Semgrep.
 */
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { createServer } from '../src/mcp/server-factory.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const KESTREL_PATH = 'C:/Users/Subodh Kc/Desktop/App Building/Github/kestrel/AI-Service-Call-Agent-';

interface FindingDistribution {
  bySecurityCheck: Record<string, number>;
  byDetector: Record<string, number>;
  bySeverity: Record<string, number>;
  byDisposition: Record<string, number>;
  byFindingKind: Record<string, number>;
  byDirectory: Record<string, number>;
  topChecks: Array<{ checkId: string; count: number; share: number }>;
  top5Share: number;
  top10Share: number;
  maxInstancesOneCheck: number;
  medianInstancesPerCheck: number;
  uniqueSecurityChecks: number;
  uniqueDetectors: number;
  affectedFiles: number;
}

interface KestrelQualification {
  corpus: {
    repository: string;
    commit: string;
    branch: string;
    dirtyState: boolean;
    dirtyFiles: string[];
    treeSha: string;
    fileCount: number;
    fileSetDigest: string;
    snapshotMethod: string;
  };
  scan: {
    duration: string;
    verdict: string;
    completeness: string;
    completenessReasons: string[];
    isError: boolean;
    summary: any;
    truncation: any;
    versions: any;
    errors: any[];
    limitations: any[];
    securityConcernCount: number;
    topConcerns: any[];
    responseBytes: number;
  };
  partialCause: {
    timeout: boolean;
    parseErrors: number;
    manifestMismatch: boolean;
    completenessReasons: string[];
    analysis: string;
  };
  distribution: FindingDistribution;
  rulepackDigest: string;
  manifestDigest: string;
  semgrepVersion: string;
}

function computeFileSetDigest(repoPath: string): { count: number; digest: string } {
  // Use git ls-tree -r HEAD for immutable committed tree
  const files = execSync('git ls-tree -r HEAD --name-only', { cwd: repoPath, encoding: 'utf-8' }).trim().split('\n');
  const sorted = [...files].sort();
  const hash = crypto.createHash('sha256').update(sorted.join('\n'), 'utf-8').digest('hex');
  return { count: files.length, digest: `sha256:${hash}` };
}

function analyzeDistribution(findings: any[], concerns: any[]): FindingDistribution {
  const bySecurityCheck: Record<string, number> = {};
  const byDetector: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byDisposition: Record<string, number> = {};
  const byFindingKind: Record<string, number> = {};
  const byDirectory: Record<string, number> = {};
  const fileSet = new Set<string>();

  for (const f of findings) {
    bySecurityCheck[f.securityCheckId] = (bySecurityCheck[f.securityCheckId] ?? 0) + 1;
    bySeverity[f.canonicalSeverity] = (bySeverity[f.canonicalSeverity] ?? 0) + 1;
    byDisposition[f.defaultDisposition] = (byDisposition[f.defaultDisposition] ?? 0) + 1;
    byFindingKind[f.findingKind] = (byFindingKind[f.findingKind] ?? 0) + 1;
    for (const d of f.detectorIds) {
      byDetector[d] = (byDetector[d] ?? 0) + 1;
    }
    const dir = f.relativePath.includes('/') ? f.relativePath.split('/').slice(0, 2).join('/') : f.relativePath;
    byDirectory[dir] = (byDirectory[dir] ?? 0) + 1;
    fileSet.add(f.relativePath);
  }

  const checkCounts = Object.entries(bySecurityCheck).sort((a, b) => b[1] - a[1]);
  const total = findings.length;
  const topChecks = checkCounts.slice(0, 20).map(([checkId, count]) => ({
    checkId,
    count,
    share: total > 0 ? count / total : 0,
  }));
  const top5 = topChecks.slice(0, 5).reduce((s, c) => s + c.count, 0);
  const top10 = topChecks.slice(0, 10).reduce((s, c) => s + c.count, 0);
  const maxInstances = checkCounts.length > 0 ? checkCounts[0][1] : 0;
  const counts = checkCounts.map((c) => c[1]).sort((a, b) => a - b);
  const median = counts.length > 0 ? counts[Math.floor(counts.length / 2)] : 0;

  return {
    bySecurityCheck,
    byDetector,
    bySeverity,
    byDisposition,
    byFindingKind,
    byDirectory,
    topChecks,
    top5Share: total > 0 ? top5 / total : 0,
    top10Share: total > 0 ? top10 / total : 0,
    maxInstancesOneCheck: maxInstances,
    medianInstancesPerCheck: median,
    uniqueSecurityChecks: checkCounts.length,
    uniqueDetectors: Object.keys(byDetector).length,
    affectedFiles: fileSet.size,
  };
}

async function main(): Promise<void> {
  console.error('=== C2R Kestrel Qualification ===');

  // 1. Capture immutable corpus identity
  const commit = execSync('git rev-parse HEAD', { cwd: KESTREL_PATH, encoding: 'utf-8' }).trim();
  const branch = execSync('git branch --show-current', { cwd: KESTREL_PATH, encoding: 'utf-8' }).trim();
  const status = execSync('git status --short', { cwd: KESTREL_PATH, encoding: 'utf-8' }).trim();
  const dirtyFiles = status ? status.split('\n') : [];
  const treeLine = execSync('git cat-file -p HEAD', { cwd: KESTREL_PATH, encoding: 'utf-8' }).trim().split('\n')[0];
  const treeSha = treeLine.replace('tree ', '');
  const { count: fileCount, digest: fileSetDigest } = computeFileSetDigest(KESTREL_PATH);

  console.error(`Commit: ${commit}`);
  console.error(`Tree: ${treeSha}`);
  console.error(`Files: ${fileCount}`);
  console.error(`File-set digest: ${fileSetDigest}`);
  console.error(`Dirty: ${dirtyFiles.length > 0} (${dirtyFiles.length} untracked)`);

  // 2. Run scan via MCP protocol
  const server = createServer();
  const client = new Client(
    { name: 'c2r-kestrel', version: '1.0.0' },
    { capabilities: {}, timeout: 600000 } as any,
  );
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  await client.connect(ct);

  const startTime = Date.now();
  const result = await client.callTool(
    { name: 'scan_ai_security', arguments: { targetPath: KESTREL_PATH, timeout: 300 } },
    { timeout: 600000 } as any,
  );
  const duration = Date.now() - startTime;
  const sc = (result as any).structuredContent;
  const textContent = result.content?.find((c: any) => c.type === 'text');
  const responseBytes = JSON.stringify(sc).length + (textContent ? (textContent as any).text.length : 0);

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${sc?.verdict}`);
  console.error(`Completeness: ${sc?.completeness}`);
  console.error(`Detector instances: ${sc?.summary?.detectorInstancesFound ?? 0}`);
  console.error(`Canonical findings: ${sc?.summary?.canonicalFindingsFound ?? 0}`);
  console.error(`Material concerns: ${sc?.summary?.materialConcernsFound ?? 0}`);
  console.error(`Observations: ${sc?.summary?.observationsFound ?? 0}`);
  console.error(`Files analyzed: ${sc?.summary?.filesAnalyzed ?? 0}`);

  await client.close();

  // 3. Analyze finding distribution (use actionable + observations for full picture)
  const allFindings = [...(sc?.actionableFindings ?? []), ...(sc?.observations ?? [])];
  const distribution = analyzeDistribution(allFindings, sc?.securityConcerns ?? []);

  // 4. Determine PARTIAL cause
  const timeout = (sc?.errors ?? []).some((e: any) => e.code === 'SEMGREP_TIMEOUT');
  const parseErrors = sc?.summary?.filesSkippedByEngine ?? 0;
  const manifestMismatch = (sc?.errors ?? []).some((e: any) => e.code === 'RULEPACK_MANIFEST_MISMATCH');
  const partialReasons = sc?.completenessReasons ?? [];

  let partialAnalysis = 'N/A (completeness is not PARTIAL)';
  if (sc?.completeness === 'PARTIAL') {
    const causes: string[] = [];
    if (timeout) causes.push('SEMGREP_TIMEOUT — scan exceeded timeout, partial results available');
    if (parseErrors > 0) causes.push(`${parseErrors} parser error(s) — some files could not be parsed`);
    if (manifestMismatch) causes.push('RULEPACK_MANIFEST_MISMATCH — some detector results could not be mapped');
    if (causes.length === 0) causes.push('No explicit cause found in errors or completeness reasons');
    partialAnalysis = causes.join('; ');
  }

  const qualification: KestrelQualification = {
    corpus: {
      repository: 'kestrel/AI-Service-Call-Agent-',
      commit,
      branch,
      dirtyState: dirtyFiles.length > 0,
      dirtyFiles: dirtyFiles.map((f) => f.replace(/C:\\Users\\[^\\]+/g, '<HAIEC_HOME>')),
      treeSha,
      fileCount,
      fileSetDigest,
      snapshotMethod: 'git ls-tree -r HEAD (immutable committed tree)',
    },
    scan: {
      duration: `${duration}ms`,
      verdict: sc?.verdict,
      completeness: sc?.completeness,
      completenessReasons: sc?.completenessReasons ?? [],
      isError: (result as any).isError,
      summary: sc?.summary,
      truncation: sc?.truncation,
      versions: sc?.versions,
      errors: sc?.errors ?? [],
      limitations: sc?.limitations ?? [],
      securityConcernCount: sc?.securityConcerns?.length ?? 0,
      topConcerns: (sc?.securityConcerns ?? []).slice(0, 10),
      responseBytes,
    },
    partialCause: {
      timeout,
      parseErrors,
      manifestMismatch,
      completenessReasons: partialReasons,
      analysis: partialAnalysis,
    },
    distribution,
    rulepackDigest: sc?.versions?.rulepackDigest ?? 'unknown',
    manifestDigest: sc?.versions?.manifestDigest ?? 'unknown',
    semgrepVersion: sc?.versions?.semgrepVersion ?? 'unknown',
  };

  // Write evidence
  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'kestrel-qualification.json');
  fs.writeFileSync(evidencePath, JSON.stringify(qualification, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;
  console.error(`\nEvidence written to: ${evidencePath}`);
  console.error(`Evidence digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
