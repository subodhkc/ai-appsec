/**
 * Rulepack provider — abstraction for resolving the canonical HAIEC rulepack.
 *
 * The runtime engine depends on this contract, not hardcoded repository paths.
 *
 * Providers:
 * - BundledPublicCoreRulepackProvider: resolves the package-bundled Public Core
 *   (default for npm package — no env vars, no login, no network)
 * - PrivateLocalRulepackProvider: resolves HAIEC_RULEPACK_PATH / HAIEC_MANIFEST_PATH
 *   (development override for private rulepack testing)
 * - SyntheticTestRulepackProvider: returns a harmless synthetic test rulepack
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import * as url from 'node:url';
import type { ResolvedRulepack, RulepackManifest } from './types.js';

export interface RulepackProvider {
  /** Resolve the rulepack, returning paths and parsed manifest. */
  resolve(): Promise<ResolvedRulepack>;
  /** Human-readable provider name for diagnostics. */
  readonly name: string;
}

export class RulepackProviderError extends Error {
  readonly code: 'RULEPACK_MISSING' | 'MANIFEST_MISSING' | 'RULEPACK_INVALID' | 'DIGEST_MISMATCH';
  constructor(code: RulepackProviderError['code'], message: string) {
    super(message);
    this.code = code;
    this.name = 'RulepackProviderError';
  }
}

/**
 * Expected SHA-256 digests for the bundled Public Core.
 * These are verified at runtime to detect tampering or corruption.
 * If the bundled files don't match, the scan fails closed.
 */
export const PUBLIC_CORE_EXPECTED_RULEPACK_DIGEST =
  'sha256:23338e814d3efad9f2c70f0eac2ac17028a7ee7dd27b741e1ed10b86bed0ac92';
export const PUBLIC_CORE_EXPECTED_MANIFEST_DIGEST =
  'sha256:205ea6b336953a9cefdfe16800d8ad117ddbc4ab77495a8e51528b67d3fae85f';
export const PUBLIC_CORE_VERSION = '0.1.0-rc.6.1-public-core';

/**
 * Bundled Public Core rulepack provider — resolves from package-relative files.
 *
 * This is the DEFAULT provider for the npm package. It requires:
 * - No HAIEC login
 * - No API key
 * - No SaaS request
 * - No runtime rule download
 * - No environment variables
 *
 * The Public Core YAML and manifest are bundled in the npm package under
 * rules/public-core/. Their digests are verified at runtime.
 */
export class BundledPublicCoreRulepackProvider implements RulepackProvider {
  readonly name = 'BundledPublicCoreRulepackProvider';

  async resolve(): Promise<ResolvedRulepack> {
    // Resolve package-relative path to the bundled Public Core
    // dist/mcp/../../rules/public-core/ → rules/public-core/
    const moduleDir = path.dirname(url.fileURLToPath(import.meta.url));
    // From dist/engines/ai-security/ to rules/public-core/
    const rulesDir = path.resolve(moduleDir, '..', '..', '..', 'rules', 'public-core');
    const rulepackPath = path.join(rulesDir, 'haiec-ai-security.yml');
    const manifestPath = path.join(rulesDir, 'manifest.json');

    // Verify rulepack exists
    try {
      await fs.access(rulepackPath);
    } catch {
      throw new RulepackProviderError(
        'RULEPACK_MISSING',
        `Bundled Public Core rulepack not found: ${rulepackPath}. The npm package may be corrupted.`,
      );
    }

    // Verify manifest exists
    try {
      await fs.access(manifestPath);
    } catch {
      throw new RulepackProviderError(
        'MANIFEST_MISSING',
        `Bundled Public Core manifest not found: ${manifestPath}. The npm package may be corrupted.`,
      );
    }

    // Read files
    const yamlContent = await fs.readFile(rulepackPath);
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');

    // Compute digests
    const rulepackDigest = `sha256:${createHash('sha256').update(yamlContent).digest('hex')}`;
    const manifestDigest = `sha256:${createHash('sha256').update(manifestContent, 'utf-8').digest('hex')}`;

    // Verify digests — fail closed if tampered
    if (rulepackDigest !== PUBLIC_CORE_EXPECTED_RULEPACK_DIGEST) {
      throw new RulepackProviderError(
        'DIGEST_MISMATCH',
        `Bundled Public Core rulepack digest mismatch. Expected ${PUBLIC_CORE_EXPECTED_RULEPACK_DIGEST}, got ${rulepackDigest}. The file may be corrupted or tampered with.`,
      );
    }
    if (manifestDigest !== PUBLIC_CORE_EXPECTED_MANIFEST_DIGEST) {
      throw new RulepackProviderError(
        'DIGEST_MISMATCH',
        `Bundled Public Core manifest digest mismatch. Expected ${PUBLIC_CORE_EXPECTED_MANIFEST_DIGEST}, got ${manifestDigest}. The file may be corrupted or tampered with.`,
      );
    }

    // Parse manifest
    let manifest: RulepackManifest;
    try {
      manifest = JSON.parse(manifestContent) as RulepackManifest;
    } catch {
      throw new RulepackProviderError('RULEPACK_INVALID', `Bundled Public Core manifest is not valid JSON.`);
    }

    return {
      rulepackPath: path.resolve(rulepackPath),
      manifestPath: path.resolve(manifestPath),
      rulepackVersion: manifest.rulepackVersion,
      rulepackDigest,
      manifestVersion: manifest.manifestVersion,
      manifestDigest,
      manifest,
    };
  }
}

