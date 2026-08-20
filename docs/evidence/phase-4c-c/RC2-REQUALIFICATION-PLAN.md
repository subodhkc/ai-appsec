# RC2 Requalification Plan

## Phase 4C-C — Part 20

## Principle

Because README/package.json/license metadata changes alter tarball bytes,
the final exact `.tgz` must be requalified. The publication artifact must
be the artifact tested.

## Shortest Sufficient Remote Requalification

### Required Gates

| Gate | Required | Notes |
|------|----------|-------|
| Canonical build-once | YES | Build tarball once on Ubuntu/Node 24 |
| New SHA-256 | YES | Record new canonical tarball identity |
| Clean install | YES | Install from tarball in empty directory |
| Windows Node 22 | YES | Required matrix |
| Windows Node 24 | YES | Required matrix |
| Linux Node 22 | YES | Required matrix |
| Linux Node 24 | YES | Required matrix |
| macOS Node 22 | YES | Required matrix |
| macOS Node 24 | YES | Required matrix |
| Cross-OS semantic equality | YES | All 6 combos must match |
| Hard-offline scan | YES | Docker --network=none |
| MCP stdio contract | YES | initialize + tools/list |
| npm audit | YES | 0 vulnerabilities |
| Supply-chain package inspection | YES | No secrets/private content |

### Not Required (If No Runtime/Rule/Evidence Code Changed)

| Gate | Required | Reason |
|------|----------|-------|
| Detector provenance re-investigation | NO | No detector changes |
| Full forensic re-audit | NO | No source code changes |
| Semgrep resolver requalification | NO | No resolver changes |
| Process cleanup retest | NO | No runner changes |

### Optional (Non-Blocking)

| Gate | Required | Notes |
|------|----------|-------|
| Node 26 canary | OPTIONAL | Non-blocking |

## Requalification Workflow

1. Create branch `release/mcp-v0.1.0-rc2`
2. Apply all automatable public-contract corrections
3. Run local: typecheck, tests, npm audit, npm pack
4. Commit RC2
5. Push `release/mcp-v0.1.0-rc2` (after authorization)
6. Trigger Phase 4C-D remote requalification workflow
7. Verify all required gates pass
8. Record new canonical tarball SHA-256
9. Generate RC2 qualification evidence

## What Must Be the Same as RC1

- `dist/` content (no source code changes)
- `rules/public-core/` content (no rulepack changes)
- Semantic evidence digests (same golden corpus, same results)
- Semgrep version (1.173.0)
- Coverage contract (0.1.1)

## What Will Be Different from RC1

- `package.json` (metadata fields)
- `README.md` (content)
- `LICENSE` (if changed)
- `THIRD_PARTY_NOTICES.md` (if changed)
- `TRADEMARKS.md` (if changed)
- `SECURITY.md` (not in tarball, but in repo)
- Canonical tarball SHA-256 (different bytes = different hash)

## Status

**PLAN_PREPARED** — Will execute after human decisions and RC2 branch creation.
