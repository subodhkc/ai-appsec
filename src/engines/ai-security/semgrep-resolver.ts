/**
 * Semgrep dependency resolver — locates and verifies the Semgrep executable.
 *
 * Resolution order:
 * 1. HAIEC-managed Semgrep (installed by `haiec-agent-security setup`)
 * 2. Explicitly configured executable path (HAIEC_SEMGREP_PATH env var)
 * 3. Semgrep executable available on PATH
 * 4. MISSING (setup required)
 *
 * For v1, Semgrep 1.173.0 is required (exact match).
 *
 * This module NEVER:
 * - Silently installs Semgrep
 * - Downloads binaries
 * - Runs pip/pipx/uv
 * - Invokes Docker or WSL
 * - Changes PATH
 * - Modifies the user's environment
 *
 * The resolver knows the HAIEC-managed location without requiring PATH modification.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs/promises';

const execFileAsync = promisify(execFile);

/** Required Semgrep version for v1. */
export const REQUIRED_SEMGREP_VERSION = '1.173.0';

/**
 * Engine preflight status model.
 * This is the authoritative Semgrep dependency state.
 */
export type EngineReadiness =
  | 'READY'           // Exact version found and executable
  | 'MISSING'         // No Semgrep found anywhere
  | 'WRONG_VERSION'   // Semgrep found but version doesn't match
  | 'UNEXECUTABLE'    // Semgrep found but cannot execute
  | 'SETUP_REQUIRED'  // No Semgrep, but setup is available
  | 'SETUP_UNAVAILABLE'; // No Semgrep, and setup cannot help (unsupported OS)

/**
 * Remediation codes for agent self-recovery.
 */
export type RemediationCode =
  | 'READY'
  | 'RUN_HAIEC_SETUP'
  | 'INSTALL_SEMGREP_1_173_0'
  | 'SETUP_UNAVAILABLE_PLATFORM'
  | 'NONE';

export interface SemgrepResolution {
  /** Engine readiness state. */
  readonly readiness: EngineReadiness;
  /** Legacy status field for backward compat. */
  readonly status: 'AVAILABLE_SUPPORTED_VERSION' | 'AVAILABLE_UNSUPPORTED_VERSION' | 'MISSING' | 'EXECUTION_ERROR';
  /** Path to the executable (null if not found). */
  readonly executablePath: string | null;
  /** Detected version (null if not determined). */
  readonly version: string | null;
  /** Required version. */
  readonly requiredVersion: string;
  /** Human-readable message. */
  readonly message: string;
  /** Remediation code for agent self-recovery. */
  readonly remediationCode: RemediationCode;
  /** Whether explicit setup is available for this platform. */
  readonly setupAvailable: boolean;
  /** Recommended command to fix the issue. */
  readonly recommendedCommand: string | null;
}

export interface SemgrepResolverOptions {
  /** Explicitly configured Semgrep executable path (highest priority after managed). */
  readonly configuredPath?: string;
  /** Override the required version (for testing). */
  readonly requiredVersion?: string;
  /** Override HAIEC_HOME (for testing). */
  readonly haiecHome?: string;
}

/**
 * Get the HAIEC home directory.
 * Priority: HAIEC_HOME env var > OS-appropriate app data location.
 */
export function getHaiecHome(override?: string): string {
  if (override) return path.resolve(override);
  const envHome = process.env.HAIEC_HOME;
  if (envHome) return path.resolve(envHome);

  const home = os.homedir();
  if (process.platform === 'win32') {
    return path.join(home, 'AppData', 'Local', 'haiec');
  } else if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'haiec');
  } else {
    return path.join(home, '.local', 'share', 'haiec');
  }
}

/**
 * Get the path to the HAIEC-managed Semgrep executable.
 */
export function getManagedSemgrepPath(haiecHome?: string): string {
  const home = getHaiecHome(haiecHome);
  if (process.platform === 'win32') {
    return path.join(home, 'semgrep', 'Scripts', 'semgrep.exe');
  } else {
    return path.join(home, 'semgrep', 'bin', 'semgrep');
  }
}

/**
 * Check if the HAIEC-managed Semgrep exists.
 */
