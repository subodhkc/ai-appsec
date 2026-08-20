# 04 — SOC2 Rule Execution Trace

> **Phase -0.5 forensic document.** Deep trace of the SOC2 static rule
> implementation. Determines whether SOC2 rules actually execute in production.

---

## The SOC2 Rule Discrepancy

Five different counts exist for SOC2 rules:

| Source | Count | Evidence |
|--------|-------|---------|
| `soc2-static-rules.ts:2` (comment) | 27 | `* SOC2 Static Rules - 27 New Rules for SOC2 Compliance Evidence` |
| `soc2-static-rules.ts:478` (comment) | 27 | `* All SOC2 Static Rules Combined (27 rules)` |
| `soc2-static-rules.ts` (actual RuleMeta objects) | **21** | Programmatic count: 5+5+3+2+2+2+2 |
| `config.ts:55` (`SOC2_STATIC_RULES_COUNT`) | 30 | `export const SOC2_STATIC_RULES_COUNT = 30;` |
| `docs/RULE-COUNT-REFERENCE.md:45` | 27 | `B. SOC2 Compliance Rules (27 rules)` |
| Modal mapping (lines 322-368) | 30 | 30 `"soc2-*": "R-*"` mapping entries |

---

## Actual TypeScript RuleMeta Object Count: 21

### Breakdown by category array

| Array | Declared | Actual | Rule IDs |
|-------|----------|--------|----------|
| `PROCESSING_INTEGRITY_RULES` | 5 | **5** | R-PI01 to R-PI05 |
| `PRIVACY_GDPR_RULES` | 5 | **5** | R-PR01 to R-PR05 |
| `CHANGE_MANAGEMENT_RULES` | 3 (comment says 4) | **3** | R-CM01 to R-CM03 (no R-CM04) |
| `AVAILABILITY_RULES` | 2 (comment says 3) | **2** | R-AV01 to R-AV02 (no R-AV03) |
| `VENDOR_RISK_RULES` | 2 (comment says 3) | **2** | R-VR01 to R-VR02 (no R-VR03) |
| `LOGGING_RULES` | 2 (comment says 4) | **2** | R-LG01 to R-LG02 (no R-LG03, R-LG04) |
| `ACCESS_CONTROL_RULES` | 2 (comment says 7) | **2** | R-HR01, R-AC01 (no R-AC02 to R-AC05) |
| **TOTAL** | **27** (comment) | **21** | |

### Missing rules (in Modal mapping but NOT in TypeScript)

| Display ID | In Modal mapping? | In TypeScript? | Status |
|------------|-------------------|----------------|--------|
| R-CM04 (deployment approval gate) | YES | NO | Missing from TypeScript |
| R-AV03 (disaster recovery plan) | YES | NO | Missing from TypeScript |
| R-VR03 (vendor risk assessment process) | YES | NO | Missing from TypeScript |
| R-LG03 (security event logging) | YES | NO | Missing from TypeScript |
| R-LG04 (centralized logging configuration) | YES | NO | Missing from TypeScript |
| R-AC02 (role-based access control) | YES | NO | Missing from TypeScript |
| R-AC03 (multi-factor authentication) | YES | NO | Missing from TypeScript |
| R-AC04 (session timeout configuration) | YES | NO | Missing from TypeScript |
| R-AC05 (password complexity requirements) | YES | NO | Missing from TypeScript |

**9 rules exist in the Modal mapping but have NO TypeScript RuleMeta definition.**
30 (Modal) - 21 (TypeScript) = 9 missing. This confirms the counts are consistent
with each source's own data, but the sources disagree.

---

## Are the TypeScript Patterns Evaluated?

