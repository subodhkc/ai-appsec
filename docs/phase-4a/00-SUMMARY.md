# Phase 4A — Summary

## Status: COMPLETE

Phase 4A implemented the local `scan_ai_security` MCP tool. The tool is
functional, tested, and validated against the private rc.5 rulepack bundle.

## What was implemented

1. **Rulepack provider abstraction** — `PrivateLocalRulepackProvider` and
   `SyntheticTestRulepackProvider` resolve authorized rulepacks at runtime
   via `HAIEC_RULEPACK_PATH` / `HAIEC_MANIFEST_PATH` env vars. No private
   rule bodies are committed.

2. **Semgrep resolver** — resolves native Semgrep, requires exact version
   `1.173.0`, produces clear errors for missing or unsupported versions.
   Never silently installs or downloads.

3. **Safe Semgrep runner** — subprocess execution with `shell: false`,
   argument arrays, timeout handling, SIGTERM→SIGKILL escalation, bounded
   stdout/stderr, `--metrics off`.

4. **Target scope** — `DEFAULT_PRODUCTION` and `EXTENDED_SECURITY` modes.
   Minimal excludes passed to Semgrep (to avoid glob parser limitations).
   Non-production filtering handled in post-processing.

5. **Finding adapter** — maps raw Semgrep findings to canonical HAIEC
   findings using the manifest. Strips config-name prefixes. Redacts
   secrets. Converts paths to repository-relative.

6. **Normalizer** — collapses exact duplicates (same check + same location +
   same evidence hash). Preserves raw count. Never falsely collapses
   unrelated findings.

7. **Prioritizer** — deterministic sort: BLOCK > REVIEW > INFORMATIONAL,
   then VULNERABILITY > CONTROL_GAP > RISK_SIGNAL > PRESENCE, then
   CRITICAL > HIGH > MEDIUM > LOW > INFO, then securityCheckId, path,
   line, evidence hash.

8. **Scanner** — orchestrates the full pipeline. Computes completeness
   (COMPLETE, PARTIAL, TIMEOUT, ERROR). Computes advisory verdict
   (BLOCK, REVIEW, PASS, ERROR). Bounds output to 20 actionable / 10
   observations / 48KB. Preserves exact totals.

9. **MCP tool registration** — `scan_ai_security` registered via
   `McpServer.registerTool()`. Other three tools remain unimplemented.

## Test results

- **159 tests pass** (0 fail)
- TypeScript strict mode: clean
- Private-bundle smoke tests:
  - together-python (small): 312 raw → 101 actionable + 208 observations
  - anthropic-sdk-python (medium): 489 raw → 379 actionable + 20 observations
  - anthropic-sdk-typescript (medium): 146 raw → 90 actionable + 12 observations

## What was NOT done

- No npm publication
- No public release
- No MCP Registry publication
- No Docker Catalog publication
- No HAIEC SaaS migration
- No Tenant Isolation integration
- No LLMVerify integration
- No Deploy Gate
- No Scan Receipt
- No Proof-of-fix
- No git commit, push, tag, or deploy

## Remaining blockers for public packaging

1. **Rulepack distribution** — private rc.5 rule bodies must not be
   published. A distribution mechanism (private registry, signed bundle,
   or bring-your-own-rulepack) must be decided before public release.

2. **Medium-repository native-vs-Docker comparison** — the small
   repository comparison passed (312=312). A medium repository normalized
   comparison is still needed for full reconciliation.

3. **Large-repository smoke test** — only small and medium repositories
   were tested. A large repository (e.g., langchainjs, crewAI) should be
   tested through the MCP path.
