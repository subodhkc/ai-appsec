# 12 — Local Security Validation

## Constraints Verified

The scanner does NOT:

| Constraint | Status |
|---|---|
| Execute target code | PASS — Semgrep is static analysis only |
| Invoke target package managers | PASS — No npm/pip install triggered |
| Run target binaries | PASS — No target binaries executed |
| Read outside configured root | PASS — Docker volume mount restricts access |
| Follow unsafe symlinks outside root | PASS — Docker mount boundary enforced |
| Emit absolute host paths | PASS — Paths are container-relative (/target/...) |
| Emit raw secrets | PASS — Findings contain code snippets, not secret values |
| Upload source | PASS — Network-none validation confirmed no network dependency |

## Docker Security

- All scans run in `semgrep/semgrep:1.173.0` Docker container
- Container has read-only access to target repository via volume mount
- Container has read-only access to HAIEC rulepack via volume mount
- Network-none validation confirmed no network egress
- No target repository code is executed — Semgrep performs static pattern matching only

## Path Handling

- Findings paths are container-relative (`/target/src/...`)
- Normalization converts to repo-relative paths (`src/...`)
- No absolute host paths are emitted in findings

## Conclusion

All local security constraints pass. The scanner is safe to run on untrusted repositories.