/**
 * Private local rulepack provider — resolves from environment variables.
 *
 * HAIEC_RULEPACK_PATH: absolute path to the canonical YAML rulepack
 * HAIEC_MANIFEST_PATH: absolute path to the canonical manifest JSON
 *
 * This is a DEVELOPMENT OVERRIDE for testing private rulepacks.
 * The private rulepack is gitignored and never committed.
 */
export class PrivateLocalRulepackProvider implements RulepackProvider {
  readonly name = 'PrivateLocalRulepackProvider';

  constructor(
    private readonly rulepackPath: string,
    private readonly manifestPath: string,
  ) {}

  async resolve(): Promise<ResolvedRulepack> {
    try {
      await fs.access(this.rulepackPath);
    } catch {
      throw new RulepackProviderError(
        'RULEPACK_MISSING',
        `Rulepack not found at: ${this.rulepackPath}. Set HAIEC_RULEPACK_PATH to the canonical rulepack YAML.`,
      );
    }

    try {
      await fs.access(this.manifestPath);
    } catch {
      throw new RulepackProviderError(
        'MANIFEST_MISSING',
        `Manifest not found at: ${this.manifestPath}. Set HAIEC_MANIFEST_PATH to the canonical manifest JSON.`,
      );
    }

    const manifestContent = await fs.readFile(this.manifestPath, 'utf-8');
    let manifest: RulepackManifest;
    try {
      manifest = JSON.parse(manifestContent) as RulepackManifest;
    } catch {
      throw new RulepackProviderError('RULEPACK_INVALID', `Manifest is not valid JSON: ${this.manifestPath}`);
    }

    const yamlContent = await fs.readFile(this.rulepackPath);
    const rulepackDigest = `sha256:${createHash('sha256').update(yamlContent).digest('hex')}`;
    const manifestDigest = `sha256:${createHash('sha256').update(manifestContent, 'utf-8').digest('hex')}`;

    return {
      rulepackPath: path.resolve(this.rulepackPath),
      manifestPath: path.resolve(this.manifestPath),
      rulepackVersion: manifest.rulepackVersion,
      rulepackDigest,
      manifestVersion: manifest.manifestVersion,
      manifestDigest,
      manifest,
    };
  }

  static fromEnv(): PrivateLocalRulepackProvider | null {
    const rulepackPath = process.env.HAIEC_RULEPACK_PATH;
    const manifestPath = process.env.HAIEC_MANIFEST_PATH;
    if (!rulepackPath || !manifestPath) return null;
    return new PrivateLocalRulepackProvider(rulepackPath, manifestPath);
  }
}

/**
 * Synthetic test rulepack provider — returns a harmless test rulepack.
 *
 * TEST ONLY — NOT HAIEC PRODUCTION SECURITY COVERAGE.
 */
export class SyntheticTestRulepackProvider implements RulepackProvider {
  readonly name = 'SyntheticTestRulepackProvider';

  constructor(
    private readonly rulepackPath: string,
    private readonly manifestPath: string,
  ) {}

  async resolve(): Promise<ResolvedRulepack> {
    const yamlContent = await fs.readFile(this.rulepackPath);
    const manifestContent = await fs.readFile(this.manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent) as RulepackManifest;

    return {
      rulepackPath: path.resolve(this.rulepackPath),
      manifestPath: path.resolve(this.manifestPath),
      rulepackVersion: manifest.rulepackVersion,
      rulepackDigest: `sha256:${createHash('sha256').update(yamlContent).digest('hex')}`,
      manifestVersion: manifest.manifestVersion,
      manifestDigest: `sha256:${createHash('sha256').update(manifestContent, 'utf-8').digest('hex')}`,
      manifest,
    };
  }
}

/**
 * Resolve the default rulepack provider.
 * Order: explicit provider > env-based private > bundled Public Core.
 */
export async function resolveRulepack(
  provider?: RulepackProvider,
): Promise<ResolvedRulepack> {
  if (provider) return provider.resolve();
  // Development override: private rulepack via env vars
  const envProvider = PrivateLocalRulepackProvider.fromEnv();
  if (envProvider) return envProvider.resolve();
  // Default: bundled Public Core (no env vars needed)
  return new BundledPublicCoreRulepackProvider().resolve();
}
