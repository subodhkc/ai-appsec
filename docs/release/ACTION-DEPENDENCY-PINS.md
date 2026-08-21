# Action Dependency Pins

All release-critical GitHub Actions are pinned to immutable 40-character
Git commit SHAs instead of mutable major version tags (@v4).

## Pinned Actions

| Action | Release | Immutable SHA | Upstream Repository | Verified |
|--------|---------|---------------|---------------------|----------|
| actions/checkout | v4 | `11d5960a326750d5838078e36cf38b85af677262` | https://github.com/actions/checkout | 2026-08-21 |
| actions/setup-node | v4 | `49933ea5288caeca8642d1e84afbd3f7d6820020` | https://github.com/actions/setup-node | 2026-08-21 |
| actions/upload-artifact | v4 | `ea165f8d65b6e75b540449e92b4886f43607fa02` | https://github.com/actions/upload-artifact | 2026-08-21 |
| actions/download-artifact | v4 | `d3f86a106a0bac45b974a628896c90dbdf5c8093` | https://github.com/actions/download-artifact | 2026-08-21 |

## Verification Method

Each SHA was verified by:
1. Fetching the v4 tag ref from the official action repository
2. Confirming the tag is a lightweight tag pointing directly to the commit
3. Confirming the commit exists in the official repository via the commits API

## Workflows Using Pinned Actions

- `.github/workflows/publish.yml`
- `.github/workflows/phase-4c-cross-platform.yml`
- `.github/workflows/ci.yml`
