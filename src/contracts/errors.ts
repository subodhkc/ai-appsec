/**
 * Error contract — machine-readable errors for engine and tool operations.
 *
 * No secrets or stack traces in default model-facing output.
 */
export type ErrorCode =
  | 'ENGINE_NOT_INTEGRATED'
  | 'ENGINE_UNAVAILABLE'
  | 'UNSUPPORTED_SCOPE'
  | 'PATH_OUTSIDE_ROOT'
  | 'SYMLINK_ESCAPE'
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_LANGUAGE'
  | 'PARTIAL_COVERAGE'
  | 'SCAN_FAILED'
  | 'DEPENDENCY_MISSING'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export type CauseCategory =
  | 'configuration'
  | 'filesystem'
  | 'engine'
  | 'input'
  | 'environment'
  | 'unknown';

export interface HaiecError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly recoverable: boolean;
  readonly causeCategory?: CauseCategory;
  readonly engine?: string;
  /** Sanitized details — no secrets, no stack traces. */
  readonly details?: Record<string, unknown>;
}

export function isHaiecError(value: unknown): value is HaiecError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'recoverable' in value
  );
}
