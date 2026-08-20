/**
 * Scan Receipt — deterministic evidence artifact for scan reproducibility.
 *
 * The receipt captures everything needed to verify that a scan was executed
 * with a specific configuration against a specific target, and that the
 * results are deterministic.
 *
 * The receipt EXCLUDES operational metadata (timestamps, duration, PIDs,
 * absolute host paths) from the digest computation to ensure determinism.
 */
import { createHash } from 'node:crypto';
import type { ScanResult } from './scanner.js';
import type { NormalizedFinding } from './types.js';
import { computeScopePolicyDigest, COVERAGE_CONTRACT_VERSION } from './coverage-collector.js';

/** Scan Receipt schema version. */
export const RECEIPT_SCHEMA_VERSION = '0.1.0';

/** Receipt version (separate from schema version). */
export const RECEIPT_VERSION = '0.1.0';

export interface ScanReceipt {
  /** Receipt format version. */
  readonly receiptVersion: string;
  /** Schema version of the scan output. */
  readonly schemaVersion: string;
  /** Scanner name. */
  readonly scannerName: string;
  /** Scanner version. */
  readonly scannerVersion: string;
  /** Semgrep version used. */
  readonly semgrepVersion: string;
  /** Public Core version. */
  readonly publicCoreVersion: string;
  /** Rulepack digest. */
  readonly rulepackDigest: string;
  /** Manifest digest. */
  readonly manifestDigest: string;
  /** Git commit SHA of scanned repository (if available). */
  readonly gitCommit: string | null;
  /** Whether the working tree was dirty. */
  readonly dirtyState: boolean;
  /** Digest of scanned file contents (deterministic). */
  readonly scanInputDigest: string;
  /** Digest of coverage state (deterministic). */
  readonly coverageDigest: string;
  /** Digest of the set of all discovered files (deterministic). */
  readonly discoveredFileSetDigest: string;
  /** Digest of the set of files targeted for scanning (deterministic). */
  readonly targetedFileSetDigest: string;
  /** Digest of the set of files intentionally excluded by scope (deterministic). */
  readonly intentionallyExcludedFileSetDigest: string;
  /** Digest of the set of files with unsupported extensions (deterministic). */
  readonly unsupportedFileSetDigest: string;
  /** Digest of files Semgrep reports in paths.scanned (deterministic). */
  readonly engineReportedScannedFileSetDigest: string;
  /** Digest of the set of files that failed parsing (deterministic).
   * If the parse-failure file set changes, this digest MUST change.
   * This is a semantic coverage identity field, NOT operational metadata. */
  readonly parseFailureFileSetDigest: string;
  /** Digest of successfully analyzed files = ENGINE_REPORTED_SCANNED - PARSE_FAILED. */
  readonly successfullyAnalyzedFileSetDigest: string;
  /** Scope mode used. */
  readonly scopeMode: string;
  /** File accounting. */
  readonly fileAccounting: {
    readonly filesAnalyzed: number;
    readonly filesWithFindings: number;
    readonly filesSkippedByEngine: number;
    readonly filesUnscannedDueToTimeout: number;
    readonly findingsExcludedByReportingScope: number;
  };
  /** Completeness status. */
  readonly completeness: string;
  /** Advisory verdict. */
  readonly verdict: string;
  /** Finding counts. */
  readonly findingCounts: {
    readonly rawFindingCount: number;
    readonly actionableTotal: number;
    readonly vulnerabilityTotal: number;
    readonly controlGapTotal: number;
    readonly riskSignalTotal: number;
    readonly presenceTotal: number;
    readonly blockTotal: number;
    readonly reviewTotal: number;
    readonly informationalTotal: number;
  };
  /** Digest of the normalized finding set (deterministic). */
  readonly findingSetDigest: string;
  /** Digest of the security concern family set (deterministic). */
  readonly concernFamilySetDigest: string;
  /** Security check IDs actually evaluated during this scan. */
  readonly evaluatedSecurityCheckIds: readonly string[];
  /** Digest of the evaluated security check set (deterministic). */
  readonly evaluatedSecurityCheckSetDigest: string;
  /** Detector IDs actually evaluated during this scan. */
  readonly evaluatedDetectorIds: readonly string[];
  /** Digest of the evaluated detector set (deterministic). */
  readonly evaluatedDetectorSetDigest: string;
  /** Sanitized limitation messages. */
  readonly limitations: readonly string[];
  /** Sanitized error codes (messages excluded for sanitization). */
  readonly errorCodes: readonly string[];
  /** Semantic receipt digest — SHA-256 over deterministic evidence semantics.
   * Answers: "Did these scans establish the same security evidence?"
   * Includes: producer/engine/rulepack/target identity, findingSetDigest,
   * coverage/file-set identities, evaluated-check/detector identities,
   * completeness, verdict, limitations.
   * Excludes: timestamps, duration, PIDs, filesSkippedByEngine count. */
  readonly semanticReceiptDigest: string;
  /** Receipt document digest — SHA-256 over the complete canonical serialized
   * receipt document, excluding only receiptDocumentDigest itself.
   * Answers: "Is this exact Receipt document unchanged?"
   * MAY differ between runs because it includes operational metadata. */
  readonly receiptDocumentDigest: string;
}

