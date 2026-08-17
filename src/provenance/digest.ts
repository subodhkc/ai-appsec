/**
 * Digest utility — SHA-256 hashing of canonicalized JSON.
 *
 * Uses Node built-in crypto only. No external hashing packages.
 * Observational metadata (timestamps, duration, execution ID) must NOT
 * be included in the digest input.
 */
import { createHash } from 'node:crypto';
import { canonicalizeForDigest } from './canonicalize.js';

/**
 * Compute the SHA-256 digest of a JSON-serializable value.
 * The value is canonicalized using RFC 8785 JCS before hashing.
 */
export function computeDigest(value: unknown): string {
  const canonical = canonicalizeForDigest(value);
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * Compute the SHA-256 digest of a raw string (no canonicalization).
 */
export function computeDigestOfString(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Verify that a value produces the expected digest.
 */
export function verifyDigest(value: unknown, expectedDigest: string): boolean {
  const actual = computeDigest(value);
  return actual === expectedDigest;
}
