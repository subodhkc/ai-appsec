# 12 — Phase 3.6B-2 Input

## Prerequisites for Phase 3.6B-2

Phase 3.6B-2 may start only after the user explicitly authorizes it. Phase 3.6B-1 stops here.

## Recommended Phase 3.6B-2 Scope

### Priority 1 — Safety-Critical
1. **Risk-score duplicate-finding inflation:** Implement finding deduplication in `risk-summary-generator.ts` (dedupe by ruleId + filePath + lineRange before calculating risk score).
2. **Modal scanner version alignment:** Align Modal scanner version with config.ts (either update Modal to 3.27.0 or update config.ts to match the actual deployed Modal version).
3. **E2E test version expectation:** Update `tests/e2e/modal-scanner-deployment.spec.ts` to expect the correct scanner version.

### Priority 2 — Completeness
4. **Static HTML sample files:** Update the 45 HTML files in `public/demo/` to align with new copy standards (stale rule counts, "violates" language, etc.).
5. **Captcha route type error:** Fix the pre-existing `.next/types` captcha route type error.
6. **Compliance/GitHub/NYC benchmark sources:** Verify the sources cited in `COMPLIANCE_BENCHMARKS`, `GITHUB_BENCHMARKS`, and `NYC_LL144_BENCHMARKS`.

### Priority 3 — Quality
7. **"No AI guessing" audit:** Review all remaining "No AI guessing" instances to confirm they only appear in compliance-engine contexts.
8. **SEO metadata review:** Review and update SEO metadata templates for unsupported claims.
9. **TypeScript analyzer decision:** Decide whether to wire the TypeScript deterministic analyzer to the production scan path or document it as a future capability.
10. **AI Inventory risk scoring:** Review AI Inventory risk scoring for unsupported claims.

## Context for Phase 3.6B-2

### What Phase 3.6B-1 Changed
- Trust page semantics (no more "implemented by default")
- SOC2 coverage labeling (no more "coveragePercentage")
- Report finding language ("findings" not "vulnerabilities", "maps to" not "violates")
- Financial model (severityWeight not probability, SOC2 not a fine, modeled impact not prediction)
- Industry benchmarks (removed unsupported, added verified context)
- Sample truth (all 45 classified as SYNTHETIC_DEMO, gallery copy updated)
- Version drift (aligned to 3.27.0, removed 3.25.0/3.28.0 fallbacks)
- Public copy (Semgrep attribution, no "82 rules", no "Provable data-flow paths")

### What Phase 3.6B-1 Did NOT Change
- `modal_ai_security_scanner.py` (production rule bodies)
- `AI_SECURITY_RULES` (embedded YAML)
- `rc.3` (private rule candidate)
- Tenant Isolation repo
- LLMVerify repo
- MCP repo implementation
- Database schema
- Static HTML sample files in `public/demo/`
- E2E test version expectations
- Compliance/GitHub/NYC benchmark sources

### Verification Artifacts Available
- `01-VERIFICATION-LEDGER.md` — all 3.6A claims verified/disproved
- `06-EXTERNAL-SOURCE-LEDGER.md` — all external sources verified
- `lib/reports/evidence-sources.ts` — source registry (new file in haiec-website)
- `10-REGRESSION-RESULTS.md` — test results
- `.private-rule-staging/phase36b1/typecheck-baseline.txt` — baseline typecheck
- `.private-rule-staging/phase36b1/typecheck-after.txt` — post-change typecheck

## Can Phase 3.6B-2 Start?

**YES** — Phase 3.6B-2 can start when the user explicitly authorizes it. All Phase 3.6B-1 work is complete, tested, and documented. No blocking issues remain.
