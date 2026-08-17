import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { PathBoundary, PathBoundaryError } from '../../src/security/path-boundary.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

/** Compare paths case-insensitively on Windows, case-sensitively elsewhere. */
function pathStartsWith(candidate: string, prefix: string): boolean {
  if (process.platform === 'win32') {
    return candidate.toLowerCase().startsWith(prefix.toLowerCase());
  }
  return candidate.startsWith(prefix);
}

describe('PathBoundary', () => {
  it('rejects traversal outside root', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      const boundary = await PathBoundary.create(root);
      await assert.rejects(
        boundary.resolve('../../etc/passwd'),
        (err: PathBoundaryError) => err.code === 'PATH_OUTSIDE_ROOT'
      );
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('rejects absolute paths outside root', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      const boundary = await PathBoundary.create(root);
      const outside = path.resolve(root, '..', 'outside.txt');
      await assert.rejects(
        boundary.resolve(outside),
        (err: PathBoundaryError) => err.code === 'PATH_OUTSIDE_ROOT'
      );
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('rejects symlink escape (skip on Windows without symlink permissions)', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    const outsideDir = await fs.mkdtemp(path.join(tmpdir(), 'haiec-outside-'));
    try {
      const linkPath = path.join(root, 'evil-link');
      try {
        await fs.symlink(outsideDir, linkPath, 'dir');
      } catch (err: any) {
        if (err.code === 'EPERM') {
          // Windows requires admin/dev mode for symlinks — skip this test
          return;
        }
        throw err;
      }
      const boundary = await PathBoundary.create(root);
      await assert.rejects(
        boundary.resolve('evil-link'),
        (err: PathBoundaryError) => err.code === 'SYMLINK_ESCAPE'
      );
    } finally {
      await fs.rm(root, { recursive: true });
      await fs.rm(outsideDir, { recursive: true });
    }
  });

  it('rejects UNC paths', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      const boundary = await PathBoundary.create(root);
      await assert.rejects(
        boundary.resolve('\\\\server\\share\\file'),
        (err: PathBoundaryError) => err.code === 'PATH_OUTSIDE_ROOT'
      );
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('accepts valid paths within root', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      await fs.writeFile(path.join(root, 'test.txt'), 'hello');
      const boundary = await PathBoundary.create(root);
      const resolved = await boundary.resolve('test.txt');
      // Use boundary.getRoot() which is the real path, not the original root
      // (realpath may expand 8.3 short names on Windows)
      assert.ok(pathStartsWith(resolved, boundary.getRoot()));
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('accepts subdirectory paths', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      await fs.mkdir(path.join(root, 'subdir'));
      await fs.writeFile(path.join(root, 'subdir', 'file.txt'), 'hello');
      const boundary = await PathBoundary.create(root);
      const resolved = await boundary.resolve('subdir/file.txt');
      assert.ok(pathStartsWith(resolved, boundary.getRoot()));
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('contains() returns false for outside paths', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      const boundary = await PathBoundary.create(root);
      assert.equal(boundary.contains('../../etc/passwd'), false);
      assert.equal(boundary.contains('subdir/file.txt'), true);
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });

  it('rejects non-directory root', async () => {
    const root = await fs.mkdtemp(path.join(tmpdir(), 'haiec-test-'));
    try {
      const filePath = path.join(root, 'file.txt');
      await fs.writeFile(filePath, 'hello');
      await assert.rejects(
        PathBoundary.create(filePath),
        (err: PathBoundaryError) => err.code === 'INVALID_PATH'
      );
    } finally {
      await fs.rm(root, { recursive: true });
    }
  });
});
