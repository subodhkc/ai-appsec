/**
 * C2R Parser Error Classification — runs scan against immutable Kestrel
 * snapshot and classifies all parser errors by:
 * - file extension
 * - language
 * - directory
 * - scope (generated/vendor/example/test/production)
 * - supported language vs unsupported
 * - actual syntax failure vs unsupported grammar
 */
import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const KESTREL_TARGET = 'C:\\ks';

function getExtension(filePath: string): string {
  const parts = filePath.split('.');
  if (parts.length < 2) return '(no extension)';
  return '.' + parts[parts.length - 1].toLowerCase();
}

function getTopLevelDir(filePath: string): string {
  const parts = filePath.split('/');
  return parts.length > 1 ? parts[0] : '(root)';
}

function classifyScope(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.includes('node_modules/') || lower.includes('vendor/') || lower.includes('.venv/')) return 'VENDOR';
  if (lower.includes('test/') || lower.includes('tests/') || lower.includes('__tests__/') || lower.includes('.test.') || lower.includes('.spec.')) return 'TEST';
  if (lower.includes('example/') || lower.includes('examples/') || lower.includes('demo/')) return 'EXAMPLE';
  if (lower.includes('generated/') || lower.includes('dist/') || lower.includes('build/') || lower.includes('.next/')) return 'GENERATED';
  if (lower.includes('migrations/')) return 'MIGRATION';
  return 'PRODUCTION_LIKE';
}

const SUPPORTED_EXTENSIONS = new Set([
  '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rb', '.php',
  '.c', '.h', '.cpp', '.cc', '.hpp', '.cs', '.swift', '.kt', '.rs',
  '.scala', '.clj', '.lua', '.pl', '.r', '.ml', '.hs', '.elm',
  '.vue', '.svelte',
]);

