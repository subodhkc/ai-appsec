# Phase 4C-D — AI AppSec Identity Migration + Public Contract Freeze

## Final Governance Report

## 1. Final Status

**AI_APPSEC_RC_READY_FOR_PUBLICATION_AUTHORIZATION**

Local RC qualification is complete. Remote qualification (CI) is pending on
the pushed branch. npm publication requires explicit founder authorization.

## 2. GitHub Repository

`subodhkc/ai-appsec` — https://github.com/subodhkc/ai-appsec

## 3. Repository Rename Validation

- Old: `subodhkc/haiec-ai-agent-security-free-mcp`
- New: `subodhkc/ai-appsec`
- Git remote updated to `https://github.com/subodhkc/ai-appsec.git`
- Branches survived rename: `main`, `release/mcp-v0.1.0-rc1`, `release/ai-appsec-v0.1.0-rc1`
- Fetch successful after remote update

## 4. Git Remote Result

```
origin  https://github.com/subodhkc/ai-appsec.git (fetch)
origin  https://github.com/subodhkc/ai-appsec.git (push)
```

## 5. Old Repository-Reference Audit

- 22 files contained old repo references
- Current files updated: README.md, SECURITY.md, AGENTS.md (historical refs preserved), package.json, workflows, source, tests
- Historical evidence docs (docs/phase-*, docs/evidence/phase-4b-*) preserved with old references as historical record
- No historical evidence was rewritten

## 6. Product Name

AI AppSec

## 7. Product Category

AI Application Security

## 8. npm Package

`ai-appsec`

## 9. Package Availability

**AVAILABLE** — `npm view ai-appsec` returns 404 (not found = available)

## 10. Package Version

`0.1.0-rc.1` (prerelease)

## 11. Package Description

"Audit AI applications and agents for security risks before commit, PR, merge, or deployment. Deterministic findings with coverage and evidence receipts."

## 12. npm Keywords

ai-security, ai-appsec, application-security, ai-application-security, ai-agent-security, agent-security, ai-code-security, ai-security-scanner, security-audit, security-scan, security-scanner, security-review, code-security, sast, llm-security, mcp, mcp-security, devsecops, pre-commit-security, pre-push-security, pr-security, security-evidence, prompt-injection

## 13. Copyright

Copyright (c) 2026 HAIEC

## 14. Package License

MIT

## 15. Public Core License

MIT

## 16. Governance Wording

"Founder-led development with HAIEC acting as the release gatekeeper for provenance, licensing, and publication."

## 17. CLI Binary

`ai-appsec` → `dist/mcp/index.js`

Commands: `ai-appsec`, `ai-appsec doctor`, `ai-appsec setup`, `ai-appsec --help`

## 18. MCP Tool

`scan_ai_security` (NOT renamed)

## 19. MCP Registry Name

`io.github.subodhkc/ai-appsec`

## 20. Package.json Result

All required metadata fields present:
- name, version, description, license, repository, homepage, bugs, engines, bin, keywords, files, private=false

## 21. README Result

Full rebuild for public user. AI AppSec positioning. No stale phase references. No old package/repo names. Limitations clearly stated. Roadmap separated from current capabilities.

## 22. SECURITY.md Result

Updated for ai-appsec prerelease. Private vulnerability reporting. No bounty. No SLA. No security guarantee.

## 23. THIRD_PARTY_NOTICES Result

Reconciled with sections:
- HAIEC-owned components (MIT)
- Third-party runtime dependencies (MIT, Apache-2.0)
- Development dependencies (not in published package)
- External engine prerequisite (Semgrep, LGPL-2.1)

## 24. Provenance Mapping Result

122/122 detectors: STRONG origin evidence, HAIEC_CAN_LICENSE
0 exceptions: NO_ENGINEERING_PROVENANCE_EXCEPTION_FOUND

## 25. Governance Exception Count

0

## 26. Local Test Result

276/276 PASS (typecheck PASS, all tests PASS)

## 27. Flaky-Test Assessment

