/**
 * Artifact contract — reference to a future artifact (Scan Receipt, SARIF, etc.).
 *
 * Phase 0 defines the contract only. No MCP Resources, no signing, no cloud storage.
 */
export type ArtifactKind =
  | 'SCAN_RECEIPT'
  | 'FINDINGS'
  | 'SARIF'
  | 'SUMMARY';

export interface ArtifactRef {
  readonly kind: ArtifactKind;
  readonly format: string;
  /** SHA-256 digest of the canonical artifact content. */
  readonly digest?: string;
  /** Human-readable description of the artifact. */
  readonly description: string;
}
