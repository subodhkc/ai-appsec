/**
 * AI Security scanner — orchestrates the full scan_ai_security pipeline.
 *
 * Pipeline:
 * 1. Resolve rulepack (via provider)
 * 2. Resolve Semgrep (via resolver)
 * 3. Validate target path (via PathBoundary)
 * 4. Run Semgrep with scope-aware excludes
 * 5. Adapt raw findings to normalized findings (via manifest)
 * 6. Normalize findings (collapse duplicates)
 * 7. Prioritize findings (deterministic ordering)
 * 8. Apply scope filtering (exclude non-prod unless VULNERABILITY)
 * 9. Compute completeness
 * 10. Compute verdict
 * 11. Build agent-facing output (bounded)
 *
 * This scanner does NOT:
 * - Execute target repository code
 * - Make network requests
 * - Emit telemetry
 * - Persist raw findings durably (in-memory only)
 * - Enforce deployment decisions (BLOCK is advisory)
 */
import { PathBoundary, PathBoundaryError } from '../../security/path-boundary.js';
import { createHash } from 'node:crypto';
import { resolveRulepack, type RulepackProvider } from './rulepack-provider.js';
import { SemgrepResolver, type SemgrepResolution } from './semgrep-resolver.js';
import { runSemgrep } from './semgrep-runner.js';
import { adaptFindings } from './finding-adapter.js';
import { normalizeFindings } from './normalizer.js';
import { prioritizeFindings, diversityBoundFindings } from './prioritizer.js';
import { groupFindingsIntoConcerns, type SecurityConcern } from './security-concern.js';
import { getSemgrepExcludes, shouldIncludeFinding, getFindingScope, type ScopeMode } from './scope.js';
import type {
  NormalizedFinding,
  CompletenessStatus,
  ScanVerdict,
  ScanError,
  ScanRemediation,
  ResolvedRulepack,
} from './types.js';
import { buildScanReceipt, buildErrorReceipt, type ScanReceipt } from './scan-receipt.js';
import { buildEvidenceEnvelope, type EvidenceEnvelope } from './evidence-envelope.js';
import { collectCoverageFileSets } from './coverage-collector.js';

/** Maximum actionable findings returned to the agent. */
export const MAX_ACTIONABLE_FINDINGS = 20;

/** Maximum observations (PRESENCE findings) returned to the agent. */
export const MAX_OBSERVATIONS = 10;

/** Maximum serialized response size in bytes (48 KB). */
export const MAX_RESPONSE_BYTES = 48 * 1024;

/** Default scan timeout in milliseconds (300s). */
export const DEFAULT_TIMEOUT_MS = 300_000;

export interface ScanRequest {
  readonly targetPath: string;
  readonly extendedScope?: boolean;
  readonly timeoutMs?: number;
}

export interface ScanSummary {
  // ── File accounting ──
  /** Files actually analyzed by Semgrep (from result.paths.scanned). */
  readonly filesAnalyzed: number;
  /** Files that had at least one finding (deduplicated by relative path). */
  readonly filesWithFindings: number;
  /** Files skipped by Semgrep engine (parse errors). */
  readonly filesSkippedByEngine: number;
  /** Files not scanned due to timeout (-1 = unknown, timeout occurred). */
  readonly filesUnscannedDueToTimeout: number;

  // ── Finding pipeline accounting (each stage) ──
  /** Raw Semgrep output match count (before adapter). */
  readonly rawEngineMatches: number;
  /** Raw matches skipped by adapter (unknown detectors / manifest mismatch). */
  readonly manifestUnmappedInstances: number;
  /** Findings after adapter mapped to manifest detectors (pre-normalizer). */
  readonly detectorInstancesAccepted: number;
  /** Duplicates collapsed by normalizer (same check+path+line+evidence). */
  readonly normalizationDuplicatesCollapsed: number;
  /** Canonical findings after normalization dedup (pre-scope). */
  readonly canonicalFindingInstances: number;
  /** Findings excluded by reporting scope (non-production paths). */
  readonly suppressedInstances: number;
  /** Scoped canonical findings (post-scope = actionable + observations). */
  readonly scopedFindingInstances: number;
  /** Scoped actionable findings (non-PRESENCE). */
  readonly actionableFindingInstances: number;
  /** Scoped observation findings (PRESENCE). */
  readonly observationInstances: number;
  /** Security Concern Families (grouped actionable findings, a VIEW). */
  readonly concernFamiliesFound: number;