/**
 * Canonicalize a finding for deterministic digest computation.
 * Excludes operational nondeterminism (no timestamps, no PIDs, no absolute paths).
 */
function canonicalizeFinding(f: NormalizedFinding): string {
  return [
    f.securityCheckId,
    f.findingKind,
    f.canonicalSeverity,
    f.defaultDisposition,
    f.relativePath,
    f.startLine,
    f.startColumn,
    f.endLine,
    f.endColumn,
    f.detectorIds.slice().sort().join(','),
    f.evidenceHash,
    f.scope,
  ].join('|');
}

/**
 * Compute the finding set digest from normalized findings.
 * Findings are sorted canonically before hashing.
 */
export function computeFindingSetDigest(
  actionable: readonly NormalizedFinding[],
  observations: readonly NormalizedFinding[],
): string {
  const all = [...actionable, ...observations];
  const canonical = all.map(canonicalizeFinding).sort().join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Compute the scan input digest from file paths and content hashes.
 * This distinguishes different working-tree contents even when git commit is unchanged.
 *
 * @param fileHashes - Array of { relativePath, contentSha256 } tuples
 */
export function computeScanInputDigest(
  fileHashes: readonly { relativePath: string; contentSha256: string }[],
): string {
  const canonical = fileHashes
    .map((f) => `${f.relativePath}:${f.contentSha256}`)
    .sort()
    .join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Compute a file-set digest from a list of repository-relative paths.
 * Uses canonical sorted paths to ensure determinism.
 * Two scans with the same number of files but different file sets
 * must NOT have equivalent coverage identity.
 */
export function computeFileSetDigest(relativePaths: readonly string[]): string {
  const canonical = relativePaths
    .filter((p): p is string => typeof p === 'string' && p.length > 0)
    .map((p) => p.replace(/\\/g, '/')) // normalize Windows separators
    .sort()
    .join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Compute a set digest from a list of string IDs.
 * Sorts and joins canonically before hashing.
 */
export function computeSetDigest(ids: readonly string[]): string {
  const canonical = ids.slice().sort().join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Compute the concern family set digest from security concern families.
 * Captures the complete concern family identity (not just count).
 */
export function computeConcernFamilySetDigest(
  families: readonly { readonly concernId: string; readonly securityCheckId: string; readonly findingKind: string; readonly canonicalSeverity: string; readonly defaultDisposition: string; readonly instanceCount: number; readonly affectedFileCount: number; readonly affectedDetectorCount: number; readonly affectedDetectors: readonly string[] }[] | undefined,
): string {
  const canonical = (families ?? [])
    .map((c) => [
      c.concernId, c.securityCheckId, c.findingKind, c.canonicalSeverity,
      c.defaultDisposition, c.instanceCount, c.affectedFileCount,
      c.affectedDetectorCount, c.affectedDetectors.slice().sort().join(','),
    ].join('|'))
    .sort()
    .join('\n');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Compute the coverage digest from ALL material coverage file-set identities.
 *
 * Per HAIEC Coverage Contract v0.1.1, coverageDigest MUST change whenever
 * material coverage identity changes. Inputs:
 *   - coverageContractVersion
 *   - scopePolicyDigest
 *   - discoveredFileSetDigest
 *   - intentionallyExcludedFileSetDigest
 *   - unsupportedFileSetDigest
 *   - targetedFileSetDigest
 *   - engineReportedScannedFileSetDigest
 *   - parseFailureFileSetDigest
 *   - successfullyAnalyzedFileSetDigest
 *   - completeness
 *
 * Excludes: timestamps, duration, PID, filesSkippedByEngine count.
 */
export function computeCoverageDigest(params: {
  readonly completeness: string;
  readonly coverageContractVersion: string;
  readonly scopePolicyDigest: string;
  readonly discoveredFileSetDigest: string;
  readonly intentionallyExcludedFileSetDigest: string;
  readonly unsupportedFileSetDigest: string;
  readonly targetedFileSetDigest: string;
  readonly engineReportedScannedFileSetDigest: string;
  readonly parseFailureFileSetDigest: string;
  readonly successfullyAnalyzedFileSetDigest: string;
}): string {
  const parts = [
    `completeness:${params.completeness}`,
    `coverageContractVersion:${params.coverageContractVersion}`,
    `scopePolicyDigest:${params.scopePolicyDigest}`,
    `discoveredFileSetDigest:${params.discoveredFileSetDigest}`,
    `intentionallyExcludedFileSetDigest:${params.intentionallyExcludedFileSetDigest}`,
    `unsupportedFileSetDigest:${params.unsupportedFileSetDigest}`,
    `targetedFileSetDigest:${params.targetedFileSetDigest}`,
    `engineReportedScannedFileSetDigest:${params.engineReportedScannedFileSetDigest}`,
    `parseFailureFileSetDigest:${params.parseFailureFileSetDigest}`,
    `successfullyAnalyzedFileSetDigest:${params.successfullyAnalyzedFileSetDigest}`,
  ];
  const canonical = parts.sort().join('|');
  return `sha256:${createHash('sha256').update(canonical, 'utf-8').digest('hex')}`;
}

/**
 * Build a Scan Receipt from a scan result.
 *
 * @param result - The scan result
 * @param gitCommit - Git commit SHA (null if not available)
 * @param dirtyState - Whether the working tree was dirty
 * @param scanInputDigest - Digest of scanned file contents
 * @param analyzedFilePaths - Repository-relative paths of files actually analyzed
 * @param parseFailureFilePaths - Repository-relative paths of files that failed parsing
 */
export function buildScanReceipt(
  result: ScanResult,
  gitCommit: string | null,
  dirtyState: boolean,
  scanInputDigest: string,
  coverage: {
    discoveredFilePaths?: readonly string[];
    targetedFilePaths?: readonly string[];
    intentionallyExcludedFilePaths?: readonly string[];
    parseFailureFilePaths?: readonly string[];
    unsupportedFilePaths?: readonly string[];
    engineReportedScannedFilePaths?: readonly string[];
    successfullyAnalyzedFilePaths?: readonly string[];
  } = {},
): ScanReceipt {
  const findingSetDigest = computeFindingSetDigest(
    result.actionableFindings,
    result.observations,
  );

  // Compute file-set digests from coverage paths (v0.1.1 ontology)
  const discoveredFileSetDigest = computeFileSetDigest(coverage.discoveredFilePaths ?? []);
  const targetedFileSetDigest = computeFileSetDigest(coverage.targetedFilePaths ?? []);
  const intentionallyExcludedFileSetDigest = computeFileSetDigest(coverage.intentionallyExcludedFilePaths ?? []);
  const unsupportedFileSetDigest = computeFileSetDigest(coverage.unsupportedFilePaths ?? []);
  const engineReportedScannedFileSetDigest = computeFileSetDigest(coverage.engineReportedScannedFilePaths ?? []);
  const parseFailureFileSetDigest = computeFileSetDigest(coverage.parseFailureFilePaths ?? []);
  const successfullyAnalyzedFileSetDigest = computeFileSetDigest(coverage.successfullyAnalyzedFilePaths ?? []);

  const scopeMode = result.actionableFindings.length > 0 || result.observations.length > 0
    ? (result.actionableFindings[0]?.scope ?? result.observations[0]?.scope ?? 'PRODUCTION')
    : 'PRODUCTION';

  // Compute scope policy digest
  const scopePolicyDigest = computeScopePolicyDigest(scopeMode);

  const coverageDigest = computeCoverageDigest({
    completeness: result.completeness,
    coverageContractVersion: COVERAGE_CONTRACT_VERSION,
    scopePolicyDigest,
    discoveredFileSetDigest,
    intentionallyExcludedFileSetDigest,
    unsupportedFileSetDigest,
    targetedFileSetDigest,
    engineReportedScannedFileSetDigest,
    parseFailureFileSetDigest,
    successfullyAnalyzedFileSetDigest,
  });

  // Compute concern family set digest
  const concernFamilySetDigest = computeConcernFamilySetDigest(result.securityConcernFamilies);

  // Compute evaluated check/detector set digests
  const evaluatedSecurityCheckIds = (result.evaluatedSecurityCheckIds ?? []).slice().sort();
  const evaluatedDetectorIds = (result.evaluatedDetectorIds ?? []).slice().sort();
  const evaluatedSecurityCheckSetDigest = computeSetDigest(evaluatedSecurityCheckIds);
  const evaluatedDetectorSetDigest = computeSetDigest(evaluatedDetectorIds);

  const receipt: Omit<ScanReceipt, 'semanticReceiptDigest' | 'receiptDocumentDigest'> = {
    receiptVersion: RECEIPT_VERSION,
    schemaVersion: result.schemaVersion,
    scannerName: result.versions.scanner,
    scannerVersion: result.versions.scannerVersion,
    semgrepVersion: result.versions.semgrepVersion,
    publicCoreVersion: result.versions.rulepackVersion,
    rulepackDigest: result.versions.rulepackDigest,
    manifestDigest: result.versions.manifestDigest,
    gitCommit,
    dirtyState,
    scanInputDigest,
    coverageDigest,
    discoveredFileSetDigest,
    targetedFileSetDigest,
    intentionallyExcludedFileSetDigest,
    unsupportedFileSetDigest,
    engineReportedScannedFileSetDigest,
    parseFailureFileSetDigest,
    successfullyAnalyzedFileSetDigest,
    scopeMode: result.actionableFindings[0]?.scope ?? 'PRODUCTION',
    fileAccounting: {
      filesAnalyzed: result.summary.filesAnalyzed,
      filesWithFindings: result.summary.filesWithFindings,
      filesSkippedByEngine: result.summary.filesSkippedByEngine,
      filesUnscannedDueToTimeout: result.summary.filesUnscannedDueToTimeout,
      findingsExcludedByReportingScope: result.summary.suppressedInstances,
    },
    completeness: result.completeness,
    verdict: result.verdict,
    findingCounts: {
      rawFindingCount: result.summary.detectorInstancesAccepted,
      actionableTotal: result.summary.actionableFindingInstances,
      vulnerabilityTotal: result.summary.vulnerabilityTotal,
      controlGapTotal: result.summary.controlGapTotal,
      riskSignalTotal: result.summary.riskSignalTotal,
      presenceTotal: result.summary.presenceTotal,
      blockTotal: result.summary.blockTotal,
      reviewTotal: result.summary.reviewTotal,
      informationalTotal: result.summary.informationalTotal,
    },
    findingSetDigest,
    concernFamilySetDigest,
    evaluatedSecurityCheckIds,
    evaluatedSecurityCheckSetDigest,
    evaluatedDetectorIds,
    evaluatedDetectorSetDigest,
    limitations: result.limitations,
    errorCodes: result.errors.map((e) => e.code),
  };

  // === semanticReceiptDigest ===
  // SHA-256 over deterministic evidence semantics.
  // Answers: "Did these scans establish the same security evidence?"
  // Excludes: timestamps, duration, PIDs, filesSkippedByEngine count.
  // Includes: parseFailureFileSetDigest (semantic coverage identity).
  const { filesSkippedByEngine: _excluded, ...fileAccountingForSemanticDigest } = receipt.fileAccounting;
  const semanticDigestInput = JSON.stringify({
    receiptVersion: receipt.receiptVersion,
    schemaVersion: receipt.schemaVersion,
    scannerName: receipt.scannerName,
    scannerVersion: receipt.scannerVersion,
    semgrepVersion: receipt.semgrepVersion,
    publicCoreVersion: receipt.publicCoreVersion,
    rulepackDigest: receipt.rulepackDigest,
    manifestDigest: receipt.manifestDigest,
    gitCommit: receipt.gitCommit,
    dirtyState: receipt.dirtyState,
    scanInputDigest: receipt.scanInputDigest,
    coverageDigest: receipt.coverageDigest,
    discoveredFileSetDigest: receipt.discoveredFileSetDigest,
    targetedFileSetDigest: receipt.targetedFileSetDigest,
    intentionallyExcludedFileSetDigest: receipt.intentionallyExcludedFileSetDigest,
    unsupportedFileSetDigest: receipt.unsupportedFileSetDigest,
    engineReportedScannedFileSetDigest: receipt.engineReportedScannedFileSetDigest,
    parseFailureFileSetDigest: receipt.parseFailureFileSetDigest,
    successfullyAnalyzedFileSetDigest: receipt.successfullyAnalyzedFileSetDigest,
    scopeMode: receipt.scopeMode,
    fileAccounting: fileAccountingForSemanticDigest,
    completeness: receipt.completeness,
    verdict: receipt.verdict,
    findingCounts: receipt.findingCounts,
    findingSetDigest: receipt.findingSetDigest,
    concernFamilySetDigest: receipt.concernFamilySetDigest,
    evaluatedSecurityCheckSetDigest: receipt.evaluatedSecurityCheckSetDigest,
    evaluatedDetectorSetDigest: receipt.evaluatedDetectorSetDigest,
    limitations: receipt.limitations,
    errorCodes: receipt.errorCodes,
  });
  const semanticReceiptDigest = `sha256:${createHash('sha256').update(semanticDigestInput, 'utf-8').digest('hex')}`;

  // === receiptDocumentDigest ===
  // SHA-256 over the complete canonical serialized receipt document,
  // excluding only receiptDocumentDigest itself.
  // Answers: "Is this exact Receipt document unchanged?"
  // MAY differ between runs because it includes operational metadata
  // (filesSkippedByEngine count, etc.) and semanticReceiptDigest.
  const receiptWithSemantic = { ...receipt, semanticReceiptDigest };
  const documentDigestInput = JSON.stringify({
    ...receiptWithSemantic,
    receiptDocumentDigest: undefined, // exclude self
  });
  const receiptDocumentDigest = `sha256:${createHash('sha256').update(documentDigestInput, 'utf-8').digest('hex')}`;

  return { ...receipt, semanticReceiptDigest, receiptDocumentDigest };
}

/**
 * Build a minimal ERROR receipt for scans that failed before producing evidence.
 * The receipt truthfully indicates ERROR state with no findings and no coverage.
 */
export function buildErrorReceipt(params: {
  readonly schemaVersion: string;
  readonly scannerName: string;
  readonly scannerVersion: string;
  readonly semgrepVersion: string;
  readonly publicCoreVersion: string;
  readonly rulepackDigest: string;
  readonly manifestDigest: string;
  readonly errorCodes: readonly string[];
  readonly limitations: readonly string[];
}): ScanReceipt {
  const emptyDigest = computeFileSetDigest([]);
  const scopePolicyDigest = computeScopePolicyDigest('PRODUCTION');

  const coverageDigest = computeCoverageDigest({
    completeness: 'ERROR',
    coverageContractVersion: COVERAGE_CONTRACT_VERSION,
    scopePolicyDigest,
    discoveredFileSetDigest: emptyDigest,
    intentionallyExcludedFileSetDigest: emptyDigest,
    unsupportedFileSetDigest: emptyDigest,
    targetedFileSetDigest: emptyDigest,
    engineReportedScannedFileSetDigest: emptyDigest,
    parseFailureFileSetDigest: emptyDigest,
    successfullyAnalyzedFileSetDigest: emptyDigest,
  });

  const findingSetDigest = computeFindingSetDigest([], []);
  const concernFamilySetDigest = computeConcernFamilySetDigest([]);
  const evaluatedSecurityCheckSetDigest = computeSetDigest([]);
  const evaluatedDetectorSetDigest = computeSetDigest([]);

  const receipt: Omit<ScanReceipt, 'semanticReceiptDigest' | 'receiptDocumentDigest'> = {
    receiptVersion: RECEIPT_VERSION,
    schemaVersion: params.schemaVersion,
    scannerName: params.scannerName,
    scannerVersion: params.scannerVersion,
    semgrepVersion: params.semgrepVersion,
    publicCoreVersion: params.publicCoreVersion,
    rulepackDigest: params.rulepackDigest,
    manifestDigest: params.manifestDigest,
    gitCommit: null,
    dirtyState: false,
    scanInputDigest: emptyDigest,
    coverageDigest,
    discoveredFileSetDigest: emptyDigest,
    targetedFileSetDigest: emptyDigest,
    intentionallyExcludedFileSetDigest: emptyDigest,
    unsupportedFileSetDigest: emptyDigest,
    engineReportedScannedFileSetDigest: emptyDigest,
    parseFailureFileSetDigest: emptyDigest,
    successfullyAnalyzedFileSetDigest: emptyDigest,
    scopeMode: 'PRODUCTION',
    fileAccounting: {
      filesAnalyzed: 0,
      filesWithFindings: 0,
      filesSkippedByEngine: 0,
      filesUnscannedDueToTimeout: 0,
      findingsExcludedByReportingScope: 0,
    },
    completeness: 'ERROR',
    verdict: 'ERROR',
    findingCounts: {
      rawFindingCount: 0,
      actionableTotal: 0,
      vulnerabilityTotal: 0,
      controlGapTotal: 0,
      riskSignalTotal: 0,
      presenceTotal: 0,
      blockTotal: 0,
      reviewTotal: 0,
      informationalTotal: 0,
    },
    findingSetDigest,
    concernFamilySetDigest,
    evaluatedSecurityCheckIds: [],
    evaluatedSecurityCheckSetDigest,
    evaluatedDetectorIds: [],
    evaluatedDetectorSetDigest,
    limitations: params.limitations,
    errorCodes: params.errorCodes,
  };

  const { filesSkippedByEngine: _excluded, ...fileAccountingForSemanticDigest } = receipt.fileAccounting;
  const semanticDigestInput = JSON.stringify({
    receiptVersion: receipt.receiptVersion,
    schemaVersion: receipt.schemaVersion,
    scannerName: receipt.scannerName,
    scannerVersion: receipt.scannerVersion,
    semgrepVersion: receipt.semgrepVersion,
    publicCoreVersion: receipt.publicCoreVersion,
    rulepackDigest: receipt.rulepackDigest,
    manifestDigest: receipt.manifestDigest,
    gitCommit: receipt.gitCommit,
    dirtyState: receipt.dirtyState,
    scanInputDigest: receipt.scanInputDigest,
    coverageDigest: receipt.coverageDigest,
    discoveredFileSetDigest: receipt.discoveredFileSetDigest,
    targetedFileSetDigest: receipt.targetedFileSetDigest,
    intentionallyExcludedFileSetDigest: receipt.intentionallyExcludedFileSetDigest,
    unsupportedFileSetDigest: receipt.unsupportedFileSetDigest,
    engineReportedScannedFileSetDigest: receipt.engineReportedScannedFileSetDigest,
    parseFailureFileSetDigest: receipt.parseFailureFileSetDigest,
    successfullyAnalyzedFileSetDigest: receipt.successfullyAnalyzedFileSetDigest,
    scopeMode: receipt.scopeMode,
    fileAccounting: fileAccountingForSemanticDigest,
    completeness: receipt.completeness,
    verdict: receipt.verdict,
    findingCounts: receipt.findingCounts,
    findingSetDigest: receipt.findingSetDigest,
    concernFamilySetDigest: receipt.concernFamilySetDigest,
    evaluatedSecurityCheckSetDigest: receipt.evaluatedSecurityCheckSetDigest,
    evaluatedDetectorSetDigest: receipt.evaluatedDetectorSetDigest,
    limitations: receipt.limitations,
    errorCodes: receipt.errorCodes,
  });
  const semanticReceiptDigest = `sha256:${createHash('sha256').update(semanticDigestInput, 'utf-8').digest('hex')}`;

  const receiptWithSemantic = { ...receipt, semanticReceiptDigest };
  const documentDigestInput = JSON.stringify({
    ...receiptWithSemantic,
    receiptDocumentDigest: undefined,
  });
  const receiptDocumentDigest = `sha256:${createHash('sha256').update(documentDigestInput, 'utf-8').digest('hex')}`;

  return { ...receipt, semanticReceiptDigest, receiptDocumentDigest };
}
