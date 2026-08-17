/**
 * RFC 8785 JSON Canonicalization Scheme (JCS) wrapper.
 *
 * Wraps the `canonicalize` package behind our interface so the dependency
 * can be replaced without changing receipt contracts.
 *
 * Phase -0.5 decision: REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS.
 * Do NOT copy HAIEC's existing shallow JSON.stringify hashing.
 */
import canonicalize from 'canonicalize';

/**
 * Canonicalize a JSON-serializable value using RFC 8785 JCS.
 * Returns a deterministic string representation suitable for hashing.
 */
export function canonicalizeForDigest(value: unknown): string {
  const result = canonicalize(value);
  if (result === undefined) {
    throw new Error('canonicalize returned undefined — value is not JSON-serializable');
  }
  return result;
}
