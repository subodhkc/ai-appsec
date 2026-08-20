# 09 — Phase 3.6B-2 Input

## Prerequisites
Phase 3.6B-2 may start only after the user explicitly authorizes it. Phase 3.6B-1.1 stops here.

## Recommended Phase 3.6B-2 Scope

### Priority 1 — Safety-Critical
1. **Risk-score duplicate-finding inflation:** Implement finding deduplication in risk-summary-generator.ts (dedupe by ruleId + filePath + lineRange before calculating risk score). Do NOT claim "Modal dedup handles most cases" without quantified evidence.
2. **Static HTML sample files:** Update the 55 HTML files in public/demo/ to align with new copy standards (stale rule counts, "violates" language, etc.). Alternatively, regenerate them from TypeScript templates.

### Priority 2 — Completeness
3. **Captcha route type error:** Fix the pre-existing .next/types captcha route type error (verifyCaptchaToken exported from route module).
4. **errors/types.ts stale fallback:** Fix the `engineVersion: ... || '3.22.0'` stale fallback.
5. **Compliance/GitHub/NYC benchmark sources:** Verify the sources cited in COMPLIANCE_BENCHMARKS, GITHUB_BENCHMARKS, and NYC_LL144_BENCHMARKS.
6. **OSNIT "industry average" claims:** Review app/osnit/content.tsx for unsupported "industry average (34%)" claims.

### Priority 3 — Quality
7. **TypeScript analyzer decision:** Decide whether to wire the TypeScript deterministic analyzer to the production scan path or document it as a future capability.
8. **AI Inventory risk scoring:** Review AI Inventory risk scoring for unsupported claims.
9. **Modal scanner version alignment:** Verify the actual deployed Modal scanner version matches 3.28.0 (requires live health check, not just code inspection).

## Context for Phase 3.6B-2

### What Phase 3.6B-1.1 Changed (on top of Phase 3.6B-1)
- Version reconciliation: config.ts → 3.28.0, health checkers import from config
- Trust-page status: `no_relevant_finding_reported` (not `no_issue_detected_in_scope`)
- Financial model: SOC2 qualitative only, copy matches formula
- 18 additional files with stale rule counts fixed
- E2E test fixed
- Artifact generator and scan notification use SCANNER_VERSION

### What Phase 3.6B-1.1 Did NOT Change
- modal_ai_security_scanner.py (production rule bodies)
- AI_SECURITY_RULES (embedded YAML)
- rc.3 (private rule candidate)
- Tenant Isolation repo
- LLMVerify repo
- MCP repo implementation
- Database schema
- Static HTML sample files in public/demo/
- Captcha route code
- OSNIT content

## Can Phase 3.6B-2 Start?
**YES** — Phase 3.6B-2 can start when the user explicitly authorizes it. All Phase 3.6B-1.1 work is complete, tested, and documented. Phase 3.6B-1.1 stops here and does NOT begin Phase 3.6B-2 automatically.
