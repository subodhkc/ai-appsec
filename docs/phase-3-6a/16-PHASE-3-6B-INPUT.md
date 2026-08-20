# 16 — Phase 3.6B Input

## Recommended Scope for Phase 3.6B

Phase 3.6B should be the **REPAIR phase** for the P0 and P1 issues identified in this audit. It is NOT read-only — it will modify HAIEC SaaS code (with explicit authorization).

### P0 Fixes (12)

1. **Trust page controls default:** Change from `'implemented'` to `'unknown'`/`'not_assessed'` in `trust-page.ts:79-120`
2. **Sample report mock data:** Either regenerate from real scanner output OR label as `SYNTHETIC_DEMO` with version info; update gallery description
3. **"violates" compliance language:** Change to "may affect" / "relevant to" / "mapped to" in `ai-security-report.ts:277`
4. **OWASP benchmark citation:** Add URL or remove benchmark; if removed, replace with "no industry benchmark available"
5. **Verizon DBIR benchmark:** Remove (DBIR doesn't cover this metric) or replace with accurate source
6. **Exploitation probabilities:** Cite source or label as `ILLUSTRATIVE` with disclaimer
7. **"Estimated Value Protected":** Label as `ILLUSTRATIVE_ESTIMATE` with disclaimer, or remove from report
8. **"Provable data-flow paths":** Change to "pattern-based detection with taint analysis for select rules"
9. **"No heuristics":** Remove or clarify (context-aware aggregation uses heuristic scoring)
10. **Trust artifacts "actual scans":** Reword to "generated from scanner output" with scope limitations
11. **REGULATORY_FINE_RANGES:** Add citations or label as `ILLUSTRATIVE`; remove SOC2 "fines" (SOC2 is attestation)
12. **Sample "82 rules":** Update to current count or label as historical

### P1 Fixes (5)

13. **Scanner version drift:** Align Modal fallback and Next.js config to same version
14. **Next.js /api/health:** Create endpoint returning commit + version
15. **CI/CD verification:** Implement commit injection and verification
16. **cleanRules semantics:** Change "passed" to "evaluated with no findings" or "not triggered"
17. **Duplicate risk score inflation:** Implement normalization before aggregation (from Phase 3.5 spec)

### P2 Fixes (7) — can be deferred to during cutover

18. Hardcoded rule counts → manifest-derived
19. "Python engines" → "Semgrep-based analysis engine"
20. Dashboard "27 SOC2" → "30 SOC2" or manifest-derived
21. AI inventory riskScore/10 validation
22. getActiveRulesCount fallback (9 → fail safely)
23. SOC2 coverage percentage semantics
24. (TypeScript engine integration is DEFER)

## Sample Versioning Contract (to implement in 3.6B)

Each retained sample should display:
- `sampleType`: HISTORICAL_SAMPLE | CURRENT_SAMPLE | SYNTHETIC_DEMO
- `generatedAt`: ISO timestamp
- `scannerVersion`: string
- `rulepackVersion`: string
- `rulepackDigest`: SHA-256 (if known)
- `engineVersion`: Semgrep version
- `sourceType`: PUBLIC_REPO | SYNTHETIC | INTERNAL_DEMO
- `scope`: text describing what was/wasn't scanned
- `limitations`: array of strings

## Change-Log Model (to implement in 3.6B)

```
rulepack-changelog/
  v121-rules-v4-soc2.json    ← current production
  rc3.json                    ← rc.3 candidate
  canonical-v1.json           ← future canonical
```

Each entry:
- `version`: string
- `date`: ISO date
- `materialChanges`: array
- `breakingSemanticChanges`: array
- `renamedChecks`: array
- `retiredChecks`: array
- `newChecks`: array
- `knownLimitations`: array

## Authorization Required

Phase 3.6B requires explicit authorization to:
- Modify HAIEC SaaS code (trust-page.ts, ai-security-report.ts, etc.)
- Modify sample reports and gallery descriptions
- Modify public-facing copy (trust-artifacts page, sample-reports metadata)
- Modify financial/benchmark calculations

**Do NOT begin Phase 3.6B without explicit user authorization.**
