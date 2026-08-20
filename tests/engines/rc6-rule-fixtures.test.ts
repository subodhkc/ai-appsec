/**
 * RC.6 Changed-Rule Fixture Qualification
 *
 * Tests the two detectors that changed materially in rc.6:
 * - api-key-in-error-js
 * - api-key-in-error-python
 *
 * Verifies:
 * - True positives remain detected
 * - Ordinary exception handling is NOT detected
 * - Naming variants intended by the regex are covered
 * - Unrelated variables do not trigger
 * - Detector IDs remain stable
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, '..', 'fixtures', 'rc6-rule-fixtures');
const RULEPACK_PATH = path.resolve(__dirname, '..', '..', 'rules', 'public-core', 'haiec-ai-security.yml');

interface SemgrepResult {
  results: Array<{
    check_id: string;
    path: string;
    start: { line: number; col: number };
    end: { line: number; col: number };
    extra: { message: string; severity: string; metadata: Record<string, unknown> };
  }>;
  errors: Array<{ check_id: string; path: string; message: string }>;
}

/**
 * Semgrep prepends the config path to rule IDs. The scanner normalizes this,
 * but for direct Semgrep tests we need to match on the suffix.
 */
function matchesDetectorId(checkId: string, detectorId: string): boolean {
  return checkId === detectorId || checkId.endsWith('.' + detectorId);
}

async function runSemgrepOnFile(targetPath: string): Promise<SemgrepResult> {
  const semgrepCmd = process.env.HAIEC_SEMGREP_PATH || 'semgrep';
  const { stdout } = await execFileAsync(semgrepCmd, [
    'scan',
    '--config', RULEPACK_PATH,
    '--json',
    '--metrics', 'off',
    '--no-git-ignore',
    targetPath,
  ], {
    timeout: 30000,
    shell: false,
    windowsHide: true,
  });
  return JSON.parse(stdout) as SemgrepResult;
}

async function runSemgrepOnDir(targetDir: string): Promise<SemgrepResult> {
  const semgrepCmd = process.env.HAIEC_SEMGREP_PATH || 'semgrep';
  const { stdout } = await execFileAsync(semgrepCmd, [
    'scan',
    '--config', RULEPACK_PATH,
    '--json',
    '--metrics', 'off',
    '--no-git-ignore',
    targetDir,
  ], {
    timeout: 60000,
    shell: false,
    windowsHide: true,
  });
  return JSON.parse(stdout) as SemgrepResult;
}

let semgrepAvailable = false;
before(async () => {
  try {
    const semgrepCmd = process.env.HAIEC_SEMGREP_PATH || 'semgrep';
    await execFileAsync(semgrepCmd, ['--version'], {
      timeout: 15000,
      shell: false,
      windowsHide: true,
    });
    semgrepAvailable = true;
  } catch {
    semgrepAvailable = false;
  }
});

