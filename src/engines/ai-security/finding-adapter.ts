/**
 * Finding adapter — converts raw Semgrep findings into HAIEC normalized findings.
 *
 * - Resolves detectorId through the canonical manifest
 * - Maps raw severity to canonical severity (from manifest, NOT from Semgrep)
 * - Classifies unknown detectors as RULEPACK_MANIFEST_MISMATCH
 * - Computes evidence hashes
 * - Sanitizes paths to repository-relative
 */
import { createHash } from 'node:crypto';
import * as path from 'node:path';
import type {
  RawSemgrepFinding,
  NormalizedFinding,
  RulepackManifest,
  DetectorManifest,
  SecurityCheckManifest,
} from './types.js';
import { redactSecrets } from '../../security/secret-redaction.js';

/**
 * Map manifest severity values to the canonical HAIEC severity enum.
 *
 * The manifest may use ERROR/WARNING (Semgrep-style) or CRITICAL/HIGH/MEDIUM/LOW/INFO.
 * The canonical HAIEC output schema requires CRITICAL|HIGH|MEDIUM|LOW|INFO.
 */
function mapSeverity(raw: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' {
  switch (raw.toUpperCase()) {
    case 'CRITICAL': return 'CRITICAL';
    case 'ERROR': return 'CRITICAL';   // ERROR → CRITICAL
    case 'HIGH': return 'HIGH';
    case 'WARNING': return 'MEDIUM';   // WARNING → MEDIUM
    case 'MEDIUM': return 'MEDIUM';
    case 'LOW': return 'LOW';
    case 'INFO': return 'INFO';
    case 'INFORMATIONAL': return 'INFO';
    default: return 'INFO';            // Unknown → INFO (safe default)
  }
}

export interface AdapterResult {
  readonly findings: readonly NormalizedFinding[];
  readonly unknownDetectors: readonly string[];
  readonly manifestMismatch: boolean;
}

/**
 * Convert raw Semgrep findings into normalized HAIEC findings.
 *
 * @param rawFindings - Raw Semgrep results
 * @param manifest - Canonical rulepack manifest
 * @param targetRoot - Absolute path to the scan target root
 * @param scopeMode - Current scope mode (for path classification)
 * @param getScope - Function to determine finding scope
 */
export function adaptFindings(
  rawFindings: readonly RawSemgrepFinding[],
  manifest: RulepackManifest,
  targetRoot: string,
  getScope: (relativePath: string) => 'PRODUCTION' | 'NON_PRODUCTION',
): AdapterResult {
  // Build detector -> securityCheck lookup
  const detectorMap = new Map<string, DetectorManifest>();
  for (const det of manifest.detectors) {
    detectorMap.set(det.detectorId, det);
  }

  // Build securityCheck lookup
  const checkMap = new Map<string, SecurityCheckManifest>();
  for (const check of manifest.securityChecks) {
    checkMap.set(check.securityCheckId, check);
  }

  const findings: NormalizedFinding[] = [];
  const unknownDetectors = new Set<string>();
  let manifestMismatch = false;

  for (const raw of rawFindings) {
    // Strip config-name prefix if present (Semgrep prepends the config directory name)
    // e.g., "mvp-rc5.ai-sdk-together-python" → "ai-sdk-together-python"
    // Try: full check_id first, then stripped version
    const strippedId = stripConfigPrefix(raw.check_id);
    const detector = detectorMap.get(raw.check_id) ?? detectorMap.get(strippedId);
    const detectorId = detector ? detector.detectorId : strippedId;

    if (!detector) {
      unknownDetectors.add(detectorId);
      manifestMismatch = true;
      continue; // Skip unknown detectors — do not invent metadata
    }

    const securityCheck = detector.securityCheckId
      ? checkMap.get(detector.securityCheckId)
      : null;

    if (!securityCheck) {
      unknownDetectors.add(detectorId);
      manifestMismatch = true;
      continue;
    }

    // Convert path to repository-relative
    const relativePath = toRelativePath(raw.path, targetRoot);

    // Compute evidence hash (deterministic, no timestamps)
    const evidenceInput = `${detectorId}|${relativePath}|${raw.start.line}|${raw.start.col}|${raw.end.line}|${raw.end.col}`;
    const evidenceHash = createHash('sha256').update(evidenceInput, 'utf-8').digest('hex').slice(0, 16);

    // Sanitize message (redact any secrets that might appear)
    const { redacted: sanitizedMessage } = redactSecrets(raw.extra.message);

    findings.push({
      securityCheckId: securityCheck.securityCheckId,
      canonicalName: securityCheck.canonicalName,
      findingKind: securityCheck.findingKind,
      canonicalSeverity: mapSeverity(securityCheck.canonicalSeverity),
      defaultDisposition: securityCheck.defaultDisposition,
      relativePath,
      startLine: raw.start.line,
      startColumn: raw.start.col,
      endLine: raw.end.line,
      endColumn: raw.end.col,
      detectorIds: [detectorId],
      message: sanitizedMessage,
      evidenceHash,
      remediationClass: securityCheck.remediationClass,
      scope: getScope(relativePath),
    });
  }

  return {
    findings,
    unknownDetectors: [...unknownDetectors],
    manifestMismatch,
  };
}

/**
 * Strip the Semgrep config-name prefix from a check_id.
 *
 * Semgrep prepends the config path to check_ids. When using an absolute
 * rulepack path, the prefix becomes the full path with separators replaced
 * by dots, e.g.:
 *   "C.Users....mvp-rc5.ai-sdk-together-python" → "ai-sdk-together-python"
 *
 * When using a relative path or config name:
 *   "mvp-rc5.ai-sdk-together-python" → "ai-sdk-together-python"
 *   "scan.test-detector" → "test-detector"
 *
 * Since HAIEC detector IDs never contain dots, we take everything after
 * the last dot. If there's no dot, return as-is.
 */
function stripConfigPrefix(checkId: string): string {
  const lastDot = checkId.lastIndexOf('.');
  if (lastDot === -1) return checkId;
  return checkId.slice(lastDot + 1);
}

/**
 * Convert a Semgrep path to repository-relative.
 * Semgrep paths may be absolute or relative to the scan root.
 */
function toRelativePath(semgrepPath: string, targetRoot: string): string {
  // Normalize both paths to forward slashes for comparison
  const normalized = semgrepPath.replace(/\\/g, '/');
  const rootNormalized = path.resolve(targetRoot).replace(/\\/g, '/');

  // Case-insensitive comparison on Windows
  const isWindows = process.platform === 'win32';

  // Check if path starts with root
  if (isWindows) {
    if (normalized.toLowerCase().startsWith(rootNormalized.toLowerCase() + '/')) {
      return normalized.slice(rootNormalized.length + 1);
    }
  } else {
    if (normalized.startsWith(rootNormalized + '/')) {
      return normalized.slice(rootNormalized.length + 1);
    }
  }

  // Try matching by suffix (Semgrep may return paths with different prefix)
  // e.g., target root is C:\Users\...\target but Semgrep returns /target/src/app.py
  const rootBasename = rootNormalized.split('/').pop();
  if (rootBasename && normalized.includes(`/${rootBasename}/`)) {
    const idx = normalized.indexOf(`/${rootBasename}/`);
    return normalized.slice(idx + rootBasename.length + 2);
  }

  // If it's already relative, return as-is
  if (!path.isAbsolute(normalized)) {
    return normalized;
  }

  // Fallback: return the basename (should not normally happen)
  return path.basename(normalized);
}
