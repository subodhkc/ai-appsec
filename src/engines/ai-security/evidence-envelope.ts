/**
 * Evidence Envelope v0.1 — compact standalone static evidence container.
 *
 * Cryptographically binds to the exact Receipt via semanticReceiptDigest
 * and receiptDocumentDigest. Does NOT independently reinterpret risk,
 * compliance, or assurance. It transports evidence, nothing more.
 *
 * Standalone: no HAIEC account, no SaaS call, no cloud dependency.
 *
 * Broader product architecture docs should mark this as DRAFT_REFERENCE
 * until Platform U0/U1.
 */
import { createHash } from 'node:crypto';
import type { ScanResult } from './scanner.js';
import type { ScanReceipt } from './scan-receipt.js';

/** Evidence Envelope schema version. */
export const EVIDENCE_ENVELOPE_VERSION = '0.1.0';

export interface EvidenceEnvelope {
  /** Envelope schema version. */
  readonly schemaVersion: string;
  /** Envelope version (same as schemaVersion for v0.1). */
  readonly envelopeVersion: string;
  /** Producer identifier. */
  readonly producerId: string;
  /** Producer type — always STATIC_SECURITY for this engine. */
  readonly producerType: 'STATIC_SECURITY';
  /** Producer version. */
  readonly producerVersion: string;

  /** Target identity — digest of the scanned target. */
  readonly targetIdentity: {
    readonly scanInputDigest: string;
    readonly gitCommit: string | null;
    readonly dirtyState: boolean;
  };

  /** Execution status (verdict: PASS/REVIEW/BLOCK/ERROR). */
  readonly executionStatus: string;
  /** Completeness status (COMPLETE/PARTIAL/UNSUPPORTED/ERROR). */
  readonly completeness: string;
  /** Evidence status — produced or not. */
  readonly evidenceStatus: 'PRODUCED' | 'NOT_PRODUCED';

  /** Semantic receipt digest — binds to Receipt semantic identity. */
  readonly semanticReceiptDigest: string;
  /** Receipt document digest — binds to exact Receipt document. */
  readonly receiptDocumentDigest: string;

  /** Finding set digest. */
  readonly findingSetDigest: string;
  /** Concern family set digest. */
  readonly concernFamilySetDigest: string;
  /** Coverage digest. */
  readonly coverageDigest: string;

  /** Limitations from the scan. */
  readonly limitations: readonly string[];

  /** Envelope digest — SHA-256 over the canonical envelope (excluding self). */
  readonly envelopeDigest: string;
}

/**
 * Build an Evidence Envelope from a scan result and receipt.
 * The envelope cryptographically binds to the exact Receipt.
 */
export function buildEvidenceEnvelope(
  result: ScanResult,
  receipt: ScanReceipt,
): EvidenceEnvelope {
  const evidenceStatus: 'PRODUCED' | 'NOT_PRODUCED' =
    result.completeness === 'ERROR' ? 'NOT_PRODUCED' : 'PRODUCED';

  const envelopeWithoutDigest = {
    schemaVersion: EVIDENCE_ENVELOPE_VERSION,
    envelopeVersion: EVIDENCE_ENVELOPE_VERSION,
    producerId: result.versions.scanner,
    producerType: 'STATIC_SECURITY' as const,
    producerVersion: result.versions.scannerVersion,
    targetIdentity: {
      scanInputDigest: receipt.scanInputDigest,
      gitCommit: receipt.gitCommit,
      dirtyState: receipt.dirtyState,
    },
    executionStatus: result.verdict,
    completeness: result.completeness,
    evidenceStatus,
    semanticReceiptDigest: receipt.semanticReceiptDigest,
    receiptDocumentDigest: receipt.receiptDocumentDigest,
    findingSetDigest: receipt.findingSetDigest,
    concernFamilySetDigest: receipt.concernFamilySetDigest,
    coverageDigest: receipt.coverageDigest,
    limitations: result.limitations,
  };

  const envelopeDigest = `sha256:${createHash('sha256').update(JSON.stringify(envelopeWithoutDigest), 'utf-8').digest('hex')}`;

  return { ...envelopeWithoutDigest, envelopeDigest };
}
