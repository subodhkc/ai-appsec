/**
 * Proof-of-fix — compares a baseline scan against a rescan to determine
 * whether findings were actually resolved.
 *
 * Finding disappearance alone is NOT proof. The rescan must have:
 * - COMPLETE or PARTIAL completeness (not ERROR)
 * - The same rulepack version and digest
 * - The same target file(s) actually analyzed
 *
 * If the rescan is ERROR, UNSUPPORTED, or the file was excluded/not analyzed,
 * the finding status is NOT_VERIFIABLE, not RESOLVED_CONFIRMED.
 */

export type ProofOfFixStatus =
  | 'STILL_PRESENT'
  | 'RESOLVED_CONFIRMED'
  | 'NEW'
  | 'NOT_VERIFIABLE';

export interface FindingComparison {
  /** Security check ID. */
  readonly securityCheckId: string;
  /** Repository-relative path. */
  readonly relativePath: string;
  /** Line number in baseline (null if new). */
  readonly baselineLine: number | null;
  /** Line number in rescan (null if resolved). */
  readonly rescanLine: number | null;
  /** Evidence hash from baseline. */
  readonly baselineEvidenceHash: string | null;
  /** Evidence hash from rescan. */
  readonly rescanEvidenceHash: string | null;
  /** Proof-of-fix status. */
  readonly status: ProofOfFixStatus;
  /** Reason for the status. */
  readonly reason: string;
}

export interface ProofOfFixResult {
  readonly schemaVersion: string;
  readonly baselineCompleteness: string;
  readonly rescanCompleteness: string;
  readonly baselineRulepackDigest: string;
  readonly rescanRulepackDigest: string;
  readonly rulepackMatch: boolean;
  readonly comparisons: readonly FindingComparison[];
  readonly summary: {
    readonly stillPresent: number;
    readonly resolvedConfirmed: number;
    readonly new: number;
    readonly notVerifiable: number;
  };
  /** Whether the proof-of-fix is trustworthy (rescan was valid). */
  readonly trustworthy: boolean;
  /** Reason if not trustworthy. */
  readonly trustReason: string;
}

const PROOF_OF_FIX_SCHEMA_VERSION = '0.1.0';

/**
 * Finding identity key — uses securityCheckId + relativePath + evidenceHash
 * (NOT line number alone, per spec).
 */
function findingKey(
  securityCheckId: string,
  relativePath: string,
  evidenceHash: string,
): string {
  return `${securityCheckId}|${relativePath}|${evidenceHash}`;
}

/**
 * Compare baseline and rescan findings to produce proof-of-fix results.
 *
 * @param baselineFindings - Findings from the baseline scan
 * @param rescanFindings - Findings from the rescan
 * @param baselineCompleteness - Completeness of baseline scan
 * @param rescanCompleteness - Completeness of rescan
 * @param baselineRulepackDigest - Rulepack digest from baseline
 * @param rescanRulepackDigest - Rulepack digest from rescan
 * @param rescanAnalyzedPaths - Set of paths that were actually analyzed in rescan
 * @param rescanEvaluatedSecurityCheckIds - Security check IDs actually evaluated in rescan
 */
