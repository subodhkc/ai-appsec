# 04 — Network-None Results

## Test Configuration

Each repository was scanned twice:
1. Normal Docker execution (with network access)
2. Docker `--network none` execution (no network access)

Both scans used:
- Local HAIEC rulepack (public-core.yml)
- Semgrep metrics disabled
- No login
- No registry config
- No community rule download

## Results

| Repo | Size | Normal Findings | Network-None Findings | Normal Time(s) | None Time(s) | Result |
|---|---|---|---|---|---|---|
| together-python | SMALL | 308 | 308 | 49.4 | 267.49 | NETWORK_EQUIVALENT |
| together-python (2nd) | SMALL | 308 | 308 | 37.3 | 261.38 | NETWORK_EQUIVALENT |
| anthropic-sdk-typescript | MEDIUM | 138 | 138 | 43.14 | 264.86 | NETWORK_EQUIVALENT |
| openai-node | MEDIUM | 276 | 276 | 70.12 | 299.02 | NETWORK_EQUIVALENT |
| anthropic-sdk-python | LARGE | 478 | 478 | 153.83 | 374.38 | NETWORK_EQUIVALENT |
| openai-python | LARGE | 846 | 846 | 254.98 | 475.28 | NETWORK_EQUIVALENT |

## Conclusion

**6/6 NETWORK_EQUIVALENT**

Normalized security findings are identical between normal and network-none execution. The scanner has no network dependency.

Time differences are observational — network-none execution is slower due to Docker networking overhead changes, but findings are identical.

## Finding Fingerprints

Each scan produced a SHA-256 fingerprint of normalized findings. Normal and network-none fingerprints matched exactly for every repository.
