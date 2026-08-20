/**
 * Tests for safe Semgrep execution — no shell injection.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const RUNNER = path.resolve(__dirname, '..', '..', 'src', 'engines', 'ai-security', 'semgrep-runner.ts');

describe('Safe Semgrep execution', () => {
  it('uses spawn with shell:false (no shell invocation)', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes('spawn('));
    assert.ok(content.includes('shell: false'));
  });

  it('uses argument arrays (not shell strings)', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes('args:'));
    assert.ok(content.includes('args.push('));
    assert.ok(!/exec\(["'`]/.test(content));
  });

  it('disables Semgrep metrics', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes("'--metrics'"));
    assert.ok(content.includes("'off'"));
  });

  it('does not use registry configs or remote configs', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(!/p\/[a-z]/.test(content));
    assert.ok(!/--config.*https?:\/\//.test(content));
  });

  it('implements timeout handling', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes('setTimeout'));
    assert.ok(content.includes('SIGTERM'));
    assert.ok(content.includes('SIGKILL'));
    assert.ok(content.includes('timedOut'));
  });

  it('bounds stdout size', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes('MAX_STDOUT_BYTES'));
  });

  it('bounds stderr size', async () => {
    const content = await fs.readFile(RUNNER, 'utf-8');
    assert.ok(content.includes('MAX_STDERR_BYTES'));
  });
});