  // ── Breakdown by finding kind (of scoped findings) ──
  readonly vulnerabilityTotal: number;
  readonly controlGapTotal: number;
  readonly riskSignalTotal: number;
  readonly presenceTotal: number;

  // ── Breakdown by disposition (of scoped findings) ──
  readonly blockTotal: number;
  readonly reviewTotal: number;
  readonly informationalTotal: number;
}

export interface ScanVersions {
  readonly scanner: string;
  readonly scannerVersion: string;
  readonly rulepack: string;
  readonly rulepackVersion: string;
  readonly rulepackDigest: string;
  readonly manifest: string;
  readonly manifestVersion: string;
  readonly manifestDigest: string;
  readonly semgrep: string;
  readonly semgrepVersion: string;
}

export interface TruncationInfo {
  readonly actionableReturned: number;
  readonly actionableTotal: number;
  readonly observationsReturned: number;
  readonly observationsTotal: number;
  readonly truncated: boolean;
  readonly checksRepresented: number;
  readonly checksTotal: number;
  readonly checksOmittedDueToDisplayBounds: number;
}

export interface ScanResult {
  readonly schemaVersion: string;
  readonly scanId: string;
  readonly verdict: ScanVerdict;
  readonly completeness: CompletenessStatus;
  readonly completenessReasons: readonly string[];
  readonly summary: ScanSummary;
  readonly actionableFindings: readonly NormalizedFinding[];
  readonly observations: readonly NormalizedFinding[];
  /** Security Concern Families — deterministic grouping of actionable findings.
   * A concern family is a derived VIEW, not a root-cause cluster. Every
   * actionable finding belongs to exactly one concern family. */
  readonly securityConcernFamilies: readonly SecurityConcern[];
  /** Security check IDs that were actually evaluated during this scan
   * (i.e., had at least one detector rule in the rulepack). Used by
   * proof-of-fix to determine whether a missing finding is truly resolved
   * vs. the check simply not being evaluated. */
  readonly evaluatedSecurityCheckIds: readonly string[];
  /** Detector IDs that were actually evaluated during this scan
   * (i.e., had rules in the rulepack that were run against the target). */
  readonly evaluatedDetectorIds: readonly string[];
  readonly limitations: readonly string[];
  readonly versions: ScanVersions;
  readonly truncation: TruncationInfo;
  readonly errors: readonly ScanError[];
  /** Scan Receipt — deterministic evidence artifact for reproducibility.
   * Wired into the scan output so the MCP structured content exposes it. */
  readonly receipt?: ScanReceipt;
  /** Evidence Envelope — compact standalone static evidence container.
   * No SaaS dependency, no cloud calls. DRAFT_REFERENCE until Platform U0/U1. */
  readonly evidenceEnvelope?: EvidenceEnvelope;
}

export interface ScannerOptions {
  readonly rulepackProvider?: RulepackProvider;
  readonly semgrepResolver?: SemgrepResolver;
  readonly semgrepPath?: string;
}

const SCANNER_NAME = 'HAIEC Static AI Security';
const SCANNER_VERSION = '0.1.0';

/**
 * Run the scan_ai_security pipeline.
 */
