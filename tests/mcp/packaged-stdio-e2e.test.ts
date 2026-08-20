/**
 * Real packaged stdio E2E test.
 *
 * Builds and packs the package, installs into a clean temp directory,
 * spawns the actual installed CLI as a subprocess, and tests through
 * the real MCP stdio transport.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execSync } from 'node:child_process';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as os from 'node:os';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

describe('Real packaged stdio E2E', { timeout: 120000 }, () => {
  let tarballPath: string;
  let installDir: string;

  it('builds and packs the package', () => {
    // Build
    execSync('npx tsc', { cwd: repoRoot, timeout: 60000 });

    // Pack
    execSync('npm pack', { cwd: repoRoot, timeout: 30000 });

    // Find tarball
    const tarballs = fs.readdirSync(repoRoot).filter((f) => f.endsWith('.tgz'));
    assert.ok(tarballs.length > 0, 'Tarball must be created');
    tarballPath = path.join(repoRoot, tarballs[0]);
  });

  it('installs into clean temp directory and starts MCP server', { timeout: 60000 }, () => {
    // Create clean temp dir
    installDir = path.join(os.tmpdir(), `haiec-stdio-test-${Date.now()}`);
    fs.mkdirSync(installDir, { recursive: true });

    // Init and install
    execSync('npm init -y', { cwd: installDir, timeout: 10000 });
    execSync(`npm install "${tarballPath}"`, { cwd: installDir, timeout: 60000 });

    // Verify files exist
    const installedPath = path.join(installDir, 'node_modules', 'ai-appsec');
    assert.ok(fs.existsSync(path.join(installedPath, 'dist', 'mcp', 'index.js')),
      'MCP entry point must exist');
    assert.ok(fs.existsSync(path.join(installedPath, 'rules', 'public-core', 'haiec-ai-security.yml')),
      'Public Core rulepack must exist');
    assert.ok(fs.existsSync(path.join(installedPath, 'rules', 'public-core', 'manifest.json')),
      'Public Core manifest must exist');
    assert.ok(fs.existsSync(path.join(installedPath, 'LICENSE')),
      'LICENSE must exist');
  });

  it('doctor command works from clean install', { timeout: 30000 }, () => {
    // doctor exits 1 when setup required, 0 when ready — execSync throws on non-zero
    let result: string;
    try {
      result = execSync('npx ai-appsec doctor --json', {
        cwd: installDir,
        timeout: 30000,
        encoding: 'utf-8',
      });
    } catch (e: any) {
      // Exit code 1 = setup required (expected when Semgrep not installed)
      result = e.stdout ?? '';
    }
    const parsed = JSON.parse(result);
    assert.ok(parsed.schemaVersion, 'doctor must return schemaVersion');
    assert.ok(parsed.platform, 'doctor must return platform');
    assert.ok(parsed.semgrep, 'doctor must return semgrep info');
    assert.ok(parsed.semgrep.requiredVersion === '1.173.0',
      'doctor must report required Semgrep version');
  });

  it('MCP server starts on stdio from clean install', { timeout: 30000 }, () => {
    // Spawn the server and send an initialize request
    const serverPath = path.join(installDir, 'node_modules', 'ai-appsec', 'dist', 'mcp', 'index.js');
    const child = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: installDir,
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d: Buffer) => { stdout += d.toString(); });
    child.stderr?.on('data', (d: Buffer) => { stderr += d.toString(); });

    // Send initialize request
    const initMsg = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0.0' },
      },
    }) + '\n';

    child.stdin?.write(initMsg);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check that we got a response
        assert.ok(stdout.length > 0, 'Server must respond on stdout');
        const lines = stdout.split('\n').filter((l) => l.trim().length > 0);
        assert.ok(lines.length > 0, 'Must have at least one response line');

        // Parse the first line
        const response = JSON.parse(lines[0]);
        assert.ok(response.result, 'Response must have result');
        assert.ok(response.result.serverInfo, 'Response must have serverInfo');
        assert.ok(response.result.serverInfo.name, 'Server must have a name');

        // Verify stderr has diagnostic (not stdout)
        assert.ok(stderr.includes('started'), 'stderr should have startup diagnostic');

        // Clean up
        child.kill();
        resolve();
      }, 3000);
    });
  });

  it('cleans up tarball and temp directory', () => {
    try { fs.unlinkSync(tarballPath); } catch { /* ok */ }
    try { fs.rmSync(installDir, { recursive: true, force: true }); } catch { /* ok */ }
    assert.ok(true, 'Cleanup done');
  });
});
