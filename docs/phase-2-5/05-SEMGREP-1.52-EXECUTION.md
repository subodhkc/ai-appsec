# 05 — Semgrep 1.52.0 Execution

## Environment

- **Python:** 3.12.10 (isolated venv)
- **Semgrep:** 1.52.0 (installed via pip in isolated venv)
- **OS:** Windows 11
- **Docker:** Available but Docker Desktop not running
- **WSL:** docker-desktop distro only (no Python)

## YAML Validation Result

```
semgrep --validate --config ai-security-rules-extracted.yaml --metrics off
```

**Result: PASS** (exit code 0, all 121 rules valid)

## Execution Result

**Status: DEFERRED — REQUIRES UNIX ENVIRONMENT**

### Root Cause

Semgrep 1.52.0 imports the `resource` module in `core_runner.py`:
```python
import resource
```

The `resource` module is Unix-only (not available on Windows). This is a known limitation of Semgrep 1.52.0 on Windows.

### What Was Attempted

1. Direct execution via venv Python: `ModuleNotFoundError: No module named 'resource'`
2. Docker container (`returntocorp/semgrep:1.52.0`): Docker Desktop not running
3. WSL (`docker-desktop` distro): No Python installed

### What Is Required

To complete the Semgrep 1.52.0 execution validation:

1. **Option A:** Start Docker Desktop and run `docker run --rm -v <staging>:/work returntocorp/semgrep:1.52.0 --config /work/ai-security-rules-extracted.yaml /work/fixtures/`
2. **Option B:** Install Python in a WSL Ubuntu distro and install semgrep==1.52.0
3. **Option C:** Run on a Linux/macOS machine

### What YAML Validation Confirms

- All 121 rules have valid YAML syntax
- All rules have required fields (id, message, severity, languages, pattern/patterns)
- No duplicate rule IDs
- All languages are supported (python, javascript, typescript)

### What YAML Validation Does NOT Confirm

- Whether patterns actually match the intended code
- Whether patterns cause PatternParseError at scan time
- Whether rules produce false positives or false negatives
- Behavioral parity between production and staged extraction
