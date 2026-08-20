# 04 — Postprocessing Reachability

## `lib/ai-security/false-positive-filter.ts`

### Status: DEAD_CODE

### Evidence

```
grep -r "from.*false-positive-filter" --include="*.ts" .
→ No matches found

grep -r "import.*false-positive-filter" --include="*.ts" .
→ No matches found
```

The file exists at `lib/ai-security/false-positive-filter.ts` and contains functions `filterFalsePositives`, `analyzeFalsePositive`, and `calculateConfidence`. However, NO file in the entire codebase imports it.

### Impact

Any false-positive filtering logic in this file is NOT applied to production scan results. The production scanner (`modal_ai_security_scanner.py`) runs in Modal and does not have access to TypeScript files. The Next.js API route that triggers the scanner also does not import this module.

### Conclusion

The false-positive filter is an unused prototype. It does NOT participate in the production scan pipeline. Raw Semgrep findings are stored directly in the database without filtering.
