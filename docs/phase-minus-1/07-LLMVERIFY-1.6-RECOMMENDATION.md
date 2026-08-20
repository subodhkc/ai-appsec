# 07 — LLMVerify 1.6.0 Recommendation

> **Phase -1 document.** Recommendation for a future LLMVerify v1.6.0 release.
> No implementation. No release. Current version is 1.5.2.

---

## Current State (verified)

| Field | Value | Evidence |
|-------|-------|---------|
| Package name | `llmverify` | `package.json:2` |
| Version | `1.5.2` | `package.json:4` |
| Node requirement | `>=18.0.0` | `package.json` engines |
| Postinstall | `node dist/postinstall.js \|\| true` — prints ASCII banner to **stdout** | `package.json:43`, `src/postinstall.ts:106` |
| Daily free limit | 500 calls/day | `src/types/config.ts:30` |
| Grace period | 10% above limit (550 calls) | `src/usage/limits.ts:34` |
| Content limit (free) | 50KB | `src/types/config.ts:31` |
| Schema version | `1.0.0` (`SCHEMA_VERSION`) | `src/schema.ts:146` |
| Error codes | Defined (`LLMVERIFY_1001` through `LLMVERIFY_7002`) | `src/errors/codes.ts:12-52` |
| RATE_LIMIT_EXCEEDED | `LLMVERIFY_4004` (server), `LLMVERIFY_7001` (usage limit) | `src/errors/codes.ts:36,50` |
| Telemetry (free tier) | DISABLED, enforced by code | `src/verify.ts:349-365` |
| Network calls (free tier) | ZERO, enforced by code | `src/verify.ts:349-365` |
| Usage tracking | Local only (`~/.llmverify/usage.json`) | `src/usage/tracker.ts:35` |
| Publishing workflows | **DUPLICATE**: `npm-publish.yml` (tag, provenance) + `publish.yml` (manual, no provenance) | `.github/workflows/` |
| Tests | 26+ test files | `tests/` |

---

## Proposed v1.6.0 Changes — Classification

### 1. Remove postinstall/banner noise if active

| Classification | **REQUIRED_FOR_AGENT_SECURITY** |
|----------------|-------------------------------|
| Reason | Postinstall prints to stdout (`src/postinstall.ts:106`). This corrupts MCP stdio protocol when LLMVerify is imported into an MCP server. MCP stdio requires stdout to be protocol-clean. |
| Risk | Low — banner is cosmetic; silent mode already exists for CI. |
| Proposed fix | Either: (a) remove postinstall entirely, (b) move banner to stderr, or (c) default to silent and only print when `LLMVERIFY_VERBOSE=true`. Option (b) is safest for backward compat. |
| Evidence | `package.json:43`, `src/postinstall.ts:106` (`console.log(banner)`) |

### 2. Ensure no unwanted stdout during library/MCP usage

| Classification | **REQUIRED_FOR_AGENT_SECURITY** |
|----------------|-------------------------------|
| Reason | Any stdout output from library code breaks MCP stdio. Must audit all `console.log`/`process.stdout.write` in library code (not CLI code). |
| Risk | Low — library code (`src/verify.ts`) uses logger, not console. Only `src/postinstall.ts` uses `console.log`. |
| Proposed fix | Audit all stdout writes. Move any library-code stdout to stderr. Add a test that imports the library and verifies zero stdout output. |
| Evidence | `src/verify.ts` (no console output), `src/postinstall.ts:106` (stdout) |

### 3. Raise free usage limit from 500/day to 2,000/day

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | Agent Security workflows may make many verification calls. 500/day is restrictive for CI/agent use. |
| Risk | Low — usage tracking is local; no cost impact. May need to adjust grace period proportionally. |
| Proposed fix | Change `dailyCallLimit: 500` to `2000` in `src/types/config.ts:30`. Adjust grace if needed. |

### 4. Retain local-first processing

| Classification | **REQUIRED_FOR_AGENT_SECURITY** (confirm, not change) |
|----------------|------------------------------------------------------|
| Reason | Local-first is a core product requirement. Already enforced in code. |
| Risk | None — no change needed. |
| Evidence | `src/verify.ts:349-365` (free tier throws on network/telemetry enable) |

### 5. Retain zero telemetry unless evidence contradicts

