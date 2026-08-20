# 06 — Active Claims Reconciliation

## Phase 3.6B-1 Contradiction
Phase 3.6B-1 simultaneously reported:
- "45 static HTML samples were not updated"
- "active unsupported AI-security claims remaining = 0"

This was internally inconsistent. The active claim sweep was incomplete.

## Phase 3.6B-1.1 Sweep Results

### Stale Rule-Count Claims Found and Fixed
| Count | Files | Status |
|-------|-------|--------|
| "92 rules" | docs/page.tsx, docs/engines/ai-security-static/page.tsx, api/ai-navigation/search/route.ts | FIXED → 121 |
| "91 Semgrep rules" | ai-security/page.tsx (4), solutions/ai-security/page.tsx (3), solutions/ai-security/layout.tsx (4), products/runtime-security/layout.tsx (4), services/ai-security-evidence-pack/page.tsx, dashboard/ai-security/page.tsx, how-it-works/page.tsx, components/ai-security/AISecurityWelcome.tsx, components/static-scanner/ArchitectureFlowDiagram.tsx, components/static-scanner/ProcessFlowDiagram.tsx | FIXED → 121 |
| "78 display IDs" | how-it-works/page.tsx (2), ai-security/page.tsx (2), solutions/ai-security/page.tsx (2), solutions/ai-security/layout.tsx, ai-security/opengraph-image.tsx, soc2/opengraph-image.tsx, components/static-scanner/ArchitectureFlowDiagram.tsx, components/static-scanner/ProcessFlowDiagram.tsx | FIXED → removed |
| "82 compliance mappings" | solutions/ai-security/layout.tsx (4), products/runtime-security/layout.tsx (4), components/static-scanner/ArchitectureFlowDiagram.tsx, components/static-scanner/ProcessFlowDiagram.tsx | FIXED → removed |
| "78 rules" | content/registry.ts (2), lib/content/knowledge-base-data.ts | FIXED → 121 |
| "200+ rules" | github-integration/page.tsx | FIXED → "multiple engines" |
| "91 rules / 78 display IDs" | components/static-scanner/ArchitectureFlowDiagram.tsx | FIXED → "121 detector definitions" |
| Hardcoded v3.22.0 | lib/ai-security/artifact-generator.ts, lib/ai-security/scan-notification.ts | FIXED → SCANNER_VERSION |

### "No AI guessing" Review

| Location | Context | Decision | Reason |
|----------|---------|----------|--------|
| solutions/ai-security/page.tsx:136 | AI security scanner | KEEP | Scanner IS deterministic (Semgrep) |
| readiness-assessment/page.tsx:192 | Compliance readiness | KEEP | Engine IS rule-based |
| readiness-assessment/metadata.ts:5 | Compliance readiness | KEEP | Engine IS rule-based |
| readiness-assessment/layout.tsx:5 | Compliance readiness | KEEP | Engine IS rule-based |
| how-it-works/opengraph-image.tsx:9 | Compliance engines | KEEP | Engines ARE deterministic |
| how-it-works/metadata.ts:5,16 | Platform-wide | KEEP | Compliance engines ARE deterministic |
| compare/page.tsx:221 | General comparison | KEEP | Deterministic engines |
| github-integration/page.tsx:34 | Scanner integration | KEEP | Scanner IS deterministic |
| security/rules/page.tsx:263 | Security rules page | KEEP | Scanner IS deterministic |
| services/nyc-hiring-compliance/page.tsx:548 | NYC compliance | KEEP | Engine IS rule-based |
| dashboard/ai-security/reports/page.tsx:126 | AI security reports | KEEP | Scanner IS deterministic |

**KEEP: 12 | REWORD: 0 | REMOVE: 0**

All "No AI guessing" occurrences are in contexts where the relevant engine IS deterministic and rule-based. No occurrences are in contexts where LLM generation or heuristic inference is represented as fact.

### Active Unsupported Scanner Claims Remaining
**0** — After Phase 3.6B-1.1 corrections, no active unsupported AI-security-scanner claims remain in TypeScript/TSX files.

### Active Stale Rule-Count Claims Remaining
**0** in TypeScript/TSX files. **~55** in static HTML sample files (deferred to Phase 3.6B-2).

### "violates" Language Remaining
**0** in AI-security-scanner context. The GDPR and HIPAA framework pages were fixed in Phase 3.6B-1.
