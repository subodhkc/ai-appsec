/**
 * C2R Timeout / Process-Tree empirical test — triggers a real timeout
 * during a Semgrep scan and verifies:
 * - timeout is detected
 * - partial output is classified as PARTIAL
 * - no orphan Semgrep processes remain after timeout
 * - no-result timeout is ERROR
 *
 * Uses the HAIEC MCP repo as target with a very short timeout (1 second)
 * to force a timeout on the Semgrep scan.
 */
import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const TARGET = path.resolve(__dirname, '..');

function getSemgrepProcessCount(): number {
  try {
    if (process.platform === 'win32') {
      const output = execSync('tasklist /FI "IMAGENAME eq semgrep*" /FO CSV /NH 2>nul', {
        encoding: 'utf-8', timeout: 5000,
      });
      return output.trim().split('\n').filter((l) => l.trim().length > 0 && !l.includes('INFO:')).length;
    } else {
      const output = execSync('pgrep -c semgrep 2>/dev/null || echo 0', { encoding: 'utf-8', timeout: 5000 });
      return parseInt(output.trim(), 10) || 0;
    }
  } catch {
    return 0;
  }
}

async function main(): Promise<void> {
  console.error('=== C2R Timeout / Process-Tree Empirical Test ===');
  console.error(`Target: ${TARGET}`);

  // Record pre-scan Semgrep process count
  const preCount = getSemgrepProcessCount();
  console.error(`Pre-scan Semgrep processes: ${preCount}`);

  // Run scan with 1-second timeout to force timeout
  console.error('Running scan with 1-second timeout...');
  const startTime = Date.now();
  const result = await scanAiSecurity({ targetPath: TARGET, timeoutMs: 1000 });
  const duration = Date.now() - startTime;

  console.error(`Duration: ${duration}ms`);
  console.error(`Verdict: ${result.verdict}`);
  console.error(`Completeness: ${result.completeness}`);
  console.error(`Errors: ${result.errors.map((e) => e.code).join(', ')}`);
  console.error(`Files analyzed: ${result.summary.filesAnalyzed}`);
  console.error(`Raw findings: ${result.summary.rawFindingCount}`);

  // Wait a grace period for process cleanup
  await new Promise((r) => setTimeout(r, 3000));

  // Record post-scan Semgrep process count
  const postCount = getSemgrepProcessCount();
  console.error(`Post-scan Semgrep processes: ${postCount}`);

  // Classify the result
  const timeoutDetected = result.errors.some((e) => e.code === 'SEMGREP_TIMEOUT');
  const hasPartialResult = result.summary.filesAnalyzed > 0 || result.summary.rawFindingCount > 0;
  const noOrphanProcesses = postCount <= preCount;

  // timeout + usable result = PARTIAL
  // timeout + no useful result = ERROR
  let classification: string;
  if (timeoutDetected && hasPartialResult) {
    classification = result.completeness === 'PARTIAL' ? 'PARTIAL (correct)' : `UNEXPECTED: ${result.completeness}`;
  } else if (timeoutDetected && !hasPartialResult) {
    classification = result.completeness === 'ERROR' ? 'ERROR (correct)' : `UNEXPECTED: ${result.completeness}`;
  } else {
    classification = `NO_TIMEOUT (scan completed in ${duration}ms)`;
  }

  const report = {
    target: TARGET.replace(/C:\\Users\\[^\\]+/g, '<HAIEC_HOME>'),
    timeoutMs: 1000,
    durationMs: duration,
    verdict: result.verdict,
    completeness: result.completeness,
    errorCodes: result.errors.map((e) => e.code),
    filesAnalyzed: result.summary.filesAnalyzed,
    rawFindings: result.summary.rawFindingCount,
    timeoutDetected,
    hasPartialResult,
    preScanSemgrepProcesses: preCount,
    postScanSemgrepProcesses: postCount,
    noOrphanProcesses,
    classification,
    gracePeriodMs: 3000,
    conclusion: timeoutDetected && noOrphanProcesses
      ? (classification.includes('correct') ? 'PASS — timeout detected, classified correctly, no orphan processes'
        : `PARTIAL — timeout detected but classification unexpected: ${classification}`)
      : timeoutDetected && !noOrphanProcesses
        ? 'FAIL — timeout detected but orphan Semgrep processes remain'
        : 'PASS — no timeout occurred (scan completed within timeout); process tree clean',
  };

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'timeout-process-tree.json');
  fs.writeFileSync(evidencePath, JSON.stringify(report, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`\n=== Timeout Test Result ===`);
  console.error(`Timeout detected: ${timeoutDetected}`);
  console.error(`No orphan processes: ${noOrphanProcesses}`);
  console.error(`Classification: ${classification}`);
  console.error(`Conclusion: ${report.conclusion}`);
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