| Classification | **REQUIRED_FOR_AGENT_SECURITY** (confirm, not change) |
|----------------|------------------------------------------------------|
| Reason | Zero telemetry is verified for free tier. |
| Risk | None — no change needed. |
| Evidence | `src/types/config.ts:128` (`telemetryEnabled: false`), `src/verify.ts:349-365` |

### 6. Add explicit result schemaVersion

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | `SCHEMA_VERSION = '1.0.0'` exists (`src/schema.ts:146`) but should be included in every `VerifyResult` output for forward compatibility. |
| Risk | Low — additive field. |
| Proposed fix | Add `schemaVersion: SCHEMA_VERSION` to `VerifyResult` output. |

### 7. Add stable machine-readable error codes

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | Error codes already exist (`src/errors/codes.ts`). Ensure all error paths return structured codes, not just strings. |
| Risk | Low — codes already defined. |
| Evidence | `src/errors/codes.ts:12-52` |

### 8. Add structured RATE_LIMIT_EXCEEDED behavior

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | `LLMVERIFY_7001` exists but should return a structured result (not just throw) with: `code`, `limit`, `used`, `resetAt`, `retryAfterSeconds`. |
| Risk | Low — additive. |
| Evidence | `src/errors/codes.ts:50`, `src/usage/limits.ts:90-98` |

### 9. Tighten hallucination wording to risk/signals

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | "Hallucination detection" implies certainty that isn't possible. Use "hallucination risk signals" instead. |
| Risk | Low — wording change in docs/API descriptions. |
| Evidence | `src/index.ts:81,213-215` (`HallucinationEngine`, `calculateHallucinationRisk`) |

### 10. Review unsupported marketing claims

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | Postinstall banner claims "100% local • Zero network requests • Zero telemetry" — verified for free tier, but paid tiers can enable network. Claim should be scoped to free tier. |
| Risk | Low — clarify wording. |
| Evidence | `src/postinstall.ts` banner text |

### 11. Test Node 22 and Node 24

| Classification | **REQUIRED_FOR_AGENT_SECURITY** |
|----------------|-------------------------------|
| Reason | `engines.node` is `>=18.0.0` but Node 22/24 not tested. MCP SDK v2 may require newer Node. |
| Risk | Medium — may discover runtime issues. |
| Proposed fix | Add Node 22 and 24 to CI matrix. |

### 12. Add Agent Security integration tests

| Classification | **REQUIRED_FOR_AGENT_SECURITY** |
|----------------|-------------------------------|
| Reason | Must verify LLMVerify works correctly when imported as a library (not CLI) in an MCP server context. |
| Risk | Low — additive tests. |
| Proposed fix | Add test that imports `verify()` in a simulated MCP stdio context and verifies zero stdout pollution. |

### 13. Simplify duplicate publishing workflows

| Classification | **RECOMMENDED** |
|----------------|----------------|
| Reason | Two workflows publish to npm: `npm-publish.yml` (tag, provenance) and `publish.yml` (manual, no provenance). The manual one is a security risk (can publish without provenance). |
| Risk | Low — remove or merge the manual workflow. |
| Proposed fix | Remove `publish.yml` or merge into `npm-publish.yml` with a `workflow_dispatch` trigger that still uses `--provenance`. |

### 14. Clean up or archive/rename placeholder Python repository

| Classification | **OPTIONAL** |
|----------------|-------------|
| Reason | `subodhkc/llmverify-python-preview` (redirects from `llmverify`) is a placeholder (v0.0.1, "Development Status :: 1 - Planning", 1 star). Confusing for users. |
| Risk | Low — archival is reversible. |
| Proposed fix | Archive the repo with a notice pointing to `llmverify-npm` as canonical. |

---

## Summary

| Classification | Count |
|----------------|-------|
| REQUIRED_FOR_AGENT_SECURITY | 4 |
| RECOMMENDED | 8 |
| OPTIONAL | 1 |
| REJECT | 0 |

---

## Release Order Recommendation

1. **First (blocking for MCP integration):** Items 1, 2 (stdout fix), 11 (Node 22/24), 12 (integration tests)
2. **Second:** Items 3 (limit increase), 6 (schemaVersion), 7 (error codes), 8 (RATE_LIMIT structure)
3. **Third:** Items 9 (wording), 10 (marketing review), 13 (workflow cleanup)
4. **Fourth:** Item 14 (archive Python repo)

Do NOT release v1.6.0 until items 1, 2, 11, 12 are complete and tested.
