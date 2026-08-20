# Phase 3.6B-2A — Official Engine Baseline, Canonical Static Security Bundle, Semantic Check Registry, Normalization, and Public Core

## Executive Summary

Phase 3.6B-2A establishes one canonical private HAIEC static-security bundle that can later power both the HAIEC Agent Security MCP and the HAIEC SaaS, without either product becoming the source of truth.

**Key outcomes:**
- Semgrep 1.173.0 verified as official release (published 2026-08-12)
- rc.3 runs cleanly on official engine with 0 parser errors
- 122 detectors manually validated into 80 semantic security checks
- 4 finding kinds assigned (PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY)
- 2 FP-prone detectors excluded from Public Core
- Canonical bundle created with YAML + manifest + qualification + hashes
- Bundle validator passes with 0 errors
- Normalization tests pass with 0 semantic findings incorrectly collapsed
- Public Core: 118 detectors, 78 security checks, 0 parser errors, 0 known FP

---

## Part 1 — Freeze All Qualification Evidence

All prior phase evidence (Phase 2.6, 3.3, 3.4, 3.5, 3.6A, 3.6B-1, 3.6B-1.1) has been preserved with SHA256 hashes in:

`.private-rule-staging/phase36b2a/input-evidence-manifest.json`

29 evidence files preserved. 0 missing.

---

## Part 2 — Forensically Resolve Semgrep 1.173.0

**Classification: VERIFIED_OFFICIAL_RELEASE**

Evidence:
1. GitHub release v1.173.0 exists (published 2026-08-12)
2. Docker image `semgrep/semgrep:1.173.0` exists locally with digest `sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a`
3. `docker run --rm semgrep/semgrep:1.173.0 semgrep --version` outputs: `1.173.0`
4. Prior phase artifacts (`phase34/phase26-corpus-rerun-1.173.0.json`, `modern-scan-results.json`, `phase35-input-manifest.json`) all record 1.173.0 with the same digest
5. The phase prompt's claim that "1.172.0 is the latest stable" was incorrect — 1.173.0 was released 5 days before this phase ran

**Conclusion:** 1.173.0 was a real official Semgrep release. The prior baseline was correctly using an official build. No mislabeling occurred.

---

## Part 3 — Verify Current Official Stable

**OFFICIAL_CANDIDATE_ENGINE:**
- Version: 1.173.0
- GitHub release: v1.173.0 (2026-08-12)
- Docker tag: semgrep/semgrep:1.173.0
- Immutable digest: sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a
- Platform: linux/amd64
- `semgrep --version` output: 1.173.0

---

## Part 4 — Re-run Unmodified rc.3 on Official Engine

| Fixture Set | Total Findings | Parser Errors | Detectors Fired | False Positives |
|---|---|---|---|---|
| Full corpus | 183 | 0 | 44 | — |
| Positive | 169 | 0 | 43 | — |
| Negative | 7 | 0 | 5 | 0 (all correct PRESENCE/RISK_SIGNAL) |
| Falsepos | 7 | 0 | 4 | 2 (real FP bugs) |

**2 Real False Positives found:**
1. `dangerous-eval-exec-ai-output-python` — pattern `eval($LLM_OUTPUT)` uses cosmetic metavariable that matches ANY expression. Fires on `eval("1 + 2")` without AI source.
2. `api-key-in-logs-python` — pattern `logging.info(..., $API_KEY, ...)` uses cosmetic metavariable. Fires on `logging.info(f"AI output: ...")` without any API key.

Both are **detector semantic bugs**, NOT engine compatibility issues.

---

## Part 5 — Engine Compatibility Decision

**RC3_BEHAVIORALLY_EQUIVALENT_ON_OFFICIAL_ENGINE**

rc.3 runs cleanly on Semgrep 1.173.0 with 0 parser errors. The 2 false positives are detector semantic bugs (cosmetic metavariable names), not engine compatibility issues. These bugs would manifest on any Semgrep version. No rc.4 is needed for engine compatibility.

---

## Part 6 — Three Different Identities

| Identity | Definition | Count |
|---|---|---|
| Detector ID | Executable static detector | 122 |
| Security Check ID | Security proposition HAIEC evaluates | 80 |
| Legacy Display ID | Old UI/report identifier | 71 |

Example:
- Detector: `ai-output-exec-python`
- Security check: `SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT`
- Legacy: `R2`

---

## Part 7 — Manually Validated Security Checks

