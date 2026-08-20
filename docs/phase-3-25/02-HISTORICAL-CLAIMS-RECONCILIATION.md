# 02 — Historical Claims Reconciliation

## Claims Found in Historical Documents

| Claim | Source | Classification | Reality |
|-------|--------|---------------|---------|
| "121 rules" | scanner.py RULEPACK_VERSION | SUPPORTED_FOR_RULE_COUNT_ONLY | 121 YAML rule definitions exist |
| "91 core + 30 SOC2" | scanner.py comments | STALE | SOC2 rules are metadata-only, non-functional |
| "all rules complete" | SCANNER_FIXES_COMPLETE.md | CONTRADICTED | 1 parser error, multiple semantic issues |
| "tests passed" | TEST-REPORT.md | SUPPORTED_FOR_PIPELINE_ONLY | Next.js tests passed, not Semgrep rule tests |
| "production ready" | SCANNER_FINAL_FIX.md | PARTIALLY_SUPPORTED | Scanner pipeline works; rules have defects |
| "100% coverage" | COMPREHENSIVE_AUDIT_COMPLETE.md | CONTRADICTED | Phase 2.6 showed 23/80 positive coverage |
| "70 rules" | older docs | STALE | Rule count grew from 70 → 91 → 121 |
| "78 rules" | older docs | STALE | Same growth trajectory |
| "deterministic engine" | how-it-works page | PARTIALLY_SUPPORTED | Scoring engine exists; AI-security deterministic engine is dead code |
| "false positive filtering" | lib/ai-security/false-positive-filter.ts | UNVERIFIED | File exists but is never imported (dead code) |

## Important Distinction

The historical "tests passed" claims were NOT false — they referred to the Next.js application test suite (vitest), which tests API routes, UI components, and database integration. These tests genuinely passed. The problem is that they were MISINTERPRETED as validating Semgrep rule semantics, which they did not.

## SOC2 Rules

The scanner maps 30 rules to SOC2 compliance controls (R-PI01 to R-AC05). These are included in the 121 rule count but are metadata-only — they do not have executable Semgrep patterns. Claiming "121 security rules" is technically accurate for YAML definitions but misleading for executable protections.
