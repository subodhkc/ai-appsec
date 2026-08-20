# Phase 4A — Security Validation

## Path boundary

- `PathBoundary` resolves and validates target paths
- Prevents path traversal outside root
- Detects symlink escape
- Rejects UNC paths
- All output paths are repository-relative

## Secret redaction

- `redactSecrets()` applied to all finding messages
- Patterns: AWS keys, GitHub tokens, OpenAI keys, private keys, bearer
  tokens, passwords, generic secret assignments
- Redacted values replaced with `[REDACTED_*]` tags

## Output sanitization

- No absolute paths in output
- Excerpt length limited
- Control characters removed
- Untrusted content tagged

## No telemetry

- HAIEC scanner emits zero telemetry
- Semgrep invoked with `--metrics off`
- No analytics imports
- No external HTTP calls
- No phone-home behavior
- Verified by `tests/engines/no-telemetry.test.ts`

## No shell injection

- `spawn()` with `shell: false`
- Arguments passed as array
- No `exec()` with string commands
- Verified by `tests/engines/safe-execution.test.ts`

## No source upload

- All scanning is local
- No repository content leaves the machine
- No cloud/network fallback

## No code execution

- Target repository code is never executed during scanning
- Semgrep performs static analysis only
