/**
 * C2R RECONCILIATION Evidence Index Generator — builds the final
 * evidence index AFTER all evidence artifacts are final.
 */
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');

interface EvidenceEntry {
  file: string;
  digest: string;
  size: number;
  status: 'ACTIVE' | 'SUPERSEDED';
  supersededBy?: string;
  description: string;
}

function computeDigest(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function main(): void {
  const entries: EvidenceEntry[] = [];

  const activeFiles: Array<{ file: string; description: string }> = [
    { file: 'kestrel-full-forensics.json', description: 'Full unbounded Kestrel forensics (post-rule-fix, immutable snapshot)' },
    { file: 'parser-error-classification.json', description: 'Parser error classification (102 errors, all Semgrep limitations)' },
    { file: 'kestrel-export-manifest.txt', description: 'Kestrel immutable export file-set manifest (5528 files)' },
    { file: 'kestrel-three-run-determinism.json', description: 'Three-run Kestrel determinism on immutable snapshot (finding-level PASS)' },
    { file: 'direct-vs-tarball-equivalence.json', description: 'Direct vs actual npm tarball equivalence (EXACT_MATCH)' },
    { file: 'timeout-process-tree.json', description: 'Timeout/process-tree empirical test (unchanged from prior C2R)' },
    { file: 'semgrep-fingerprint.json', description: 'Semgrep fingerprint (unchanged from prior C2R)' },
    { file: 'evidence-sanitization-report.md', description: 'Evidence sanitization report (unchanged from prior C2R)' },
    { file: 'offline-validation-report.md', description: 'Offline validation report (unchanged from prior C2R)' },
    { file: 'reuse-audit.md', description: 'Reuse/abandonment audit (unchanged from prior C2R)' },
    { file: 'product-unification-defects.md', description: 'Product-unification defects (unchanged from prior C2R)' },
    { file: 'PHASE-4B-EVIDENCE-SUMMARY.md', description: 'Phase 4B evidence summary (C2R RECONCILIATION)' },
  ];

  const supersededFiles: Array<{ file: string; supersededBy: string; description: string }> = [
    { file: 'kestrel-qualification.json', supersededBy: 'kestrel-full-forensics.json', description: 'Prior Kestrel qualification (dirty working tree, pre-rule-fix)' },
    { file: 'kestrel-qualification-report.md', supersededBy: 'PHASE-4B-EVIDENCE-SUMMARY.md', description: 'Prior Kestrel qualification report (dirty working tree)' },
    { file: 'three-run-determinism.json', supersededBy: 'kestrel-three-run-determinism.json', description: 'Prior three-run determinism (MCP repo, not Kestrel)' },
    { file: 'direct-vs-packaged-equivalence.json', supersededBy: 'direct-vs-tarball-equivalence.json', description: 'Prior direct-vs-packaged equivalence (built package, not tarball)' },
  ];

  for (const { file, description } of activeFiles) {
    const filePath = path.join(evidenceDir, file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      entries.push({
        file,
        digest: computeDigest(filePath),
        size: stat.size,
        status: 'ACTIVE',
        description,
      });
    }
  }

  for (const { file, supersededBy, description } of supersededFiles) {
    const filePath = path.join(evidenceDir, file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      entries.push({
        file,
        digest: computeDigest(filePath),
        size: stat.size,
        status: 'SUPERSEDED',
        supersededBy,
        description,
      });
    }
  }

  const index = {
    generatedAt: new Date().toISOString(),
    phase: '4B-C2R RECONCILIATION',
    status: 'TECHNICALLY_READY_FOR_PHASE_4C',
    rulepackVersion: '0.1.0-rc.6-public-core',
    rulepackDigest: 'sha256:013e2da09d22ceb9786109a2c04f82a80288213a42427d85c1a301ad5640289e',
    manifestDigest: 'sha256:6d68142fd91210fbd5da4c802ad3f3613c45e4bb0ae595444a00991f22724699',
    tarballSha256: 'sha256:5dd04958dfa89b2c94961afbfe3fb424ec18737a1d96b183f7c3121c1cebc903',
    kestrelCommit: '0f131ea63c477e1da5fee318095c3aee761eb628',
    kestrelExportMethod: 'git worktree add --detach',
    kestrelFileSetDigest: 'sha256:c6b73e45046c40454c2f3ad985a4c1ff18833197a4df4c565d5c5df0cb72a5b2',
    accountingInvariants: {
      I1_rawEqualsAcceptedPlusUnmapped: true,
      I2_acceptedEqualsCanonicalPlusDupes: true,
      I3_canonicalEqualsScopedPlusSuppressed: true,
      I4_scopedEqualsActionablePlusObservations: true,
      I5_concernSumEqualsActionable: true,
    },
    kestrelScanResults: {
      rawEngineMatches: 859,
      detectorInstancesAccepted: 859,
      canonicalFindingInstances: 859,
      scopedFindingInstances: 848,
      actionableFindingInstances: 798,
      observationInstances: 50,
      concernFamiliesFound: 13,
      parserErrors: 102,
      verdict: 'REVIEW',
      completeness: 'PARTIAL',
    },
    testResults: {
      typecheck: 'PASS',
      tests: 239,
      failures: 0,
      npmAudit: '0 vulnerabilities',
      privateTrue: true,
    },
    phase4CBlockers: [
      'Offline firewall-level isolation test (PARTIALLY_VERIFIED)',
      'Remote Linux/macOS empirical testing (UNVERIFIED)',
      'Final legal/provenance review (pending)',
      'Remove private:true for publication (pending)',
      'npm publication decision (pending)',
      'MCP Registry decision (pending)',
    ],
    entries,
  };

  const indexPath = path.join(evidenceDir, 'evidence-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  const indexDigest = computeDigest(indexPath);

  console.error(`Evidence index: ${indexPath}`);
  console.error(`Digest: ${indexDigest}`);
  console.error(`Entries: ${entries.length} (${entries.filter(e => e.status === 'ACTIVE').length} ACTIVE, ${entries.filter(e => e.status === 'SUPERSEDED').length} SUPERSEDED)`);
}

main();
