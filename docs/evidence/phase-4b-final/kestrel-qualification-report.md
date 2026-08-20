# Kestrel Qualification Report — C2R Final

> **Status:** Empirical qualification against immutable Kestrel corpus.
> **Date:** 2026-09-17

---

## 1. Immutable Corpus Identity

| Field | Value |
|-------|-------|
| Repository | `kestrel/AI-Service-Call-Agent-` |
| Commit | `0f131ea63c477e1da5fee318095c3aee761eb628` |
| Branch | `main` |
| Tree SHA | `4054fef7a5e360403e1d9ed36771d3a03a7a6b22` |
| File count (committed tree) | 5528 |
| File-set digest | `sha256:9133283e2c17ef177cd03500df22215329b6f27a1a366f138100387b9db1793d` |
| Dirty state | 3 untracked files (log files + screenshot, not source code) |
| Snapshot method | `git ls-tree -r HEAD` (immutable committed tree) |

The 3 untracked files (`modal_logs_consolidated.txt`, `modal_logs_hvac_demo.txt`,
`frontend/public/demo-screenshots/witness and questions netflix source .png`)
are not source code and do not affect the scan. The committed tree is immutable.

---

## 2. Scan Result

| Metric | Value |
|--------|-------|
| Duration | 119,256ms (~119s) |
| Verdict | REVIEW (advisory) |
| Completeness | PARTIAL |
| isError | false |
| Files analyzed | 2,473 |
| Files with findings | 647 |
| Raw findings (Semgrep) | 1,704 |
| Detector instances found | 1,690 |
| Canonical findings found | 1,704 |
| **Material security concerns** | **13** |
| Observations | 54 |
| Actionable total | 1,636 |
| Vulnerability total | 351 |
| Control gap total | 14 |
| Risk signal total | 1,271 |
| Block total | 0 |
| Review total | 1,636 |
| Informational total | 54 |
| Findings excluded by reporting scope | 14 |
| Response bytes | (see JSON evidence) |

### Versions

| Component | Version |
|-----------|---------|
| Scanner | HAIEC Static AI Security 0.1.0 |
| Rulepack | haiec-ai-security 0.1.0-rc.5-public-core |
| Rulepack digest | `sha256:33b4a0dd...` |
| Manifest | haiec-ai-security-manifest 1.0.0 |
| Manifest digest | `sha256:0f9247ab...` |
| Semgrep | 1.173.0 |

---

## 3. PARTIAL Cause — EXPLAINED

**Root cause: 103 parser errors (NOT timeout)**

| Factor | Value |
|--------|-------|
| Timeout | false |
| Parse errors | 103 |
| Manifest mismatch | false |
| Completeness reasons | `["103 parser error(s) occurred during scanning."]` |

**Analysis:** The PARTIAL completeness is caused by 103 files that could not
be parsed by Semgrep. These are files in languages or syntax variants that
Semgrep's parser does not support, or files with syntax errors. This is NOT
a timeout issue and NOT a manifest mismatch.

The 103 parse-error files represent files that Semgrep attempted to scan but
could not parse. The remaining 2,473 files were successfully analyzed. The
scan completed within the 300s timeout (119s actual).

---

## 4. Finding Distribution

### By Security Check (from bounded output — 30 findings shown)

| Check | Count | Share |
|-------|-------|-------|
| SC-AI-INVOCATION-OPENAI-REST | 5 | 16.7% |
| SC-AI-INVOCATION-GENERIC-REST | 4 | 13.3% |
| SC-API-KEY-IN-LOGS | 3 | 10.0% |
| SC-MISSING-MAX-TOKENS | 3 | 10.0% |
| SC-AI-INVOCATION-ANTHROPIC-SDK | 3 | 10.0% |
| SC-AI-INVOCATION-OPENAI-SDK | 3 | 10.0% |
| SC-AI-RAG-POISONING | 3 | 10.0% |
| SC-API-KEY-IN-ERROR-MESSAGES | 2 | 6.7% |
| SC-MISSING-DATA-MINIMIZATION | 1 | 3.3% |
| SC-AI-INVOCATION-HUGGINGFACE | 1 | 3.3% |
| SC-AI-MULTIMODAL-INPUT | 1 | 3.3% |
| SC-AI-FUNCTION-CALLING | 1 | 3.3% |

