/**
 * Test utilities for hermetic Semgrep resolver isolation.
 *
 * Provides resolvers that explicitly control Semgrep availability
 * without depending on developer-machine PATH state.
 */
import { SemgrepResolver } from '../../src/engines/ai-security/semgrep-resolver.js';
import type { SemgrepResolution } from '../../src/engines/ai-security/semgrep-resolver.js';

/**
 * A resolver that always returns SETUP_REQUIRED.
 * Use for tests that need Semgrep to be absent.
 */
export class AbsentSemgrepResolver extends SemgrepResolver {
  async resolve(): Promise<SemgrepResolution> {
    return {
      readiness: 'SETUP_REQUIRED',
      status: 'MISSING',
      executablePath: null,
      version: null,
      requiredVersion: '1.173.0',
      message: 'Semgrep 1.173.0 not found. Run haiec-agent-security setup to install it.',
      remediationCode: 'RUN_HAIEC_SETUP',
      setupAvailable: true,
      recommendedCommand: 'haiec-agent-security setup',
    };
  }
}

/**
 * A resolver that returns SETUP_REQUIRED on the first call,
 * then delegates to the real resolver on subsequent calls.
 * Use for same-process recovery tests.
 */
export class RecoverableSemgrepResolver extends SemgrepResolver {
  private callCount = 0;
  private readonly realResolver: SemgrepResolver;

  constructor(realResolver?: SemgrepResolver) {
    super({});
    this.realResolver = realResolver ?? new SemgrepResolver();
  }

  async resolve(): Promise<SemgrepResolution> {
    this.callCount++;
    if (this.callCount === 1) {
      return {
        readiness: 'SETUP_REQUIRED',
        status: 'MISSING',
        executablePath: null,
        version: null,
        requiredVersion: '1.173.0',
        message: 'Semgrep 1.173.0 not found. Run haiec-agent-security setup to install it.',
        remediationCode: 'RUN_HAIEC_SETUP',
        setupAvailable: true,
        recommendedCommand: 'haiec-agent-security setup',
      };
    }
    return this.realResolver.resolve();
  }
}