export async function scanAiSecurity(
  request: ScanRequest,
  options: ScannerOptions = {},
): Promise<ScanResult> {
  const errors: ScanError[] = [];
  const limitations: string[] = [];
  const completenessReasons: string[] = [];

  const scanId = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const scopeMode: ScopeMode = request.extendedScope ? 'EXTENDED_SECURITY' : 'DEFAULT_PRODUCTION';
  const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // 1. Resolve rulepack
  let rulepack: ResolvedRulepack;
  try {
    rulepack = await resolveRulepack(options.rulepackProvider);
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === 'RULEPACK_MISSING') {
      errors.push({ code: 'RULEPACK_MISSING', message: (e as Error).message, recoverable: false });
    } else if (code === 'MANIFEST_MISSING') {
      errors.push({ code: 'MANIFEST_MISSING', message: (e as Error).message, recoverable: false });
    } else {
      errors.push({ code: 'RULEPACK_MISSING', message: (e as Error).message, recoverable: false });
    }
    return buildErrorResult(scanId, errors, [], [], limitations, {}, scopeMode);
  }

  // 2. Resolve Semgrep
  const resolver = options.semgrepResolver ?? new SemgrepResolver({ configuredPath: options.semgrepPath });
  const semgrep: SemgrepResolution = await resolver.resolve();

  // Build remediation metadata for agent self-recovery
  const remediation: ScanRemediation | undefined = semgrep.remediationCode !== 'READY' && semgrep.remediationCode !== 'NONE'
    ? {
        dependency: 'semgrep',
        dependencyStatus: semgrep.readiness,
        requiredVersion: semgrep.requiredVersion,
        detectedVersion: semgrep.version,
        remediationCode: semgrep.remediationCode,
        setupAvailable: semgrep.setupAvailable,
        recommendedCommand: semgrep.recommendedCommand,
      }
    : undefined;

  if (semgrep.status === 'MISSING') {
    errors.push({ code: 'SEMGREP_MISSING', message: semgrep.message, recoverable: semgrep.setupAvailable, remediation });
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }
  if (semgrep.status === 'AVAILABLE_UNSUPPORTED_VERSION') {
    errors.push({ code: 'SEMGREP_UNSUPPORTED_VERSION', message: semgrep.message, recoverable: true, remediation });
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }
  if (semgrep.status === 'EXECUTION_ERROR') {
    errors.push({ code: 'SEMGREP_EXECUTION_ERROR', message: semgrep.message, recoverable: true, remediation });
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }

  // 3. Validate target path
  let boundary: PathBoundary;
  try {
    boundary = await PathBoundary.create(request.targetPath);
  } catch (e) {
    if (e instanceof PathBoundaryError) {
      errors.push({
        code: e.code === 'PATH_OUTSIDE_ROOT' ? 'PATH_BOUNDARY_VIOLATION' : 'INVALID_TARGET_PATH',
        message: e.message,
        recoverable: false,
      });
    } else {
      errors.push({ code: 'INVALID_TARGET_PATH', message: (e as Error).message, recoverable: false });
    }
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }

  const targetRoot = boundary.getRoot();

  // 4. Run Semgrep with scope-aware excludes
  const excludes = getSemgrepExcludes();
  const runResult = await runSemgrep({
    executablePath: semgrep.executablePath!,
    rulepackPath: rulepack.rulepackPath,
    targetPath: targetRoot,
    timeoutMs,
    excludes,
  });

  // Handle timeout — timeout is an error CODE, not a completeness type
  // timeout + trustworthy partial findings => PARTIAL
  // timeout + no trustworthy result => ERROR
  if (runResult.timedOut) {
    errors.push({
      code: 'SEMGREP_TIMEOUT',
      message: `Scan timed out after ${timeoutMs}ms. Partial results may be available.`,
      recoverable: true,
    });
    limitations.push('Scan timed out — some files may not have been scanned.');
  }

  // Handle execution error (non-timeout, no result)
  if (!runResult.success && !runResult.timedOut && runResult.result === null) {
    errors.push({
      code: 'SEMGREP_EXECUTION_ERROR',
      message: runResult.error ?? 'Semgrep execution failed.',
      recoverable: true,
    });
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }

  // Timeout with no parseable result => ERROR completeness
  if (runResult.timedOut && runResult.result === null) {
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }

  // 5. Adapt raw findings
  const rawResult = runResult.result;
  if (!rawResult) {
    errors.push({ code: 'RESULT_PARSE_ERROR', message: 'No Semgrep result available.', recoverable: true });
    return buildErrorResult(scanId, errors, [], [], limitations, buildVersions(rulepack, semgrep), scopeMode);
  }

  const adapterResult = adaptFindings(
    rawResult.results,
    rulepack.manifest,
    targetRoot,
    (relPath) => getFindingScope(relPath, scopeMode),
  );

  // Handle manifest mismatch
  if (adapterResult.manifestMismatch) {
    errors.push({
      code: 'RULEPACK_MANIFEST_MISMATCH',
      message: `Unknown detectors returned by Semgrep: ${adapterResult.unknownDetectors.join(', ')}`,
      recoverable: true,
    });
    completenessReasons.push('Manifest mismatch — some detector results could not be mapped.');
  }

  // 6. Normalize findings
  const normResult = normalizeFindings(adapterResult.findings);

  // 7. Apply scope filtering
  const scopedFindings = normResult.normalized.filter((f) =>
    shouldIncludeFinding(f.relativePath, f.findingKind, scopeMode),
  );

  // 8. Separate actionable from observations
  const actionable = scopedFindings.filter((f) => f.findingKind !== 'PRESENCE');
  const observationFindings = scopedFindings.filter((f) => f.findingKind === 'PRESENCE');

  // 9. Prioritize
  const prioritizedActionable = prioritizeFindings(actionable);
  const prioritizedObservations = prioritizeFindings(observationFindings);

  // 9b. Group actionable findings into Security Concern Families (deterministic, v0.1)
  // Grouping is a VIEW — every canonical finding remains accounted for.
  // Concern families are computed from the FULL actionable set (not the bounded output).
  // A concern family is NOT a root-cause cluster — it is a deterministic grouping
  // by securityCheckId + findingKind + disposition + severity. Root-cause clustering
  // is NOT implemented in v0.1.
  const securityConcernFamilies = groupFindingsIntoConcerns(actionable);

  // 9c. Compute evaluated security check IDs and detector IDs.
  // These are the IDs that were actually evaluated (had rules in the rulepack
  // that were run against the target). Used by proof-of-fix to determine
  // whether a missing finding is truly resolved vs. the check not being evaluated.
  const evaluatedSecurityCheckIds = rulepack.manifest.securityChecks
    .map((c) => c.securityCheckId)
    .sort();
  const evaluatedDetectorIds = rulepack.manifest.detectors
    .filter((d) => d.enabledByDefault)
    .map((d) => d.detectorId)
    .sort();

  // 10. Compute counts
  // Extract files analyzed from Semgrep's paths.scanned if available
  const filesAnalyzed = rawResult.paths?.scanned?.length ?? 0;
  // Count findings excluded by reporting scope (before scope filtering)
  const suppressedInstances = normResult.normalized.length - scopedFindings.length;
  // Raw engine matches (before adapter)
  const rawEngineMatches = rawResult.results.length;
  // Manifest-unmapped instances (skipped by adapter)
  const manifestUnmappedInstances = rawEngineMatches - adapterResult.findings.length;
  // Duplicates collapsed by normalizer
  const normalizationDuplicatesCollapsed = normResult.rawCount - normResult.normalized.length;

  const summary = computeSummary(
    scopedFindings,
    actionable,
    observationFindings,
    rawEngineMatches,
    manifestUnmappedInstances,
    normResult.rawCount,
    normalizationDuplicatesCollapsed,
    rawResult.errors.length,
    runResult.timedOut,
    filesAnalyzed,
    suppressedInstances,
    normResult.normalized.length,
    securityConcernFamilies.length,
  );

  // 11. Compute completeness
  // Canonical completeness: COMPLETE | PARTIAL | UNSUPPORTED | ERROR
  // Timeout is NOT a completeness type — it's an error code (SEMGREP_TIMEOUT)
  // timeout + trustworthy partial findings => PARTIAL
  // timeout + no trustworthy result => ERROR (handled above)
  // parser errors affecting part of target => PARTIAL
  // full successful supported analysis => COMPLETE
  let completeness: CompletenessStatus = 'COMPLETE';
  if (runResult.timedOut) {
    // We have partial results (result !== null, checked above)
    completeness = 'PARTIAL';
    completenessReasons.push('Scan timed out — partial results available, some files may not have been scanned.');
  }
  if (rawResult.errors.length > 0) {
    completeness = completeness === 'COMPLETE' ? 'PARTIAL' : completeness;
    completenessReasons.push(`${rawResult.errors.length} parser error(s) occurred during scanning.`);
  }
  if (adapterResult.manifestMismatch) {
    completeness = completeness === 'COMPLETE' ? 'PARTIAL' : completeness;
  }

  // 12. Compute verdict (advisory, not enforcement)
  const verdict = computeVerdict(completeness, scopedFindings);

  // 13. Truncate output with diversity-aware bounding
  const actionableBounded = diversityBoundFindings(prioritizedActionable, MAX_ACTIONABLE_FINDINGS);
  const truncatedActionable = actionableBounded.visible;
  const truncatedObservations = prioritizedObservations.slice(0, MAX_OBSERVATIONS);

  const truncation: TruncationInfo = {
    actionableReturned: truncatedActionable.length,
    actionableTotal: prioritizedActionable.length,
    observationsReturned: truncatedObservations.length,
    observationsTotal: prioritizedObservations.length,
    truncated: truncatedActionable.length < prioritizedActionable.length ||
      truncatedObservations.length < prioritizedObservations.length,
    checksRepresented: actionableBounded.checksRepresented,
    checksTotal: actionableBounded.checksTotal,
    checksOmittedDueToDisplayBounds: actionableBounded.checksOmittedDueToDisplayBounds,
  };

  // 14. Build versions
  const versions = buildVersions(rulepack, semgrep);

  // 15. Add parser errors as limitations
  if (rawResult.errors.length > 0) {
    limitations.push(`${rawResult.errors.length} files had parse errors.`);
  }

  // 16. Collect coverage file paths for receipt using coverage collector
  // Use the same resolved target root that Semgrep received, so path normalization is consistent
  const scanTargetRoot = targetRoot;
  const scopeModeValue = request.extendedScope ? 'EXTENDED_SECURITY' : 'DEFAULT_PRODUCTION';
  const coverageSets = collectCoverageFileSets(
    scanTargetRoot,
    rawResult.paths?.scanned ?? [],
    rawResult.errors.map((e) => e.path).filter((p): p is string => p !== null),
    scopeModeValue,
  );

  // Compute scan input digest from engine-reported scanned file paths
  const scanInputDigest = `sha256:${createHash('sha256').update(coverageSets.engineReportedScannedFilePaths.slice().sort().join('\n'), 'utf-8').digest('hex')}`;

  // 17. Build scan receipt from actual scan result
  const receipt = buildScanReceipt(
    {
      schemaVersion: '1.0.0',
      scanId,
      verdict,
      completeness,
      completenessReasons,
      summary,
      actionableFindings: truncatedActionable,
      observations: truncatedObservations,
      securityConcernFamilies,
      evaluatedSecurityCheckIds,
      evaluatedDetectorIds,
      limitations,
      versions,
      truncation,
      errors,
    } as ScanResult,
    null, // gitCommit — not available in scanner
    false, // dirtyState — not available in scanner
    scanInputDigest,
    {
      discoveredFilePaths: coverageSets.discoveredFilePaths,
      targetedFilePaths: coverageSets.targetedFilePaths,
      intentionallyExcludedFilePaths: coverageSets.intentionallyExcludedFilePaths,
      parseFailureFilePaths: coverageSets.parseFailureFilePaths,
      unsupportedFilePaths: coverageSets.unsupportedFilePaths,
      engineReportedScannedFilePaths: coverageSets.engineReportedScannedFilePaths,
      successfullyAnalyzedFilePaths: coverageSets.successfullyAnalyzedFilePaths,
    },
  );

  // 18. Build evidence envelope
  const evidenceEnvelope = buildEvidenceEnvelope(
    {
      schemaVersion: '1.0.0',
      scanId,
      verdict,
      completeness,
      completenessReasons,
      summary,
      actionableFindings: truncatedActionable,
      observations: truncatedObservations,
      securityConcernFamilies,
      evaluatedSecurityCheckIds,
      evaluatedDetectorIds,
      limitations,
      versions,
      truncation,
      errors,
    } as ScanResult,
    receipt,
  );

  return {
    schemaVersion: '1.0.0',
    scanId,
    verdict,
    completeness,
    completenessReasons,
    summary,
    actionableFindings: truncatedActionable,
    observations: truncatedObservations,
    securityConcernFamilies,
    evaluatedSecurityCheckIds,
    evaluatedDetectorIds,
    limitations,
    versions,
    truncation,
    errors,
    receipt,
    evidenceEnvelope,
  };
}

