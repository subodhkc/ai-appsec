/**
 * Verdict contract — top-level security verdict for a scan or deploy gate.
 *
 * Semantics (from Phase -1 / Phase -0.5):
 * - PASS: applicable required checks completed with sufficient coverage, no blocking findings.
 *   0 findings does NOT automatically equal PASS.
 * - REVIEW: findings require human review before proceeding.
 * - BLOCK: critical findings or failed required checks prevent proceeding.
 * - ERROR: engine or system failure prevented a meaningful verdict.
 *
 * Phase 0 defines contracts only. Deploy decision logic is NOT implemented.
 */
import type { EngineId } from './engine.js';

export type VerdictLevel = 'PASS' | 'REVIEW' | 'BLOCK' | 'ERROR';

export interface Verdict {
  readonly level: VerdictLevel;
  readonly summary: string;
  /** Engines that contributed to this verdict. */
  readonly enginesContributing: readonly EngineId[];
  /** Engines that were applicable but did not run, with reasons. */
  readonly enginesSkipped: readonly EngineSkipReason[];
  /** Whether this verdict is final or requires human confirmation. */
  readonly requiresHumanReview: boolean;
}

export interface EngineSkipReason {
  readonly engine: EngineId;
  readonly reason: string;
}
