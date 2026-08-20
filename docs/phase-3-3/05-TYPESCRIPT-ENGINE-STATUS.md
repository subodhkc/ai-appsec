# 05 — TypeScript Engine Status

## Distinction: IMPLEMENTED CODE vs PRODUCTION ACTIVE ENGINE

### `lib/ai-security/false-positive-filter.ts`

**Status:** IMPLEMENTED_BUT_NOT_PRODUCTION_WIRED

**Evidence:**
- File exists at `lib/ai-security/false-positive-filter.ts`
- Contains functions: `filterFalsePositives`, `analyzeFalsePositive`, `calculateConfidence`
- NO file in the codebase imports it:
  ```
  grep -r "from.*false-positive-filter" --include="*.ts" . → No matches
  grep -r "import.*false-positive-filter" --include="*.ts" . → No matches
  ```
- The production scanner (`modal_ai_security_scanner.py`) runs in Modal and does not have access to TypeScript files
- The Next.js API route that triggers the scanner does not import this module

**Conclusion:** The false-positive filter is implemented TypeScript code that is NOT wired into the production scan pipeline. It is not "nonexistent" — it exists as code. But it does not participate in production scanning.

### `lib/ai-security/deterministic-engine.ts`

**Status:** IMPLEMENTED_BUT_NOT_PRODUCTION_WIRED

**Evidence:**
- File exists at `lib/ai-security/deterministic-engine.ts`
- NO file in the codebase imports it from the ai-security path:
  ```
  grep -r "from.*ai-security/deterministic-engine" --include="*.ts" . → No matches
  ```
- Note: `lib/scoring/deterministic-engine.ts` is a DIFFERENT module for compliance scoring — it IS used, but not for AI security scanning

**Conclusion:** The AI-security deterministic engine is implemented TypeScript code that is NOT wired into the production scan pipeline. It is not "nonexistent" — it exists as code. But it does not participate in production AI security scanning.

### Production Pipeline (Confirmed)

The production AI security scan pipeline is:
```
POST /api/ai-security/scan
  → Modal scanner (modal_ai_security_scanner.py)
    → setup_rules() → writes AI_SECURITY_RULES to temp YAML
    → run_semgrep() → semgrep --config <yaml> --json
    → parse_semgrep_results() → Finding objects
    → Store in database
  → API response
```

No TypeScript post-processing occurs on Semgrep findings. The TypeScript files exist as implemented code but are not called in the production path.

### Important Distinction

The user's historical notes showed implemented TypeScript rule logic. These files are NOT nonexistent — they contain real, implemented code. The correct classification is:

**IMPLEMENTED_BUT_NOT_PRODUCTION_WIRED**

This means:
1. The code exists and may have been tested in isolation
2. The code is NOT called by any production code path
3. The code does NOT affect production scan results
4. The code could potentially be wired in during a future phase
