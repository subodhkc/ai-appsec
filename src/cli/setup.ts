/**
 * AI AppSec CLI — setup command.
 *
 * Explicitly installs an isolated HAIEC-managed Semgrep environment.
 *
 * Installation model priority:
 * 1. If exact qualified Semgrep already exists and is executable, use it.
 * 2. Else if exact HAIEC-managed Semgrep exists, use it.
 * 3. Else explicitly install an isolated HAIEC-managed Semgrep environment.
 *
 * For managed installation, prefer available tooling:
 * 1. uv (preferred — fastest, most isolated)
 * 2. pipx
 * 3. isolated Python virtual environment + pip
 *
 * Never installs globally. Never modifies PATH.
 *
 * This command MAY use network access because the user explicitly invoked setup.
 * The normal scan path remains network-free.
 */
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { getHaiecHome, getManagedSemgrepPath, REQUIRED_SEMGREP_VERSION, managedSemgrepExists, SemgrepResolver } from '../engines/ai-security/semgrep-resolver.js';

const execFileAsync = promisify(execFile);

export interface SetupResult {
  readonly schemaVersion: string;
  readonly action: 'ALREADY_READY' | 'INSTALLED' | 'FAILED' | 'NO_TOOLING';
  readonly toolUsed: string | null;
  readonly managedPath: string;
  readonly semgrepVersion: string | null;
  readonly validated: boolean;
  readonly message: string;
  readonly networkActivity: string[];
  readonly timestamp: string;
}

const SETUP_SCHEMA_VERSION = '1.0.0';

/**
 * Check if a tool is available.
 */
async function checkTool(name: string): Promise<boolean> {
  try {
    await execFileAsync(name, ['--version'], { timeout: 5000, shell: false, windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Run a command and stream output to stderr.
 */
function runCommand(cmd: string, args: string[], cwd?: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      shell: false,
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d: Buffer) => { stderr += d.toString(); }); // route to stderr for diagnostics
    child.stderr?.on('data', (d: Buffer) => { stderr += d.toString(); });
    child.on('close', (code) => {
      resolve({ code: code ?? -1, stdout, stderr });
    });
    child.on('error', (err) => {
      resolve({ code: -1, stdout, stderr: err.message });
    });
  });
}

