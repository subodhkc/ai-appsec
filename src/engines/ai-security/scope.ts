/**
 * Target scope — implements the Phase 2C target-scope contract.
 *
 * Separates DEFAULT_PRODUCTION_SCOPE from OPTIONAL_EXTENDED_SCOPE.
 * Determines which paths are scanned by default vs excluded.
 *
 * Path classes:
 * - DEFAULT_INCLUDE: application source, server code, API routes, etc.
 * - DEFAULT_EXCLUDE: tests, examples, docs, fixtures, generated, vendor, build, etc.
 * - INCLUDE_FOR_SPECIFIC_CHECKS: VULNERABILITY and secrets detectors still scan
 *   tests/docs/examples because users copy code from them.
 */
/** Scope mode for a scan. */
export type ScopeMode = 'DEFAULT_PRODUCTION' | 'EXTENDED_SECURITY';

/** Path classification result. */
export interface PathClassification {
  readonly scope: 'PRODUCTION' | 'NON_PRODUCTION';
  readonly reason: string;
}

/** Default exclude patterns — applied to all scans. */
const ALWAYS_EXCLUDED: readonly string[] = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  'out/**',
  '.next/**',
  '.output/**',
  'coverage/**',
  '.nyc_output/**',
  '__pycache__/**',
  '.cache/**',
  '.parcel-cache/**',
  '**/*.min.js',
  '**/*.min.ts',
  '**/*.min.css',
  '**/__snapshots__/**',
  '**/*.snap',
  'vendor/**',
  'third_party/**',
  'external/**',
  '**/generated/**',
  '**/gen/**',
  '**/autogen/**',
  '**/*.generated.*',
];

/**
 * Get only the essential excludes for Semgrep.
 * These are passed to Semgrep's --exclude flag.
 *
 * We keep this list minimal because Semgrep 1.173.0 has a glob parser
 * limitation that causes "Failed to obtain target files from semgrep-core"
 * errors when too many --exclude patterns are used (especially patterns
 * with multiple ** segments).
 *
 * Non-production patterns (tests, docs, examples) and fine-grained
 * always-excluded patterns (min files, snapshots, generated code) are
 * handled in post-processing scope filtering instead.
 */
export function getSemgrepExcludes(): readonly string[] {
  return [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '__pycache__',
    '.cache',
    'vendor',
    'third_party',
  ];
}

/** Non-production patterns — excluded in DEFAULT_PRODUCTION, included in EXTENDED_SECURITY. */
const NON_PRODUCTION_PATTERNS: readonly string[] = [
  'test/**',
  'tests/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/test_*',
  'examples/**',
  'example/**',
  '**/examples/**',
  'docs/**',
  'fixtures/**',
  '__fixtures__/**',
  'benchmark/**',
  'benchmarks/**',
];

/**
 * Get Semgrep exclude patterns for the given scope mode.
 */
export function getExcludePatterns(mode: ScopeMode): readonly string[] {
  if (mode === 'EXTENDED_SECURITY') {
    // Extended scope: only exclude always-excluded paths
    return ALWAYS_EXCLUDED;
  }
  // Default production scope: exclude always-excluded + non-production
  return [...ALWAYS_EXCLUDED, ...NON_PRODUCTION_PATTERNS];
}

/**
 * Classify a file path as production or non-production.
 */
export function classifyPath(relativePath: string): PathClassification {
  const normalized = relativePath.replace(/\\/g, '/');

  // Check always-excluded
  for (const pattern of ALWAYS_EXCLUDED) {
    if (matchPattern(normalized, pattern)) {
      return { scope: 'PRODUCTION', reason: 'always-excluded (generated/vendor/build)' };
    }
  }

  // Check non-production patterns
  for (const pattern of NON_PRODUCTION_PATTERNS) {
    if (matchPattern(normalized, pattern)) {
      return { scope: 'NON_PRODUCTION', reason: `matches non-production pattern: ${pattern}` };
    }
  }

  return { scope: 'PRODUCTION', reason: 'production source' };
}

/**
 * Determine if a finding should be included based on scope mode and finding kind.
 *
 * In DEFAULT_PRODUCTION mode, VULNERABILITY findings from non-production paths
 * are still included (users copy from docs/examples).
 */
export function shouldIncludeFinding(
  relativePath: string,
  findingKind: 'PRESENCE' | 'RISK_SIGNAL' | 'CONTROL_GAP' | 'VULNERABILITY',
  mode: ScopeMode,
): boolean {
  if (mode === 'EXTENDED_SECURITY') return true;

  const classification = classifyPath(relativePath);
  if (classification.scope === 'PRODUCTION') return true;

  // Non-production path in DEFAULT_PRODUCTION mode:
  // Include VULNERABILITY findings (users copy from docs/examples)
  // Include secrets-related findings (real secrets in test files matter)
  if (findingKind === 'VULNERABILITY') return true;

  // Exclude other finding kinds from non-production paths
  return false;
}

/**
 * Simple glob pattern matcher (supports ** and *).
 */
function matchPattern(filePath: string, pattern: string): boolean {
  // Escape regex special chars first (except * and ?)
  let regexStr = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  // Convert globstar ** to placeholder
  regexStr = regexStr.replace(/\*\*/g, '{{GLOBSTAR}}');
  // Convert single * to [^/]*
  regexStr = regexStr.replace(/\*/g, '[^/]*');
  // Convert ? to [^/]
  regexStr = regexStr.replace(/\?/g, '[^/]');
  // Restore globstar
  regexStr = regexStr.replace(/{{GLOBSTAR}}/g, '.*');
  const regex = new RegExp(`(^|/)${regexStr}($|/)`, 'i');
  return regex.test(filePath);
}

/**
 * Get the scope label for a finding.
 */
export function getFindingScope(
  relativePath: string,
  mode: ScopeMode,
): 'PRODUCTION' | 'NON_PRODUCTION' {
  if (mode === 'EXTENDED_SECURITY') return 'PRODUCTION';
  return classifyPath(relativePath).scope;
}
