/**
 * C2R Semgrep artifact identity — captures practical fingerprint of the
 * Semgrep installation used by the HAIEC MCP scanner.
 */
import { SemgrepResolver } from '../src/engines/ai-security/semgrep-resolver.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import * as crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  console.error('=== C2R Semgrep Artifact Identity ===');

  const resolver = new SemgrepResolver();
  const resolution = await resolver.resolve();

  const fingerprint: any = {
    semgrepVersion: resolution.version ?? 'unknown',
    executablePath: resolution.executablePath
      ? resolution.executablePath.replace(/C:\\Users\\[^\\]+/g, '<HAIEC_HOME>')
      : null,
    status: resolution.status,
    readiness: resolution.readiness,
    requiredVersion: resolution.requiredVersion,
    platform: process.platform,
    nodeVersion: process.version,
  };

  // Compute executable SHA-256 if available
  if (resolution.executablePath && fs.existsSync(resolution.executablePath)) {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(resolution.executablePath);
      for await (const chunk of stream) {
        hash.update(chunk);
      }
      fingerprint.executableSha256 = `sha256:${hash.digest('hex')}`;
    } catch (e) {
      fingerprint.executableSha256 = 'ERROR: could not hash executable';
    }
  } else {
    fingerprint.executableSha256 = null;
  }

  // Try to get package metadata
  try {
    const pipShow = execSync('pip show semgrep 2>nul', { encoding: 'utf-8', timeout: 10000 });
    fingerprint.pipPackageMetadata = pipShow.trim().split('\n').reduce((acc: Record<string, string>, line) => {
      const [k, ...v] = line.split(':');
      if (k && v.length) acc[k.trim()] = v.join(':').trim();
      return acc;
    }, {});
  } catch {
    fingerprint.pipPackageMetadata = 'NOT_AVAILABLE (not a pip install or pip not on PATH)';
  }

  // Try to get Python version
  try {
    fingerprint.pythonVersion = execSync('python --version 2>&1', { encoding: 'utf-8', timeout: 5000 }).trim();
  } catch {
    fingerprint.pythonVersion = 'NOT_AVAILABLE';
  }

  // Installation mechanism assessment
  const exePath = resolution.executablePath ?? '';
  if (exePath.includes('haiec') && exePath.includes('semgrep')) {
    fingerprint.installationMechanism = 'HAIEC-managed (setup script)';
  } else if (exePath.includes('venv') || exePath.includes('Scripts')) {
    fingerprint.installationMechanism = 'virtual environment';
  } else if (exePath.includes('AppData')) {
    fingerprint.installationMechanism = 'user installation (AppData)';
  } else {
    fingerprint.installationMechanism = 'system or PATH-based';
  }

  // Supply-chain verification disclaimer
  fingerprint.supplyChainDisclaimer = 'Executable SHA-256 provides tamper detection for the local installation. This is NOT a full supply-chain verification. Full verification requires reproducible builds from the Semgrep release pipeline.';

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'semgrep-fingerprint.json');
  fs.writeFileSync(evidencePath, JSON.stringify(fingerprint, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`Semgrep version: ${fingerprint.semgrepVersion}`);
  console.error(`Executable SHA-256: ${fingerprint.executableSha256}`);
  console.error(`Installation: ${fingerprint.installationMechanism}`);
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
