/**
 * Private-bundle smoke test — runs scan_ai_security through the MCP path
 * against real repositories using the gitignored private rc.5 bundle.
 *
 * This script is NOT a test runner test. It's a manual smoke test.
 * Run with: npx tsx scripts/private-bundle-smoke.ts
 */
import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

async function runSmoke() {
  const rulepackPath = process.env.HAIEC_RULEPACK_PATH;
  const manifestPath = process.env.HAIEC_MANIFEST_PATH;
  const semgrepPath = process.env.HAIEC_SEMGREP_PATH;

  if (!rulepackPath || !manifestPath) {
    console.error('Set HAIEC_RULEPACK_PATH and HAIEC_MANIFEST_PATH');
    process.exit(1);
  }

  const repos = [
    { name: 'together-python (small)', path: '.private-rule-staging/real-repos/together-python', timeout: 120000 },
    { name: 'anthropic-sdk-python (medium)', path: '.private-rule-staging/real-repos/anthropic-sdk-python', timeout: 120000 },
    { name: 'anthropic-sdk-typescript (medium)', path: '.private-rule-staging/real-repos/anthropic-sdk-typescript', timeout: 120000 },
  ];

  for (const repo of repos) {
    console.log(`\n=== ${repo.name} ===`);
    const targetPath = path.resolve(REPO_ROOT, repo.path);
    try {
      const result = await scanAiSecurity(
        { targetPath, timeoutMs: repo.timeout },
        { semgrepPath },
      );
      console.log(JSON.stringify({
        verdict: result.verdict,
        completeness: result.completeness,
        summary: {
          actionableTotal: result.summary.actionableTotal,
          vulnerabilityTotal: result.summary.vulnerabilityTotal,
          controlGapTotal: result.summary.controlGapTotal,
          riskSignalTotal: result.summary.riskSignalTotal,
          presenceTotal: result.summary.presenceTotal,
          rawFindingCount: result.summary.rawFindingCount,
        },
        versions: {
          rulepack: result.versions.rulepackVersion,
          rulepackDigest: result.versions.rulepackDigest.slice(0, 20) + '...',
          semgrep: result.versions.semgrepVersion,
        },
        truncation: result.truncation,
        errors: result.errors.slice(0, 3),
        limitations: result.limitations,
      }, null, 2));
    } catch (e) {
      console.error(`Failed: ${(e as Error).message}`);
    }
  }
}

runSmoke().catch(console.error);
