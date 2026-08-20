# Public-Contract Change Classification

## Phase 4C-C — Part 18

## Classification Rules

- **PACKAGE_BYTE_AFFECTING**: Changes to files included in the npm tarball
- **REPOSITORY_ONLY**: Changes to files NOT included in the npm tarball

## npm `files` Field

```json
["dist", "rules/public-core", "LICENSE", "THIRD_PARTY_NOTICES.md", "TRADEMARKS.md"]
```

npm always includes: `package.json`, `README.md`, `LICENSE`

## Phase 4C-C Planned Changes

| Change | File | In tarball? | Classification |
|--------|------|-------------|----------------|
| Update description | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Add license field | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Add repository field | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Add homepage field | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Add bugs field | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Add author field | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Update keywords | `package.json` | YES | PACKAGE_BYTE_AFFECTING |
| Update status section | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Update tool presentation | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Update test count | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Update rulepack version | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Resolve license section | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Remove phase history | `README.md` | YES | PACKAGE_BYTE_AFFECTING |
| Confirm/change license | `LICENSE` | YES | PACKAGE_BYTE_AFFECTING |
| Resolve MIT contradiction | `THIRD_PARTY_NOTICES.md` | YES | PACKAGE_BYTE_AFFECTING |
| Resolve MIT contradiction | `TRADEMARKS.md` | YES | PACKAGE_BYTE_AFFECTING |
| Post-release-ready policy | `SECURITY.md` | NO | REPOSITORY_ONLY |
| Governance evidence docs | `docs/evidence/phase-4c-c/` | NO | REPOSITORY_ONLY |

## Tarball Impact

**Multiple PACKAGE_BYTE_AFFECTING changes are required.**

Therefore the current Phase 4C-B canonical tarball SHA:

```
sha256:7790ca18141830ead9b6d12dffb00415dec06d63db8ac0a8a37e2fbe7a1d9f29
```

becomes:

**SUPERSEDED_FOR_PUBLICATION**

It is preserved as historical Phase 4C-B evidence. The final publication
artifact will be built from RC2 and must be requalified.

## What Does NOT Change

- `dist/` — no source code changes (no detector, security-check, or evidence semantics changes)
- `rules/public-core/` — no rulepack changes
- No runtime code changes
- No evidence semantics changes
