# PHASES.md — HAIEC Agent Security MCP Phase Tracker

> **Purpose:** Single source of truth for phase status across the 16-18 phase
> build of `haiec-ai-agent-security-free-mcp`. Update this file at the end of
> every phase so context survives across sessions. Pair with `AGENTS.md` for
> the standing rules.
>
> **Status legend:** `pending` · `in_progress` · `blocked` · `done` · `skipped`
> Each `done` phase must have passed its phase-exit gate (see `AGENTS.md` §4).

---

## Phase -1 — Forensic Setup & Audit

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Branch:** `main` (no commits — per no-commit rule, all files untracked)
- **Scope:** Assemble workspace, persist session rules, audit the three
  read-only repos to establish ground truth before any MCP code is written.
- **Decision:** READY_FOR_PHASE_0

### Phase -1 Entry Checks
- [x] Workspace assembled: `HAIEC-workspace/` with 1 write + 3 read-only junctions.
- [x] Write repo cloned and remote verified (`subodhkc/haiec-ai-agent-security-free-mcp`).
- [x] `AGENTS.md` written and loaded as always-on rule.
- [x] `PHASES.md` created (this file).
- [x] Read-only repos confirmed unmodified (git status clean for haiec-website and mcp-tenant-isolation; llmverify-npm has pre-existing `llmverify-audit.jsonl` modification not touched by this phase).
- [x] Forensic audit of `haiec-website` (scanner, rules, versions, evidence architecture, public-repo-scanner).
- [x] Forensic audit of `llmverify-npm` (API surface, postinstall, rate limits, telemetry, publishing workflows).
- [x] Forensic audit of `mcp-tenant-isolation` (scan() API, rules, MCP server, architecture).
- [x] Forensic audit of `llmverify-python-preview` (confirmed placeholder, not canonical).
- [x] Cross-repo findings documented in `docs/phase-minus-1/` (24 documents).
- [x] Phase -1 exit gate passed.

### Phase -1 Exit Gate
- [x] No read-only repo has been modified (git status clean for all 3, except pre-existing llmverify-audit.jsonl).
- [x] All findings are documented in `docs/phase-minus-1/`, not silently "fixed".
- [x] Evidence (file:line refs) cited for every material claim.
- [x] `AGENTS.md` and `PHASES.md` reflect final state.
- [x] Next phase's entry prerequisites are identified (see `24-PHASE-0-ENTRY-DECISION.md`).

### Phase -1 Key Decisions
- 2026-08-16 — Use `llmverify-npm` only; no separate `llmverify/` repo (no such repo on GitHub; `llmverify-python-preview` is a placeholder v0.0.1).
- 2026-08-16 — Junctions to existing local clones for read-only repos (user-confirmed).
- 2026-08-16 — Rules persisted to `AGENTS.md` + tracker to `PHASES.md` for cross-phase context.
- 2026-08-16 — Target MCP SDK v2 (`@modelcontextprotocol/server@2.x`) and 2026-07-28 spec (current stable).
- 2026-08-16 — All 91 Semgrep rules marked DO_NOT_PUBLISH_YET until provenance audit complete.
- 2026-08-16 — Tenant isolation engine integration confirmed feasible (clean scan() export, no MCP coupling).
- 2026-08-16 — LLMVerify postinstall stdout is a REQUIRED fix before MCP integration (v1.6.0).
- 2026-08-16 — Scan Receipt + proof-of-fix lifecycle classified BUILD_IN_V0.1.
- 2026-08-16 — Canonical hash pattern from `lib/audit-orchestrator/fingerprint.ts` classified REUSE_IMPLEMENTATION.
- 2026-08-16 — Fabricated numeric confidence values to be replaced with qualitative evidence strength.

### Phase -1 Key Findings (top 10 — see `00-EXECUTIVE-SUMMARY.md` for full detail)
1. Rule count "121" is FALSE — actual is 91 Semgrep rules in YAML.
2. Critical version drift: SCANNER_VERSION 3.28.0 vs 3.27.0; RULEPACK_VERSION 3 formats.
3. Rule provenance UNKNOWN — no license headers, no attribution; all 91 rules DO_NOT_PUBLISH_YET.
4. Display ID aliasing: 91 Semgrep IDs → 72 display IDs (12 shared).
5. Scanner heavily coupled to Prisma/Modal/auth — cannot move to open source as-is.
6. LLMVerify postinstall prints to stdout — breaks MCP stdio.
7. LLMVerify has duplicate npm publishing workflows (one without provenance).
8. Tenant isolation engine has clean architecture — direct programmatic integration feasible.
9. Public-repo-scanner fabricates numeric confidence (0.9/0.7/0.5/0.8).
10. Evidence fingerprint architecture: two implementations, neither fully suitable for Scan Receipt.

### Phase -1 Deferred / Handoffs to Phase 0
- Resolve version canonicalization (which SCANNER_VERSION/RULEPACK_VERSION is authoritative).
- Decide on display ID aliasing (preserve 91→72 or resolve).
- Investigate the "30 SOC2 rules" (where are they? do they exist?).
- Investigate which rule is missing `metadata.rule_id` (90 entries for 91 rules).
- Scaffold repo structure and define TypeScript interfaces.
- Set up MCP SDK v2 with stdio transport.
- Implement tool-independence module boundaries + test harness.
- Implement canonical hash pattern, path validator, output sanitizer.

### Phase -1 Files Created
- `AGENTS.md` (session rules)
- `PHASES.md` (this file)
- `docs/phase-minus-1/00-EXECUTIVE-SUMMARY.md` through `24-PHASE-0-ENTRY-DECISION.md` (24 documents + 1 JSON evals file)

---

## Phase -0.5 — Forensic Reconciliation & P0 Closure

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Scope:** Correct overstrong Phase -1 conclusions. Trace actual rule execution path. Reconcile SOC2 rule status. Reassess provenance. Correct LLMVerify, tenant isolation, canonicalization, competitive, and MCP language.
- **Decision:** READY_FOR_PHASE_0 (confirmed)

### Phase -0.5 Key Corrections
1. Rule count: 121 `ai-*` detectors in Modal (NOT "91+30 SOC2"); 91 in YAML; 0 SOC2 execute
2. SOC2 rules: entirely non-functional (0 execute, 30 phantom mappings, 21 metadata-only TS objects)
3. Provenance: ~63 PROVEN_HAIEC_ORIGINAL, ~28 STRONG_HAIEC_ORIGIN_EVIDENCE (not "UNKNOWN for all")
4. LLMVerify: MCP_STDIO_FIRST_RUN_RISK (not "not MCP-stdio-safe")
5. Tenant isolation: includes MCP, but scan() bypasses wrapper (not "no MCP coupling")
6. Canonicalization: REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS (not "directly reusable")
7. Competitive: COMPETITIVE_VALIDATION_REQUIRED (not "unique differentiator")
8. MCP: dual-era SDK, stdio is long-lived (not "MCP 2026 is stateless")
9. MCP client compat: deferred to pre-Beta (not "P0 blocker")
10. AI discovery: separated into 4 categories (not conflated)

### Phase -0.5 Files Created
- `docs/phase-minus-0-5/00-RECONCILIATION-SUMMARY.md` through `13-PHASE-0-ENTRY-DECISION.md` (14 documents)

