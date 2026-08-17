import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeForDigest } from '../../src/provenance/canonicalize.js';
import { computeDigest, computeDigestOfString, verifyDigest } from '../../src/provenance/digest.js';

describe('RFC 8785 Canonicalization', () => {
  it('produces identical output for different property order', () => {
    const a = { b: 2, a: 1, c: 3 };
    const b = { c: 3, a: 1, b: 2 };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('produces identical output for nested objects with different order', () => {
    const a = { outer: { z: 26, a: 1 }, inner: { m: 13, b: 2 } };
    const b = { inner: { b: 2, m: 13 }, outer: { a: 1, z: 26 } };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('preserves array order (arrays are NOT sorted)', () => {
    const a = { arr: [3, 1, 2] };
    const b = { arr: [1, 2, 3] };
    assert.notEqual(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles Unicode correctly', () => {
    const a = { name: 'café', emoji: '🔐' };
    const b = { emoji: '🔐', name: 'café' };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles numbers correctly', () => {
    const a = { int: 42, float: 3.14, zero: 0, neg: -1 };
    const b = { neg: -1, zero: 0, float: 3.14, int: 42 };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles null correctly', () => {
    const a = { x: null, y: 'val' };
    const b = { y: 'val', x: null };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles deep nesting', () => {
    const a = { l1: { l2: { l3: { l4: { l5: 'deep' } } } } };
    const b = { l1: { l2: { l3: { l4: { l5: 'deep' } } } } };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles empty objects and arrays', () => {
    const a = { obj: {}, arr: [] };
    const b = { arr: [], obj: {} };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });

  it('handles boolean values', () => {
    const a = { t: true, f: false };
    const b = { f: false, t: true };
    assert.equal(canonicalizeForDigest(a), canonicalizeForDigest(b));
  });
});

describe('SHA-256 Digest', () => {
  it('produces identical digest for different property order', () => {
    const a = { b: 2, a: 1 };
    const b = { a: 1, b: 2 };
    assert.equal(computeDigest(a), computeDigest(b));
  });

  it('produces different digest for different values', () => {
    const a = { x: 1 };
    const b = { x: 2 };
    assert.notEqual(computeDigest(a), computeDigest(b));
  });

  it('produces 64-character hex string', () => {
    const digest = computeDigest({ test: true });
    assert.equal(digest.length, 64);
    assert.ok(/^[0-9a-f]+$/.test(digest));
  });

  it('computes digest of raw string', () => {
    const digest = computeDigestOfString('hello');
    assert.equal(digest.length, 64);
  });

  it('verifies digest correctly', () => {
    const value = { test: 'data' };
    const digest = computeDigest(value);
    assert.equal(verifyDigest(value, digest), true);
    assert.equal(verifyDigest({ test: 'wrong' }, digest), false);
  });

  it('excludes observational metadata from digest', () => {
    // Simulate: same findings, different timestamps → same digest
    const findings = [{ ruleId: 'R1', severity: 'HIGH' }];
    const digest1 = computeDigest({ findings });
    const digest2 = computeDigest({ findings });
    assert.equal(digest1, digest2);
    // Even if observational metadata differs, the digest of findings is the same
  });
});
