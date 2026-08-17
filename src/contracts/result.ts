/**
 * EngineResult contract — the result of running a single engine.
 */
import type { Finding } from './finding.js';
import type { EngineId } from './engine.js';

export type EngineStatus =
  | 'PASSED'
  | 'FINDINGS'
  | 'NOT_APPLICABLE'
  | 'PARTIAL'
  | 'SKIPPED'
  | 'FAILED';

export interface CoverageInfo {
  /** What was scanned (e.g., file count, languages, scope). */
  readonly scope: string;
  /** What was NOT scanned and why. */
  readonly limitations: readonly string[];
}

/**
 * Observational metadata — NOT part of deterministic digest input.
 * Separated from the result payload to preserve reproducibility.
 */
export interface ObservationalMetadata {
  readonly scanStartedAt?: string;
  readonly scanEndedAt?: string;
  readonly durationMs?: number;
  readonly executionId?: string;
}

export interface EngineError {
  readonly code: string;
  readonly message: string;
  readonly recoverable: boolean;
}

export interface EngineResult {
  readonly engine: EngineId;
  readonly engineVersion: string;
  readonly status: EngineStatus;
  readonly coverage: CoverageInfo;
  readonly findings: readonly Finding[];
  readonly errors: readonly EngineError[];
  /** Observational metadata — excluded from deterministic digests. */
  readonly observational?: ObservationalMetadata;
}
