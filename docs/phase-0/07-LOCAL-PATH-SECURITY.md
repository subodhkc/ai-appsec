# 07 — Local Path Security

> Phase 0 document. Path boundary utility design and test results.

## Implementation

`src/security/path-boundary.ts` provides `PathBoundary` class:
- `create(root)` — creates boundary with realpath resolution
- `resolve(target)` — resolves path within root, rejects escapes
- `contains(target)` — checks without resolving symlinks

## Security Properties

- Rejects traversal outside root (`../../etc/passwd`)
- Rejects absolute paths outside root
- Rejects symlink escape (realpath checked against root)
- Rejects UNC/network paths (`\\server\share`)
- Rejects non-directory roots
- Cross-platform: Windows (drive letters, case), macOS, Linux

## Test Results (8 tests, all pass)

1. ✔ rejects traversal outside root
2. ✔ rejects absolute paths outside root
3. ✔ rejects symlink escape (skipped on Windows without symlink permissions)
4. ✔ rejects UNC paths
5. ✔ accepts valid paths within root
6. ✔ accepts subdirectory paths
7. ✔ contains() returns false for outside paths
8. ✔ rejects non-directory root

## Windows Considerations

- `fs.realpath` may expand 8.3 short names (e.g., `SUBODH~1` → `Subodh Kc`)
- Path comparison uses case-insensitive matching on Windows
- Symlink creation requires admin/developer mode on Windows — test gracefully skips
