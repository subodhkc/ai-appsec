# 02 — Rule Execution Inventory

> **Phase -0.5 forensic document.** Programmatic trace of the ACTUAL production
> execution path. Not comments, not constants, not docs — what actually runs.

---

## Methodology

1. Enumerate all rule definition files (YAML, embedded Python strings, TypeScript)
2. Trace the `setup_rules()` → `run_semgrep()` execution path in the Modal scanner
3. Check for SOC2 Semgrep YAML files on the filesystem
4. Check if TypeScript SOC2 rule patterns are ever evaluated
5. Compare embedded Python rules vs. `semgrep_rules.yaml` rules
6. Count what actually executes, not what is declared

---

## Rule Family Inventory

### Family 1: Core AI Security Semgrep Rules (embedded in Python)

| Field | Value |
|-------|-------|
| DECLARED COUNT | 121 (comment at `modal_ai_security_scanner.py:83`) |
| ACTUAL DEFINITION COUNT | **121** unique Semgrep rule IDs in `AI_SECURITY_RULES` string (lines 989-3358) |
| ACTUALLY EXECUTED? | **YES — VERIFIED_ACTIVE** |
| EXECUTION PATH | `setup_rules()` (line 3951) → writes `AI_SECURITY_RULES` to temp YAML → `run_semgrep()` (line 4182) → `semgrep --config <temp_yaml>` |
| SOURCE | `modal_ai_security_scanner.py:989-3358` (embedded YAML string) |
| STATUS | **VERIFIED_ACTIVE** |

**Key finding:** The 121 rules are ALL `ai-*` prefixed rules. None are `soc2-*`.
The 30 extra rules vs. `semgrep_rules.yaml` are language-specific splits
(e.g., `ai-agent-loop-js` + `ai-agent-loop-python` instead of one `ai-agent-loop`
with multiple languages).

### Family 2: Core AI Security Semgrep Rules (YAML file)

| Field | Value |
|-------|-------|
| DECLARED COUNT | 91 (per Phase -1 programmatic count) |
| ACTUAL DEFINITION COUNT | **91** unique Semgrep rule IDs |
| ACTUALLY EXECUTED IN MODAL? | **NO — VERIFIED_INACTIVE** in Modal production path |
| ACTUALLY EXECUTED IN PUBLIC SCANNER? | **YES — VERIFIED_ACTIVE** in `public-repo-scanner/scanner/analyzer.py` |
| EXECUTION PATH (public scanner) | `analyzer.py:54` → `--config=<rules_path>` or `--config=auto` |
| SOURCE | `semgrep_rules.yaml` (repo root) |
| STATUS | **VERIFIED_ACTIVE** (public scanner), **VERIFIED_INACTIVE** (Modal scanner) |

**Key finding:** The Modal scanner does NOT load `semgrep_rules.yaml`. It uses its
own embedded `AI_SECURITY_RULES` string (121 rules). The YAML file is used by the
public-repo-scanner Python CLI, not by Modal.

### Family 3: SOC2 Compliance Semgrep Rules

| Field | Value |
|-------|-------|
| DECLARED COUNT | 30 (config.ts:55, Modal mapping lines 322-368) |
| ACTUAL DEFINITION COUNT | **0** — no `soc2-*` Semgrep rule definitions found anywhere |
| ACTUALLY EXECUTED? | **NO — MAPPING_ONLY** |
| EXECUTION PATH | None — no Semgrep definitions exist to execute |
| SOURCE | N/A — phantom mappings only |
| STATUS | **MAPPING_ONLY** |

**Evidence:**
- No `.semgrep/` directory exists (filesystem enumeration)
- No `soc2-*.yml` or `soc2-*.yaml` files exist (filesystem enumeration)
- `semgrep_rules.yaml` has 0 rules with `soc2-` prefix ID
- `AI_SECURITY_RULES` (Python embedded) has 0 rules with `soc2-` prefix ID
- `PROFILE_SEMGREP_RULES` has 0 SOC2 rules (most profiles say "Semgrep rules pending")
- Modal scanner has 30 mapping entries (`soc2-transaction-queue-persistence` → `R-PI01`, etc.)
  but these map Semgrep IDs that DON'T EXIST to display IDs
- `docs/RULE-COUNT-REFERENCE.md:55` references `.semgrep/soc2-*.yml` files that DON'T EXIST
- `config.ts:44` references `.semgrep/soc2-*.yml` files that DON'T EXIST

### Family 4: SOC2 TypeScript Static Rules

| Field | Value |
|-------|-------|
| DECLARED COUNT | 27 (comment at `soc2-static-rules.ts:2,478`), 30 (config.ts:55) |
| ACTUAL DEFINITION COUNT | **21** RuleMeta objects (5+5+3+2+2+2+2 = 21) |
| ACTUALLY EXECUTED? | **NO — MAPPING_ONLY** (patterns never evaluated) |
| EXECUTION PATH | None — `SOC2_STATIC_RULES.patterns` is never accessed by any evaluator |
| SOURCE | `lib/ai-security/soc2-static-rules.ts` |
| STATUS | **MAPPING_ONLY** |