### Phase -0.5 Files Modified
- `docs/phase-minus-1/00-EXECUTIVE-SUMMARY.md` (added correction notice)
- `docs/phase-minus-1/02-CLAIMS-LEDGER.md` (corrected claim #1, added claims to retire)
- `docs/phase-minus-1/03-VERSION-DRIFT-AUDIT.md` (corrected rule count section)
- `docs/phase-minus-1/04-RULEPACK-FORENSIC-INVENTORY.md` (added correction notice, fixed conflict table)
- `docs/phase-minus-1/24-PHASE-0-ENTRY-DECISION.md` (added correction notice, pointer to Phase -0.5)

---

## Phase 0 — Scaffolding & Interface Design

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Scope:** Scaffold repo, define interfaces, set up MCP v2, implement core utilities (JCS canonicalization, path validator, output sanitizer). NO rule copying, NO publishing, NO engine integration, NO public claims.
- **Entry prerequisites:** READY_FOR_PHASE_0 (Phase -1 + Phase -0.5 complete, read-only repos unmodified, no P0 blockers affecting Phase 0 scope).
- **Decision:** PHASE_0_PASS

### Phase 0 Key Decisions
1. Package: `haiec-agent-security` (private, fallback; `@haiec/agent-security` preferred for future)
2. MCP SDK: v2.0.0 with `serveStdio()` dual-era compatibility
3. Canonicalization: RFC 8785 JCS via `canonicalize` 4.0.0
4. TypeScript: 5.9.3 (v7 incompatible with typescript-eslint)
5. Tool independence: ESLint `no-restricted-imports` + architecture tests
6. No rules published (provenance pending)
7. No engine integration (contracts only)
8. No deploy orchestration (contract only)
9. No host plugins (architecture supports future)
10. License: FOUNDER_DECISION_REQUIRED

### Phase 0 Files Created
- `package.json`, `tsconfig.json`, `eslint.config.js`, `.gitignore`
- `src/contracts/` (7 files: finding, engine, result, verdict, artifact, tool, errors, index)
- `src/mcp/` (3 files: protocol, tool-definitions, server-factory)
- `src/security/` (3 files: path-boundary, secret-redaction, output-sanitizer)
- `src/provenance/` (2 files: canonicalize, digest)
- `src/engines/` (3 READMEs: ai-security, tenant-isolation, llmverify)
- `src/orchestration/deploy-security/README.md`
- `evals/tool-selection/` (scenarios.json with 102 scenarios, README.md)
- `rules/README.md`
- `tests/` (6 test files: architecture, contracts, security, provenance, evals, mcp)
- `.github/workflows/ci.yml`
- `docs/phase-0/` (15 documents: 00-14)

### Phase 0 Test Results
- 78 tests, all passing
- 0 vulnerabilities
- Build succeeds, typecheck passes

- **See:** `docs/phase-0/14-PHASE-0-EXIT-DECISION.md` for full exit gate results.

---

## Phase 1 — LLMVerify Hardening (external repo)

- **Status:** done
- **Scope:** Harden `llmverify-npm` from 1.5.2 to 1.6.0 (postinstall removal, 2000/day limit, schema versioning, Node 22/24, claim cleanup, publish to npm).
- **Decision:** PHASE_1_PASS — `llmverify@1.6.0` published to npm.
- **Note:** This phase modified the read-only `llmverify-npm` repo with user authorization. It is not part of the `haiec-ai-agent-security-free-mcp` repository.

---

## Phase 2 — Canonical AI Security Rulepack: Provenance, Parity & Migration Candidate

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Scope:** Extract production AI_SECURITY_RULES from modal_ai_security_scanner.py, classify all 121 detectors, audit provenance, compare production vs legacy, design detectorId/checkId identity, classify findingKind and disposition, create candidate manifest, document rule quality backlog. NO rule body publication, NO MCP tool registration, NO Semgrep modernization.
- **Decision:** READY_WITH_EXCLUSIONS

### Phase 2 Key Numbers
- Production detector definitions: 121
- Logical checks (checkId groups): 80
- Legacy semgrep_rules.yaml detectors: 91
- Provenance: 121 STRONG_HAIEC_ORIGIN_EVIDENCE
- Publication: 121 CANDIDATE
- BLOCK candidates: 9
- PRESENCE detectors: 43 (all INFORMATIONAL, none BLOCK)

### Phase 2 Key Decisions
1. Two stable identities: detectorId (121 unique) and checkId (80 unique)
2. All 121 detectors: STRONG_HAIEC_ORIGIN_EVIDENCE (HAIEC-authored, no third-party)
3. All 121 detectors: CANDIDATE publication status (pending external similarity check + license)
4. PRESENCE detectors must not default to BLOCK (mandatory safety rule)
5. 9 BLOCK candidates: hardcoded keys, API key in URL, AI output to exec/eval
6. Candidate version: 0.1.0-candidate.1 (not v1.0)
7. Rule bodies remain in .private-rule-staging/ (gitignored) until publication approval
8. 30-detector difference (121 vs 91) fully explained by language splits
9. No MCP tool registration (scan_ai_security not registered)
10. Standing product principle added to AGENTS.md: ONE WORKFLOW, FOUR CHECKS

### Phase 2 Files Created
- `docs/phase-2/00-PHASE-2-SUMMARY.md` through `19-PHASE-2-EXIT-DECISION.md` (20 documents)
- `rules/candidate-manifest.json` (metadata only, no rule patterns)
- `.private-rule-staging/` (gitignored: extracted YAML, analysis scripts, classification data)

### Phase 2 Files Modified
- `AGENTS.md` (added §9: Standing Product Principle)
- `.gitignore` (added .private-rule-staging/)

### Phase 2 Deferred / Handoffs to Next Phase
- External similarity check (automated comparison against Semgrep community rules)
- Final license selection for the project
- Semgrep 1.52.0 execution validation in isolated environment
- Golden corpus fixture implementation
- Rule quality fixes (P0/P1/P2 backlog documented)
- MCP tool registration for scan_ai_security
- Semgrep modernization

---

## Phase 2.5 — Rulepack Qualification, Provenance Closure & Publication Gate

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Scope:** Close unfinished Phase 2 validation: execute external similarity review, strengthen provenance, validate logical check groups, run Semgrep 1.52.0, implement golden corpus, revalidate findingKind/BLOCK/control-gap, update manifest, create modernization baseline.
- **Decision:** QUALIFIED_WITH_RULE_EXCLUSIONS

### Phase 2.5 Key Numbers
- External rules compared: 2,228 (from semgrep/semgrep-rules repo)
- External similarity: 118 NO_MEANINGFUL_MATCH_FOUND, 3 GENERIC_SIMILARITY, 0 STRONG/EXACT_MATCH
- Semgrep 1.52.0 YAML validation: PASS (121/121)
- Semgrep 1.52.0 scan execution: DEFERRED (requires Unix — `resource` module not on Windows)
- Golden corpus: 107 fixtures (93 positive, 7 negative, 7 false-positive)
- BLOCK confirmed: 7 (down from 9 — 2 downgraded to REDESIGN_BEFORE_BLOCK)
- Redesign required: 24 detectors (17 control-gap + 7 prompt-injection)
- Manifest hash: 22e4897bb3a5a86b...

### Phase 2.5 Key Decisions
1. External similarity: NO copying found — 3 GENERIC_SIMILARITY are expected common patterns
2. Provenance: 121 STRONG_HAIEC_ORIGIN_EVIDENCE (confirmed by external similarity check)
3. Publication: 121 APPROVED_CANDIDATE (metadata safe; 24 rule bodies need redesign)
4. Logical checks: 80 (75 GROUP_VERIFIED, 5 AMBIGUOUS — likely verified after manual review)
5. BLOCK: 7 confirmed (hardcoded keys + AI output to exec), 2 redesign (api-key-in-url)
6. Control gaps: 17 invalid (pattern cannot prove absence) → REDESIGN_REQUIRED
7. Prompt injection: 7 messages overstate evidence → REDESIGN_REQUIRED
8. Secret detection: Cannot distinguish real keys from placeholders → REDESIGN_REQUIRED
9. Semgrep 1.52.0 cannot run on Windows — scan execution deferred to Unix environment
10. Baseline created at baseline/semgrep-1.52/ for Phase 3 modernization comparison

### Phase 2.5 Files Created
- `docs/phase-2-5/00-SUMMARY.md` through `15-EXIT-DECISION.md` (16 documents)
- `baseline/semgrep-1.52/baseline-metadata.json`
- `baseline/semgrep-1.52/fixture-hashes.json`
- `.private-rule-staging/` (gitignored: external comparison, fixtures, qualification scripts)

### Phase 2.5 Files Modified
- `rules/candidate-manifest.json` (updated to schema 1.1 with qualification fields)
- `PHASES.md` (this entry)

### Phase 2.5 Deferred / Handoffs to Phase 3
- Semgrep 1.52.0 scan execution (requires Unix/Linux/macOS environment)
- Behavioral parity test (requires Semgrep execution)
- Rule body redesign for 24 REDESIGN_REQUIRED detectors
- Final license selection
- MCP tool registration for scan_ai_security
- Semgrep modernization (compare 1.52.0 baseline against current stable at Phase 3 time)
- Verify current stable Semgrep version AT Phase 3 entry time (do not hardcode)

---

## Phase 2.6 — Linux Baseline Execution & Rule Qualification Closure

- **Status:** done
- **Started:** 2026-08-16
- **Completed:** 2026-08-16
- **Scope:** Execute Semgrep 1.52.0 on Linux, run golden corpus, validate positive coverage, resolve AMBIGUOUS groups, true behavioral parity, revalidate BLOCK with real fixtures, fix publication status taxonomy, create performance baseline, freeze baseline.
- **Decision:** QUALIFIED_WITH_RULE_EXCLUSIONS

### Phase 2.6 Key Numbers
- Linux environment: Docker returntocorp/semgrep:1.52.0
- Semgrep 1.52.0 execution: 165 findings, 1 pattern error, 34/121 detectors fired
- Golden corpus: 107 fixtures (33 PASS, 52 UNEXPECTED_FINDING, 16 MISSING_FINDING, 6 FAIL)
- Positive coverage: 23/80 logical checks (28.75%)
- BLOCK confirmed: 0 (all 9 downgraded to REDESIGN_BEFORE_BLOCK)
- REDESIGN_REQUIRED (rule body): 33
- QUALIFIED_CANDIDATE (rule body): 88
- AMBIGUOUS groups resolved: 5/5 → all GROUP_VERIFIED
- FindingKind: 44 PRESENCE, 26 RISK_SIGNAL, 26 CONTROL_GAP, 25 VULNERABILITY
- Parity: EXACT (candidate = production-extracted)
- Baseline ID: haiec-ai-security-semgrep152-baseline-v1

### Phase 2.6 Critical Finding
Zero BLOCK candidates survived fixture validation. The current rulepack cannot support automated deployment blocking. 87/121 detectors did not fire on any fixture, indicating broad pattern gaps or overly narrow pattern syntax.

### Phase 2.6 Files Created
- `docs/phase-2-6/00-SUMMARY.md` through `15-EXIT-DECISION.md` (16 documents)
- `baseline/semgrep-1.52/baseline-metadata.json`
- `baseline/semgrep-1.52/environment.json`
- `baseline/semgrep-1.52/expected-findings.json`
- `baseline/semgrep-1.52/fixture-hashes.json`
- `baseline/semgrep-1.52/performance.json`

### Phase 2.6 Files Modified
- `rules/candidate-manifest.json` (updated to schema 1.2 with split publication statuses)
- `PHASES.md` (this entry)

### Phase 2.6 Handoffs to Phase 3
- Fix `ai-function-calling-js` regex parse error
- Redesign 33 REDESIGN_REQUIRED rule bodies
- Improve positive fixture coverage from 23/80 to target >80%
- Run modern Semgrep against baseline for comparison
- Verify current stable Semgrep version AT Phase 3 entry time
- Do NOT begin Semgrep modernization until explicitly authorized

---

## Phase 3 — (placeholder)

- **Status:** pending
- **Scope:** TBD
- **Status:** done
- **Completed:** 2026-08-16
- **Decision:** ADOPT_MODERN_WITH_EXCLUSIONS (Part B); PUBLIC_PUSH_PASS (Part A)

### Phase 3 Key Numbers
- Public commit: `fd27714` on `main` (38 files, 6080 insertions)
- Modern Semgrep: 1.173.0 (2026-08-12)
- Legacy findings: 165 (143 unique)
- Modern findings: 165 (143 unique)
- Finding deltas: 0 (100% identical)
- Pattern errors: 1.52 had `ai-function-calling-js`, 1.173 has `ai-prompt-injection-langchain`
- Compatibility: 119 unchanged, 1 improved, 1 rule bug (not engine regression)
- Engine selection: ADOPT_MODERN_WITH_EXCLUSIONS

### Phase 3 Files Created
- `README.md` (public)
- `SECURITY.md` (public)
- `docs/phase-3/00-SUMMARY.md` through `12-EXIT-DECISION.md` (13 internal docs)

### Phase 3 Files Modified
- `PHASES.md` (this entry)

### Phase 3 Public Push
- Commit: `fd277140a9d8b6e18a8d0f5af0ea0bc15838a7b0`
- Repo: `subodhkc/haiec-ai-agent-security-free-mcp`
- Branch: `main`
- No private rule bodies, no AGENTS.md, no PHASES.md, no internal docs pushed

### Phase 3 Handoffs to Phase 3.5
- Fix `ai-prompt-injection-langchain` pattern (JS syntax in Python rule)
- Redesign 33 REDESIGN_REQUIRED rule bodies
- Build MVP subset (15-25 high-confidence checks)
- Implement taint-mode rules for prompt injection and AI output execution
- Add metavariable-regex to secret detection
- Reclassify or deprecate missing-* control gap rules
- Do NOT begin Phase 3.5 automatically

---

## Phase 3.25 — Historical Test Reconciliation & Rule-by-Rule Truth Audit

- **Status:** done
- **Completed:** 2026-08-16
- **Decision:** B — RULEPACK_AND_TEST_HARNESS_BOTH_HAVE_MATERIAL_ISSUES

### Phase 3.25 Key Findings
- Overall conclusion: B (rulepack and test harness both have material issues)
- Historical test_sample_code.py was NEVER an automated test — contains wrong expectations
- Phase 2.6 fixtures were generated from names/messages, not actual rule patterns
- Phase 2.6 negative/FP logic counted cross-rule interference as failures
- false-positive-filter.ts = DEAD CODE (not imported anywhere)
- deterministic-engine.ts (ai-security) = DEAD CODE (not imported anywhere)
- Production pipeline: API → Modal → Semgrep 1.52 → parse → DB (no TS post-processing)
- ai-tool-abuse-output-exec: Taint rule has false positive on subprocess.run(shell=True) in Semgrep 1.52.0
- dangerous-eval-exec-ai-output: Has JS pattern (new Function) in Python rule — parse error
- ai-prompt-injection-* (7 rules): WORKS_BUT_MESSAGE_OVERSTATES (detect API calls, not injection)
- missing-data-minimization-*: WORKS_BUT_NAME_MISLEADING (detects concrete behavior)
- missing-max-tokens: WORKS_AS_DESIGNED (contrary to Phase 2.6 LOGIC_ERROR classification)
- hardcoded-api-key-python: WORKS_BUT_TOO_BROAD (matches placeholders)
- missing-ai-auth-python: WORKS_BUT_TOO_NARROW (only Flask, not FastAPI)

### Phase 3.25 Corrected Coverage
- Phase 2.6 reported: 23/80 (28.75%)
- Corrected isolated-rule estimate: ~45/80 (56%)
- Corrected full-pipeline estimate: ~40/80 (50%)

### Phase 3.25 Rule Status Breakdown
- WORKS_AS_DESIGNED: ~95
- WORKS_BUT_NAME_MISLEADING: 15
- WORKS_BUT_MESSAGE_OVERSTATES: 7
- WORKS_BUT_TOO_BROAD: 2
- WORKS_BUT_TOO_NARROW: 1
- NEEDS_REPAIR: 1
- PARSER_ERROR: 1

### Phase 3.25 Next Actions
- KEEP: ~95 rules
- RENAME_OR_RECLASSIFY: 15 rules
- REPAIR: 5 rules
- REDESIGN: 7 rules (prompt injection → taint mode)
- DEPRECATE: 0

### Phase 3.25 Files Created
- `docs/phase-3-25/00-EXECUTIVE-SUMMARY.md` through `14-EXIT-DECISION.md` (15 docs)

### Phase 3.25 Handoffs to Phase 3.5
- Phase 3.5 rebuild recommendation STILL STANDS but with modified scope
- Focus on 7 REDESIGN + 5 REPAIR + 15 RENAME rules (not full 121 rebuild)
- MVP should ship ~110 rules (95 KEEP + 15 RENAME after renaming)
- Do NOT begin Phase 3.5 automatically

---

## Phase 3.3 — Rule Qualification Closure

- **Status:** done
- **Completed:** 2026-08-16
- **Decision:** B — RULEPACK_AND_TEST_HARNESS_BOTH_HAVE_MATERIAL_ISSUES (confirmed with exact counts)

### Phase 3.3 Key Findings
- All 121 detectors tested in isolation against positive, negative, and FP fixtures
- 5 testing rounds completed to resolve all initial failures
- Exact root cause identified for every failure
- Status counts sum to exactly 121 (no approximations)
- Logical check count: 78 (not 80 as previously claimed)
- Qualified logical checks: 61
- Qualified detector definitions: 91
- Semgrep 1.172.0 verified as stable future baseline (1.173.0 exists but not used)

### Phase 3.3 Final Counts
- QUALIFIED_AS_IS: 72
- QUALIFIED_BUT_RENAME: 14
- QUALIFIED_BUT_MESSAGE_FIX: 0
- QUALIFIED_WITH_PRECISION_REPAIR: 5
- NEEDS_LOGIC_REPAIR: 22
- NEEDS_REDESIGN: 7
- PARSER_ERROR: 1
- NOT_YET_VALIDATED: 0
- TOTAL: 121

### Phase 3.3 Root Causes for 22 NEEDS_LOGIC_REPAIR
- 12 double-escaped regex (ai-rest-* rules)
- 6 ... in strings doesn't work in Semgrep 1.52.0
- 2 multi-language silent failure (JS pattern in Python rule)
- 1 pattern doesn't match keyword arguments
- 1 ? in template literal causes failure

### Phase 3.3 Public Rulepack Recommendation
- PUBLIC_READY_DETECTORS: 86 (72 AS_IS + 14 RENAME)
- PUBLIC_READY_LOGICAL_CHECKS: 61
- RULES_REQUIRING_SMALL_FIX: 6
- RULES_REQUIRING_REDESIGN: 29

### Phase 3.3 Files Created
- docs/phase-3-3/00-SUMMARY.md through 08-EXIT-DECISION.md (9 docs)
- .private-rule-staging/qualification/detector-matrix.json
- .private-rule-staging/qualification/logical-check-matrix.json
- .private-rule-staging/qualification/execution-results/

### Phase 3.3 Handoffs to Next Phase
- Rule redesign phase should start with precise scope:
  - REPAIR: 28 detectors (22 logic + 5 precision + 1 parser)
  - REDESIGN: 7 detectors (prompt injection → taint mode)
  - RENAME: 14 detectors (missing-* → concrete behavior names)
- Do NOT begin fixing rules automatically

---

## Phase 3.4 — Evidence Reconciliation, Semantic Check Taxonomy, Canonical Rulepack Source of Truth, and Controlled Private Repair

- **Status:** done
- **Completed:** 2026-08-16
- **Decision:** COMPLETE — evidence reconciled, rc.2 built privately, no public release

### Phase 3.4 Key Findings
- Engine drift between Semgrep 1.52.0 and 1.173.0: ZERO (107/107 fixtures identical)
- All Phase 3.3 diagnoses confirmed as CURRENT_STABLE_CONFIRMED on 1.173.0
- Phase 3.3 correction: dangerous-eval-exec-ai-output reclassified (eval pattern issue, not multi-lang silent failure)
- Reconciliation: 65 CONFLICT_2_6_FAIL_3_3_PASS (golden fixtures were wrong), 8 CONFLICT_2_6_PASS_3_3_FAIL (deeper analysis found defects)
- Reproducibility: 5/5 identical runs, normalized digest 53b425562b6a66fa
- Semantic check registry: 81 security checks, 78 public check IDs, 121 detector definitions
- Public claims audit: 7 SUPPORTED, 3 SUPPORTED_WITH_SCOPE, 2 CONFLICTING, 2 UNSUPPORTED, 2 FALSE_AS_WRITTEN
- <1% FP claim: UNSUPPORTED (no evidence found)
- 500+ repo claim: UNSUPPORTED (no evidence found)
- "Every finding has data-flow path": FALSE_AS_WRITTEN (only 6 taint rules have data flow)
- rc.2 built: 185 findings, 45 detectors, 0 errors (up from 165/34/1)
- Full-pack interference: 42 same-line duplicates, 11 severity conflicts

### Phase 3.4 Final Public-Ready Counts
- PUBLIC_READY: 72
- READY_AFTER_METADATA_FIX: 14
- READY_AFTER_RULE_REPAIR: 28
- REDESIGN_REQUIRED: 7
- DEFER: 0
- DEPRECATE: 0
- TOTAL: 121

### Phase 3.4 Files Created
- docs/phase-3-4/SUMMARY.md
- docs/phase-3-4/CANONICAL-ARCHITECTURE.md
- docs/claims/AI-SECURITY-PUBLIC-CLAIMS-EVIDENCE-MATRIX.md

---

## Phase 3.5 — Final Static Rulepack Qualification, Contradiction Closure, RC.3 Repair, and Release-Candidate Gate

- **Status:** done
- **Completed:** 2026-08-17
- **Decision:** PHASE_3.5_COMPLETE — PUBLIC_CORE_READY_PENDING_LICENSE; FULL_STATIC_RULEPACK_NOT_READY

### Phase 3.5 Key Results
- All Phase 3.4 contradictions resolved from raw evidence
- ai-function-calling-js: parser error on both engines (root cause: YAML single-quote double-escape); fixed in rc.2/rc.3
- dangerous-eval-exec: Phase 3.3 CORRECTED — eval($X) does not match in Python multi-lang; exec($X) does; split into language-specific rules in rc.3
- hardcoded-api-key-python: matches placeholders (NOT PUBLIC_READY); fixed in rc.3 with length+placeholder-exclusion regex
- ai-tool-abuse-output-exec: subprocess.run(shell=True) FP fixed in rc.3 by removing subprocess sinks (Semgrep taint limitation)
- Phase 3.3 diagnosis matrix: 6 CONFIRMED, 2 PARTIALLY_CONFIRMED, 1 CORRECTED, 3 NOT_RETESTED
- Semgrep 1.173.0 verified: image sha256:67319956..., Alpine 3.23.5
- rc.3: 122 detectors (121 + 1 split), 183 findings, 44 detectors fired, 0 parser errors
- Reproducibility: 5/5 identical, digest 90fe18ea9cb7b4f3d6a5429f126038349b43cf2bbbaefa18703fa7e37efe9657
- Network-blocked: PASS (183 findings, 0 errors, no network required)
- Smoke test: 4 repos (Python + TypeScript), 0 parser errors, 0 scan failures
- TypeScript engine: 8 unique useful checks worth preserving (CFG, alias, heap, completeness, etc.)
- Prompt-injection: 7 detectors reclassified PRESENCE (detect API usage, not injection)
- Finding kinds: PRESENCE 15, RISK_SIGNAL 41, VULNERABILITY 17, CONTROL_GAP 8
- 9 VULNERABILITY checks downgraded to RISK_SIGNAL (lack complete proof)
- BLOCK count: 0
- Duplicates: 23 before normalization, 0 after
- Severity conflicts: 11 before normalization, 0 after
- Known FP fixture failures: 0 (rc.3 fixed all known FPs)

### Phase 3.5 Final Counts
- Total detectors: 122 (was 121; +1 from eval/exec split)
- Total semantic checks: 81
- Total legacy display IDs: 78
- PUBLIC_READY: 72
- READY_AFTER_METADATA_FIX: 14
- READY_AFTER_RULE_REPAIR: 29 (was 28; +1 from new js detector)
- REDESIGN_REQUIRED: 7
- DEFER: 0
- DEPRECATE: 0

### Phase 3.5 rc.3 Hashes
- rc.3 rulepack SHA256: 8d9596b57ef2bbb6c461884a8ec2a22c03b6db6a3f03e6a45e5e00dcaecfc8e9
- rc.3 manifest SHA256: 4418ebb2f5a6736eb8de47c68e8ff3603dea2f834dbb2b9de1bfb26c6c8ab5bd

### Phase 3.5 Status Decisions
- PUBLIC_CORE_STATUS: READY_PENDING_LICENSE (72 detectors, 48 semantic checks)
- FULL_STATIC_RULEPACK_STATUS: NOT_READY (50 detectors need repair/redesign)

### Phase 3.5 Files Created
- docs/phase-3-5/SUMMARY.md (final 56-item report)
- docs/phase-3-5/normalization-spec.md
- .private-rule-staging/mvp-rc3/haiec-ai-security.yml (rc.3 rulepack)
- .private-rule-staging/mvp-rc3/manifest.json
- .private-rule-staging/mvp-rc3/hashes.json
- .private-rule-staging/phase35/ (11 JSON artifacts)
- .private-rule-staging/phase35-*.py / .sh (analysis and test scripts)

### Phase 3.5 Handoffs to Next Phase
- PHASE 4 — PUBLIC CORE RELEASE PREPARATION
- Obtain license/provenance approval for public rule release
- Apply metadata fixes to 14 READY_AFTER_METADATA_FIX detectors
- Apply rule repairs to 29 READY_AFTER_RULE_REPAIR detectors
- Wire scan_ai_security MCP tool to rc.3 rulepack (after approval)
- Build normalized finding output layer per normalization-spec.md
- Integrate TypeScript deterministic engine as STATIC_FUTURE_ANALYZER
- Correct unsupported website claims (blocked — requires website repo access)
- Build check_deploy_security orchestration gate (future)

---

## Phase 3.6A — Product Truth, Downstream Dependency, Sample/Proof, and Launch-Safety Audit

- **Status:** done
- **Completed:** 2026-08-17
- **Decision:** PHASE_3.6A_COMPLETE — READ-ONLY FORENSIC AUDIT DONE; 12 P0 issues identified; Phase 3.6B scope defined

### Phase 3.6A Key Results
- Static-scanner downstream consumers found: 31 (9 CRITICAL, 8 HIGH, 14 MEDIUM)
- Hardcoded rule count locations: 20+ across UI/docs/email (78, 82, 91, 92, 121)
- Version drift: Modal 3.28.0 vs Next.js 3.27.0; /api/health NOT created; CI verification NOT implemented
- Sample artifacts found: 11 (ALL SYNTHETIC; 4 inaccurate descriptions)
- AI security sample uses MOCK data but gallery says "real output" — P0
- Trust page defaults all 8 controls to 'implemented' with 0 evidence — P0
- Report says "violates SOC2/GDPR/HIPAA" from pattern detection alone — P0
- Industry benchmarks cite OWASP/DBIR with no URL/citation — P0
- 45/28/15/5% exploitation probabilities have no source — P0
- "Estimated Value Protected" derived from unverified inputs — P0
- Homepage claims "Provable data-flow paths. Not heuristics." — P0 (only 6 taint rules)
- Risk score can inflate from duplicate findings — P1 (confirmed)
- 3 risk score formulas found (aggregation-v1, context-aware-v2, ai-inventory)
- TypeScript engine: 8 analyzer capabilities worth preserving (NOT wired to production scan)
- No P0/P1 issues block MCP static integration — all critical issues are in HAIEC SaaS

### Phase 3.6A P0/P1 Counts
- P0: 12 (all FIX_BEFORE_SAAS_CUTOVER)
- P1: 5 (3 FIX_BEFORE_SAAS_CUTOVER, 2 FIX_DURING_SAAS_CUTOVER)
- P2: 7 (FIX_DURING_SAAS_CUTOVER)
- P3: 1 (DEFER)

### Phase 3.6A Files Created
- docs/phase-3-6a/00-EXECUTIVE-SUMMARY.md through 16-PHASE-3-6B-INPUT.md (17 docs)
- .private-rule-staging/phase36a/dependency-map.json
- .private-rule-staging/phase36a/claim-map.json
- .private-rule-staging/phase36a/sample-artifact-map.json
- .private-rule-staging/phase36a/version-map.json
- .private-rule-staging/phase36a/risk-score-map.json
- .private-rule-staging/phase36a/priority-gap-map.json

### Phase 3.6A Handoffs to Next Phase
- PHASE 3.6B — REPAIR PHASE (requires explicit authorization to modify HAIEC SaaS)
- Fix 12 P0 issues (trust page, sample report, compliance language, benchmarks, financial claims, overclaims)
- Fix 5 P1 issues (version drift, health endpoint, CI verification, cleanRules, duplicate inflation)
- Implement sample-versioning contract
- Implement rulepack change-log model
- Do NOT begin without explicit user authorization
- .private-rule-staging/mvp/haiec-ai-security.yml (rc.2, gitignored)
- .private-rule-staging/mvp/manifest.json (gitignored)
- .private-rule-staging/phase34/ (all artifacts, gitignored)

### Phase 3.4 Handoffs to Next Phase
- rc.2 exists but needs founder/license approval before public release
- Public claims need correction (remove <1% FP, 500+ repo, "every finding has data-flow path")
- Canonical manifest architecture ready for Phase 4.5 migration
- Prompt-injection redesign still needed (7 detectors)
- Metadata fixes needed for 14 detectors (rename missing-* rules)

---

## Phase 4A — Local scan_ai_security MCP Tool Implementation

- **Status:** done
- **Completed:** 2026-08-17
- **Decision:** COMPLETE — scan_ai_security implemented, tested, validated

### Phase 4A Key Results
- scan_ai_security MCP tool implemented with full scanner pipeline
- 159 tests passing, typecheck clean
- Private-bundle smoke tests: small + medium repos through direct scanner path
- Completeness model: COMPLETE/PARTIAL/UNSUPPORTED/ERROR
- Process tree safety: taskkill /T /F on Windows, process-group kill on POSIX
- No telemetry, no network calls during scan
- Private rulepack gitignored, synthetic test rulepack for CI

---

## Phase 4B — MCP Protocol Hardening & Release Candidate

- **Status:** done (initial report overstated completion — corrected in Phase 4B-C1)
- **Completed:** 2026-08-17
- **Decision:** COMPLETE with corrections

### Phase 4B Key Results
- 166 tests passing, typecheck clean
- MCP outputSchema defined with Zod validation
- structuredContent + compact TextContent (17KB total on medium repos)
- Tool annotations: readOnlyHint=true, openWorldHint=false (no destructive/idempotent)
- Tool description corrected (removed "prompt-injection exposure" overstatement)
- MCP stdio E2E tests (InMemoryTransport): initialize, tools/list, tools/call, isError
- Private-bundle MCP E2E: medium repos scan through actual MCP protocol
- Scope accounting: filesAnalyzed, filesWithFindings, findingsExcludedByReportingScope
- Severity mapping: ERROR→CRITICAL, WARNING→MEDIUM
- Selection evals: 10 adversarial ambiguous cases added (S113-S122)
- NPM package audit: 0 vulnerabilities, no private leakage, clean install passes

### Phase 4B Correction (from Phase 4B-C1)
- Initial Phase 4B report claimed "Phase 4B COMPLETE" but mandatory work remained:
  - No bundled Public Core (rules not in package)
  - No license (MIT not applied)
  - No doctor/setup commands
  - No engine preflight model
  - No AI agent self-recovery contract
  - No real packaged stdio E2E
  - Small-repo MCP failure unresolved
  - No third-party inventory
  - No future engine ADR
- Phase 4B-C1 corrects these gaps

---

## Phase 4B-C1 — Distribution, Agent Adoption, and Packaged MCP Foundation

- **Status:** done
- **Completed:** 2026-08-19
- **Decision:** PHASE_4B_C1_COMPLETE — distribution foundation closed

### Phase 4B-C1 Key Results
- Public Core bundled in package (rules/public-core/), 122 detectors, 79 security checks
- All 122 detectors classified PUBLIC_CORE (0 excluded)
- MIT license applied to free MCP runtime + Public Core rulepack
- THIRD_PARTY_NOTICES.md created (Semgrep as external engine, not HAIEC-owned)
- Engine preflight model: READY/MISSING/WRONG_VERSION/UNEXECUTABLE/SETUP_REQUIRED/SETUP_UNAVAILABLE
- `doctor` command (read-only, offline, --json)
- `setup` command (explicit, isolated, idempotent, network allowed, uv/pipx/venv)
- AI agent self-recovery: structured remediation metadata in scan errors (RUN_HAIEC_SETUP)
- MCP server starts without Semgrep (initialize + tools/list work)
- schemaVersion in structured output (1.0.0)
- Bundled Public Core digest validation (fail closed if tampered)
- Real packaged stdio E2E: build → pack → clean install → subprocess → initialize
- 173 tests passing, typecheck clean
- Package: 122 files, 82.3KB packed, 448KB unpacked, 0 private leakage
- Future engine ADR-001 created (Tree-sitter/ast-grep roadmap)
- Publication boundary manifest created

### Phase 4B-C1 Key Decisions
1. MIT license for free MCP + Public Core (not Apache-2.0, not custom)
2. All 122 detectors are PUBLIC_CORE (private rc.5 == public core)
3. Semgrep 1.173.0 exact-version requirement preserved for v1
4. Bundled Public Core as default (no env vars, no login, no network for scan)
5. Private env vars (HAIEC_RULEPACK_PATH) as development override only
6. `setup` uses uv > pipx > venv priority, never global install
7. HAIEC_HOME for managed Semgrep (OS-appropriate app data location)
8. Doctor exit codes: 0=ready, 1=setup required, 2=unsupported

### Phase 4B-C1 Files Created
- rules/public-core/haiec-ai-security.yml (bundled Public Core)
- rules/public-core/manifest.json (bundled Public Core manifest)
- src/cli/doctor.ts (doctor command)
- src/cli/setup.ts (setup command)
- LICENSE (MIT)
- THIRD_PARTY_NOTICES.md
- publication-boundary-manifest.json
- docs/adr/ADR-001-future-engine-migration.md
- tests/mcp/no-semgrep-recovery.test.ts
- tests/mcp/packaged-stdio-e2e.test.ts

### Phase 4B-C1 Files Modified
- src/engines/ai-security/rulepack-provider.ts (BundledPublicCoreRulepackProvider)
- src/engines/ai-security/semgrep-resolver.ts (preflight model, managed path, remediation)
- src/engines/ai-security/types.ts (ScanRemediation)
- src/engines/ai-security/scanner.ts (remediation metadata in errors)
- src/mcp/server-factory.ts (remediation in outputSchema)
- src/mcp/index.ts (CLI subcommands: doctor, setup, --help)
- package.json (files allowlist, bin entry)
- PHASES.md (this entry)

### Phase 4B-C1 Handoffs to Phase 4B-C2
- Scan Receipt implementation (mandatory Phase 4B work)
- Proof-of-fix implementation (mandatory Phase 4B work)
- Large-repository MCP smoke test
- Diversity-aware bounding (per-check finding limits)
- Same-process recovery E2E (setup → retry scan in same MCP process)
- Native-vs-Docker normalized digest comparison
- Public packaging (remove private:true, npm publish, MCP Registry)

---

## Phase 4B-C1R — C1R Validation Run

- **Status:** done
- **Completed:** 2026-08-19
- **Decision:** C1R_PASS — all mandatory C1R gates passed

### Phase 4B-C1R Key Results
- 188 tests pass, typecheck clean
- Doctor: SETUP_REQUIRED → setup → READY (empirically validated)
- Setup: Semgrep 1.173.0 installed via venv, idempotent, isolated
- Same-process recovery: MCP recovers after setup without restart (REVIEW/PARTIAL)
- Kestrel scan: 1704 findings, REVIEW/PARTIAL, 2473 files, 196s
- HAIEC self-scan: 10 findings, REVIEW/COMPLETE, 33 files, 44s
- Offline: PARTIALLY_VERIFIED (source inspection, no firewall test)
- Provenance: 122/122 HAIEC_ORIGINAL, 0 OTHER_REVIEW_REQUIRED
- Public Core manifest discrepancy resolved (rulepackVersion field only)
- License: MIT (clean), TRADEMARKS.md separated, THIRD_PARTY_NOTICES.md accurate
- Runtime matrix: Windows TESTED, Linux PARTIALLY_TESTED, macOS UNVERIFIED
- Package: 131 files, 89.4KB, 0 private leakage
- Evidence index: 13 evidence artifacts with SHA-256 digests

### Phase 4B-C1R Resolver Fix
- Root cause of prior small-repo failure: Semgrep --version check timed out on cold start (10s timeout)
- Fix: increased timeout to 30s + retry on first failure
- Kestrel scan now succeeds through MCP protocol path

---

## Phase 4B-C2 — Evidence, Determinism, and Proof

- **Status:** done
- **Completed:** 2026-08-19
- **Decision:** C2_PASS — Scan Receipt and proof-of-fix implemented

### Phase 4B-C2 Key Results
- Scan Receipt v0.1 implemented (receiptVersion, schemaVersion, findingSetDigest, scanInputDigest, coverageDigest, receiptDigest)
- Receipt digest is deterministic (excludes timestamps, duration, PIDs, absolute paths)
- Proof-of-fix v0.1 implemented (STILL_PRESENT, RESOLVED_CONFIRMED, NEW, NOT_VERIFIABLE)
- Finding disappearance alone is NOT proof — rescan must be valid
- NOT_VERIFIABLE returned when rescan is ERROR/UNSUPPORTED, rulepack mismatches, or file not analyzed
- 14 tests for receipt determinism and proof-of-fix safety
- Total: 188 tests pass

### Phase 4B-C2 Files Created
- src/engines/ai-security/scan-receipt.ts
- src/engines/ai-security/proof-of-fix.ts
- tests/engines/scan-receipt-proof-of-fix.test.ts
- docs/evidence/phase-4b-final/ (evidence index, evidence summary, scan results, offline proof, provenance, runtime matrix)

### Phase 4B-C2 Remaining Work (deferred to Phase 4C)
- Three-run determinism on Kestrel (requires multiple scan runs)
- Direct-vs-MCP semantic digest comparison
- Diversity-aware bounding (per-check finding limits)
- Controlled proof-of-fix corpus (10 scenarios)
- Timeout/process-tree empirical test
- Large-repo validation (Kestrel qualifies as large: 2473 files)
- Selection regression rerun
- Native-vs-Docker normalized digest comparison
- Public packaging (remove private:true, npm publish, MCP Registry)

---

## Phase 4B-C2R — Final MCP Technical Qualification + Master Roadmap Reconciliation

- **Status:** done (partial — C2R code gates passed, evidence gates remain for Phase 4C)
- **Completed:** 2026-08-19 (C2R initial), 2026-09-17 (C2R FINAL)
- **Decision:** PHASE_4B_C2_PARTIAL — code qualification done, remaining evidence/validation deferred to Phase 4C

### Phase 4B-C2R Key Results
- Proof-of-fix safety corrected: RESOLVED_CONFIRMED only for COMPLETE rescans (not PARTIAL)
- PARTIAL/ERROR/UNSUPPORTED rescans correctly return NOT_VERIFIABLE
- Coverage identity strengthened with file-set digests (analyzedFileSetDigest)
- scanInputDigest verified: deterministic, path-normalized, order-independent
- Diversity-aware bounding implemented: one check cannot monopolize 20-finding cap
- TruncationInfo now includes checksRepresented, checksTotal, checksOmittedDueToDisplayBounds
- 203 tests pass, typecheck clean
- Package: 131 files, 91.8KB, 0 private leakage, 0 vulnerabilities
- Native engine gaps confirmed via read-only inspection of HAIEC main repo
- Master roadmap created (docs/HAIEC-MASTER-ROADMAP.md)
- ADR-002 created (native deterministic analysis integration)
- Provenance wording corrected: STRONG origin evidence, not "122/122 HAIEC_ORIGINAL" from non-similarity alone
- "Technically ready for Phase 4C" language corrected — C2 remains PARTIAL

### Phase 4B-C2R FINAL (2026-09-17) — Decision-Quality + Empirical Qualification

- Security Concern layer implemented (deterministic grouping, v0.1)
- Concern Priority v0.1 implemented (deterministic lexicographic, no fuzzy scoring)
- Scanner integrated with concerns + accounting invariants (detectorInstancesFound, canonicalFindingsFound, materialConcernsFound, observationsFound)
- MCP output schema updated with securityConcerns + accounting fields
- 239 tests pass (203 + 28 concern + 8 proof-of-fix), typecheck clean
- Reuse/abandonment audit completed (read-only HAIEC main repo)
- 11 product-unification defects verified with file:line evidence
- Evidence Model v1, Evidence Envelope v1, Report Contract v1, MCP Assurance Boundary specs created
- Immutable Kestrel corpus created (git ls-tree -r HEAD, 5528 files, tree 4054fef7)
- Kestrel PARTIAL cause explained: 103 parser errors (NOT timeout)
- Kestrel result: 1,690 instances → 1,704 canonical → 13 material concerns
- Three-run determinism: PASS (all deterministic digests match)
- Direct vs packaged MCP: EXACT_MATCH
- Timeout/process-tree: PASS (ERROR classification, no orphan processes)
- Proof-of-fix corpus: 14 scenarios passing
- Tool selection regression: 122 scenarios, 15 tests passing
- Evidence sanitization: complete (absolute paths replaced)
- Semgrep fingerprint: captured (version, SHA-256, installation mechanism)
- Offline validation: PARTIALLY_VERIFIED (source inspection, no firewall test)
- Master roadmap updated with Platform U0-U8 sequence
- Retirement ledger created (10 candidates)
- Package audit: 139 files, 97.9KB, 0 private leakage, 0 vulnerabilities
- Evidence index regenerated: sha256:63aa097bf5ee6da680414d76341956cf1ad78e902c33e045ed48d3398ab95533

### Phase 4B-C2R Files Created
- src/engines/ai-security/scan-receipt.ts (updated with file-set digests)
- src/engines/ai-security/proof-of-fix.ts (safety correction)
- src/engines/ai-security/prioritizer.ts (diversity-aware bounding)
- src/engines/ai-security/security-concern.ts (Security Concern layer v0.1)
- src/engines/ai-security/concern-priority.ts (Concern Priority v0.1)
- src/engines/ai-security/scanner.ts (integrated concerns + accounting)
- src/mcp/server-factory.ts (output schema + decision-quality text summary)
- tests/engines/diversity-coverage.test.ts
- tests/engines/security-concern.test.ts (28 tests)
- tests/engines/scan-receipt-proof-of-fix.test.ts (8 new scenarios)
- docs/HAIEC-MASTER-ROADMAP.md (updated with Platform U0-U8)
- docs/adr/ADR-002-native-deterministic-analysis-integration.md
- docs/architecture/HAIEC-EVIDENCE-MODEL-V1.md
- docs/architecture/HAIEC-EVIDENCE-ENVELOPE-V1.md
- docs/architecture/HAIEC-REPORT-CONTRACT-V1.md
- docs/architecture/MCP-ASSURANCE-BOUNDARY.md
- docs/architecture/RETIREMENT-LEDGER.md
- docs/evidence/phase-4b-final/reuse-audit.md
- docs/evidence/phase-4b-final/product-unification-defects.md
- docs/evidence/phase-4b-final/kestrel-qualification.json
- docs/evidence/phase-4b-final/kestrel-qualification-report.md
- docs/evidence/phase-4b-final/three-run-determinism.json
- docs/evidence/phase-4b-final/direct-vs-packaged-equivalence.json
- docs/evidence/phase-4b-final/timeout-process-tree.json
- docs/evidence/phase-4b-final/semgrep-fingerprint.json
- docs/evidence/phase-4b-final/evidence-sanitization-report.md
- docs/evidence/phase-4b-final/offline-validation-report.md

### Phase 4B-C2R Remaining (Phase 4C blockers)
- Offline execution firewall-level proof (PARTIALLY_VERIFIED)
- Linux/macOS empirical testing
- Final legal/provenance review
- Remove private:true for publication
- npm publication decision
- MCP Registry decision

## Phase 4B-C2R RECONCILIATION — Evidence Accounting + Concern Semantics + Proof-of-Fix + Kestrel Determinism

- **Status:** done (local mandatory C2R reconciliation gates passed)
- **Completed:** 2026-09-17 (C2R RECONCILIATION)
- **Decision:** TECHNICALLY_READY_FOR_PHASE_4C (local mandatory gates only — firewall-level offline isolation and remote OS testing remain Phase 4C blockers)

### Phase 4B-C2R RECONCILIATION Key Results

**Accounting reconciliation (P2):**
- Replaced misleading summary field names with precise pipeline-stage names:
  - `rawEngineMatches` (was `rawFindingCount`)
  - `detectorInstancesAccepted` (was conflated with `detectorInstancesFound`)
  - `canonicalFindingInstances` (was `canonicalFindingsFound`)
  - `scopedFindingInstances` (new — was implicit)
  - `actionableFindingInstances` (was `actionableTotal`)
  - `observationInstances` (was `observationsFound`)
  - `concernFamiliesFound` (was `materialConcernsFound`)
  - `suppressedInstances` (was `findingsExcludedByReportingScope`)
  - `manifestUnmappedInstances` (new)
  - `normalizationDuplicatesCollapsed` (new)
- 5 hard accounting invariants implemented and verified:
  - I1: raw = accepted + unmapped
  - I2: accepted = canonical + duplicates
  - I3: canonical = scoped + suppressed
  - I4: scoped = actionable + observations
  - I5: concernFamilyInstanceSum = actionable

**Concern terminology correction (P3-4):**
- `SecurityConcern` → "Security Concern Family" in all agent-facing language
- A concern family is NOT a root-cause cluster, NOT a vulnerability, NOT necessarily a material issue
- Root-cause / material-issue clustering is NOT implemented in v0.1
- TypeScript type retains `SecurityConcern` name but documentation and MCP output use "concern family"
- `securityConcerns` field renamed to `securityConcernFamilies` in ScanResult and MCP output schema

**Concern Priority review (P5):**
- Concern Priority v0.1 remains deterministic lexicographic (disposition, severity, kind, breadth, count, tie-breakers)
- No evidence-strength ranking dimension added — the current evidence model does not support it
- No calibrated numeric risk score — priority is ordering only

**Rule quality fix (P7):**
- `api-key-in-error-js` and `api-key-in-error-python` rules were missing `metavariable-regex` constraint
- This caused them to match ANY `throw new Error(...)` / `raise Exception(...)` statement, not just ones with API keys
- Fix: added `metavariable-regex` matching the same secret-keyword pattern used by `api-key-in-logs` rules
- Impact: SC-API-KEY-IN-ERROR-MESSAGES dropped from 865 → 62 instances (803 false positives removed, 93% FPR)
- Total rawEngineMatches dropped from 1704 → 859 (845 false positives removed, ~50% of all findings)
- Rulepack version bumped: 0.1.0-rc.5 → 0.1.0-rc.6
- Rulepack digest updated: sha256:33b4a0dd... → sha256:013e2da0...
- Manifest digest updated: sha256:0f9247ab... → sha256:6d68142f...

**Immutable Kestrel snapshot (P8):**
- Previous scan used dirty working tree while deriving identity from `git ls-tree`
- Fix: created immutable exported tree via `git worktree add --detach C:\ks 0f131ea63...`
- 5528 files, 0 untracked, 0 dirty, 0 of the 3 prior untracked files present
- File-set digest: sha256:c6b73e45046c40454c2f3ad985a4c1ff18833197a4df4c565d5c5df0cb72a5b2

**Parser error classification (P9):**
- 102 parser errors (was 103 — rule fix changed scan coverage)
- ALL 102 are Semgrep engine limitations, NOT genuine syntax errors:
  - 99 .tsx files: Semgrep TSX parser limitation (valid TypeScript)
  - 2 .py files in docs-archive/: UTF-16 BOM encoding errors
  - 1 .py file (hvac_agent/...): valid Python (verified via ast.parse), Semgrep edge case
- 0 genuine syntax errors, 0 vendor/generated files, 0 test/example files

**Proof-of-fix check-evaluation safety (P11-12):**
- Added `evaluatedSecurityCheckIds` and `evaluatedDetectorIds` to ScanResult
- Proof-of-fix now checks whether the relevant security check was actually evaluated in rescan
- If check was NOT evaluated → NOT_VERIFIABLE (fail closed)
- Scenario 14 now correctly returns NOT_VERIFIABLE with explicit reason
- 24 proof-of-fix tests pass (including updated scenario 14)

**Kestrel three-run determinism (P13):**
- Three scans against the SAME immutable exported Kestrel snapshot
- All deterministic fields match across 3 runs (verdict, counts, concern families, digests)
- Scan IDs and durations differ (expected operational metadata)

**Architecture spec DRAFT_REFERENCE (P16):**
- HAIEC-EVIDENCE-MODEL-V1.md: Status → DRAFT_REFERENCE
- HAIEC-EVIDENCE-ENVELOPE-V1.md: Status → DRAFT_REFERENCE
- HAIEC-REPORT-CONTRACT-V1.md: Status → DRAFT_REFERENCE
- Report Contract §1.3 updated with explicit report status terminology

**Package audit:**
- 239 tests pass, typecheck clean
- private:true remains
- No commit, push, tag, publish, or deploy performed

### Phase 4B-C2R RECONCILIATION Files Modified
- src/engines/ai-security/scanner.ts (accounting fields, concern family rename, evaluated check/detector IDs)
- src/engines/ai-security/security-concern.ts (terminology correction in docs/comments)
- src/engines/ai-security/proof-of-fix.ts (check-evaluation safety)
- src/engines/ai-security/rulepack-provider.ts (updated expected digests, version bump)
- src/mcp/server-factory.ts (output schema, text summary with new field names)
- src/engines/ai-security/scan-receipt.ts (updated to new summary field names)
- rules/public-core/haiec-ai-security.yml (api-key-in-error rules fixed with metavariable-regex)
- rules/public-core/manifest.json (version bump to rc.6)
- tests/engines/scan-receipt-proof-of-fix.test.ts (scenario 14 updated, version refs updated)
- docs/architecture/HAIEC-EVIDENCE-MODEL-V1.md (DRAFT_REFERENCE status)
- docs/architecture/HAIEC-EVIDENCE-ENVELOPE-V1.md (DRAFT_REFERENCE status)
- docs/architecture/HAIEC-REPORT-CONTRACT-V1.md (DRAFT_REFERENCE status, report status terminology)

### Phase 4B-C2R RECONCILIATION Files Created
- scripts/c2r-full-forensics.ts
- scripts/c2r-parser-error-classification.ts
- scripts/c2r-kestrel-three-run-determinism.ts
- docs/evidence/phase-4b-final/kestrel-full-forensics.json
- docs/evidence/phase-4b-final/parser-error-classification.json
- docs/evidence/phase-4b-final/kestrel-export-manifest.txt
- docs/evidence/phase-4b-final/kestrel-three-run-determinism.json

### Phase 4B-C2R RECONCILIATION Remaining (Phase 4C blockers)
- Offline execution firewall-level proof (PARTIALLY_VERIFIED)
- Linux/macOS empirical testing
- Final legal/provenance review
- Remove private:true for publication
- npm publication decision
- MCP Registry decision

### Confirmed Native Engine Gaps (from read-only inspection)
1. FlowGraphBuilder leaves cfg = undefined (flow-graph.ts:108)
2. DeterministicSecurityEngine does not pass call graph to FlowGraphBuilder
3. Alias/heap graphs not incorporated into taint proof
4. CFGs are function-specific, not interprocedural
5. Data-flow scope handling not sound enough for proof claims
6. Old documentation overstated production readiness

### CLAIM HOLD
HAIEC must NOT claim mathematically proven dataflow, full CFG-backed taint,
alias-backed deterministic proof, heap-backed deterministic proof, or full
interprocedural deterministic taint until Phase 5 qualification provides evidence.

---

## Phase 4C-A — Release Candidate Qualification

- **Status:** PHASE_4C_A_LOCAL_READY_FOR_REMOTE_VALIDATION (after 4C-A2 reconciliation)
- **Scope:** Release freeze, version identity reconciliation, RC.6 rule quality,
  Public Core release identity, provenance review, Kestrel semantic determinism,
  parser failure classification, cross-platform CI preparation, offline proof,
  install/setup qualification, MCP protocol test, package/supply-chain audit,
  claim integrity audit, concern family contract freeze, receipt contract freeze,
  publication metadata preparation, downstream handoff, MCP→SaaS hold,
  master roadmap confirmation, remote-CI handoff, release-candidate manifest,
  evidence index.

### Phase 4C-A Changes Made

**Version identity fix:**
- `rules/public-core/manifest.json`: `api-key-in-error-js` and `api-key-in-error-python`
  detector `revision` fields updated from `rc.5` to `rc.6` (were stale after C2R fix)
- `src/engines/ai-security/rulepack-provider.ts`: expected manifest digest updated
  from `sha256:6d68142f...` to `sha256:2117f9b9...` to match revised manifest

**filesSkippedByEngine nondeterminism fix:**
- `src/engines/ai-security/scan-receipt.ts`: removed `filesSkippedByEngine` from
  `computeCoverageDigest` and `receiptDigest` computations
- Classified as ENGINE_OPERATIONAL_NONDETERMINISM
- Field remains in receipt `fileAccounting` for informational purposes
- 3-run Kestrel determinism test confirms all semantic fields now match

**README claim integrity:**
- `README.md`: updated from "No security scanning capability is functional yet"
  to accurate description of implemented scan_ai_security engine
- Added explicit "What it does NOT do" section
- Added Security Concern Family and PARTIAL scan explanations

**CI workflow preparation:**
- `.github/workflows/phase-4c-cross-platform.yml`: prepared (NOT pushed)
- Matrix: Windows/Linux/macOS × Node 20/22/24
- Includes tarball install, offline scan, and Semgrep resolver lifecycle tests

**Evidence and documentation:**
- `docs/evidence/phase-4c/` — Release freeze manifest, version identity matrix,
  provenance packet, parser failure classification, offline validation, Kestrel
  determinism evidence
- `docs/architecture/HAIEC-DOWNSTREAM-OUTPUT-INTEGRITY-HANDOFF.md` — downstream
  semantic risk register

### Phase 4C-A Test Results
- Typecheck: PASS (clean)
- Tests: 239 pass, 0 fail
- npm audit: 0 vulnerabilities
- 3-run Kestrel determinism: All semantic fields match
- Tarball: 139 files, no private leakage

### Phase 4C-A Remaining (Phase 4C-B blockers)
- Remote CI execution (workflow prepared, not pushed)
- Human/founder/legal provenance approval
- Founder publication authorization
- Remove private:true for publication
- npm publication decision
- MCP Registry decision

### MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD
The MCP may release independently. But MCP Scan Receipts / Findings / Concern
Families must NOT be wired directly into existing HAIEC SaaS (reports, trust
artifacts, badges, audit packages, Decision Pipeline, compliance output) until
Platform U0-U6 reconcile downstream semantic contracts. This is NOT a product
dependency — MCP remains standalone. The hold protects against feeding correct
new evidence into legacy consumers that reinterpret it incorrectly.

### Master Roadmap (confirmed)
```
MCP Phase 4C-A → local release-candidate qualification
↓
MCP Phase 4C-B → remote CI + founder/human release authorization
↓
Public MCP v0.1 release
↓
Platform U0 → Architecture Truth + Output Integrity Audit
↓
Platform U1 → Canonical identities/contracts
↓
Platform U2 → Evidence Core
↓
Platform U3 → Static evidence unification
↓
Platform U4 → Report migration
↓
Platform U5 → Artifact unification
↓
Platform U6 → Badge / verification lifecycle unification
↓
Platform U7 → Compliance Twin continuous assurance integration
↓
Platform U8 → Legacy retirement
↓
Phase 5 → Native deterministic analysis
↓
Phase 6 → Tree-sitter / ast-grep frontend
```

**Principle:** ONE HAIEC PRODUCT SEMANTICALLY. INDEPENDENT EVIDENCE PRODUCERS
OPERATIONALLY.

---

## Phase 5 — HAIEC Native Analysis Engine Consolidation

- **Status:** pending
- **Scope:** TBD

---

## Phase 6 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 7 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 8 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 9 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 10 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 11 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 12 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 13 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 14 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 15 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 16 — (placeholder)

- **Status:** pending
- **Scope:** TBD

---

## Phase 17 — (placeholder, if needed)

- **Status:** pending
- **Scope:** TBD

---

## Phase 18 — (placeholder, if needed)

- **Status:** pending
- **Scope:** TBD

---

## Cross-Phase Notes

- **Context preservation rule:** Before ending any phase, update its section
  above with: status, key decisions, deferred items, and the next phase's
  entry prerequisites. This is non-negotiable for a 16-18 phase project.
- **Findings register:** All forensic findings and opportunistic-fix proposals
  live in `FINDINGS.md` (created during Phase -1 audit). Do not scatter
  findings across phase sections.
- **Rule amendments:** If a phase needs to change a rule in `AGENTS.md`, record
  the change in `AGENTS.md` §10 (Key Decisions Log) AND note it here under the
  relevant phase's "Key Decisions".
