# Offline / Network-Independence Proof (Phase 4C-A)

> Phase 4C-A Part 8 — Offline scan validation status.

## Status: PREPARED_NOT_EXECUTED (local)

Hard network isolation (`--network=none` on Linux or equivalent) cannot be
executed on this Windows development machine. The offline test is PREPARED in
the CI workflow (`.github/workflows/phase-4c-cross-platform.yml`) for remote
execution in Phase 4C-B.

## Static Verification (performed locally)

The following static verification confirms the scan code is designed for
offline operation:

### 1. Scanner — No Network Calls
- `src/engines/ai-security/scanner.ts` explicitly documents: "Make network requests" is NOT done
- No `fetch`, `http`, `https`, `axios`, or similar imports
- No HAIEC API calls during scan execution

### 2. Semgrep Runner — Metrics Disabled
- `src/engines/ai-security/semgrep-runner.ts` constructs command:
  `semgrep scan --config <rulepack> --json --metrics off <target>`
- `--metrics off` is explicitly set (line 108)
- No `--config auto` (which would fetch from Semgrep registry)
- No remote config flags
- No login/register flags
- `shell: false` — no shell injection risk

### 3. Semgrep Resolver — No Download During Scan
- `src/engines/ai-security/semgrep-resolver.ts` explicitly documents:
  "Does NOT install, download, or modify the environment"
- Resolver only discovers existing Semgrep installations
- Setup (which may download) is a separate explicit command

### 4. Rulepack Provider — Bundled, No Download
- `src/engines/ai-security/rulepack-provider.ts`:
  `BundledPublicCoreRulepackProvider` reads from package-bundled files
- No runtime rule download
- No HAIEC login required
- No API key required
- No environment variables required

### 5. No Telemetry Dependencies
- No telemetry SDK imports
- No analytics packages
- No error reporting services (Sentry, etc.)

## CI Offline Test (PREPARED)

The CI workflow includes an `offline-scan` job that:
1. Installs Semgrep 1.173.0
2. Creates a synthetic test target
3. Runs scan with `unshare --net` (Linux network namespace isolation)
4. Verifies scan completes without network access

This test will execute in Phase 4C-B on `ubuntu-latest` runners.

## Explicit Exclusions

- `doctor` may inspect local state only — not part of offline-scan proof
- `setup` may require network — NOT part of offline-scan proof
- Semgrep installation is a prerequisite, not part of the scan itself

## Claim

"Normal scan operation is designed not to require HAIEC cloud access or
network connectivity. Static verification confirms no network calls, no
telemetry, and no rule downloads during scan execution. Hard network
isolation testing is PREPARED for remote CI execution in Phase 4C-B."

**We do NOT claim VERIFIED offline execution until hard isolation test passes
on a remote CI runner.**
