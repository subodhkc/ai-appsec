# 01 — Linux Environment

## Environment Selection Process

1. **Docker Desktop** — initially not running, started during Phase 2.6
2. **WSL Ubuntu-24.04** — installed and Semgrep installed, but /tmp cleared between sessions making it unreliable
3. **Docker** — chosen as the stable execution environment

## Final Environment

| Field | Value |
|-------|-------|
| OS | Linux (Docker container) |
| Image | `returntocorp/semgrep:1.52.0` |
| Kernel | Linux (Docker Desktop Linux engine) |
| Python | 3.x (container default) |
| Semgrep | 1.52.0 |
| CPU | x86_64 |
| Metrics | off |
| SEMGREP_SEND_METRICS | off |
| Registry rules | none |
| Config | local file only (`ai-security-rules-extracted.yaml`) |

## Verification

```
semgrep --version → 1.52.0
```

## Security

- No Semgrep authentication
- No `--config auto`
- No Semgrep Registry rules
- Private rulepack mounted as local volume only
- No upload of private rules anywhere
- `--metrics off` and `SEMGREP_SEND_METRICS=off` set explicitly
