# 02 — Claims Ledger

> **Phase -1 document (corrected in Phase -0.5).** Tracks every public/internal
> claim about HAIEC and its verification status. Claims unsupported by executable
> code are flagged.
>
> **Phase -0.5 correction:** Claim #1 was corrected. See
> `docs/phase-minus-0-5/01-AUDIT-CORRECTIONS.md` for details.

---

## Claims Audit

| # | Claim | Source | Status | Evidence | Correct value |
|---|-------|--------|--------|----------|---------------|
| 1 | "121 unique rules (91 core AI security + 30 SOC2 compliance)" | `modal_ai_security_scanner.py:83`, `config.ts:62` | **PARTIALLY_TRUE** (corrected in Phase -0.5) | 121 detector definitions DO exist in `AI_SECURITY_RULES` (Python embedded, line 989-3358), but they are ALL `ai-*` rules, NOT 91 AI + 30 SOC2. 0 SOC2 rules execute. | 121 `ai-*` detectors in Modal; 91 in YAML; 0 SOC2 execute |
| 2 | "70 Semgrep pattern detection rules → 33 unique compliance rule IDs" | `README.md:150` | **STALE** | Actual: 91 rules, 72 display IDs | 91 rules, 72 display IDs |
| 3 | SCANNER_VERSION = 3.28.0 | `modal_ai_security_scanner.py:38`, CI workflow | **VERIFIED** | Deployed version | 3.28.0 |
| 4 | SCANNER_VERSION = 3.27.0 | `lib/ai-security/config.ts:21` | **STALE** | Conflicts with deployed 3.28.0 | Should be 3.28.0 (or single source) |
| 5 | RULEPACK_VERSION = "121-rules-v4-soc2" | `modal_ai_security_scanner.py:41` | **MISLEADING** | Embeds false rule count (121) | Should not embed count |
| 6 | RULEPACK_VERSION = "2.0.0" | `evidence-bundle/generator.ts:40` | **CONFLICT** | Different format/value than #5 | Needs canonicalization |
| 7 | RULEPACK_VERSION = "2026.01.1" | `artifact-generator.ts:57`, `trust-artifacts/service.ts:34` | **CONFLICT** | Third format | Needs canonicalization |
| 8 | Semgrep version 1.52.0 | `modal_ai_security_scanner.py:64,4951`, `analyzer.py:79` | **VERIFIED** | Consistent across sources | 1.52.0 |
| 9 | "148 automated tests — 95 integration + 53 adversarial" | `README.md:125` | **UNVERIFIED** | Not checked in this audit | Requires test count |
| 10 | LLMVerify "100% local • Zero network requests • Zero telemetry" | `src/postinstall.ts` banner | **VERIFIED (free tier only)** | `src/verify.ts:349-365` enforces | Should scope to "free tier" |
| 11 | LLMVerify "500 calls/day" free limit | `src/postinstall.ts` banner, `src/types/config.ts:30` | **VERIFIED** | `dailyCallLimit: 500` | 500/day |
| 12 | Tenant isolation "57 rules" | `src/rules/index.ts:11`, MCP tool description | **VERIFIED** | 42 general + 15 MCP = 57 | 57 |
| 13 | "AI Security Scanning - Static code analysis for AI/ML attack surface detection" | `README.md:11` | **VERIFIED** | Scanner exists and runs | Accurate |
| 14 | "AI Security Runtime - Live endpoint testing with adversarial attack templates" | `README.md:12` | **UNVERIFIED** | Runtime security not audited in Phase -1 | Requires runtime audit |
| 15 | `subodhkc/llmverify` is canonical LLMVerify | (assumption) | **FALSE** | Redirects to `llmverify-python-preview` (placeholder v0.0.1) | `llmverify-npm` is canonical |
| 16 | Confidence values (0.9, 0.7, 0.5, 0.8) are meaningful probabilities | `public-repo-scanner/analyzer.py:299-311` | **FALSE** | Fabricated mappings, not calibrated | Should be qualitative |
| 17 | Evidence fingerprint is deterministic | `lib/safety/evidence-integrity.ts` | **FALSE** | Includes timestamp in composite hash | Not deterministic |
| 18 | Audit orchestrator fingerprint is deterministic | `lib/audit-orchestrator/fingerprint.ts` | **VERIFIED** | Canonical JSON, no timestamps | Deterministic |

---

## Claims That Must Not Be Made (without specific verification)

Per quality rule 13, do NOT claim:
- "safe"
- "secure"
- "certified"
- "compliant"
- "complete"
- "zero false positives"
- "zero false negatives"
- "guaranteed"

Unless an extremely specific verified statement warrants it.

---

## Claims to Retire

1. **"121 rules = 91 core + 30 SOC2"** — the formula is FALSE. 121 `ai-*` detectors exist in Modal, but 0 SOC2 rules execute. Use the rule-count taxonomy from `docs/phase-minus-0-5/03-RULE-COUNT-TAXONOMY.md`.
2. **"70 rules → 33 IDs"** — stale. Use "91 rules → 72 display IDs" (YAML file).
3. **"3.27.0" scanner version** — stale. Use 3.28.0 or single source.
4. **Numeric confidence values** — fabricated. Use qualitative evidence strength.
5. **"100% local" (unscoped)** — scope to "free tier" for LLMVerify.
6. **"27 SOC2 rules"** — FALSE. Only 21 TypeScript RuleMeta objects exist, and none execute.
7. **"30 SOC2 rules"** — FALSE. 0 SOC2 rules execute; 30 is a phantom mapping count.
