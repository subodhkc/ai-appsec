# GitHub Packages Mirror Decision

## Decision

**GITHUB_PACKAGES_MIRROR_DEFERRED_BY_DESIGN**

## Rationale

GitHub Packages npm registry requires a scoped package identity (`@subodhkc/ai-appsec`), while the canonical npmjs identity is unscoped (`ai-appsec`). Publishing to GitHub Packages would:

1. **Fragment package identity** — users would need to know two different package names for the same tool
2. **Increase install friction** — GitHub Packages requires authentication even for public packages (npmrc configuration with a PAT)
3. **Duplicate release maintenance** — every release would need to publish to both registries, doubling the release surface
4. **No incremental discovery benefit** — the GitHub Release already satisfies GitHub-native distribution, and the Official MCP Registry provides canonical discovery
5. **No enterprise/private-registry benefit** — the package is public MIT; GitHub Packages adds no value for public packages over npmjs

The GitHub Release at https://github.com/subodhkc/ai-appsec/releases/tag/v0.1.0 already provides:
- Release notes
- Source tarball
- Canonical SHA-256
- npm install instructions

## Future Trigger

GitHub Packages mirror would be enabled if:
- Enterprise users request a private registry mirror behind their firewall
- GitHub Packages removes the scoped-package requirement for public packages
- A concrete enterprise customer requires GitHub-native package installation

## Safe Workflow Architecture (If Later Needed)

If enabled in the future:
1. Create a separate scoped package `@subodhkc/ai-appsec` on GitHub Packages
2. Add a separate workflow job that publishes the same tarball to GitHub Packages
3. Document both install paths clearly in README
4. Never change the canonical npmjs package name
