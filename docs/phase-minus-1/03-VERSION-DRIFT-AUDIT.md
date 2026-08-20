# 03 — Version Drift Audit

> **Phase -1 forensic document (corrected in Phase -0.5).** All version
> declarations found across the HAIEC ecosystem. Conflicts flagged. Canonical
> source recommendation provided but NOT implemented.
>
> **Phase -0.5 correction:** The rule count section was corrected. "121 rules"
> is correct for the Modal embedded `AI_SECURITY_RULES` count, but the formula
> "91 core + 30 SOC2" is FALSE — the 121 are all `ai-*` rules. See
> `docs/phase-minus-0-5/02-RULE-EXECUTION-INVENTORY.md`.

---

## Version Declarations Found

### SCANNER_VERSION

| Source | Value | Status | Active? | Evidence |
|--------|-------|--------|---------|----------|
| `modal_ai_security_scanner.py:38` | `3.28.0` | VERIFIED_EXECUTABLE | **ACTIVE** (deployed via CI) | `SCANNER_VERSION = os.environ.get("APP_VERSION", "3.28.0")` |
| `lib/ai-security/config.ts:21` | `3.27.0` | VERIFIED_CONFIG | Likely stale (app-side config) | `SCANNER_VERSION = '3.27.0'` |
| `.github/workflows/modal-scanner-deploy.yml:35` | `3.28.0` | VERIFIED_CONFIG | ACTIVE (CI sets APP_VERSION) | `APP_VERSION: "3.28.0"` |

**Conflict:** Modal scanner = 3.28.0, app config = 3.27.0. The CI workflow deploys
with `APP_VERSION: "3.28.0"`, so the Modal scanner's `3.28.0` is authoritative.
The `config.ts` value is stale.

**Recommendation:** `modal_ai_security_scanner.py` / CI workflow is canonical.
The new architecture should have a SINGLE source for scanner version, imported
everywhere. Do not duplicate version constants.

---

### RULEPACK_VERSION

| Source | Value | Format | Status | Evidence |
|--------|-------|--------|--------|----------|
| `modal_ai_security_scanner.py:41` | `121-rules-v4-soc2` | Descriptive string | VERIFIED_EXECUTABLE | `RULEPACK_VERSION = "121-rules-v4-soc2"` |
| `lib/ai-security/ci/evidence-bundle/generator.ts:40` | `2.0.0` | Semver | VERIFIED_EXECUTABLE | `RULEPACK_VERSION = '2.0.0'` |
| `lib/artifacts/artifact-generator.ts:57` | `2026.01.1` | Calver | VERIFIED_EXECUTABLE | (line 57) |
| `lib/trust-artifacts/service.ts:34` | `2026.01.1` | Calver | VERIFIED_EXECUTABLE | (line 34) |

**Conflict:** THREE different formats and values for the same concept.
- `121-rules-v4-soc2` is descriptive but embeds a false rule count (121)
- `2.0.0` is semver but doesn't correspond to the descriptive version
- `2026.01.1` is calver but yet another value

**Recommendation:** The new architecture should use a SINGLE rulepack version
(semver, e.g., `1.0.0`) plus a SEPARATE rulepack content hash (SHA-256 of the
canonical rulepack file). The version tracks breaking changes; the hash tracks
exact content. Do not embed rule counts in version strings.

---

### ENGINE_VERSION

| Source | Value | Status | Evidence |
|--------|-------|--------|----------|
| `lib/ai-security/ci/evidence-bundle/generator.ts:39` | `3.8.0` | VERIFIED_EXECUTABLE | `ENGINE_VERSION = '3.8.0'` |

**Note:** This is a THIRD version concept (distinct from SCANNER_VERSION and
RULEPACK_VERSION). It's unclear what "engine version" means vs "scanner version."
This conflation is a design problem.

**Recommendation:** In the new architecture, define a clear ontology:
- `scannerVersion` — the HAIEC scanner orchestration code version
- `rulepackVersion` — the rulepack version (semver)
- `rulepackHash` — SHA-256 of canonical rulepack content
- `semgrepVersion` — the Semgrep engine version
- `engineVersion` — DEPRECATED or merged into scannerVersion

---

### SEMGREP_VERSION

| Source | Value | Status | Evidence |
|--------|-------|--------|----------|
| `modal_ai_security_scanner.py:64` | `1.52.0` | VERIFIED_EXECUTABLE (pip install) | `semgrep==1.52.0` in Modal image |
| `modal_ai_security_scanner.py:4951` | `1.52.0` | VERIFIED_EXECUTABLE | `semgrep_version = "1.52.0"` |
| `public-repo-scanner/scanner/analyzer.py:79` | `semgrep-1.52.0` | VERIFIED_EXECUTABLE | `"engine_version": "semgrep-1.52.0"` |

**Status:** Consistent across sources. No conflict.

---

### RULE COUNTS

