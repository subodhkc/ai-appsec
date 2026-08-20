/**
 * C2R Evidence Index generator — enumerates all evidence artifacts,
 * computes SHA-256 for each, and builds the final evidence index.
 *
 * This is the LAST phase artifact. It must be generated after all other
 * evidence exists and is sanitized.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import * as crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

interface EvidenceArtifact {
  readonly fileName: string;
  readonly relativePath: string;
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly sanitized: boolean;
}

interface EvidenceIndex {
  readonly schemaVersion: string;
  readonly generatedAt: string;
  readonly phase: string;
  readonly artifacts: readonly EvidenceArtifact[];
  readonly artifactCount: number;
  readonly totalSizeBytes: number;
  readonly evidenceIndexDigest: string;
}

function computeSha256(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function main(): void {
  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  const archDir = path.resolve(__dirname, '..', 'docs', 'architecture');

  const artifacts: EvidenceArtifact[] = [];

  // Evidence artifacts
  for (const file of fs.readdirSync(evidenceDir).sort()) {
    const fullPath = path.join(evidenceDir, file);
    if (!fs.statSync(fullPath).isFile()) continue;
    if (file === 'evidence-index.json') continue; // don't index the index itself

    const hash = computeSha256(fullPath);
    artifacts.push({
      fileName: file,
      relativePath: `docs/evidence/phase-4b-final/${file}`,
      sizeBytes: fs.statSync(fullPath).size,
      sha256: `sha256:${hash}`,
      sanitized: true,
    });
  }

  // Architecture artifacts
  for (const file of fs.readdirSync(archDir).sort()) {
    const fullPath = path.join(archDir, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    const hash = computeSha256(fullPath);
    artifacts.push({
      fileName: file,
      relativePath: `docs/architecture/${file}`,
      sizeBytes: fs.statSync(fullPath).size,
      sha256: `sha256:${hash}`,
      sanitized: true,
    });
  }

  // Compute evidence index digest (over all artifact digests)
  const digestInput = artifacts
    .map((a) => `${a.relativePath}|${a.sha256}`)
    .sort()
    .join('\n');
  const evidenceIndexDigest = `sha256:${crypto.createHash('sha256').update(digestInput, 'utf-8').digest('hex')}`;

  const index: EvidenceIndex = {
    schemaVersion: 'haiec-evidence-index/1.0',
    generatedAt: new Date().toISOString(),
    phase: '4B-C2R-FINAL',
    artifacts,
    artifactCount: artifacts.length,
    totalSizeBytes: artifacts.reduce((s, a) => s + a.sizeBytes, 0),
    evidenceIndexDigest,
  };

  const indexPath = path.join(evidenceDir, 'evidence-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.error(`Evidence index written to: ${indexPath}`);
  console.error(`Artifact count: ${artifacts.length}`);
  console.error(`Total size: ${index.totalSizeBytes} bytes`);
  console.error(`Evidence index digest: ${evidenceIndexDigest}`);
}

main();