export async function runSetup(): Promise<SetupResult> {
  const haiecHome = getHaiecHome();
  const managedPath = getManagedSemgrepPath();
  const semgrepDir = path.join(haiecHome, 'semgrep');
  const networkActivity: string[] = [];

  // 1. Check if already ready
  const resolver = new SemgrepResolver();
  const current = await resolver.resolve();
  if (current.readiness === 'READY') {
    return {
      schemaVersion: SETUP_SCHEMA_VERSION,
      action: 'ALREADY_READY',
      toolUsed: null,
      managedPath,
      semgrepVersion: current.version,
      validated: true,
      message: `Semgrep ${current.version} is already available at ${current.executablePath}.`,
      networkActivity: [],
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Check available tooling
  const hasUv = await checkTool('uv');
  const hasPipx = await checkTool('pipx');
  const hasPython = process.platform === 'win32' ? await checkTool('python') : await checkTool('python3');

  if (!hasUv && !hasPipx && !hasPython) {
    return {
      schemaVersion: SETUP_SCHEMA_VERSION,
      action: 'NO_TOOLING',
      toolUsed: null,
      managedPath,
      semgrepVersion: null,
      validated: false,
      message: 'No Python tooling found (uv, pipx, or python3). Install one of: uv, pipx, or Python 3.10+.',
      networkActivity: [],
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Create HAIEC home directory
  try {
    await fs.mkdir(haiecHome, { recursive: true });
  } catch (e) {
    return {
      schemaVersion: SETUP_SCHEMA_VERSION,
      action: 'FAILED',
      toolUsed: null,
      managedPath,
      semgrepVersion: null,
      validated: false,
      message: `Failed to create HAIEC home directory: ${(e as Error).message}`,
      networkActivity,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Install using preferred tooling
  // Use a lock file for concurrency safety
  const lockPath = path.join(haiecHome, 'setup.lock');
  try {
    // Simple lock — create exclusively
    await fs.writeFile(lockPath, process.pid.toString(), { flag: 'wx' });
  } catch {
    return {
      schemaVersion: SETUP_SCHEMA_VERSION,
      action: 'FAILED',
      toolUsed: null,
      managedPath,
      semgrepVersion: null,
      validated: false,
      message: 'Another setup is already running. Wait for it to complete.',
      networkActivity: [],
      timestamp: new Date().toISOString(),
    };
  }

  try {
    let toolUsed: string | null = null;

    if (hasUv) {
      // uv: create venv and install semgrep
      networkActivity.push('uv venv (local isolated environment creation)');
      networkActivity.push(`uv pip install semgrep==${REQUIRED_SEMGREP_VERSION} (from PyPI)`);
      toolUsed = 'uv';

      // Remove old install if exists
      try { await fs.rm(semgrepDir, { recursive: true, force: true }); } catch { /* ok */ }
      await fs.mkdir(semgrepDir, { recursive: true });

      const venvResult = await runCommand('uv', ['venv', semgrepDir], haiecHome);
      if (venvResult.code !== 0) {
        throw new Error(`uv venv failed: ${venvResult.stderr}`);
      }

      const pipResult = await runCommand('uv', ['pip', 'install', `semgrep==${REQUIRED_SEMGREP_VERSION}`], semgrepDir);
      if (pipResult.code !== 0) {
        throw new Error(`uv pip install failed: ${pipResult.stderr}`);
      }
    } else if (hasPipx) {
      // pipx: install to isolated location
      networkActivity.push(`pipx install semgrep==${REQUIRED_SEMGREP_VERSION} (from PyPI)`);
      toolUsed = 'pipx';

      try { await fs.rm(semgrepDir, { recursive: true, force: true }); } catch { /* ok */ }
      await runCommand('pipx', ['install', `semgrep==${REQUIRED_SEMGREP_VERSION}`, '--pip-args', `--target=${semgrepDir}`]);
    } else if (hasPython) {
      // Python venv + pip
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      networkActivity.push(`${pythonCmd} -m venv (local isolated environment creation)`);
      networkActivity.push(`pip install semgrep==${REQUIRED_SEMGREP_VERSION} (from PyPI)`);
      toolUsed = 'venv';

      try { await fs.rm(semgrepDir, { recursive: true, force: true }); } catch { /* ok */ }
      await fs.mkdir(semgrepDir, { recursive: true });

      const venvResult = await runCommand(pythonCmd, ['-m', 'venv', semgrepDir], haiecHome);
      if (venvResult.code !== 0) {
        throw new Error(`python venv failed: ${venvResult.stderr}`);
      }

      const pipCmd = process.platform === 'win32'
        ? path.join(semgrepDir, 'Scripts', 'pip.exe')
        : path.join(semgrepDir, 'bin', 'pip');
      const pipResult = await runCommand(pipCmd, ['install', `semgrep==${REQUIRED_SEMGREP_VERSION}`], semgrepDir);
      if (pipResult.code !== 0) {
        throw new Error(`pip install failed: ${pipResult.stderr}`);
      }
    }

    // 5. Validate installation
    const exists = await managedSemgrepExists();
    if (!exists) {
      throw new Error(`Semgrep not found at expected path: ${managedPath}`);
    }

    // Run semgrep --version
    try {
      const { stdout } = await execFileAsync(managedPath, ['--version'], {
        timeout: 15000,
        shell: false,
        windowsHide: true,
      });
      const version = stdout.trim();
      if (version !== REQUIRED_SEMGREP_VERSION) {
        throw new Error(`Version mismatch: expected ${REQUIRED_SEMGREP_VERSION}, got ${version}`);
      }

      return {
        schemaVersion: SETUP_SCHEMA_VERSION,
        action: 'INSTALLED',
        toolUsed,
        managedPath,
        semgrepVersion: version,
        validated: true,
        message: `Semgrep ${version} installed and validated at ${managedPath}.`,
        networkActivity,
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      throw new Error(`Semgrep validation failed: ${(e as Error).message}`);
    }
  } catch (e) {
    // Cleanup failed install
    try { await fs.rm(semgrepDir, { recursive: true, force: true }); } catch { /* ok */ }
    return {
      schemaVersion: SETUP_SCHEMA_VERSION,
      action: 'FAILED',
      toolUsed: null,
      managedPath,
      semgrepVersion: null,
      validated: false,
      message: `Setup failed: ${(e as Error).message}`,
      networkActivity,
      timestamp: new Date().toISOString(),
    };
  } finally {
    // Release lock
    try { await fs.unlink(lockPath); } catch { /* ok */ }
  }
}

export function formatSetupText(result: SetupResult): string {
  const lines: string[] = [
    'AI AppSec — setup',
    '',
    `Action: ${result.action}`,
    `Tool used: ${result.toolUsed ?? 'none'}`,
    `Managed path: ${result.managedPath}`,
    `Semgrep version: ${result.semgrepVersion ?? 'not installed'}`,
    `Validated: ${result.validated ? 'YES' : 'NO'}`,
    '',
    result.message,
  ];
  if (result.networkActivity.length > 0) {
    lines.push('', 'Network activity:');
    for (const activity of result.networkActivity) {
      lines.push(`  - ${activity}`);
    }
  }
  return lines.join('\n');
}
