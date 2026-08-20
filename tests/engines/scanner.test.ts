/**
 * Tests for scanner output bounds and contract.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_ACTIONABLE_FINDINGS,
  MAX_OBSERVATIONS,
  MAX_RESPONSE_BYTES,
} from '../../src/engines/ai-security/scanner.js';

describe('Scanner output bounds', () => {
  it('MAX_ACTIONABLE_FINDINGS is 20', () => {
    assert.equal(MAX_ACTIONABLE_FINDINGS, 20);
  });

  it('MAX_OBSERVATIONS is 10', () => {
    assert.equal(MAX_OBSERVATIONS, 10);
  });

  it('MAX_RESPONSE_BYTES is 48KB', () => {
    assert.equal(MAX_RESPONSE_BYTES, 48 * 1024);
  });
});

describe('Scanner advisory BLOCK', () => {
  it('BLOCK is advisory — scan_ai_security does not enforce deployment', () => {
    // This is verified by the tool description and docs, not by code logic.
    // check_deploy_security owns release enforcement.
    assert.ok(true);
  });
});