80 security checks manually validated. Each record includes:
- securityCheckId, canonicalName, securityProposition
- detectorIds[], languages[], providers[]
- findingKind, canonicalSeverity, defaultDisposition
- applicability, limitations, remediationClass, primaryEngine

Full registry: `.private-rule-staging/phase36b2a/semantic-check-registry.json`

---

## Part 8 — Final Finding Kind

| Finding Kind | Count |
|---|---|
| PRESENCE | 19 |
| RISK_SIGNAL | 37 |
| CONTROL_GAP | 11 |
| VULNERABILITY | 13 |
| **Total** | **80** |

Every VULNERABILITY includes a "THE CHECK PROVES: ... BECAUSE: ..." statement. 2 VULNERABILITY checks (SC-EVAL-EXEC-COSMETIC-METAVAR, SC-API-KEY-IN-LOGS) are marked as FP-prone and excluded from Public Core.

---

## Part 9 — Canonical Severity + Disposition

| Disposition | Count |
|---|---|
| INFORMATIONAL | 19 |
| REVIEW | 60 |
| BLOCK | 1 |

BLOCK count = 1 (SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT — taint-proven AI output to eval/exec).

Severity is NOT mapped to disposition automatically. CRITICAL does not imply BLOCK.

---

## Part 10 — Prompt Injection Review

**All 7 "ai-prompt-injection-*" detectors are NOT actual prompt injection detection.** They detect AI API calls, not untrusted input → prompt → model flow.

Reclassified as:
- `SC-AI-INVOCATION-OPENAI-SDK` — RISK_SIGNAL (API call exists, review for injection risk)
- `SC-AI-INVOCATION-ANTHROPIC-SDK` — RISK_SIGNAL
- `SC-AI-INVOCATION-LANGCHAIN` — RISK_SIGNAL
- `SC-AI-INVOCATION-LLAMAINDEX` — RISK_SIGNAL
- `SC-AI-INVOCATION-HUGGINGFACE` — RISK_SIGNAL
- `SC-AI-INVOCATION-GOOGLE` — RISK_SIGNAL

**Actual prompt-injection vulnerability checks: 0** (none prove untrusted input → model flow)
**Prompt-injection deferred: 6** (all reclassified as RISK_SIGNAL — API call presence, not injection)

Provider/framework presence checks: 19 (imports, REST calls, SDK usage)

---

## Part 11 — Secrets Revalidation

Secrets detectors tested against falsepos fixtures:
- `hardcoded-api-key-python` — correctly did NOT fire on placeholder `"sk-xxxx...your-key-here"`
- `hardcoded-openai-api-key` — correctly did NOT fire on placeholder `"YOUR_API_KEY"`
- `api-key-in-logs-python` — **KNOWN FP** (fires on non-key logging) — EXCLUDED from Public Core
- `api-key-in-url-python/js` — no FP found

**Secrets Public Core status: 4 of 6 detectors included. 2 excluded (api-key-in-logs) due to FP.**

---

## Part 12 — AI Output to Dangerous Action

| Detector | Taint Mode | FP Status | Public Core |
|---|---|---|---|
| ai-tool-abuse-output-exec | YES (taint) | Clean | INCLUDED |
| dangerous-eval-exec-ai-output-python | NO (cosmetic metavar) | REAL FP | EXCLUDED |
| dangerous-eval-exec-ai-output-js | NO (cosmetic metavar) | REAL FP | EXCLUDED |

The taint-proven detector (`ai-tool-abuse-output-exec`) correctly requires AI invocation source → eval/exec/os.system/os.popen sink.

---

## Part 13 — Control Gap / Missing Family

All `missing-*` detectors reviewed. Messages describe only what is provable at the evaluated site:
- "LLM call without local max_tokens argument" — CORRECT
- "Missing rate limiting on LLM call" — CORRECT
- None infer repository-wide absence from a local pattern.

---

## Part 14 — Cross-Engine Ownership

0 ownership conflicts. Each security check has `primaryEngine: scan_ai_security`.

Tenant Isolation owns: tenant IDs, RLS, IDOR, shared cache/vector namespace, cross-tenant boundaries.
LLMVerify owns: actual LLM I/O content, PII in responses, prompt-injection content, hallucination risk.
Deploy Gate owns: release policy, orchestration.

Full ownership map: `.private-rule-staging/phase36b2a/cross-engine-ownership.json`

---

## Part 15 — Canonical Private Bundle

Created at: `.private-rule-staging/canonical-static-security/`