describe('RC.6 Changed-Rule Fixture Qualification', () => {
  describe('api-key-in-error-js — positive fixtures', () => {
    it('detects API-key-like variables in throw new Error()', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-js.positive.js');
      assert.ok(fs.existsSync(fixturePath), 'Positive fixture file must exist');

      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-js'));

      assert.ok(matches.length >= 8,
        `Expected at least 8 positive matches for api-key-in-error-js, got ${matches.length}`);

      for (const m of matches) {
        assert.ok(matchesDetectorId(m.check_id, 'api-key-in-error-js'),
          `Unexpected check_id: ${m.check_id}`);
      }
    });

    it('detects specific naming variants', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-js.positive.js');
      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-js'));
      const matchLines = new Set(matches.map(m => m.start.line));

      const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');
      const lines = fixtureContent.split('\n');

      const expectedDetections = [
        'apiKey',
        'openaiApiKey',
        'anthropic_api_key',
        'clientSecret',
        'authToken',
        'privateKey',
        'accessKey',
      ];

      let detectedCount = 0;
      for (const variant of expectedDetections) {
        const matchingLine = lines.findIndex(l => l.includes(variant) && l.includes('throw'));
        if (matchingLine >= 0 && matchLines.has(matchingLine + 1)) {
          detectedCount++;
        }
      }

      assert.ok(detectedCount >= 5,
        `Expected at least 5 naming variants detected, got ${detectedCount}`);
    });
  });

  describe('api-key-in-error-js — negative fixtures', () => {
    it('does NOT detect ordinary error handling', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'negative', 'api-key-in-error-js.negative.js');
      assert.ok(fs.existsSync(fixturePath), 'Negative fixture file must exist');

      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-js'));

      assert.equal(matches.length, 0,
        `Expected 0 matches for negative fixture, got ${matches.length}. ` +
        `False positives on lines: ${matches.map(m => m.start.line).join(', ')}`);
    });
  });

  describe('api-key-in-error-python — positive fixtures', () => {
    it('detects API-key-like variables in raise Exception()', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-python.positive.py');
      assert.ok(fs.existsSync(fixturePath), 'Positive fixture file must exist');

      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-python'));

      assert.ok(matches.length >= 8,
        `Expected at least 8 positive matches for api-key-in-error-python, got ${matches.length}`);

      for (const m of matches) {
        assert.ok(matchesDetectorId(m.check_id, 'api-key-in-error-python'),
          `Unexpected check_id: ${m.check_id}`);
      }
    });

    it('detects specific naming variants', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-python.positive.py');
      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-python'));
      const matchLines = new Set(matches.map(m => m.start.line));

      const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');
      const lines = fixtureContent.split('\n');

      const expectedDetections = [
        'api_key',
        'openai_api_key',
        'anthropic_api_key',
        'client_secret',
        'auth_token',
        'private_key',
        'access_key',
      ];

      let detectedCount = 0;
      for (const variant of expectedDetections) {
        const matchingLine = lines.findIndex(l => l.includes(variant) && l.includes('raise'));
        if (matchingLine >= 0 && matchLines.has(matchingLine + 1)) {
          detectedCount++;
        }
      }

      assert.ok(detectedCount >= 5,
        `Expected at least 5 naming variants detected, got ${detectedCount}`);
    });
  });

  describe('api-key-in-error-python — negative fixtures', () => {
    it('does NOT detect ordinary exception handling', async () => {
      if (!semgrepAvailable) { return; }
      const fixturePath = path.join(FIXTURES_DIR, 'negative', 'api-key-in-error-python.negative.py');
      assert.ok(fs.existsSync(fixturePath), 'Negative fixture file must exist');

      const result = await runSemgrepOnFile(fixturePath);
      const matches = result.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-python'));

      assert.equal(matches.length, 0,
        `Expected 0 matches for negative fixture, got ${matches.length}. ` +
        `False positives on lines: ${matches.map(m => m.start.line).join(', ')}`);
    });
  });

  describe('Detector ID stability', () => {
    it('detector IDs remain api-key-in-error-js and api-key-in-error-python', async () => {
      if (!semgrepAvailable) { return; }
      // Scan each file individually — Semgrep directory scanning doesn't
      // recognize .positive.js / .negative.py extensions as supported languages.
      const jsFile = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-js.positive.js');
      const pyFile = path.join(FIXTURES_DIR, 'positive', 'api-key-in-error-python.positive.py');

      const jsResult = await runSemgrepOnFile(jsFile);
      const pyResult = await runSemgrepOnFile(pyFile);

      const jsMatches = jsResult.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-js'));
      const pyMatches = pyResult.results.filter(r => matchesDetectorId(r.check_id, 'api-key-in-error-python'));

      assert.ok(jsMatches.length > 0, 'api-key-in-error-js must produce matches');
      assert.ok(pyMatches.length > 0, 'api-key-in-error-python must produce matches');
    });
  });
});
