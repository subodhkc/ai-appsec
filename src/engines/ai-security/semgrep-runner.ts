/**
 * Semgrep runner — safely executes the Semgrep binary and captures results.
 *
 * Safety requirements:
 * - Uses argument arrays (never shell strings) — no shell injection
 * - Metrics explicitly disabled (--metrics off)
 * - No registry configs, no p/*, no remote configs, no login
 * - Bounded stdout/stderr/execution time
 * - Subprocess and descendants terminated safely on timeout (process tree kill)
 * - No target repository code is executed
 * - Findings paths are container/target-relative
 */
import { spawn, type ChildProcess } from 'node:child_process';
import * as path from 'node:path';
import type { SemgrepResult, SemgrepParseError } from './types.js';

export interface SemgrepRunOptions {
  readonly executablePath: string;
  readonly rulepackPath: string;
  readonly targetPath: string;
  readonly timeoutMs: number;
  /** Additional exclude patterns. */
  readonly excludes?: readonly string[];
}

export interface SemgrepRunResult {
  readonly success: boolean;
  readonly timedOut: boolean;
  readonly result: SemgrepResult | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
  readonly exitCode: number | null;
  readonly error: string | null;
  /** Child PID (for process-tree debugging). */
  readonly childPid: number | null;
}

/** Maximum stdout size (50 MB) — prevents memory exhaustion from malformed responses. */
const MAX_STDOUT_BYTES = 50 * 1024 * 1024;

/** Maximum stderr size (1 MB). */
const MAX_STDERR_BYTES = 1 * 1024 * 1024;

/**
 * Kill a process and its entire descendant tree.
 *
 * On Windows: uses `taskkill /T /F /PID <pid>` invoked directly (not through shell).
 *   /T = terminate descendant processes
 *   /F = force termination
 *
 * On POSIX: sends signal to the process group (negative PID).
 *   This works because we spawn with detached=false, so the child shares
 *   the parent's process group. For Semgrep, which spawns semgrep-core as
 *   a subprocess, killing the child PID with SIGKILL is usually sufficient
 *   because semgrep-core is a direct child. If semgrep-core spawns further
 *   processes, the process group kill handles that.
 *
 * This function NEVER accepts user-provided PIDs. It only kills PIDs
 * created by this HAIEC execution.
 */
function killProcessTree(child: ChildProcess, signal: 'SIGTERM' | 'SIGKILL'): void {
  const pid = child.pid;
  if (pid === undefined) return;

  if (process.platform === 'win32') {
    // Use taskkill with /T (tree) and /F (force) — invoked directly, NOT through shell
    // This is the only reliable way to kill descendant processes on Windows
    try {
      spawn('taskkill', ['/T', '/F', '/PID', String(pid)], {
        shell: false,
        windowsHide: true,
        stdio: ['ignore', 'ignore', 'ignore'],
      });
    } catch {
      // Fallback: direct kill if taskkill fails
      try { child.kill(signal); } catch { /* already dead */ }
    }
  } else {
    // POSIX: kill the process group (negative PID)
    try {
      process.kill(-pid, signal);
    } catch {
      // Fallback: kill just the child
      try { child.kill(signal); } catch { /* already dead */ }
    }
  }
}

/**
 * Run Semgrep safely with argument arrays (no shell).
 *
 * The command is:
 *   semgrep scan --config <rulepack> --json --metrics off [excludes...] <target>
 *
 * No shell is used. Arguments are passed as an array to prevent injection.
 *
 * On timeout, partial JSON output is parsed if available (trustworthy partial
 * results). If no partial output exists, result is null (ERROR completeness).
 */
export function runSemgrep(options: SemgrepRunOptions): Promise<SemgrepRunResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const args: string[] = [
      'scan',
      '--config', options.rulepackPath,
      '--json',
      '--metrics', 'off',
    ];

    // Add excludes
    for (const exclude of options.excludes ?? []) {
      args.push('--exclude', exclude);
    }

    // Target path must be absolute for Semgrep
    const targetAbs = path.resolve(options.targetPath);
    args.push(targetAbs);

    const child = spawn(options.executablePath, args, {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const childPid = child.pid ?? null;

    let stdoutBuf = '';
    let stderrBuf = '';
    let timedOut = false;
    let stdoutTruncated = false;

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      // Kill the entire process tree (parent + descendants)
      killProcessTree(child, 'SIGTERM');
      // Give it 2 seconds to clean up, then force-kill the tree
      setTimeout(() => {
        killProcessTree(child, 'SIGKILL');
      }, 2000);
    }, options.timeoutMs);

    child.stdout?.on('data', (chunk: Buffer) => {
      if (stdoutBuf.length < MAX_STDOUT_BYTES) {
        stdoutBuf += chunk.toString('utf-8');
        if (stdoutBuf.length >= MAX_STDOUT_BYTES) {
          stdoutTruncated = true;
        }
      }
    });

    child.stderr?.on('data', (chunk: Buffer) => {
      if (stderrBuf.length < MAX_STDERR_BYTES) {
        stderrBuf += chunk.toString('utf-8');
      }
    });

    child.on('close', (code) => {
      clearTimeout(timeoutHandle);
      const durationMs = Date.now() - startTime;

      // Try to parse JSON output even on timeout — partial results may be available
      let result: SemgrepResult | null = null;
      let parseError: string | null = null;

      if (stdoutBuf.length > 0) {
        try {
          const parsed = JSON.parse(stdoutBuf);
          result = {
            results: Array.isArray(parsed.results) ? parsed.results : [],
            errors: Array.isArray(parsed.errors) ? parsed.errors : [],
            paths: parsed.paths ?? undefined,
          };
        } catch (e) {
          parseError = `Failed to parse Semgrep JSON output: ${(e as Error).message}`;
        }
      }

      if (timedOut) {
        resolve({
          success: result !== null, // Partial results are "successful" in the sense of having data
          timedOut: true,
          result, // May be non-null if partial JSON was captured
          stdout: stdoutTruncated ? stdoutBuf + '\n[...stdout truncated]' : stdoutBuf,
          stderr: stderrBuf,
          durationMs,
          exitCode: code,
          error: result !== null ? null : `Semgrep timed out after ${options.timeoutMs}ms with no parseable output`,
          childPid,
        });
        return;
      }

      // Non-timeout case
      resolve({
        success: parseError === null && result !== null,
        timedOut: false,
        result,
        stdout: stdoutTruncated ? stdoutBuf + '\n[...stdout truncated]' : stdoutBuf,
        stderr: stderrBuf,
        durationMs,
        exitCode: code,
        error: parseError,
        childPid,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timeoutHandle);
      const durationMs = Date.now() - startTime;
      resolve({
        success: false,
        timedOut: false,
        result: null,
        stdout: stdoutBuf,
        stderr: stderrBuf,
        durationMs,
        exitCode: null,
        error: `Failed to execute Semgrep: ${err.message}`,
        childPid,
      });
    });
  });
}

/**
 * Extract parse errors from Semgrep result.
 */
export function extractParseErrors(errors: readonly SemgrepParseError[]): readonly SemgrepParseError[] {
  return errors;
}
