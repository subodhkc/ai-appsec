/**
 * Finding contract — canonical representation of a single security finding.
 *
 * This is the shared contract that ALL engines must produce.
 * Engines may not supply every field; optionality is deliberate.
 *
 * Invariants:
 * - No uncalibrated numeric confidence scores.
 * - No absolute paths in output (use repository-relative paths).
 * - No raw credentials/secrets in evidence.
 */
export const FINDING_SCHEMA_VERSION = '1.0.0' as const;

export type FindingKind =
  | 'PRESENCE'
  | 'RISK_SIGNAL'
  | 'CONTROL_GAP'
  | 'VULNERABILITY';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type DefaultDisposition = 'INFORMATIONAL' | 'REVIEW' | 'BLOCK';

export interface FindingLocation {
  /** Repository-relative path. Never absolute. */
  readonly relativePath: string;
  readonly startLine?: number;
  readonly startColumn?: number;
  readonly endLine?: number;
  readonly endColumn?: number;
}

export interface FindingEvidence {
  /** Sanitized, human-readable summary of what was detected. */
  readonly sanitizedSummary?: string;
  /** SHA-256 hash of the canonical evidence data (not the raw source). */
  readonly evidenceHash?: string;
}

export interface FindingReferences {
  readonly cwe: readonly string[];
  readonly owasp: readonly string[];
  readonly other: readonly string[];
}

export interface Finding {
  readonly schemaVersion: typeof FINDING_SCHEMA_VERSION;
  readonly findingId: string;
  /** Optional fingerprint for deduplication/tracking across scans. */
  readonly findingFingerprint?: string;
  readonly engine: string;
  readonly engineVersion: string;
  readonly ruleId: string;
  readonly ruleRevision?: string;
  readonly findingKind: FindingKind;
  readonly severity: Severity;
  readonly defaultDisposition: DefaultDisposition;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly location: FindingLocation;
  readonly evidence?: FindingEvidence;
  readonly remediation?: string;
  readonly references?: FindingReferences;
}