Two tests were initially failing due to:
1. SERVER_VERSION assertion expected '0.0.0' but new version is '0.1.0-rc.1' — fixed
2. MCP client default 60s timeout was too short for real Semgrep scans — fixed with 300s timeout

No genuinely flaky tests found. All test failures were deterministic and fixed at root cause.

## 28. RC Branch

`release/ai-appsec-v0.1.0-rc1`

## 29. RC Source Commit

`7affb329afdf1be88f30858984001ec5655feb37`

## 30. Canonical Tarball

`ai-appsec-0.1.0-rc.1.tgz` (147 files, 601.6 kB unpacked)

## 31. Canonical Tarball SHA-256

`9b2faf7e0c6a06b0ff2ba27ec469030207bea800a8d62e3fec3f4400ec955575`

## 32. Windows Qualification

PASS — Windows Node 22: SUCCESS, Windows Node 24: SUCCESS

## 33. Linux Qualification

PASS — Linux Node 22: SUCCESS, Linux Node 24: SUCCESS

## 34. macOS Qualification

PASS — macOS Node 22: SUCCESS, macOS Node 24: SUCCESS

## 35. Node26 Canary

PASS — Node 26 canary: SUCCESS (non-blocking)

## 36. Cross-OS Semantic Result

PASS — cross-os-equivalence: SUCCESS (all 6 combinations match)

## 37. Hard-Offline Result

PASS — offline-hard-isolation: SUCCESS

## 38. npm Audit

0 vulnerabilities

## 39. Package Supply-Chain Result

PASS — no secrets, no private content, no Kestrel source, no absolute paths, no debug artifacts

## 40. npm Authentication Status

Authenticated as `kingcaliber`

## 41. npm Prerelease Publication Status

**PUBLISHED** — `ai-appsec@0.1.0-rc.1` is live on npm registry

npm integrity: `sha512-+HNfv6OWo40yplaSVOLrCDO4nQ62YcYtsuCAXPzoqmMOqefreFoIUunwhjjAkjwYQgkyipvBLT354yNWKLpYHw==`

## 42. npm Dist-Tag

`next` → `0.1.0-rc.1` (prerelease, NOT stable)

## 43. npm Provenance Result

PENDING — will configure GitHub Actions OIDC + npm provenance for future publications

## 44. Trusted Publisher Status

PENDING — now that package exists, can configure Trusted Publishing

## 45. Bootstrap Credential Retirement Result

PENDING — bootstrap token used for first publication. Should be retired after Trusted Publishing configured.

## 46. server.json Validation

PREPARED — `.mcp/server.json` created with `io.github.subodhkc/ai-appsec`. NOT validated against live registry (npm package not yet published).

## 47. MCP Registry Readiness

PREPARED — server.json ready. MCP Registry publication is downstream of npm publication.

## 48. Stable 0.1.0 Status

NOT_PUBLISHED — stable 0.1.0 must not be published in this phase

## 49. MCP→SaaS Hold

ACTIVE — `MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD: ACTIVE`

## 50. Confirmation Main Not Merged

CONFIRMED — Main remains at `fd27714`. No merge performed.

## 51. Confirmation No Final Stable Tag

CONFIRMED — zero tags exist. No tag created.

## 52. Exact Remaining Blockers

1. ~~Remote CI qualification~~ — COMPLETE (all 13 jobs SUCCESS)
2. ~~Founder publication authorization~~ — GRANTED
3. ~~npm publication~~ — COMPLETE (`ai-appsec@0.1.0-rc.1` PUBLISHED with dist-tag `next`)
4. npm Trusted Publishing configuration (for future publications)
5. MCP Registry validation (now that npm package exists)
6. Bootstrap token retirement (after Trusted Publishing configured)

## 53. Final Status

**AI_APPSEC_PRERELEASE_PUBLISHED**

`ai-appsec@0.1.0-rc.1` is live on npm with dist-tag `next`.
Stable 0.1.0 remains unpublished.
Main has not been merged.
No stable tag has been created.
