# 05 — Sample Evidence Map

## Summary
- **Total files:** 55 (not 45 as Phase 3.6B-1 reported)
- **REAL_RUN:** 0
- **SYNTHETIC_DEMO:** 55
- **HISTORICAL_SAMPLE:** 0
- **UNKNOWN_SOURCE:** 0

## Methodology
All 55 HTML files in `public/demo/` (including subdirectories `eu-ai-act-samples/` and `nyc-ll144-samples/`) were searched for:
1. Sample/demo/synthetic/fictional/illustrative/template/example/mock indicators
2. Real company names
3. Real GitHub repo URLs
4. Real scan IDs

All 55 files contain sample/demo/synthetic indicators. One file (`ai-security-scanner-sample-report.html`) references `github.com/techventure/ai-platform` — a fictional repo ("techventure" is not a real company). No real customer data, real scan IDs, or real repo URLs found in any file.

## Phase 3.6B-1 Count Error
Phase 3.6B-1 reported 45 samples. The actual count is 55 (22 in demo/ + 8 in eu-ai-act-samples/ + 2 in nyc-ll144-samples/ + 23 more in demo/). Phase 3.6B-1 missed the subdirectory files.

## Machine-Readable Map
See `sample-evidence-map.json` for per-file evidence and classification.

## Static HTML Files Not Updated
The 55 HTML files themselves contain stale copy (e.g., "38 validation rules" in ai-code-security-analysis-sample.html, "91 rules" in others). These are static HTML files, not generated from TypeScript templates. Updating them individually is a large scope expansion and is deferred to Phase 3.6B-2. The gallery metadata copy now discloses all samples as synthetic demonstrations.
