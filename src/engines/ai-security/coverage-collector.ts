/**
 * Coverage collector — derives coverage file sets from the filesystem
 * and Semgrep execution results.
 *
 * Implements HAIEC Coverage Contract v0.1.1:
 *
 *   DISCOVERED = INTENTIONALLY_EXCLUDED + UNSUPPORTED + TARGETED
 *   (mutually exclusive pre-engine partition)
 *
 *   ENGINE_REPORTED_SCANNED = files Semgrep reports in paths.scanned
 *   PARSE_FAILED = files Semgrep reports in errors[].path
 *   SUCCESSFULLY_ANALYZED = ENGINE_REPORTED_SCANNED - PARSE_FAILED
 *   (empirically proven: PARSE_FAILED ⊆ ENGINE_REPORTED_SCANNED)
 *
 * Engine outcome sets may overlap with each other but are separate
 * from the pre-engine partition. We do NOT claim
 * TARGETED = ENGINE_REPORTED_SCANNED + PARSE_FAILED.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { getSemgrepExcludes } from './scope.js';

/** Supported language extensions for HAIEC AI security rules. */
export const SUPPORTED_EXTENSIONS = new Set([
  '.py', '.js', '.jsx', '.ts', '.tsx',
]);

/** Coverage file sets derived from filesystem + Semgrep results. */
export interface CoverageFileSets {
  /** DISCOVERED: all files from filesystem walk beneath target. */
  readonly discoveredFilePaths: readonly string[];
  /** INTENTIONALLY_EXCLUDED: discovered files matching HAIEC exclude patterns. */
  readonly intentionallyExcludedFilePaths: readonly string[];
  /** UNSUPPORTED: discovered, non-excluded files with unsupported extensions. */
  readonly unsupportedFilePaths: readonly string[];
  /** TARGETED: discovered, non-excluded, supported files HAIEC intends to evaluate. */
  readonly targetedFilePaths: readonly string[];
  /** ENGINE_REPORTED_SCANNED: files Semgrep reports in paths.scanned. */
  readonly engineReportedScannedFilePaths: readonly string[];
  /** PARSE_FAILED: files Semgrep reports in errors[].path. */
  readonly parseFailureFilePaths: readonly string[];
  /** SUCCESSFULLY_ANALYZED: ENGINE_REPORTED_SCANNED - PARSE_FAILED (derived). */
  readonly successfullyAnalyzedFilePaths: readonly string[];
}

/**
 * Walk the filesystem to collect all files under a root directory.
 * Returns repository-relative paths (relative to root).
 */
function walkDirectory(root: string): string[] {
  const results: string[] = [];
  const stack: string[] = [root];

  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relativePath = path.relative(root, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        results.push(relativePath);
      }
    }
  }

  return results.sort();
}

/**
 * Check if a relative path matches any exclude pattern.
 */
function matchesExcludePattern(relativePath: string, patterns: readonly string[]): boolean {
  const normalizedPath = relativePath.replace(/\\/g, '/');

  for (const pattern of patterns) {
    const regexStr = pattern
      .replace(/\*\*/g, '<<DOUBLESTAR>>')
      .replace(/\*/g, '[^/]*')
      .replace(/<<DOUBLESTAR>>/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp('^' + regexStr + '$');
    if (regex.test(normalizedPath)) return true;

    const dirPattern = pattern.replace(/\/\*\*$/, '');
    if (normalizedPath.startsWith(dirPattern + '/')) return true;
  }
  return false;
}

/**
 * Derive all coverage file sets from the filesystem and Semgrep results.
 *
 * Pre-engine partition (mutually exclusive):
 *   DISCOVERED = INTENTIONALLY_EXCLUDED + UNSUPPORTED + TARGETED
 *
 * Engine outcome sets (may overlap with each other):
 *   ENGINE_REPORTED_SCANNED, PARSE_FAILED
 *
 * Derived:
 *   SUCCESSFULLY_ANALYZED = ENGINE_REPORTED_SCANNED - PARSE_FAILED
 */
export function collectCoverageFileSets(
  targetRoot: string,
  engineReportedScannedPaths: readonly string[],
  parseFailurePaths: readonly string[],
  _scopeMode: string,
): CoverageFileSets {
  // Resolve targetRoot to canonical form to handle Windows short-name vs long-name paths
  let resolvedRoot = targetRoot;
  try { resolvedRoot = fs.realpathSync(targetRoot); } catch { /* use as-is */ }

  const toRelative = (p: string): string => {
    if (!p) return p;
    try {
      // Try resolving the input path to canonical form too
      let resolvedP = p;
      try { resolvedP = fs.realpathSync(p); } catch { /* use as-is */ }
      const rel = path.relative(resolvedRoot, resolvedP).replace(/\\/g, '/');
      if (rel === '' || rel === '.') return '.';
      // If path.relative returns an absolute path, the input was outside root
      if (path.isAbsolute(rel)) {
        // Fallback: try string-based normalization
        const normP = p.replace(/\\/g, '/');
        const normRoot = resolvedRoot.replace(/\\/g, '/').replace(/\/$/, '');
        if (normP.startsWith(normRoot + '/')) return normP.slice(normRoot.length + 1);
        return normP;
      }
      return rel;
    } catch {
      return p.replace(/\\/g, '/');
    }
  };

  const engineScannedRelative = engineReportedScannedPaths.map(toRelative).filter((p) => p && p !== '.').sort();
  const parseFailureRelative = parseFailurePaths.map(toRelative).filter((p) => p && p !== '.').sort();

  // DISCOVERED: all files from filesystem walk
  const discovered = walkDirectory(targetRoot);

  // Pre-engine partition (mutually exclusive)
  const excludePatterns = getSemgrepExcludes();
  const intentionallyExcluded: string[] = [];
  const unsupported: string[] = [];
  const targeted: string[] = [];

  for (const file of discovered) {
    if (matchesExcludePattern(file, excludePatterns)) {
      intentionallyExcluded.push(file);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        targeted.push(file);
      } else {
        unsupported.push(file);
      }
    }
  }

  // SUCCESSFULLY_ANALYZED = ENGINE_REPORTED_SCANNED - PARSE_FAILED
  const parseFailureSet = new Set(parseFailureRelative);
  const successfullyAnalyzed = engineScannedRelative.filter((p) => !parseFailureSet.has(p));

  return {
    discoveredFilePaths: discovered.sort(),
    intentionallyExcludedFilePaths: intentionallyExcluded.sort(),
    unsupportedFilePaths: unsupported.sort(),
    targetedFilePaths: targeted.sort(),
    engineReportedScannedFilePaths: engineScannedRelative,
    parseFailureFilePaths: parseFailureRelative,
    successfullyAnalyzedFilePaths: successfullyAnalyzed,
  };
}

/**
 * Coverage contract version — bumped to 0.1.1 for ontology correction.
 * v0.1.0 had contradictory TARGETED/UNSUPPORTED definitions.
 * v0.1.1 fixes: DISCOVERED = EXCLUDED + UNSUPPORTED + TARGETED (mutually exclusive),
 *   engine sets documented separately, SUCCESSFULLY_ANALYZED derived.
 */
export const COVERAGE_CONTRACT_VERSION = '0.1.1';

/**
 * Compute a scope policy digest from the exclude patterns and scope mode.
 */
export function computeScopePolicyDigest(scopeMode: string): string {
  const excludes = getSemgrepExcludes();
  const canonical = JSON.stringify({
    scopeMode,
    excludes: excludes.slice().sort(),
  });
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}
