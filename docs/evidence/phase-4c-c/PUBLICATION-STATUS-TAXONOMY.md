# Publication Status Taxonomy

## Phase 4C-C — Correct Status Model

The repository is public. The release-candidate branch has been pushed.
Therefore the project is NOT simply "NOT_PUBLISHED" — that loses an
important distinction.

## Current Status Fields

| Field | Value | Meaning |
|-------|-------|---------|
| sourceRepositoryVisibility | PUBLIC | The GitHub repository `subodhkc/haiec-ai-agent-security-free-mcp` is publicly accessible |
| releaseCandidateSourceVisibility | PUBLIC | The branch `release/mcp-v0.1.0-rc1` is pushed to the public repository |
| npmPublicationStatus | NOT_PUBLISHED | No package has been published to the npm registry |
| mcpRegistryPublicationStatus | NOT_PUBLISHED | No server.json has been submitted to the MCP Registry |
| githubReleaseStatus | NOT_CREATED | No GitHub Release has been created |
| mainMergeStatus | NOT_MERGED | The RC branch has not been merged to Main |
| finalTagStatus | NOT_CREATED | No final version tag has been created |

## Key Distinction

Pushing a branch to a public GitHub repository makes that source
publicly accessible even though no package-registry release has occurred.

The source code on `release/mcp-v0.1.0-rc1` is publicly readable.
The npm package has not been published.

These are different states. Do not call this private/unpublished source.
Do not call this a published package.

The correct description is:

> "Source repository is public. Release-candidate source is public.
> npm package is NOT published. MCP Registry entry is NOT published.
> No GitHub Release. No merge to Main. No final tag."
