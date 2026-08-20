/**
 * Prioritizer — deterministic finding prioritization.
 *
 * Ordering (no hidden AI scoring, no random ordering):
 * 1. defaultDisposition: BLOCK > REVIEW > INFORMATIONAL
 * 2. findingKind: VULNERABILITY > CONTROL_GAP > RISK_SIGNAL > PRESENCE
 * 3. canonicalSeverity: CRITICAL > HIGH > MEDIUM > LOW > INFO
 * 4. Stable tie-breakers: securityCheckId, relativePath, startLine, evidenceHash
 */
import type { NormalizedFinding } from './types.js';

const DISPOSITION_ORDER: Readonly<Record<string, number>> = {
  BLOCK: 0,
  REVIEW: 1,
  INFORMATIONAL: 2,
};

const KIND_ORDER: Readonly<Record<string, number>> = {
  VULNERABILITY: 0,
  CONTROL_GAP: 1,
  RISK_SIGNAL: 2,
  PRESENCE: 3,
};

const SEVERITY_ORDER: Readonly<Record<string, number>> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4,
};

/**
 * Deterministically sort findings by canonical HAIEC semantics.
 */
export function prioritizeFindings(
  findings: readonly NormalizedFinding[],
): readonly NormalizedFinding[] {
  return [...findings].sort((a, b) => {
    // 1. Disposition
    const dispDiff = DISPOSITION_ORDER[a.defaultDisposition] - DISPOSITION_ORDER[b.defaultDisposition];
    if (dispDiff !== 0) return dispDiff;

    // 2. Finding kind
    const kindDiff = KIND_ORDER[a.findingKind] - KIND_ORDER[b.findingKind];
    if (kindDiff !== 0) return kindDiff;

    // 3. Canonical severity
    const sevDiff = SEVERITY_ORDER[a.canonicalSeverity] - SEVERITY_ORDER[b.canonicalSeverity];
    if (sevDiff !== 0) return sevDiff;

    // 4. Stable tie-breakers
    if (a.securityCheckId !== b.securityCheckId) {
      return a.securityCheckId.localeCompare(b.securityCheckId);
    }
    if (a.relativePath !== b.relativePath) {
      return a.relativePath.localeCompare(b.relativePath);
    }
    if (a.startLine !== b.startLine) return a.startLine - b.startLine;
    return a.evidenceHash.localeCompare(b.evidenceHash);
  });
}

/** Maximum instances of the same security check to show in the first diversity pass. */
const MAX_PER_CHECK_FIRST_PASS = 3;

export interface DiversityBoundedResult {
  /** The bounded list of findings to show to the agent. */
  readonly visible: readonly NormalizedFinding[];
  /** Total number of actionable findings (unchanged). */
  readonly total: number;
  /** Number of findings hidden due to display bounds. */
  readonly hidden: number;
  /** Number of distinct security checks represented in visible output. */
  readonly checksRepresented: number;
  /** Number of distinct security checks in the full result set. */
  readonly checksTotal: number;
  /** Number of checks omitted from visible output solely due to display bounds. */
  readonly checksOmittedDueToDisplayBounds: number;
}

/**
 * Apply deterministic diversity-aware bounding.
 *
 * Strategy:
 * Pass 1: Represent the highest-priority distinct material security checks
 *         (up to MAX_PER_CHECK_FIRST_PASS instances per check).
 * Pass 2: Fill remaining capacity by global deterministic priority.
 *
 * Exact underlying counts never change.
 * Verdict never changes because of display truncation.
 * One check should not consume the entire first-pass output.
 */
export function diversityBoundFindings(
  findings: readonly NormalizedFinding[],
  maxVisible: number,
): DiversityBoundedResult {
  const prioritized = prioritizeFindings(findings);
  const total = prioritized.length;

  if (total <= maxVisible) {
    // No bounding needed — all findings visible
    const checks = new Set(prioritized.map((f) => f.securityCheckId));
    return {
      visible: prioritized,
      total,
      hidden: 0,
      checksRepresented: checks.size,
      checksTotal: checks.size,
      checksOmittedDueToDisplayBounds: 0,
    };
  }

  // Pass 1: Up to MAX_PER_CHECK_FIRST_PASS per check, in priority order
  const perCheckCount = new Map<string, number>();
  const pass1: NormalizedFinding[] = [];
  const remaining: NormalizedFinding[] = [];

  for (const f of prioritized) {
    const count = perCheckCount.get(f.securityCheckId) ?? 0;
    if (count < MAX_PER_CHECK_FIRST_PASS && pass1.length < maxVisible) {
      pass1.push(f);
      perCheckCount.set(f.securityCheckId, count + 1);
    } else {
      remaining.push(f);
    }
  }

  // Pass 2: Fill remaining capacity by global priority
  const pass2: NormalizedFinding[] = [];
  for (const f of remaining) {
    if (pass1.length + pass2.length >= maxVisible) break;
    pass2.push(f);
  }

  const visible = [...pass1, ...pass2];
  const hidden = total - visible.length;
  const visibleChecks = new Set(visible.map((f) => f.securityCheckId));
  const allChecks = new Set(prioritized.map((f) => f.securityCheckId));

  return {
    visible,
    total,
    hidden,
    checksRepresented: visibleChecks.size,
    checksTotal: allChecks.size,
    checksOmittedDueToDisplayBounds: allChecks.size - visibleChecks.size,
  };
}
