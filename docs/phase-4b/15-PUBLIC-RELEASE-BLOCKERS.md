# Phase 4B — Public Release Blockers

## Blockers (must resolve before public packaging)

1. **Rulepack distribution decision** — Founder must approve bundling
   Public Core rules or choosing another distribution mechanism.
   Current: private rulepack is gitignored, no public rules bundled.

2. **`private: true` in package.json** — Must be removed before
   `npm publish`. Currently prevents publication.

3. **License decision** — No license file exists. Code and rulepack may
   have separate licensing decisions. Must be reviewed before publication.
   Do not call the project "open source" unless the chosen license qualifies.

4. **Large-repository MCP smoke test** — Only small and medium repos tested
   through MCP path. A large repo (langchainjs, crewAI) should be tested.

5. **Diversity-aware bounding** — Current 20-finding cap may be dominated
   by one check. Consider per-check limits in Phase 4C.

## Non-blockers (can be resolved post-release)

- Scan Receipt (Phase 4C+)
- Proof-of-fix (Phase 4C+)
- Native-vs-Docker normalized digest comparison (count match confirmed)
- Process-tree kill on POSIX (empirically tested on Windows only)