**Evidence:**
- `SOC2_STATIC_RULES` is imported only in `rules-registry.ts:8` and spread into `RULES` array (line 252)
- `rules-registry.ts` uses `RULES` for metadata lookup (`getRuleById`, `getRulesByCategory`, etc.)
- No code anywhere accesses `.patterns` on SOC2 rule objects
- grep for `SOC2_STATIC_RULES\.(patterns|forEach|map|filter|reduce|find)` returns 0 matches
- The `patterns` arrays (e.g., `['SQS.sendMessage', 'queue.publish', ...]`) are defined but never evaluated against code

**Discrepancy among counts:**
| Source | Count | Status |
|--------|-------|--------|
| `soc2-static-rules.ts` comment (line 2, 478) | 27 | FALSE — actual is 21 |
| `soc2-static-rules.ts` actual RuleMeta objects | 21 | VERIFIED |
| `config.ts:55` (`SOC2_STATIC_RULES_COUNT`) | 30 | FALSE — no matching definitions |
| `docs/RULE-COUNT-REFERENCE.md:45` | 27 | FALSE — actual is 21 |
| Modal mapping (lines 322-368) | 30 mapping entries | MAPPING_ONLY — no definitions |
| `config.ts:62` (`TOTAL_STATIC_RULES = 121`) | 121 | Coincidentally matches embedded rule count, but formula "91+30" is FALSE |

### Family 5: Profile-Specific Semgrep Rules

| Field | Value |
|-------|-------|
| DECLARED COUNT | Varies by profile |
| ACTUAL DEFINITION COUNT | Only `AI_ASSISTED_DEV` has actual Semgrep rules; all others say "pending" |
| ACTUALLY EXECUTED? | **YES** for AI_ASSISTED_DEV only; **NO** for others |
| EXECUTION PATH | `setup_rules()` (line 3973) → `PROFILE_SEMGREP_RULES.get(profile_id)` → appended to rules YAML |
| SOURCE | `modal_ai_security_scanner.py:3358-3490` |
| STATUS | AI_ASSISTED_DEV: **VERIFIED_ACTIVE**; VOICE/AGENTIC/EMBEDDED_SAAS/RAG: **DOCUMENTED_ONLY** ("Semgrep rules pending") |

### Family 6: Display ID Mappings

| Field | Value |
|-------|-------|
| DECLARED COUNT | N/A (mappings, not rules) |
| ACTUAL DEFINITION COUNT | 121+ entries in `HAIEC_RULE_TO_DISPLAY_ID` (Modal) |
| ACTUALLY EXECUTED? | N/A — used for display ID lookup only |
| EXECUTION PATH | `get_display_rule_id()` (line 381) → maps Semgrep ID to display ID |
| SOURCE | `modal_ai_security_scanner.py:88-371` |
| STATUS | **MAPPING_ONLY** (for display purposes; not executable rules) |

---

## Summary Table

| Rule Family | Declared Count | Actual Definition Count | Actually Executed? | Execution Path | Source | Status |
|-------------|----------------|------------------------|---------------------|----------------|--------|--------|
| Core AI (Python embedded) | 121 | 121 | YES | `setup_rules()` → `run_semgrep()` | `modal_ai_security_scanner.py:989-3358` | VERIFIED_ACTIVE |
| Core AI (YAML file) | 91 | 91 | YES (public scanner only) | `analyzer.py:54` → `--config` | `semgrep_rules.yaml` | VERIFIED_ACTIVE (public), VERIFIED_INACTIVE (Modal) |
| SOC2 Semgrep | 30 | 0 | NO | None | N/A | MAPPING_ONLY |
| SOC2 TypeScript | 27/30 | 21 | NO (patterns never evaluated) | None | `soc2-static-rules.ts` | MAPPING_ONLY |
| Profile: AI_ASSISTED_DEV | ~13 | ~13 | YES (if profile selected) | `setup_rules()` → `PROFILE_SEMGREP_RULES` | `modal_ai_security_scanner.py:3374+` | VERIFIED_ACTIVE |
| Profile: VOICE/AGENTIC/etc. | varies | 0 | NO | None | comments only | DOCUMENTED_ONLY |
| Display ID mappings | N/A | 121+ | N/A (lookup only) | `get_display_rule_id()` | `modal_ai_security_scanner.py:88-371` | MAPPING_ONLY |

---

## What Actually Executes in a Normal Production HAIEC Static Scan

1. `setup_rules()` is called with `scan_profiles=["DEFAULT"]` (or other profiles)
2. `AI_SECURITY_RULES` (121 embedded `ai-*` Semgrep rules) is written to a temp YAML file
3. If non-DEFAULT profiles are selected, `PROFILE_SEMGREP_RULES` for those profiles are appended
4. `run_semgrep()` runs `semgrep --config <temp_yaml> --json --no-git-ignore --max-memory 4096 --timeout 300`
5. Semgrep evaluates the 121 `ai-*` rules (plus any profile-specific rules)
6. Results are mapped to display IDs via `HAIEC_RULE_TO_DISPLAY_ID`
7. SOC2 display IDs (R-PI01 to R-AC05) NEVER appear in results because no `soc2-*` Semgrep rules exist

**The SOC2 rules are phantom — they exist only as mappings and metadata, never as executable detectors.**
