# 01 — Historical Test Inventory

## Files Discovered in haiec-website

### Semantic Test Files

| File | Classification | What It Tests |
|------|---------------|---------------|
| `test_sample_code.py` | POSITIVE_DETECTOR_SEMANTICS | Sample vulnerable code with inline expectations |
| `test-python-ast.py` | POSITIVE_DETECTOR_SEMANTICS | FastAPI endpoint with AI call expectations |
| `test-semgrep-rules.yaml` | RULE_SYNTAX | 3 simplified test rules (not production rules) |
| `test-semgrep-simple.yaml` | RULE_SYNTAX | 1 minimal OpenAI detection rule |
| `test_yaml_validation.py` | RULE_SYNTAX | YAML parse validation for AI_SECURITY_RULES |

### Scanner Infrastructure Files

| File | Classification |
|------|---------------|
| `modal_ai_security_scanner.py` | SCANNER_EXECUTION (production scanner) |
| `modal_ai_security_scanner_filter_helper.py` | RULE_MAPPING (ADMIN_QUICK_SCAN filter) |
| `semgrep_rules.yaml` | RULE_SYNTAX (legacy/extracted rules) |
| `extract_rules.py` | RULE_COUNT |
| `add_metadata_to_rules.py` | RULE_MAPPING |

### Audit/Documentation Files (Not Tests)

| File | Classification |
|------|---------------|
| `SCANNER_TEST_PLAN.md` | DOCUMENTATION_ONLY |
| `TEST-REPORT.md` | DOCUMENTATION_ONLY |
| `TESTING_SUMMARY.md` | DOCUMENTATION_ONLY |
| `TEST-FIXES-SUMMARY.md` | DOCUMENTATION_ONLY |
| `AI-RUNTIME-SCANNER-TEST-REPORT.md` | DOCUMENTATION_ONLY |
| `LOCAL_TEST_RESULTS.md` | DOCUMENTATION_ONLY |
| `E2E_TEST.md` | DOCUMENTATION_ONLY |
| `FINAL_TEST.md` | DOCUMENTATION_ONLY |
| 40+ SCANNER_*.md and AUDIT_*.md files | DOCUMENTATION_ONLY |

### CI/CD Test Files

| File | Classification |
|------|---------------|
| `.github/workflows/smoke-tests.yml` | SCANNER_EXECUTION |
| `.github/workflows/sarif-export.yml` | SARIF |
| `vitest.config.ts` | RULE_SYNTAX (test runner config) |
| `tests/unit/readiness-engine.test.ts` | API_INTEGRATION (compliance scoring, not Semgrep) |

## What Historical Tests Actually Validated

### test_sample_code.py

**Purpose:** Manual sample code with inline comments saying "Should be detected by [rule-id]"

**What it proved:** NOTHING automatically — it's a Python script with `if __name__ == "__main__": print(...)`. It was never run against Semgrep in any automated test. It's sample code for manual inspection.

**Invalid expectations found:**
- Line 30: `os.system("ls -la")` expected to trigger `ai-tool-abuse-output-exec` — WRONG. This is a taint rule requiring AI output → execution flow. A fixed string has no AI source.
- Line 35: `subprocess.run("echo hello", shell=True)` expected to trigger `ai-tool-abuse-output-exec` — WRONG for same reason (though the rule has a false-positive bug that makes it fire anyway).
- Line 75: `url = user_provided_url` — `user_provided_url` is undefined, invalid Python.
- Line 82: `query = f"SELECT * FROM users WHERE id = {user_id}"` — `user_id` is undefined.
- Line 55: `Chroma.from_documents(documents=user_docs)` — `user_docs` is undefined.

### test_yaml_validation.py

**Purpose:** Validates that AI_SECURITY_RULES YAML parses correctly.

**What it proved:** YAML syntax validity only. Does NOT test rule semantics, pattern correctness, or fixture behavior.

### test-semgrep-rules.yaml / test-semgrep-simple.yaml

**Purpose:** Simplified test rules for manual Semgrep testing.

**What it proved:** These are NOT the production rules. They are simplified versions with fewer patterns. Testing them does NOT validate the production rulepack.

## Key Conclusion

**No historical test in haiec-website automatically validated Semgrep rule semantics.** The "247 tests passed" and "Phase 8 passed" claims in historical documents refer to the Next.js application test suite (vitest), NOT Semgrep rule validation.
