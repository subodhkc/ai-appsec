/**
 * C2R Direct vs Packaged MCP equivalence — compares semantic digests of
 * scan_ai_security run directly (via scanner API) vs via packaged MCP stdio.
 *
 * Both run against the same immutable corpus (HAIEC MCP repo self-scan).
 * Compares canonical findings, concerns, verdict, completeness.
 * Does NOT compare operational metadata.
 */
import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const TARGET = path.resolve(__dirname, '..');

interface SemanticDigest {
  verdict: string;
  completeness: string;
  detectorInstancesFound: number;
  canonicalFindingsFound: number;
  materialConcernsFound: number;
  observationsFound: number;
  filesAnalyzed: number;
  securityConcernCount: number;
  concernDigest: string;
  findingSetDigest: string;
}

function computeConcernDigest(concerns: any[]): string {
  const canonical = concerns
    .map((c) => [
      c.concernId, c.securityCheckId, c.findingKind, c.canonicalSeverity,
      c.defaultDisposition, c.instanceCount, c.affectedFileCount,
      c.affectedDetectorCount, c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort().join('\n');
  return `sha256:${crypto.createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

function computeFindingDigest(findings: any[]): string {
  const canonical = findings
    .map((f) => [f.securityCheckId, f.relativePath, f.evidenceHash, f.findingKind, f.canonicalSeverity, f.defaultDisposition].join('|'))
    .sort().join('\n');
  return `sha256:${crypto.createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

function extractDigest(sc: any): SemanticDigest {
  const concerns = sc?.securityConcerns ?? [];
  const findings = [...(sc?.actionableFindings ?? []), ...(sc?.observations ?? [])];
  return {
    verdict: sc?.verdict,
    completeness: sc?.completeness,
    detectorInstancesFound: sc?.summary?.detectorInstancesFound ?? 0,
    canonicalFindingsFound: sc?.summary?.canonicalFindingsFound ?? 0,
    materialConcernsFound: sc?.summary?.materialConcernsFound ?? 0,
    observationsFound: sc?.summary?.observationsFound ?? 0,
    filesAnalyzed: sc?.summary?.filesAnalyzed ?? 0,
    securityConcernCount: concerns.length,
    concernDigest: computeConcernDigest(concerns),
    findingSetDigest: computeFindingDigest(findings),
  };
}

async function runDirect(): Promise<SemanticDigest> {
  console.error('=== Direct scanner ===');
  const result = await scanAiSecurity({ targetPath: TARGET, timeout: 120 });
  console.error(`Verdict: ${result.verdict}, Concerns: ${result.securityConcerns.length}`);
  return extractDigest(result);
}

async function runPackaged(): Promise<SemanticDigest> {
  console.error('=== Packaged MCP stdio ===');
  // Invoke the built dist/mcp/index.js as a subprocess MCP server
  const serverPath = path.resolve(__dirname, '..', 'dist', 'mcp', 'index.js');
  const child = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  // Send MCP initialize + tools/call via stdio
  const initMsg = {
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2026-07-28', capabilities: {}, clientInfo: { name: 'c2r-equiv', version: '1.0.0' } },
  };
  const initNotif = { jsonrpc: '2.0', method: 'notifications/initialized' };
  const callMsg = {
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'scan_ai_security', arguments: { targetPath: TARGET, timeout: 120 } },
  };

  return new Promise((resolve, reject) => {
    let buffer = '';
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) { child.kill(); reject(new Error('Packaged MCP timeout')); }
    }, 180000);

    child.stdout.on('data', (data) => {
      buffer += data.toString();
      // Parse line-delimited JSON
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 2 && msg.result) {
            resolved = true;
            clearTimeout(timeout);
            child.kill();
            const sc = msg.result.structuredContent ?? msg.result;
            console.error(`Verdict: ${sc?.verdict}, Concerns: ${sc?.securityConcerns?.length ?? 0}`);
            resolve(extractDigest(sc));
          }
        } catch { /* not JSON */ }
      }
    });

    child.stderr.on('data', (d) => { /* diagnostics */ });
    child.on('error', (e) => { clearTimeout(timeout); reject(e); });

    // Send messages
    child.stdin.write(JSON.stringify(initMsg) + '\n');
    child.stdin.write(JSON.stringify(initNotif) + '\n');
    child.stdin.write(JSON.stringify(callMsg) + '\n');
  });
}

async function main(): Promise<void> {
  console.error('=== C2R Direct vs Packaged MCP Equivalence ===');
  console.error(`Target: ${TARGET}`);

  const [direct, packaged] = await Promise.all([runDirect(), runPackaged()]);

  const verdictMatch = direct.verdict === packaged.verdict;
  const completenessMatch = direct.completeness === packaged.completeness;
  const instancesMatch = direct.detectorInstancesFound === packaged.detectorInstancesFound;
  const canonicalMatch = direct.canonicalFindingsFound === packaged.canonicalFindingsFound;
  const concernsMatch = direct.materialConcernsFound === packaged.materialConcernsFound;
  const observationsMatch = direct.observationsFound === packaged.observationsFound;
  const filesMatch = direct.filesAnalyzed === packaged.filesAnalyzed;
  const concernCountMatch = direct.securityConcernCount === packaged.securityConcernCount;
  const concernDigestMatch = direct.concernDigest === packaged.concernDigest;
  const findingDigestMatch = direct.findingSetDigest === packaged.findingSetDigest;

  const allMatch = verdictMatch && completenessMatch && instancesMatch && canonicalMatch &&
    concernsMatch && observationsMatch && filesMatch && concernCountMatch &&
    concernDigestMatch && findingDigestMatch;

  const result = {
    EXACT_MATCH: allMatch,
    direct,
    packaged,
    comparison: {
      verdictMatch, completenessMatch, instancesMatch, canonicalMatch,
      concernsMatch, observationsMatch, filesMatch, concernCountMatch,
      concernDigestMatch, findingDigestMatch,
    },
    conclusion: allMatch
      ? 'EXACT_MATCH — direct and packaged MCP produce identical semantic digests'
      : 'MISMATCH — semantic drift between direct and packaged MCP',
  };

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'direct-vs-packaged-equivalence.json');
  fs.writeFileSync(evidencePath, JSON.stringify(result, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`\n=== Equivalence Result ===`);
  console.error(`EXACT_MATCH: ${allMatch}`);
  console.error(`Concern digest match: ${concernDigestMatch}`);
  console.error(`Finding digest match: ${findingDigestMatch}`);
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
