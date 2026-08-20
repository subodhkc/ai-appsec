/**
 * Normalizer — canonical normalization of HAIEC findings.
 *
 * Normalization key: securityCheckId | relativePath | startLine | evidenceHash
 *
 * Rules:
 * - Same securityCheck + same location + same evidence → collapse into one finding
 * - Same securityCheck + different location → separate findings
 * - Different securityChecks on same line → separate findings
 * - Distinct evidence → separate findings
 * - Valid secondary findings remain preserved
 * - Zero semantic findings are incorrectly collapsed
 *
 * When multiple detectors map to the same securityCheck and fire on the same
 * location/evidence, they are collapsed into a single normalized finding with
 * all detectorIds merged.
 */
import type { NormalizedFinding } from './types.js';

export interface NormalizationResult {
  readonly normalized: readonly NormalizedFinding[];
  readonly rawCount: number;
  readonly normalizedCount: number;
  readonly duplicatesCollapsed: number;
}

/**
 * Normalize findings by collapsing same securityCheck + same location + same evidence.
 *
 * Multiple detectors mapping to the same securityCheck that fire on the same
 * line with the same evidence hash are collapsed into one finding.
 */
export function normalizeFindings(
  findings: readonly NormalizedFinding[],
): NormalizationResult {
  const groups = new Map<string, NormalizedFinding>();

  for (const finding of findings) {
    const key = `${finding.securityCheckId}|${finding.relativePath}|${finding.startLine}|${finding.evidenceHash}`;

    const existing = groups.get(key);
    if (existing) {
      // Merge detector IDs (deduped)
      const mergedDetectorIds = [...new Set([...existing.detectorIds, ...finding.detectorIds])];
      groups.set(key, {
        ...existing,
        detectorIds: mergedDetectorIds,
      });
    } else {
      groups.set(key, finding);
    }
  }

  const normalized = [...groups.values()];
  const duplicatesCollapsed = findings.length - normalized.length;

  return {
    normalized,
    rawCount: findings.length,
    normalizedCount: normalized.length,
    duplicatesCollapsed,
  };
}
