/**
 * Security Concern Family — deterministic grouping of compatible findings.
 *
 * A Security Concern Family is a derived VIEW over canonical findings. It
 * groups findings that share the same securityCheckId, findingKind,
 * disposition, and severity into a single family with aggregate counts
 * and representative evidence.
 *
 * IMPORTANT — TERMINOLOGY:
 * - A "Security Concern Family" is NOT a root-cause cluster.
 * - A "Security Concern Family" is NOT a "material issue."
 * - A "Security Concern Family" is NOT a "vulnerability."
 * - A family groups findings by deterministic semantic equivalence
 *   (same check, kind, disposition, severity). Multiple findings in a
 *   family MAY represent independent material issues.
 * - Root-cause / material-issue clustering is NOT implemented in v0.1.
 *   It requires evidence beyond what the static scanner produces today.
 *
 * The TypeScript type retains the name `SecurityConcern` for practical
 * reasons, but all agent-facing language and documentation MUST say
 * "security concern family," never "material issue" or "vulnerability."
 *
 * GROUPING RULES:
 * - Grouping is a VIEW, not deletion. Every canonical finding remains accounted for.
 * - Never merge across securityCheckId simply because titles look similar.
 * - Never merge semantically distinct findings merely to reduce volume.
 * - When uncertain: KEEP SEPARATE.
 * - No LLM grouping. All grouping is deterministic.
 *
 * Issue Aggregation Version: 0.1.0
 */
import { createHash } from 'node:crypto';
import type { NormalizedFinding } from './types.js';
import { prioritizeFindings } from './prioritizer.js';
import { prioritizeConcerns } from './concern-priority.js';

/** Issue aggregation version — separate from schema/receipt versions. */
export const ISSUE_AGGREGATION_VERSION = '0.1.0';

/** Maximum representative findings per concern family in bounded output. */
export const MAX_REPRESENTATIVE_FINDINGS_PER_CONCERN = 3;

export interface SecurityConcern {
  /** Deterministic concern family ID derived from grouping key. */
  readonly concernId: string;
  /** Security check ID from the manifest. */
  readonly securityCheckId: string;
  /** Finding kind (PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY). */
  readonly findingKind: NormalizedFinding['findingKind'];
  /** Canonical severity (CRITICAL, HIGH, MEDIUM, LOW, INFO). */
  readonly canonicalSeverity: NormalizedFinding['canonicalSeverity'];
  /** Default disposition (INFORMATIONAL, REVIEW, BLOCK). */
  readonly defaultDisposition: NormalizedFinding['defaultDisposition'];
  /** Human-readable title from the manifest canonical name. */
  readonly title: string;
  /** Remediation class from the manifest. */
  readonly remediationClass: string;
  /** Total number of finding instances in this concern family. */
  readonly instanceCount: number;
  /** Number of distinct files affected. */
  readonly affectedFileCount: number;
  /** Number of distinct detectors that produced findings. */
  readonly affectedDetectorCount: number;
  /** List of distinct detector IDs. */
  readonly affectedDetectors: readonly string[];
  /** Representative findings (up to MAX_REPRESENTATIVE_FINDINGS_PER_CONCERN). */
  readonly representativeFindings: readonly NormalizedFinding[];
  /** Representative file paths (up to 5). */
  readonly representativePaths: readonly string[];
  /** Limitations specific to this concern. */
  readonly limitations: readonly string[];
}

/**
 * Grouping key — determines which findings belong to the same concern.
 *
 * v0.1 conservative grouping: securityCheckId + findingKind + disposition + severity.
 * This ensures semantically distinct findings are never merged.
 */
function concernKey(f: NormalizedFinding): string {
  return [f.securityCheckId, f.findingKind, f.defaultDisposition, f.canonicalSeverity].join('|');
}

/**
 * Derive a deterministic concern ID from the grouping key.
 */
function deriveConcernId(key: string): string {
  // Use a simple hash of the key for a stable ID
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return `concern-${Math.abs(hash).toString(36).padStart(8, '0')}`;
}

/**
 * Group canonical findings into Security Concerns.
 *
 * This is a deterministic derived view. The underlying findings are NOT modified.
 * Every finding remains accounted for — instanceCount sums must equal the total
 * finding count.
 *
 * @param findings - Canonical findings to group (typically actionable only)
 * @returns Array of Security Concerns, sorted by Concern Priority v0.1
 */
export function groupFindingsIntoConcerns(
  findings: readonly NormalizedFinding[],
): readonly SecurityConcern[] {
  // Group by concern key
  const groups = new Map<string, NormalizedFinding[]>();
  for (const f of findings) {
    const key = concernKey(f);
    const group = groups.get(key) ?? [];
    group.push(f);
    groups.set(key, group);
  }

  // Build concerns
  const concerns: SecurityConcern[] = [];
  for (const [key, groupFindings] of groups) {
    const first = groupFindings[0];
    const fileSet = new Set(groupFindings.map((f) => f.relativePath));
    const detectorSet = new Set<string>();
    for (const f of groupFindings) {
      for (const d of f.detectorIds) {
        detectorSet.add(d);
      }
    }

    // Select representative findings (highest priority first)
    const prioritized = prioritizeFindings(groupFindings);
    const representative = prioritized.slice(0, MAX_REPRESENTATIVE_FINDINGS_PER_CONCERN);
    const representativePaths = [...fileSet].sort().slice(0, 5);

    concerns.push({
      concernId: deriveConcernId(key),
      securityCheckId: first.securityCheckId,
      findingKind: first.findingKind,
      canonicalSeverity: first.canonicalSeverity,
      defaultDisposition: first.defaultDisposition,
      title: first.canonicalName,
      remediationClass: first.remediationClass,
      instanceCount: groupFindings.length,
      affectedFileCount: fileSet.size,
      affectedDetectorCount: detectorSet.size,
      affectedDetectors: [...detectorSet].sort(),
      representativeFindings: representative,
      representativePaths,
      limitations: [],
    });
  }

  // Sort by Concern Priority v0.1
  return prioritizeConcerns(concerns);
}

/**
 * Compute a deterministic digest of the concern set.
 */
export function computeConcernSetDigest(concerns: readonly SecurityConcern[]): string {
  const canonical = concerns
    .map((c) => [
      c.concernId,
      c.securityCheckId,
      c.findingKind,
      c.canonicalSeverity,
      c.defaultDisposition,
      c.instanceCount,
      c.affectedFileCount,
      c.affectedDetectorCount,
      c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort()
    .join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}