export function compareScans(
  baselineFindings: readonly {
    securityCheckId: string;
    relativePath: string;
    startLine: number;
    evidenceHash: string;
  }[],
  rescanFindings: readonly {
    securityCheckId: string;
    relativePath: string;
    startLine: number;
    evidenceHash: string;
  }[],
  baselineCompleteness: string,
  rescanCompleteness: string,
  baselineRulepackDigest: string,
  rescanRulepackDigest: string,
  rescanAnalyzedPaths: ReadonlySet<string>,
  rescanEvaluatedSecurityCheckIds?: ReadonlySet<string>,
): ProofOfFixResult {
  // Check trustworthiness
  // For v0.1, RESOLVED_CONFIRMED is allowed ONLY when rescan completeness == COMPLETE.
  // PARTIAL, ERROR, UNSUPPORTED, timeout, parser failure, excluded file, unavailable check,
  // changed incompatible rulepack, and unknown relevant coverage all return NOT_VERIFIABLE.
  //
  // Future enhancement: PARTIAL could potentially prove remediation only after HAIEC supports
  // explicit per-file + per-check + per-analysis-unit completeness evidence.
  // Do NOT implement that relaxation in v0.1.
  const untrustworthyReasons: string[] = [];

  if (rescanCompleteness !== 'COMPLETE') {
    untrustworthyReasons.push(`Rescan completeness is ${rescanCompleteness} — RESOLVED_CONFIRMED requires COMPLETE`);
  }

  if (baselineRulepackDigest !== rescanRulepackDigest) {
    untrustworthyReasons.push('Rulepack digest mismatch between baseline and rescan');
  }

  const trustworthy = untrustworthyReasons.length === 0;
  const trustReason = trustworthy ? 'Rescan is COMPLETE with matching rulepack' : untrustworthyReasons.join('; ');

  // Build finding maps using evidence hash (NOT line number alone)
  const baselineMap = new Map<string, { line: number; hash: string }>();
  for (const f of baselineFindings) {
    const key = findingKey(f.securityCheckId, f.relativePath, f.evidenceHash);
    baselineMap.set(key, { line: f.startLine, hash: f.evidenceHash });
  }

  const rescanMap = new Map<string, { line: number; hash: string }>();
  for (const f of rescanFindings) {
    const key = findingKey(f.securityCheckId, f.relativePath, f.evidenceHash);
    rescanMap.set(key, { line: f.startLine, hash: f.evidenceHash });
  }

  const comparisons: FindingComparison[] = [];
  let stillPresent = 0;
  let resolvedConfirmed = 0;
  let newFindings = 0;
  let notVerifiable = 0;

  // Check baseline findings
  for (const [key, baseline] of baselineMap) {
    const rescan = rescanMap.get(key);
    const [securityCheckId, relativePath] = key.split('|');

    if (rescan) {
      // Finding still present in rescan
      comparisons.push({
        securityCheckId,
        relativePath,
        baselineLine: baseline.line,
        rescanLine: rescan.line,
        baselineEvidenceHash: baseline.hash,
        rescanEvidenceHash: rescan.hash,
        status: 'STILL_PRESENT',
        reason: 'Finding present in both baseline and rescan',
      });
      stillPresent++;
    } else {
      // Finding not in rescan — check if it was actually verifiable
      if (!trustworthy) {
        comparisons.push({
          securityCheckId,
          relativePath,
          baselineLine: baseline.line,
          rescanLine: null,
          baselineEvidenceHash: baseline.hash,
          rescanEvidenceHash: null,
          status: 'NOT_VERIFIABLE',
          reason: `Rescan is not trustworthy: ${trustReason}`,
        });
        notVerifiable++;
      } else if (!rescanAnalyzedPaths.has(relativePath)) {
        // File was not analyzed in rescan
        comparisons.push({
          securityCheckId,
          relativePath,
          baselineLine: baseline.line,
          rescanLine: null,
          baselineEvidenceHash: baseline.hash,
          rescanEvidenceHash: null,
          status: 'NOT_VERIFIABLE',
          reason: 'File was not analyzed in rescan (excluded or not reached)',
        });
        notVerifiable++;
      } else if (
        rescanEvaluatedSecurityCheckIds !== undefined &&
        !rescanEvaluatedSecurityCheckIds.has(securityCheckId)
      ) {
        // The relevant security check was NOT evaluated in the rescan.
        // The finding's absence does not prove resolution — the check
        // simply didn't run. Fail closed to NOT_VERIFIABLE.
        comparisons.push({
          securityCheckId,
          relativePath,
          baselineLine: baseline.line,
          rescanLine: null,
          baselineEvidenceHash: baseline.hash,
          rescanEvidenceHash: null,
          status: 'NOT_VERIFIABLE',
          reason: `Security check ${securityCheckId} was not evaluated in rescan`,
        });
        notVerifiable++;
      } else {
        // File was analyzed but finding is gone — confirmed resolution
        comparisons.push({
          securityCheckId,
          relativePath,
          baselineLine: baseline.line,
          rescanLine: null,
          baselineEvidenceHash: baseline.hash,
          rescanEvidenceHash: null,
          status: 'RESOLVED_CONFIRMED',
          reason: 'Finding present in baseline, absent in valid rescan of same file',
        });
        resolvedConfirmed++;
      }
    }
  }

  // Check for new findings in rescan
  for (const [key, rescan] of rescanMap) {
    if (!baselineMap.has(key)) {
      const [securityCheckId, relativePath] = key.split('|');
      comparisons.push({
        securityCheckId,
        relativePath,
        baselineLine: null,
        rescanLine: rescan.line,
        baselineEvidenceHash: null,
        rescanEvidenceHash: rescan.hash,
        status: 'NEW',
        reason: 'Finding present in rescan but not in baseline',
      });
      newFindings++;
    }
  }

  return {
    schemaVersion: PROOF_OF_FIX_SCHEMA_VERSION,
    baselineCompleteness,
    rescanCompleteness,
    baselineRulepackDigest,
    rescanRulepackDigest,
    rulepackMatch: baselineRulepackDigest === rescanRulepackDigest,
    comparisons,
    summary: {
      stillPresent,
      resolvedConfirmed,
      new: newFindings,
      notVerifiable,
    },
    trustworthy,
    trustReason,
  };
}
