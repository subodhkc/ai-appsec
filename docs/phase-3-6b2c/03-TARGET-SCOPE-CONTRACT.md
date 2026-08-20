# 03 — Target Scope Contract

## Default Production Scope

Scanned by default:
- Application source code (src/, lib/, app/)
- Server code, API routes
- Agent/tool code, RAG code
- Configuration files
- Infrastructure/security-relevant config

## Path Class Policies

| Path Class | Default Status | Exceptions |
|---|---|---|
| tests | DEFAULT_EXCLUDE | Secrets detectors still scan for real keys |
| examples | DEFAULT_EXCLUDE | VULNERABILITY detectors still scan (users copy examples) |
| docs embedded code | DEFAULT_EXCLUDE | VULNERABILITY detectors still scan (users copy from docs) |
| fixtures | DEFAULT_EXCLUDE | None |
| generated code | DEFAULT_EXCLUDE | None |
| vendor code | DEFAULT_EXCLUDE | None |
| node_modules | DEFAULT_EXCLUDE | None |
| build output (dist, build, .next) | DEFAULT_EXCLUDE | None |
| coverage | DEFAULT_EXCLUDE | None |
| minified files | DEFAULT_EXCLUDE | None |
| snapshots | DEFAULT_EXCLUDE | None |

## Rationale

Tests and examples are excluded by default because:
1. Test files often contain intentional unsafe patterns
2. Example code may contain simplified patterns for demonstration
3. Including them by default would generate noise

However, VULNERABILITY and secrets detectors still scan these paths because:
1. Users copy example code into production
2. Real secrets in test files are still security issues
3. Unsafe patterns in documentation affect users who follow the docs

## File Counting Model

| Term | Definition |
|---|---|
| filesTargeted | Files matching DEFAULT_INCLUDE minus DEFAULT_EXCLUDE |
| filesScanned | Files actually parsed and analyzed by Semgrep |
| filesIntentionallyExcluded | Files excluded by scope policy |
| filesSkippedByEngine | Files Semgrep skipped (unsupported language, parse failure) |
| filesUnscannedDueToTimeout | Files not reached because scan timed out |
| filesUnscannedDueToError | Files not scanned due to scan error |

**Rule:** Timeout-unscanned files MUST NOT be called "skipped." "Skipped" means the engine explicitly chose not to scan. "Unscanned" means the scan did not reach the file.