function computeSummary(
  all: readonly NormalizedFinding[],
  actionable: readonly NormalizedFinding[],
  _observations: readonly NormalizedFinding[],
  rawEngineMatches: number,
  manifestUnmappedInstances: number,
  detectorInstancesAccepted: number,
  normalizationDuplicatesCollapsed: number,
  parseErrors: number,
  timedOut: boolean,
  filesAnalyzed: number,
  suppressedInstances: number,
  canonicalFindingInstances: number,
  concernFamiliesFound: number,
): ScanSummary {
  const counts = {
    PRESENCE: 0,
    RISK_SIGNAL: 0,
    CONTROL_GAP: 0,
    VULNERABILITY: 0,
  };
  const dispositions = { INFORMATIONAL: 0, REVIEW: 0, BLOCK: 0 };

  for (const f of all) {
    counts[f.findingKind]++;
    dispositions[f.defaultDisposition]++;
  }

  // Accounting invariants:
  //   rawEngineMatches = detectorInstancesAccepted + manifestUnmappedInstances
  //   detectorInstancesAccepted = canonicalFindingInstances + normalizationDuplicatesCollapsed
  //   canonicalFindingInstances = scopedFindingInstances + suppressedInstances
  //   scopedFindingInstances = actionableFindingInstances + observationInstances
  //   sum(concernFamily.instanceCount) = actionableFindingInstances
  return {
    filesAnalyzed,
    filesWithFindings: new Set(all.map(f => f.relativePath)).size,
    filesSkippedByEngine: parseErrors,
    filesUnscannedDueToTimeout: timedOut ? -1 : 0,
    rawEngineMatches,
    manifestUnmappedInstances,
    detectorInstancesAccepted,
    normalizationDuplicatesCollapsed,
    canonicalFindingInstances,
    suppressedInstances,
    scopedFindingInstances: all.length,
    actionableFindingInstances: actionable.length,
    observationInstances: counts.PRESENCE,
    concernFamiliesFound,
    vulnerabilityTotal: counts.VULNERABILITY,
    controlGapTotal: counts.CONTROL_GAP,
    riskSignalTotal: counts.RISK_SIGNAL,
    presenceTotal: counts.PRESENCE,
    blockTotal: dispositions.BLOCK,
    reviewTotal: dispositions.REVIEW,
    informationalTotal: dispositions.INFORMATIONAL,
  };
}