| Source | Value | Status | Evidence |
|--------|-------|--------|----------|
| `semgrep_rules.yaml` (actual parse) | **91** | VERIFIED (programmatic count) | 91 `id:` entries |
| `modal_ai_security_scanner.py:83` (comment) | 121 (91 core + 30 SOC2) | **PARTIALLY_TRUE** | 121 `ai-*` rules exist in `AI_SECURITY_RULES` (Python embedded), but they are ALL AI rules, NOT 91+30 SOC2. 0 SOC2 rules execute. |
| `lib/ai-security/config.ts:38` | `CORE_AI_RULES_COUNT = 91` | VERIFIED_CONFIG | Matches YAML file count |
| `lib/ai-security/config.ts:55` | `SOC2_STATIC_RULES_COUNT = 30` | **FALSE** | 0 SOC2 rules execute; 30 is phantom mapping count |
| `lib/ai-security/config.ts:62` | `TOTAL_STATIC_RULES = 121` | **MISLEADING** | Coincidentally matches Modal embedded count, but formula "91+30" is wrong |
| `README.md:150` | "70 rules → 33 IDs" | **STALE** | Does not match any current count |

**Conflict:** Three different rule counts (91 in YAML, 121 in Modal embedded, 70 in README).
The 121 Modal embedded rules are ALL `ai-*` (91 single-language + 30 language-specific splits).
The "30 SOC2 rules" are non-functional — 0 execute.

**Recommendation:** Use the rule-count taxonomy from `docs/phase-minus-0-5/03-RULE-COUNT-TAXONOMY.md`.
Do NOT use a single ambiguous "rule count." Specify `detectorDefinitions` vs `logicalChecks`
vs `rulesEvaluated`.

---

### DISPLAY RULE COUNTS

| Source | Value | Status | Evidence |
|--------|-------|--------|----------|
| `semgrep_rules.yaml` `metadata.rule_id` (actual parse) | **72 unique display IDs** | VERIFIED | 90 rule_id metadata entries, 72 unique |
| `README.md:150` | "33 unique compliance rule IDs" | **STALE** | Does not match 72 |

**Conflict:** README claims 33 display IDs; actual is 72.

---

### OTHER VERSION CONSTANTS

| Source | Concept | Value | Evidence |
|--------|---------|-------|----------|
| `lib/ai-security/config.ts:291` | SARIF_VERSION | `2.1.0` | VERIFIED_CONFIG |
| `lib/ai-security/outputs/sarif.ts:113` | SARIF_VERSION | `2.1.0` | VERIFIED_EXECUTABLE (consistent) |
| `lib/scoring/deterministic-engine.ts:14` | CURRENT_RULE_VERSION | `2025.1.0` | VERIFIED_EXECUTABLE |
| `lib/ai-security/ci/evidence-bundle/schema.ts:17` | EVIDENCE_BUNDLE_VERSION | `1.0.0` | VERIFIED_CONFIG |
| `lib/ai-security/ci/evidence-bundle/generator.ts:41` | PYTHON_SIDECAR_VERSION | `1.0.0` | VERIFIED_EXECUTABLE |
| `lib/ai-security/ci/evidence-bundle/generator.ts:42` | GO_SIDECAR_VERSION | `1.0.0` | VERIFIED_EXECUTABLE |
| `lib/ai-security/ci/evidence-bundle/generator.ts:43` | JS_SIDECAR_VERSION | `1.0.0` | VERIFIED_EXECUTABLE |
| `lib/compliance-wizard/nist-csf-requirements.ts` | NIST_CSF_RULE_VERSION | (not read) | VERIFIED (file exists) |
| `lib/compliance-wizard/soc2-requirements.ts` | SOC2_RULE_VERSION | (not read) | VERIFIED (file exists) |
| `lib/compliance-wizard/iso42001-requirements.ts` | ISO42001_RULE_VERSION | (not read) | VERIFIED (file exists) |
| `lib/compliance-wizard/iso27001-requirements.ts` | ISO27001_RULE_VERSION | (not read) | VERIFIED (file exists) |
| `lib/compliance-wizard/hipaa-requirements.ts` | HIPAA_RULE_VERSION | (not read) | VERIFIED (file exists) |
| `lib/compliance-wizard/gdpr-requirements.ts` | GDPR_RULE_VERSION | (not read) | VERIFIED (file exists) |

---

## Summary of Conflicts

| Concept | Conflicts | Severity |
|---------|-----------|----------|
| SCANNER_VERSION | 3.28.0 vs 3.27.0 | HIGH — stale config misrepresents deployed version |
| RULEPACK_VERSION | 3 formats/values | HIGH — breaks reproducibility |
| Rule count | 91 vs 121 vs 70 | HIGH — false public claims |
| Display rule count | 72 vs 33 | MEDIUM — stale README |
| ENGINE_VERSION vs SCANNER_VERSION | Conflation | MEDIUM — unclear ontology |

---

## Canonical Source Recommendation (for new architecture — NOT implemented)

| Concept | Canonical source | Rationale |
|---------|-----------------|----------|
| scannerVersion | Single constant in new repo's `src/version.ts` | One source, imported everywhere |
| rulepackVersion | Single constant + git tag | Semver, tracked via git tags |
| rulepackHash | SHA-256 of canonical rulepack file at build time | Content-addressed, reproducible |
| semgrepVersion | Pinned in package.json/requirements, reported at runtime | Already consistent |
| ruleCount | Computed at build time from rulepack, NOT hardcoded | Avoids drift |
| displayRuleCount | Computed at build time from metadata, NOT hardcoded | Avoids drift |
