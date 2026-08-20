/**
 * Concern Priority v0.1 — deterministic lexicographic priority for Security Concerns.
 *
 * Priority order (no fuzzy numeric risk score, no LLM ranking):
 * 1. disposition: BLOCK > REVIEW > INFORMATIONAL
 * 2. severity: CRITICAL > HIGH > MEDIUM > LOW > INFO
 * 3. findingKind: VULNERABILITY > CONTROL_GAP > RISK_SIGNAL > PRESENCE
 * 4. affected-file breadth bucket: 16+ > 5-15 > 2-4 > 1
 * 5. instance-count bucket (diminishing significance): 100+ > 50-99 > 20-49 > 10-19 > 5-9 > 2-4 > 1
 * 6. deterministic tie-break: securityCheckId, concernId
 *
 * Volume is a tie-breaker, NOT a risk multiplier.
 * 500 lower-priority instances NEVER outrank a BLOCK/CRITICAL concern.
 *
 * Concern Priority Version: 0.1.0
 */
import type { SecurityConcern } from './security-concern.js';

/** Concern priority version — separate from aggregation version. */
export const CONCERN_PRIORITY_VERSION = '0.1.0';

const DISPOSITION_ORDER: Readonly<Record<string, number>> = {
  BLOCK: 0,
  REVIEW: 1,
  INFORMATIONAL: 2,
};

const SEVERITY_ORDER: Readonly<Record<string, number>> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4,
};

const KIND_ORDER: Readonly<Record<string, number>> = {
  VULNERABILITY: 0,
  CONTROL_GAP: 1,
  RISK_SIGNAL: 2,
  PRESENCE: 3,
};

/**
 * File breadth bucket: higher number = broader impact = higher priority.
 * 16+ files → 3
 * 5-15 files → 2
 * 2-4 files → 1
 * 1 file → 0
 */
function fileBreadthBucket(affectedFileCount: number): number {
  if (affectedFileCount >= 16) return 3;
  if (affectedFileCount >= 5) return 2;
  if (affectedFileCount >= 2) return 1;
  return 0;
}

/**
 * Instance count bucket: higher = more instances = slightly higher priority.
 * Diminishing significance — volume is a tie-breaker, not a risk multiplier.
 * 100+ → 6
 * 50-99 → 5
 * 20-49 → 4
 * 10-19 → 3
 * 5-9 → 2
 * 2-4 → 1
 * 1 → 0
 */
function instanceCountBucket(instanceCount: number): number {
  if (instanceCount >= 100) return 6;
  if (instanceCount >= 50) return 5;
  if (instanceCount >= 20) return 4;
  if (instanceCount >= 10) return 3;
  if (instanceCount >= 5) return 2;
  if (instanceCount >= 2) return 1;
  return 0;
}

/**
 * Deterministically sort Security Concerns by Concern Priority v0.1.
 *
 * Top 20 and Top 50 are PRESENTATION LIMITS ONLY, not risk thresholds.
 */
export function prioritizeConcerns(
  concerns: readonly SecurityConcern[],
): readonly SecurityConcern[] {
  return [...concerns].sort((a, b) => {
    // 1. Disposition
    const dispDiff = DISPOSITION_ORDER[a.defaultDisposition] - DISPOSITION_ORDER[b.defaultDisposition];
    if (dispDiff !== 0) return dispDiff;

    // 2. Severity
    const sevDiff = SEVERITY_ORDER[a.canonicalSeverity] - SEVERITY_ORDER[b.canonicalSeverity];
    if (sevDiff !== 0) return sevDiff;

    // 3. Finding kind
    const kindDiff = KIND_ORDER[a.findingKind] - KIND_ORDER[b.findingKind];
    if (kindDiff !== 0) return kindDiff;

    // 4. File breadth bucket (broader = higher priority)
    const fileDiff = fileBreadthBucket(b.affectedFileCount) - fileBreadthBucket(a.affectedFileCount);
    if (fileDiff !== 0) return fileDiff;

    // 5. Instance count bucket (more instances = slightly higher priority, but diminishing)
    const instDiff = instanceCountBucket(b.instanceCount) - instanceCountBucket(a.instanceCount);
    if (instDiff !== 0) return instDiff;

    // 6. Deterministic tie-break
    if (a.securityCheckId !== b.securityCheckId) {
      return a.securityCheckId.localeCompare(b.securityCheckId);
    }
    return a.concernId.localeCompare(b.concernId);
  });
}
