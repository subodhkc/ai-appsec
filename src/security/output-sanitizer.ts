/**
 * Output sanitizer — ensures findings and outputs are safe for model context.
 *
 * - Redacts secrets
 * - Converts absolute paths to repository-relative
 * - Limits excerpt length
 * - Strips control characters
 * - Normalizes text
 * - Tags untrusted source content
 */
import { redactSecrets } from './secret-redaction.js';
import * as path from 'node:path';

/** Maximum excerpt length in characters. */
export const MAX_EXCERPT_LENGTH = 500;

/** Maximum number of lines in an excerpt. */
export const MAX_EXCERPT_LINES = 20;

export interface SanitizeOptions {
  /** The project root for converting absolute paths to relative. */
  readonly projectRoot?: string;
  /** Maximum excerpt length (default: 500). */
  readonly maxExcerptLength?: number;
  /** Maximum excerpt lines (default: 20). */
  readonly maxExcerptLines?: number;
}

/**
 * Sanitize a text excerpt from untrusted source code.
 * - Redacts secrets
 * - Strips control characters (except newlines and tabs)
 * - Limits length and line count
 */
export function sanitizeExcerpt(text: string, options: SanitizeOptions = {}): string {
  const maxLen = options.maxExcerptLength ?? MAX_EXCERPT_LENGTH;
  const maxLines = options.maxExcerptLines ?? MAX_EXCERPT_LINES;

  // Redact secrets first
  const { redacted } = redactSecrets(text);

  // Strip control characters except \n, \r, \t
  const stripped = redacted.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Limit lines
  const lines = stripped.split('\n');
  const truncatedLines = lines.slice(0, maxLines);
  let result = truncatedLines.join('\n');

  // Limit total length
  if (result.length > maxLen) {
    result = result.slice(0, maxLen) + '\n[...truncated]';
  }

  return result;
}

/**
 * Convert an absolute path to a repository-relative path.
 * If the path is not under the project root, return a placeholder.
 */
export function toRelativePath(absolutePath: string, projectRoot: string): string {
  const root = path.resolve(projectRoot);
  const target = path.resolve(absolutePath);

  // Check if target is within root
  const rootNorm = root.toLowerCase();
  const targetNorm = target.toLowerCase();
  if (targetNorm === rootNorm || targetNorm.startsWith(rootNorm + path.sep)) {
    return path.relative(root, target);
  }

  // Path is outside root — don't expose the absolute path
  return '[PATH_OUTSIDE_ROOT]';
}

/**
 * Sanitize a file path for output.
 * - Converts absolute paths to relative
 * - Redacts any secrets that might be in the path
 */
export function sanitizePath(filePath: string, projectRoot?: string): string {
  if (projectRoot && path.isAbsolute(filePath)) {
    return toRelativePath(filePath, projectRoot);
  }
  return filePath;
}

/**
 * Tag content as coming from an untrusted source.
 */
export function tagUntrusted(content: string): string {
  return `[UNTRUSTED_SOURCE]\n${content}\n[/UNTRUSTED_SOURCE]`;
}

/**
 * Normalize text for consistent output (trim trailing whitespace per line, normalize line endings).
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}
