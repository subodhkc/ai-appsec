# 02 — Engine Environment

## Legacy Environment (1.52.0)

| Field | Value |
|-------|-------|
| Image | `returntocorp/semgrep:1.52.0` |
| Digest | `sha256:f33325700023dda4ff71e559185e2167e17c876dc979c90a71532b2bca17c819` |
| OS | Linux (Docker) |
| Semgrep | 1.52.0 |
| Metrics | off |

## Modern Environment (1.173.0)

| Field | Value |
|-------|-------|
| Image | `semgrep/semgrep:1.173.0` |
| Digest | `sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a` |
| OS | Linux (Docker) |
| Semgrep | 1.173.0 |
| Metrics | off |

## Network/Metrics Boundary

- No Semgrep authentication
- No Semgrep AppSec Platform
- No Registry rules
- No `--config auto`
- `SEMGREP_SEND_METRICS=off` set
- `--metrics off` used
- Only local HAIEC staged rules and synthetic fixtures scanned

## Fixture Hash Verification

Fixture hashes from `baseline/semgrep-1.52/fixture-hashes.json` were verified against the same fixture files used in the modern run. No changes.
