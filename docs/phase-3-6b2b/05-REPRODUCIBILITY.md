# 05 — Reproducibility

## Test Configuration

3 repositories (1 SMALL, 1 MEDIUM, 1 LARGE) were scanned 5 times each with frozen:
- Commit SHA
- Rulepack digest
- Manifest digest
- Semgrep digest (sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a)
- Configuration

Normalized outputs were compared by finding fingerprint (SHA-256 of sorted check_id + path + line + column).

## Results

### together-python (SMALL, 94 files)

| Run | Findings | Fingerprint | Time(s) |
|---|---|---|---|
| 1 | 308 | 1288afe0e0e60bd7 | 40.96 |
| 2 | 308 | 1288afe0e0e60bd7 | 46.97 |
| 3 | 308 | 1288afe0e0e60bd7 | 42.61 |
| 4 | 308 | 1288afe0e0e60bd7 | 41.69 |
| 5 | 308 | 1288afe0e0e60bd7 | 40.24 |

**Result: 5/5 IDENTICAL** (1 unique fingerprint)

### anthropic-sdk-typescript (MEDIUM, 330 files)

| Run | Findings | Fingerprint | Time(s) |
|---|---|---|---|
| 1 | 138 | 79a034c48161b2e9 | 42.49 |
| 2 | 138 | 79a034c48161b2e9 | 40.23 |
| 3 | 138 | 79a034c48161b2e9 | 42.81 |
| 4 | 138 | 79a034c48161b2e9 | 40.53 |
| 5 | 138 | 79a034c48161b2e9 | 41.87 |

**Result: 5/5 IDENTICAL** (1 unique fingerprint)

### anthropic-sdk-python (LARGE, 1240 files)

| Run | Findings | Fingerprint | Time(s) |
|---|---|---|---|
| 1 | 478 | c03ec8f00a8a974c | 141.18 |
| 2 | 478 | c03ec8f00a8a974c | 139.07 |
| 3 | 478 | c03ec8f00a8a974c | 140.08 |
| 4 | 478 | c03ec8f00a8a974c | 138.39 |
| 5 | 478 | c03ec8f00a8a974c | 140.09 |

**Result: 5/5 IDENTICAL** (1 unique fingerprint)

## Conclusion

**3/3 repos: 5/5 IDENTICAL**

Allowed technical claim: "Deterministic under a pinned rulepack, engine version, configuration, and source snapshot."

This is NOT a claim of universal determinism. Duration varies between runs (observational), but normalized findings are identical.
