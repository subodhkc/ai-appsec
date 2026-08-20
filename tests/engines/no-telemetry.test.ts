/**
 * Telemetry verification — ensures scan_ai_security emits no telemetry.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, '..', '..', 'src');

async function getAllTsFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await getAllTsFiles(full));
    else if (entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

describe('No telemetry verification', () => {
  it('src/ contains no telemetry/analytics imports', async () => {
    const files = await getAllTsFiles(SRC_ROOT);
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      assert.ok(!/import.*analytics/i.test(content), `${file} has analytics import`);
      assert.ok(!/import.*telemetry/i.test(content), `${file} has telemetry import`);
      assert.ok(!/import.*posthog/i.test(content), `${file} has posthog import`);
      assert.ok(!/import.*mixpanel/i.test(content), `${file} has mixpanel import`);
      assert.ok(!/import.*amplitude/i.test(content), `${file} has amplitude import`);
      assert.ok(!/import.*sentry/i.test(content), `${file} has sentry import`);
    }
  });

  it('semgrep-runner uses --metrics off', async () => {
    const content = await fs.readFile(
      path.join(SRC_ROOT, 'engines', 'ai-security', 'semgrep-runner.ts'), 'utf-8',
    );
    assert.ok(content.includes('--metrics'));
    assert.ok(content.includes("'off'"));
  });

  it('scanner does not emit usage events', async () => {
    const content = await fs.readFile(
      path.join(SRC_ROOT, 'engines', 'ai-security', 'scanner.ts'), 'utf-8',
    );
    assert.ok(!/usageEvent|trackEvent|emitEvent|sendEvent/i.test(content));
  });
});
