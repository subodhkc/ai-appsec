# 13 — Semgrep 1.52 Baseline

## Production Baseline

The production scanner uses **Semgrep 1.52.0**. This phase is a migration/parity phase — the canonical behavioral baseline is NOT upgraded.

## Isolation Requirements

- Use Semgrep 1.52.0 in an isolated environment (temporary venv or container)
- Do not modify the system/global Python environment
- Do not authenticate Semgrep
- Do not use Semgrep Registry rules
- Do not use `--config auto`
- Explicitly disable metrics/telemetry

## Validation Results

### Rulepack Validation

The extracted production rulepack (121 detectors) was validated for YAML structure and Semgrep rule schema:

| Check | Result |
|-------|--------|
| Valid YAML | PASS |
| All rules have `id` | PASS |
| All rules have `message` | PASS |
| All rules have `severity` | PASS |
| All rules have `languages` | PASS |
| All rules have `pattern` or `patterns` | PASS |
| Duplicate IDs | 0 |
| Language coverage | python, javascript, typescript |

### Semgrep Execution Validation

Full Semgrep 1.52.0 execution validation requires an isolated environment with Semgrep installed. This phase documents the requirements and methodology. The execution validation should be performed before public rule body publication.

### Known Issues from Git History

The git history of `modal_ai_security_scanner.py` shows several Semgrep compatibility issues that were fixed:

1. **Cross-language PatternParseError** — fixed by splitting rules by language (commits `795be453`, `a040d04c`, `4453a525`)
2. **YAML escape errors** — fixed by removing problematic regex patterns (commits `b597baca`, `3f2745bb`, `88d60ee4`)
3. **Quoted colon patterns** — fixed by removing problematic patterns (commit `3f2745bb`)

These issues are resolved in the current production rulepack. The extracted baseline reflects all fixes.