### Search methodology
1. grep for `SOC2_STATIC_RULES` across all TypeScript files → found in 2 files
2. grep for `SOC2_STATIC_RULES\.(patterns|forEach|map|filter|reduce|find)` → **0 matches**
3. Check `rules-registry.ts` usage → only spreads into `RULES` array for metadata lookup
4. Check `github-api-scanner.ts:699` → uses `API_SCAN_PATTERNS`, not `SOC2_STATIC_RULES`
5. Check `validation-analyzer.ts` → uses local pattern arrays, not SOC2 rules
6. Check `policy-enforcement-engine.ts` → uses file path patterns, not SOC2 rules

### Conclusion

**The `patterns` arrays in SOC2 RuleMeta objects are NEVER evaluated against source code.**

The `SOC2_STATIC_RULES` array is used ONLY for:
- Metadata lookup in `rules-registry.ts` (`getRuleById`, `getRulesByCategory`)
- UI display in `new-scan/page.tsx` (rule count display)
- Scan results page rendering in `app/dashboard/ai-security/scan/[scanId]/page.tsx`

No evaluator, scanner, or matcher ever iterates over `SOC2_STATIC_RULES` and tests
the `patterns` field against file contents.

---

## Are SOC2 Semgrep Rules Loaded by Modal?

### Search methodology
1. Check for `.semgrep/` directory → **DOES NOT EXIST**
2. Check for `soc2-*.yml` or `soc2-*.yaml` files → **NONE FOUND** (excluding `.venv`)
3. Check `AI_SECURITY_RULES` (embedded Python YAML) for `soc2-` IDs → **0 matches**
4. Check `PROFILE_SEMGREP_RULES` for SOC2 entries → **NONE** (all profiles say "pending" or have `aic-*` rules)
5. Check `semgrep_rules.yaml` for `soc2-` rule IDs → **0 matches** (148 "soc2" matches are all in `compliance_frameworks`/`soc2_controls` metadata)

### Conclusion

**Zero SOC2 Semgrep rule definitions exist anywhere in the repository.**

The Modal scanner's `HAIEC_RULE_TO_DISPLAY_ID` dictionary (lines 322-368) contains
30 mappings from `soc2-*` Semgrep IDs to `R-*` display IDs, but the Semgrep IDs
(e.g., `soc2-transaction-queue-persistence`) do not correspond to any actual
Semgrep rule definitions. They are phantom mappings.

---

## Does Modal Dynamically Construct SOC2 Rules?

### Search methodology
1. Search for `soc2` in `modal_ai_security_scanner.py` → 50 matches, all in:
   - Mapping dictionary (lines 322-368)
   - `compliance_frameworks` metadata in rule definitions (lines 1022-1426)
   - `soc2_controls` metadata in rule definitions
   - Search query matching (line 639: `"soc2"` in search terms)
2. No dynamic rule construction code found
3. No code that generates Semgrep YAML for SOC2 rules at runtime

### Conclusion

**Modal does NOT dynamically construct or append SOC2 rules.** The SOC2 mapping
entries are static dictionary entries that never fire because no corresponding
Semgrep rules exist.

---

## Final SOC2 Execution Status

| Question | Answer |
|----------|--------|
| Are SOC2_STATIC_RULES actually executed during the normal static scan? | **NO** |
| Show the execution path | **No execution path exists** |
| Does Modal dynamically construct SOC2 rules? | **NO** |
| Are SOC2 rules only mappings/metadata? | **YES — MAPPING_ONLY** |
| Are `.semgrep/soc2-*.yml` files actually present? | **NO — directory does not exist** |
| Are TypeScript SOC2 patterns evaluated? | **NO — patterns never accessed by any evaluator** |

**The SOC2 static rules are entirely non-functional. They exist as:**
- 21 TypeScript RuleMeta objects (metadata only, patterns never evaluated)
- 30 phantom Semgrep ID mappings in Modal (no corresponding Semgrep definitions)
- 0 actual executable detectors

The "30 SOC2 rules" claim in config.ts and the "27 SOC2 rules" claim in docs/comments
both refer to rules that DO NOT EXECUTE.