function computeVerdict(
  completeness: CompletenessStatus,
  findings: readonly NormalizedFinding[],
): ScanVerdict {
  if (completeness === 'ERROR') return 'ERROR';

  // Check for BLOCK findings
  const hasBlock = findings.some((f) => f.defaultDisposition === 'BLOCK');
  if (hasBlock) return 'BLOCK';

  // Check for REVIEW findings or PARTIAL completeness
  const hasReview = findings.some(
    (f) => f.defaultDisposition === 'REVIEW' && f.findingKind !== 'PRESENCE',
  );
  if (hasReview || completeness === 'PARTIAL') return 'REVIEW';

  return 'PASS';
}

function buildVersions(
  rulepack: ResolvedRulepack,
  semgrep: SemgrepResolution,
): ScanVersions {
  return {
    scanner: SCANNER_NAME,
    scannerVersion: SCANNER_VERSION,
    rulepack: 'haiec-ai-security',
    rulepackVersion: rulepack.rulepackVersion,
    rulepackDigest: rulepack.rulepackDigest,
    manifest: 'haiec-ai-security-manifest',
    manifestVersion: rulepack.manifestVersion,
    manifestDigest: rulepack.manifestDigest,
    semgrep: 'semgrep',
    semgrepVersion: semgrep.version ?? 'unknown',
  };
}