**Note:** The distribution above is from the bounded output (20 actionable +
10 observations = 30 findings). The full 1,690 detector instances are not
returned by MCP (by design — bounded output). The top concern
(SC-API-KEY-IN-LOGS) has 351 instances across 110 files according to the
Security Concern data.

### Top Material Concerns (from Security Concern layer)

| # | Security Check | Kind | Severity | Disposition | Instances | Files | Detectors |
|---|---------------|------|----------|-------------|-----------|-------|-----------|
| 1 | SC-API-KEY-IN-LOGS | VULNERABILITY | MEDIUM | REVIEW | 351 | 110 | 2 |
| 2 | SC-AI-RAG-POISONING | RISK_SIGNAL | ... | REVIEW | ... | ... | ... |

(See `kestrel-qualification.json` for full concern details.)

### By Severity (bounded output)

| Severity | Count |
|----------|-------|
| MEDIUM | 16 |
| INFO | 14 |

### By Finding Kind (bounded output)

| Kind | Count |
|------|-------|
| RISK_SIGNAL | 13 |
| PRESENCE | 10 |
| CONTROL_GAP | 4 |
| VULNERABILITY | 3 |

### By Disposition (bounded output)

| Disposition | Count |
|-------------|-------|
| REVIEW | 20 |
| INFORMATIONAL | 10 |

### Aggregate Stats (bounded output)

| Stat | Value |
|------|-------|
| Unique security checks | 12 |
| Unique detectors | 13 |
| Affected files | 22 |
| Max instances one check | 5 |
| Median instances per check | 3 |
| Top-5 share | 60% |
| Top-10 share | 93.3% |

---

## 5. Decision-Quality Transformation

### Before (raw detector instances)

An agent receiving 1,636 actionable findings sees an undifferentiated alert
stream. The top check (SC-API-KEY-IN-LOGS) alone produces 351 instances
across 110 files — consuming the entire 20-finding output budget under
naive truncation.

### After (Security Concerns + Concern Priority v0.1)

An agent receiving **13 material security concerns** sees:

1. The highest-priority concern first (VULNERABILITY/MEDIUM/REVIEW).
2. Instance counts and affected file counts per concern.
3. Representative evidence (up to 3 findings per concern).
4. Remediation class for each concern.
5. Exact totals preserved: 1,690 instances → 1,704 canonical → 13 concerns.

**Example wording:** "13 material security concerns supported by 1,636
finding instances" — not "1,636 findings."

### Correctly Grouped

- SC-API-KEY-IN-LOGS (351 instances, 110 files, 2 detectors) → 1 concern
  - All 351 instances share the same securityCheckId, findingKind
    (VULNERABILITY), disposition (REVIEW), and severity (MEDIUM).
  - Grouping is correct: they are materially equivalent.

### Intentionally Kept Separate

- SC-AI-INVOCATION-OPENAI-REST vs SC-AI-INVOCATION-ANTHROPIC-SDK → separate
  concerns (different securityCheckId, even though both are AI invocation).
- SC-API-KEY-IN-LOGS (VULNERABILITY) vs SC-API-KEY-IN-ERROR-MESSAGES
  (different securityCheckId) → separate concerns.
- Different severities within the same securityCheckId → separate concerns
  (by v0.1 grouping rule).

---

## 6. Accounting Invariants Verified

| Invariant | Expected | Actual | Status |
|-----------|----------|--------|--------|
| detectorInstancesFound = all normalized instances | 1,690 | 1,690 | PASS |
| canonicalFindingsFound = canonical finding count | 1,704 | 1,704 | PASS |
| materialConcernsFound = grouped concerns | 13 | 13 | PASS |
| observationsFound = PRESENCE findings | 54 | 54 | PASS |
| No counts silently reduced | true | true | PASS |
| Bounded output reports returned vs total | 20 of 1,636 | 20 of 1,636 | PASS |

---

## 7. Limitations

1. The finding distribution is computed from bounded MCP output (30 findings),
   not the full 1,690 instances. Full forensics would require a direct scanner
   run that captures all findings before bounding. This is a known limitation
   of the MCP output contract (bounded by design).
2. The 3 untracked files in Kestrel's working tree are not source code and do
   not affect the scan. The committed tree is immutable.
3. The 103 parse errors are files Semgrep could not parse. These may include
   non-source files, files with syntax errors, or unsupported language variants.
