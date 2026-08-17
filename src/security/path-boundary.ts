/**
 * Path boundary utility — ensures all file access stays within an allowed project root.
 *
 * Requirements:
 * - Explicit allowed project root
 * - Canonical/real-path resolution
 * - Reject traversal outside root
 * - Reject symlink escape
 * - Reject unrelated absolute paths
 * - Cross-platform: Windows, macOS, Linux
 * - Handle: drive letters, UNC paths, case sensitivity
 */
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export class PathBoundaryError extends Error {
  readonly code: 'PATH_OUTSIDE_ROOT' | 'SYMLINK_ESCAPE' | 'INVALID_PATH';
  constructor(code: PathBoundaryError['code'], message: string) {
    super(message);
    this.code = code;
    this.name = 'PathBoundaryError';
  }
}

export interface PathBoundaryOptions {
  /** Whether to resolve symlinks (default: true). */
  readonly resolveSymlinks?: boolean;
}

export class PathBoundary {
  private readonly root: string;
  private readonly rootNormalized: string;

  private constructor(root: string) {
    this.root = root;
    this.rootNormalized = normalizePath(root);
  }

  /**
   * Create a PathBoundary rooted at the given directory.
   * The root is resolved to an absolute, real path.
   */
  static async create(root: string): Promise<PathBoundary> {
    if (!root || typeof root !== 'string') {
      throw new PathBoundaryError('INVALID_PATH', 'Root path must be a non-empty string');
    }
    const resolved = path.resolve(root);
    const real = await fs.realpath(resolved);
    const stat = await fs.stat(real);
    if (!stat.isDirectory()) {
      throw new PathBoundaryError('INVALID_PATH', `Root is not a directory: ${real}`);
    }
    return new PathBoundary(real);
  }

  /**
   * Resolve a target path relative to the root, enforcing boundary constraints.
   * Throws PathBoundaryError if the path escapes the root.
   */
  async resolve(target: string, options: PathBoundaryOptions = {}): Promise<string> {
    const { resolveSymlinks = true } = options;

    if (!target || typeof target !== 'string') {
      throw new PathBoundaryError('INVALID_PATH', 'Target path must be a non-empty string');
    }

    // Reject UNC/network paths on Windows (they reference external resources)
    if (isUNCPath(target)) {
      throw new PathBoundaryError('PATH_OUTSIDE_ROOT', `UNC paths are not allowed: ${target}`);
    }

    // Resolve relative to root
    const joined = path.isAbsolute(target) ? target : path.join(this.root, target);
    const resolved = path.resolve(joined);

    // Check if resolved path is within root (before symlink resolution)
    if (!isWithinRoot(resolved, this.rootNormalized)) {
      throw new PathBoundaryError('PATH_OUTSIDE_ROOT', `Path escapes root: ${target}`);
    }

    // Resolve symlinks if requested
    if (resolveSymlinks) {
      let real: string;
      try {
        real = await fs.realpath(resolved);
      } catch {
        // Path doesn't exist — that's OK for some use cases
        // Use the resolved path as-is
        real = resolved;
      }

      if (!isWithinRoot(real, this.rootNormalized)) {
        throw new PathBoundaryError('SYMLINK_ESCAPE', `Symlink escapes root: ${target} -> ${real}`);
      }

      return real;
    }

    return resolved;
  }

  /**
   * Check if a path is within the root without resolving symlinks.
   */
  contains(target: string): boolean {
    if (!target || typeof target !== 'string') return false;
    if (isUNCPath(target)) return false;
    const joined = path.isAbsolute(target) ? target : path.join(this.root, target);
    const resolved = path.resolve(joined);
    return isWithinRoot(resolved, this.rootNormalized);
  }

  /** The canonical root path. */
  getRoot(): string {
    return this.root;
  }
}

/**
 * Normalize a path for comparison (handle case sensitivity, drive letters).
 */
function normalizePath(p: string): string {
  const resolved = path.resolve(p);
  // On Windows, normalize drive letter to uppercase and use backslashes
  if (process.platform === 'win32') {
    const upper = resolved.charAt(0).toUpperCase() + resolved.slice(1);
    return upper.toLowerCase();
  }
  return resolved.toLowerCase();
}

/**
 * Check if a path is within the root using normalized comparison.
 */
function isWithinRoot(target: string, rootNormalized: string): boolean {
  const targetNorm = normalizePath(target);
  if (targetNorm === rootNormalized) return true;
  // Ensure the target is a subdirectory of root
  const rootWithSep = rootNormalized.endsWith(path.sep) ? rootNormalized : rootNormalized + path.sep;
  return targetNorm.startsWith(rootWithSep);
}

/**
 * Detect UNC paths (Windows network paths like \\server\share).
 */
function isUNCPath(p: string): boolean {
  // Windows UNC: starts with \\ or // (forward slashes also accepted)
  return /^[\\/]{2}[^\\/]+[\\/]/.test(p);
}

/**
 * Convert a file:// URL to a path (useful for import.meta.url).
 */
export function urlToPath(url: string): string {
  return fileURLToPath(url);
}
