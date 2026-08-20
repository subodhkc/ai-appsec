# Public RC License Exposure Review

## Phase 4C-C

## Factual Exposure State

| Field | Value |
|-------|-------|
| Public branch | `release/mcp-v0.1.0-rc1` |
| Branch pushed date | 2026-08-20 |
| LICENSE file present | YES |
| License text | MIT License |
| Copyright line | "Copyright (c) 2026 HAIEC" |
| Affected source tree | Entire repository at commit `b8a3ff7` |
| Repository visibility | PUBLIC |
| GitHub URL | https://github.com/subodhkc/haiec-ai-agent-security-free-mcp/tree/release/mcp-v0.1.0-rc1 |

## What Happened

1. The LICENSE file (MIT, Copyright HAIEC) was committed in `b0eac0e`
   on 2026-08-20.
2. The branch `release/mcp-v0.1.0-rc1` was pushed to the public
   GitHub repository on 2026-08-20.
3. The LICENSE file is publicly accessible to anyone who visits the
   repository or clones the branch.
4. The README simultaneously says "License decision pending" —
   creating a public contradiction.

## Questions for Human/Legal Review

1. **Was this intentional?** Was it intended to push the MIT LICENSE
   to a public branch before the license decision was finalized?

2. **If intentional:** Confirm MIT as the license and proceed with
   consistency corrections (add `license` to package.json, update README).

3. **If NOT intentional:** What remediation is desired?
   - Option A: Replace LICENSE with the intended license on RC2
   - Option B: Remove LICENSE until the decision is finalized
   - Option C: Leave as-is and accept the MIT exposure
   - Note: Git history retains the MIT text regardless. Legal counsel
     should advise on implications of prior public exposure.

4. **Recipient rights:** If MIT was publicly available, recipients who
   obtained the source during that period may have acquired MIT rights.
   A human/legal reviewer should determine whether this creates
   revocability concerns.

## Engineering Position

Engineering flagged this exposure but **does not make a definitive
legal conclusion about revocability or prior recipient rights.**

The factual state is: MIT LICENSE text was publicly accessible on the
RC branch from 2026-08-20 onward. The README contradicted this by
saying "license decision pending."

## Status

**HUMAN_REVIEW_REQUIRED** — Founder/legal must determine:
- Whether the MIT exposure was intentional
- What remediation (if any) is needed
- Whether prior recipients acquired rights
