# 13 — License Decision

> Phase 0 document. License decision is ON HOLD.

## Status

**FOUNDER_DECISION_REQUIRED_BEFORE_PUBLIC_SOURCE_RELEASE**

## Intended Direction

The repository is intended to become open source. However, the final license
selection requires founder/legal decision because:

1. **Scanner rule provenance is still being resolved.** ~28 generic-pattern rules
   need manual comparison against public rule packs before publication. Rules
   are NOT published in this repository yet.

2. **HAIEC has IP/patent considerations.** The HAIEC brand, scanner design, and
   rule patterns may have intellectual property implications that affect license
   choice (MIT vs. Apache-2.0 vs. other).

3. **The orchestration code license requires founder/legal decision.** The
   MCP server, contracts, and security utilities are HAIEC-authored and need
   a clear license before public source release.

## What Was NOT Done

- No license text copied from another repository
- No LICENSE file created (would be premature)
- No license field in package.json (package is `"private": true`)
- No license claim in any documentation

## What Must Happen Before Public Source Release

1. Founder selects license (MIT, Apache-2.0, or other)
2. Legal review confirms IP/employment agreements allow the selected license
3. Rule provenance resolved (for the `rules/` directory, when rules are published)
4. LICENSE file created with the selected license text
5. `package.json` `license` field set