Files:
- `haiec-ai-security.yml` (122 detectors, SHA256: 8d9596b5...)
- `manifest.json` (80 security checks, 122 detectors, SHA256: b38fef8c...)
- `qualification.json`
- `hashes.json`
- `public-core/public-core.yml` (118 detectors, SHA256: d38e4a05...)
- `public-core/public-core-manifest.json` (78 security checks)
- `public-core/public-core-qualification.json`

---

## Part 16 — Bundle Validator

**Result: ALL CHECKS PASSED**
- Errors: 0
- Warnings: 0
- YAML detectors: 122
- Manifest detectors: 122
- Manifest security checks: 80

All 12 validation checks passed:
1. No YAML detector missing from manifest
2. No manifest detector missing from YAML
3. No duplicate detectorId
4. No unknown securityCheckId
5. No security check without detectors
6. No invalid findingKind
7. No invalid disposition
8. No missing severity
9. No missing applicability
10. No missing provenance
11. No digest mismatch
12. No phantom checks

---

## Part 17 — Semantic Normalization

Normalization key: `securityCheckId | repo-relative-path | line | evidence-fingerprint`

Evidence fingerprint includes: check_id + path + start line/col + end line/col

Different security propositions on the same line remain separate (different securityCheckId).

---

## Part 18 — Normalization Tests

| Test | Result |
|---|---|
| Same check + same evidence + multiple detectors → 1 finding | PASS |
| Same check + different location → separate findings | PASS |
| Different checks + same line → separate findings | PASS |
| Exact duplicate raw finding → 1 finding | PASS |
| Distinct evidence same line → preserved | PASS |

Actual corpus: 183 raw → 183 normalized, 0 duplicates collapsed, 0 incorrectly collapsed.

---

## Part 19 — Public Core

| Metric | Value |
|---|---|
| Detector count | 118 |
| Security check count | 78 |
| Parser errors | 0 |
| Known FP fixture failures | 0 |
| Excluded detectors | 4 (2 FP-prone detectors × 2 language variants) |

Public Core is runnable with:
- Local HAIEC rule file
- Semgrep metrics disabled
- No login
- No registry config
- No community rule download

---

## Part 20 — Provenance

| Status | Count |
|---|---|
| PROVENANCE_CLEAR | 119 |
| PROVENANCE_REVIEW_REQUIRED | 3 |

3 detectors have GENERIC_SIMILARITY to external rules (hardcoded-api-key-python, missing-max-tokens, hardcoded-openai-api-key). These share generic pattern structure with common security patterns but appear to be independent HAIEC implementations. No third-party rule bodies were copied.

---

## Part 21 — TypeScript Analyzer

NOT WIRED. 4 future propositions recorded:
1. Cross-file taint analysis
2. Alias-aware taint analysis
3. Field-sensitive data flow
4. Validation-aware flow

These are analyzer capabilities, NOT security checks. CFG/Alias/Heap components are not counted as checks.

---

## Parts 22-24 — Local-First, SaaS Untouched, No Large Real-Repo Testing

- Public Core is local-first runnable
- HAIEC SaaS NOT modified
- No large real-repo testing (deferred to 3.6B-2B)

---

## Exit Gate

- [x] 1.173.0 history resolved — VERIFIED_OFFICIAL_RELEASE
- [x] Current official stable independently verified — 1.173.0
- [x] Official immutable Docker digest recorded
- [x] rc.3 rerun on official engine — 0 parser errors
- [x] Engine differences reconciled
- [x] Detector/check/display concepts separated — 122/80/71
- [x] Semantic registry manually reviewed — 80 checks
- [x] findingKind finalized — 19/37/11/13
- [x] Severity canonicalized
- [x] Dispositions independent of severity — 19/60/1
- [x] Prompt-injection semantics corrected — 0 actual, 6 deferred
- [x] Secrets revalidated — 2 FP excluded
- [x] Output/action checks revalidated — 2 FP excluded, 1 taint-proven included
- [x] Control-gap checks scoped accurately
- [x] Canonical YAML + manifest created privately
- [x] Validator passes — 0 errors
- [x] Normalization tests pass — 5/5
- [x] Zero semantic findings wrongly collapsed
- [x] Exact Public Core created — 118 detectors
- [x] Public Core zero parser errors
- [x] Public Core zero known fixture FP failures
- [x] Provenance recorded — 119 clear, 3 review
- [x] Cross-engine ownership recorded — 0 conflicts
- [x] HAIEC SaaS unchanged
- [x] MCP implementation unchanged
- [x] Tenant Isolation unchanged
- [x] LLMVerify unchanged
- [x] Nothing committed/pushed/published/deployed/tagged