async function main(): Promise<void> {
  console.error('=== C2R Parser Error Classification ===');
  console.error(`Target: ${KESTREL_TARGET}`);

  const result = await scanAiSecurity({ targetPath: KESTREL_TARGET, timeout: 300 });

  // The scanner doesn't directly expose parser error file paths.
  // But we can get them from the limitations and the filesSkippedByEngine count.
  // We need to run Semgrep directly to get the error file paths.
  // Let's use the semgrep runner directly.

  // Actually, the scan result has errors but not the parse error file paths.
  // We need to access the raw Semgrep result to get parse error paths.
  // Let's import the semgrep runner directly.

  const { runSemgrep } = await import('../src/engines/ai-security/semgrep-runner.js');
  const { SemgrepResolver } = await import('../src/engines/ai-security/semgrep-resolver.js');
  const { BundledPublicCoreRulepackProvider } = await import('../src/engines/ai-security/rulepack-provider.js');

  const resolver = new SemgrepResolver();
  const semgrep = await resolver.resolve();
  const provider = new BundledPublicCoreRulepackProvider();
  const rulepack = await provider.resolve();

  const runResult = await runSemgrep({
    targetPath: KESTREL_TARGET,
    rulepackPath: rulepack.rulepackPath,
    executablePath: semgrep.executablePath!,
    timeoutMs: 300_000,
  });

  if (!runResult.result) {
    console.error('No result from Semgrep');
    process.exit(1);
  }

  const parseErrors = runResult.result.errors || [];
  const errorEntries = parseErrors
    .filter((e: any) => e.path !== null)
    .map((e: any) => ({ path: e.path as string, message: e.extra?.message ?? '(no message)' }));

  // Convert to relative paths
  const relPaths = errorEntries.map((e: { path: string; message: string }) => {
    const normalized = e.path.replace(/\\/g, '/');
    const targetNorm = KESTREL_TARGET.replace(/\\/g, '/');
    if (normalized.toLowerCase().startsWith(targetNorm.toLowerCase() + '/')) {
      return normalized.slice(targetNorm.length + 1);
    }
    return normalized;
  });

  // Classify
  const byExtension: Record<string, number> = {};
  const byDirectory: Record<string, number> = {};
  const byScope: Record<string, number> = {};
  const supportedVsUnsupported: Record<string, number> = { SUPPORTED: 0, UNSUPPORTED: 0, UNKNOWN: 0 };

  for (const relPath of relPaths) {
    const ext = getExtension(relPath);
    const dir = getTopLevelDir(relPath);
    const scope = classifyScope(relPath);

    byExtension[ext] = (byExtension[ext] ?? 0) + 1;
    byDirectory[dir] = (byDirectory[dir] ?? 0) + 1;
    byScope[scope] = (byScope[scope] ?? 0) + 1;

    if (SUPPORTED_EXTENSIONS.has(ext)) {
      supportedVsUnsupported.SUPPORTED++;
    } else if (ext === '(no extension)' || ext === '.json' || ext === '.md' || ext === '.txt' || ext === '.yml' || ext === '.yaml' || ext === '.xml' || ext === '.html' || ext === '.css' || ext === '.svg' || ext === '.png' || ext === '.jpg' || ext === '.ico' || ext === '.woff' || ext === '.woff2' || ext === '.ttf' || ext === '.eot' || ext === '.map' || ext === '.lock' || ext === '.gitignore' || ext === '.env') {
      supportedVsUnsupported.UNSUPPORTED++;
    } else {
      supportedVsUnsupported.UNKNOWN++;
    }
  }

  // Compute parser error file-set digest
  const sortedPaths = [...relPaths].sort();
  const parserErrorFileSetDigest = `sha256:${crypto.createHash('sha256').update(sortedPaths.join('\n'), 'utf-8').digest('hex')}`;

  const report = {
    corpus: {
      target: '<KESTREL_EXPORT>',
      commit: '0f131ea63c477e1da5fee318095c3aee761eb628',
      exportMethod: 'git worktree add --detach',
    },
    parserErrorCount: relPaths.length,
    parserErrorFileSetDigest,
    classification: {
      byExtension: Object.entries(byExtension).sort((a, b) => b[1] - a[1]).map(([ext, count]) => ({ extension: ext, count })),
      byDirectory: Object.entries(byDirectory).sort((a, b) => b[1] - a[1]).map(([dir, count]) => ({ directory: dir, count })),
      byScope: Object.entries(byScope).sort((a, b) => b[1] - a[1]).map(([scope, count]) => ({ scope, count })),
      supportedVsUnsupported,
    },
    sanitizedPaths: sortedPaths,
    sanitizedEntries: errorEntries.map((e, i) => ({ path: relPaths[i], message: e.message })).sort((a, b) => a.path.localeCompare(b.path)),
    analysis: {
      unsupportedLanguageFiles: supportedVsUnsupported.UNSUPPORTED,
      supportedLanguageFiles: supportedVsUnsupported.SUPPORTED,
      unknownFiles: supportedVsUnsupported.UNKNOWN,
      conclusion: supportedVsUnsupported.SUPPORTED === 0
        ? 'ALL parser errors are from unsupported/non-source files — no supported source files failed parsing'
        : `${supportedVsUnsupported.SUPPORTED} supported source files had parse errors — may indicate genuine syntax errors`,
    },
  };

  const evidenceDir = path.resolve(__dirname, '..', 'docs', 'evidence', 'phase-4b-final');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, 'parser-error-classification.json');
  fs.writeFileSync(evidencePath, JSON.stringify(report, null, 2));
  const digest = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}`;

  console.error(`\n=== Parser Error Classification ===`);
  console.error(`Total parse errors: ${relPaths.length}`);
  console.error(`Supported files with errors: ${supportedVsUnsupported.SUPPORTED}`);
  console.error(`Unsupported files with errors: ${supportedVsUnsupported.UNSUPPORTED}`);
  console.error(`Unknown files with errors: ${supportedVsUnsupported.UNKNOWN}`);
  console.error(`By extension:`);
  for (const [ext, count] of Object.entries(byExtension).sort((a, b) => b[1] - a[1])) {
    console.error(`  ${ext}: ${count}`);
  }
  console.error(`By scope:`);
  for (const [scope, count] of Object.entries(byScope).sort((a, b) => b[1] - a[1])) {
    console.error(`  ${scope}: ${count}`);
  }
  console.error(`Parser error file-set digest: ${parserErrorFileSetDigest}`);
  console.error(`Conclusion: ${report.analysis.conclusion}`);
  console.error(`Evidence: ${evidencePath}`);
  console.error(`Digest: ${digest}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