function buildErrorResult(
  scanId: string,
  errors: readonly ScanError[],
  actionable: readonly NormalizedFinding[],
  observations: readonly NormalizedFinding[],
  limitations: readonly string[],
  versions: Partial<ScanVersions>,
  _scopeMode: ScopeMode,
): ScanResult {
  return {
    schemaVersion: '1.0.0',
    scanId,
    verdict: 'ERROR',
    completeness: 'ERROR',
    completenessReasons: errors.map((e) => e.message),
    summary: {
      filesAnalyzed: 0,
      filesWithFindings: 0,
      filesSkippedByEngine: 0,
      filesUnscannedDueToTimeout: 0,
      rawEngineMatches: 0,
      manifestUnmappedInstances: 0,
      detectorInstancesAccepted: 0,
      normalizationDuplicatesCollapsed: 0,
      canonicalFindingInstances: 0,
      suppressedInstances: 0,
      scopedFindingInstances: 0,
      actionableFindingInstances: 0,
      observationInstances: 0,
      concernFamiliesFound: 0,
      vulnerabilityTotal: 0,
      controlGapTotal: 0,
      riskSignalTotal: 0,
      presenceTotal: 0,
      blockTotal: 0,
      reviewTotal: 0,
      informationalTotal: 0,
    },
    actionableFindings: actionable,
    observations,
    securityConcernFamilies: [],
    evaluatedSecurityCheckIds: [],
    evaluatedDetectorIds: [],
    limitations,
    versions: {
      scanner: SCANNER_NAME,
      scannerVersion: SCANNER_VERSION,
      rulepack: 'haiec-ai-security',
      rulepackVersion: versions.rulepackVersion ?? 'unknown',
      rulepackDigest: versions.rulepackDigest ?? 'unknown',
      manifest: 'haiec-ai-security-manifest',
      manifestVersion: versions.manifestVersion ?? 'unknown',
      manifestDigest: versions.manifestDigest ?? 'unknown',
      semgrep: 'semgrep',
      semgrepVersion: versions.semgrepVersion ?? 'unknown',
    },
    truncation: {
      actionableReturned: 0,
      actionableTotal: 0,
      observationsReturned: 0,
      observationsTotal: 0,
      truncated: false,
      checksRepresented: 0,
      checksTotal: 0,
      checksOmittedDueToDisplayBounds: 0,
    },
    errors,
    receipt: buildErrorReceipt({
      schemaVersion: '1.0.0',
      scannerName: SCANNER_NAME,
      scannerVersion: SCANNER_VERSION,
      semgrepVersion: versions.semgrepVersion ?? 'unknown',
      publicCoreVersion: versions.rulepackVersion ?? 'unknown',
      rulepackDigest: versions.rulepackDigest ?? 'unknown',
      manifestDigest: versions.manifestDigest ?? 'unknown',
      errorCodes: errors.map((e) => e.code),
      limitations,
    }),
    evidenceEnvelope: undefined,
  };
}