export async function managedSemgrepExists(haiecHome?: string): Promise<boolean> {
  try {
    await fs.access(getManagedSemgrepPath(haiecHome));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if explicit setup is available for this platform.
 * Setup requires at least one of: uv, pipx, or python3.
 */
export async function isSetupAvailable(): Promise<boolean> {
  // Check for uv
  try {
    await execFileAsync('uv', ['--version'], { timeout: 5000, shell: false, windowsHide: true });
    return true;
  } catch { /* try next */ }

  // Check for pipx
  try {
    await execFileAsync('pipx', ['--version'], { timeout: 5000, shell: false, windowsHide: true });
    return true;
  } catch { /* try next */ }

  // Check for python3
  try {
    await execFileAsync('python3', ['--version'], { timeout: 5000, shell: false, windowsHide: true });
    return true;
  } catch { /* try next */ }

  // Check for python (Windows)
  try {
    await execFileAsync('python', ['--version'], { timeout: 5000, shell: false, windowsHide: true });
    return true;
  } catch { /* not available */ }

  return false;
}

export class SemgrepResolver {
  private readonly configuredPath?: string;
  private readonly requiredVersion: string;
  private readonly haiecHome?: string;

  constructor(options: SemgrepResolverOptions = {}) {
    this.configuredPath = options.configuredPath;
    this.requiredVersion = options.requiredVersion ?? REQUIRED_SEMGREP_VERSION;
    this.haiecHome = options.haiecHome;
  }

  /**
   * Resolve the Semgrep executable.
   * Does NOT install, download, or modify the environment.
   */
  async resolve(): Promise<SemgrepResolution> {
    // 1. Try HAIEC-managed Semgrep first
    const managedPath = getManagedSemgrepPath(this.haiecHome);
    const managedResult = await this.tryExecutable(managedPath);
    if (managedResult) return managedResult;

    // 2. Try explicitly configured path
    if (this.configuredPath) {
      const result = await this.tryExecutable(this.configuredPath);
      if (result) return result;
    }

    // 3. Try semgrep on PATH
    const pathResult = await this.tryExecutable('semgrep');
    if (pathResult) return pathResult;

    // 4. Missing — determine if setup is available
    const setupAvailable = await isSetupAvailable();
    if (setupAvailable) {
      return {
        readiness: 'SETUP_REQUIRED',
        status: 'MISSING',
        executablePath: null,
        version: null,
        requiredVersion: this.requiredVersion,
        message: `Semgrep ${this.requiredVersion} not found. Run 'haiec-agent-security setup' to install it.`,
        remediationCode: 'RUN_HAIEC_SETUP',
        setupAvailable: true,
        recommendedCommand: 'haiec-agent-security setup',
      };
    }

    return {
      readiness: 'SETUP_UNAVAILABLE',
      status: 'MISSING',
      executablePath: null,
      version: null,
      requiredVersion: this.requiredVersion,
      message: `Semgrep ${this.requiredVersion} not found, and automatic setup is not available on this platform. Install Semgrep ${this.requiredVersion} manually.`,
      remediationCode: 'INSTALL_SEMGREP_1_173_0',
      setupAvailable: false,
      recommendedCommand: `pip install semgrep==${this.requiredVersion}`,
    };
  }

  private async tryExecutable(executable: string): Promise<SemgrepResolution | null> {
    // Try up to 2 times — Semgrep cold start on Windows can be slow
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { stdout } = await execFileAsync(executable, ['--version'], {
          timeout: 30000, // 30s — cold start can take 10+ seconds on Windows
          shell: false,
          windowsHide: true,
        });
        const version = stdout.trim();
        if (version === this.requiredVersion) {
          return {
            readiness: 'READY',
            status: 'AVAILABLE_SUPPORTED_VERSION',
            executablePath: executable,
            version,
            requiredVersion: this.requiredVersion,
            message: `Semgrep ${version} found.`,
            remediationCode: 'READY',
            setupAvailable: true,
            recommendedCommand: null,
          };
        }
        return {
          readiness: 'WRONG_VERSION',
          status: 'AVAILABLE_UNSUPPORTED_VERSION',
          executablePath: executable,
          version,
          requiredVersion: this.requiredVersion,
          message: `Semgrep ${version} found, but version ${this.requiredVersion} is required. Run 'haiec-agent-security setup' to install the correct version.`,
          remediationCode: 'RUN_HAIEC_SETUP',
          setupAvailable: true,
          recommendedCommand: 'haiec-agent-security setup',
        };
      } catch (e) {
        const err = e as Error;
        // On first attempt, retry (might be cold start timeout)
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        // Second attempt failed — determine if file exists or not
        try {
          await fs.access(executable);
          // File exists but execution failed
          return {
            readiness: 'UNEXECUTABLE',
            status: 'EXECUTION_ERROR',
            executablePath: executable,
            version: null,
            requiredVersion: this.requiredVersion,
            message: `Semgrep found at ${executable} but could not be executed: ${err.message}`,
            remediationCode: 'RUN_HAIEC_SETUP',
            setupAvailable: true,
            recommendedCommand: 'haiec-agent-security setup',
          };
        } catch {
          // File doesn't exist — try next source
          return null;
        }
      }
    }
    return null;
  }
}
