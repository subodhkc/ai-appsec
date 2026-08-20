/**
 * AI Security engine types — internal types for the scan_ai_security engine.
 *
 * These types are NOT part of the public MCP contract. They are internal
 * engine plumbing between Semgrep execution and the agent-facing output.
 */

/** Canonical manifest describing the rulepack and its security checks. */
export interface RulepackManifest {
  readonly schemaVersion: string;
  readonly rulepackVersion: string;
  readonly manifestVersion: string;
  readonly analysisEngine: 'semgrep';
  readonly semgrepCompatibility: SemgrepCompatibility;
  readonly securityChecks: readonly SecurityCheckManifest[];
  readonly detectors: readonly DetectorManifest[];
}

export interface SemgrepCompatibility {
  readonly engine: string;
  readonly minVersion: string;
  readonly verifiedStable: string;
  readonly verifiedDigest: string;
  readonly verifiedPlatform: string;
  readonly githubRelease: string;
  readonly releaseDate: string;
}

export interface SecurityCheckManifest {
  readonly securityCheckId: string;
  readonly canonicalName: string;
  readonly securityProposition: string;
  readonly findingKind: 'PRESENCE' | 'RISK_SIGNAL' | 'CONTROL_GAP' | 'VULNERABILITY';
  readonly canonicalSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  readonly defaultDisposition: 'INFORMATIONAL' | 'REVIEW' | 'BLOCK';
  readonly detectorIds: readonly string[];
  readonly applicability: string;
  readonly limitations: readonly string[];
  readonly remediationClass: string;
  readonly primaryEngine: string;
  readonly legacyDisplayId: string;
}

export interface DetectorManifest {
  readonly detectorId: string;
  readonly securityCheckId: string | null;
  readonly languages: readonly string[];
  readonly rawSeverity: string;
  readonly revision: string;
  readonly provenance: string;
  readonly candidateStatus: string;
  readonly publicStatus: string;
  readonly enabledByDefault: boolean;
  readonly limitations: readonly string[];
}

/** Resolved rulepack — paths and metadata ready for scanning. */
export interface ResolvedRulepack {
  readonly rulepackPath: string;
  readonly manifestPath: string;
  readonly rulepackVersion: string;
  readonly rulepackDigest: string;
  readonly manifestVersion: string;
  readonly manifestDigest: string;
  readonly manifest: RulepackManifest;
}

/** Raw Semgrep finding as returned by the engine. */
export interface RawSemgrepFinding {
  readonly check_id: string;
  readonly path: string;
  readonly start: { readonly line: number; readonly col: number };
  readonly end: { readonly line: number; readonly col: number };
  readonly extra: {
    readonly message: string;
    readonly severity: string;
    readonly metadata?: Record<string, unknown>;
  };
}

/** Raw Semgrep result envelope. */
export interface SemgrepResult {
  readonly results: readonly RawSemgrepFinding[];
  readonly errors: readonly SemgrepParseError[];
  readonly paths?: {
    readonly scanned?: readonly string[];
    readonly skipped?: readonly string[];
  };
}

export interface SemgrepParseError {
  readonly check_id: string | null;
  readonly path: string | null;
  readonly start?: { readonly line: number; readonly col: number };
  readonly end?: { readonly line: number; readonly col: number };
  readonly extra?: { readonly message?: string; readonly severity?: string };
}

/** Normalized finding — after manifest resolution and normalization. */
export interface NormalizedFinding {
  readonly securityCheckId: string;
  readonly canonicalName: string;
  readonly findingKind: 'PRESENCE' | 'RISK_SIGNAL' | 'CONTROL_GAP' | 'VULNERABILITY';
  readonly canonicalSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  readonly defaultDisposition: 'INFORMATIONAL' | 'REVIEW' | 'BLOCK';
  readonly relativePath: string;
  readonly startLine: number;
  readonly startColumn: number;
  readonly endLine: number;
  readonly endColumn: number;
  readonly detectorIds: readonly string[];
  readonly message: string;
  readonly evidenceHash: string;
  readonly remediationClass: string;
  readonly scope: 'PRODUCTION' | 'NON_PRODUCTION';
}

/** Completeness status for a scan. */
export type CompletenessStatus = 'COMPLETE' | 'PARTIAL' | 'UNSUPPORTED' | 'ERROR';

/** Scan verdict — advisory, not enforcement. */
export type ScanVerdict = 'PASS' | 'REVIEW' | 'BLOCK' | 'ERROR';

/** File counting model — honest scope accounting. */
export interface FileCounts {
  /** Files actually analyzed by Semgrep. */
  readonly filesAnalyzed: number;
  /** Files that had at least one finding. */
  readonly filesWithFindings: number;
  /** Files skipped by Semgrep engine (parse errors). */
  readonly filesSkippedByEngine: number;
  /** Files not scanned due to timeout (-1 = unknown). */
  readonly filesUnscannedDueToTimeout: number;
  /** Findings excluded by reporting scope. */
  readonly findingsExcludedByReportingScope: number;
}

/** Engine error codes specific to the AI security scanner. */
export type ScanErrorCode =
  | 'SEMGREP_MISSING'
  | 'SEMGREP_UNSUPPORTED_VERSION'
  | 'SEMGREP_EXECUTION_ERROR'
  | 'SEMGREP_TIMEOUT'
  | 'RULEPACK_MISSING'
  | 'MANIFEST_MISSING'
  | 'RULEPACK_MANIFEST_MISMATCH'
  | 'INVALID_TARGET_PATH'
  | 'PATH_BOUNDARY_VIOLATION'
  | 'RESULT_PARSE_ERROR'
  | 'OUTPUT_LIMIT_ERROR';

/** Structured scan error. */
export interface ScanError {
  readonly code: ScanErrorCode;
  readonly message: string;
  readonly recoverable: boolean;
  /** Engine remediation metadata (present for Semgrep dependency errors). */
  readonly remediation?: ScanRemediation;
}

/**
 * Remediation metadata for agent self-recovery.
 * Returned when Semgrep is missing or unusable.
 */
export interface ScanRemediation {
  readonly dependency: string;
  readonly dependencyStatus: string;
  readonly requiredVersion: string;
  readonly detectedVersion: string | null;
  readonly remediationCode: string;
  readonly setupAvailable: boolean;
  readonly recommendedCommand: string | null;
}
