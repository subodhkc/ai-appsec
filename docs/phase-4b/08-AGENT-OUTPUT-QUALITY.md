# Phase 4B — Agent Output Quality

## Current output design

- **structuredContent**: Full structured JSON (findings, summary, versions)
- **TextContent**: Compact human-readable summary (verdict, counts, top 5 findings)
- **Total response**: ~17KB on medium repos (well within 48KB bound)

## Finding concentration

On anthropic-sdk-python: 379 actionable findings from ~10 security checks.
With 20-finding cap, the top checks dominate the response.

## Diversity-aware bounding (NOT implemented in Phase 4B)

The current design uses strict prioritization (BLOCK > REVIEW > VULNERABILITY
> CONTROL_GAP > RISK_SIGNAL > severity > path > line). This means if one
check produces 100 findings, it may consume all 20 slots.

A future improvement could implement diversity-aware bounding:
- First prioritize security checks
- Then limited representative findings per check (e.g., 5 per check)
- Preserve exact total instance counts in summary

This is deferred to Phase 4C because:
1. The current output is functional and useful
2. `actionableTotal` in summary preserves the true count
3. The agent can see which checks are most prevalent
4. Implementing grouping changes the output contract

## Finding instance grouping (NOT implemented)

Presentation grouping (grouping repeated instances of one security check)
is separate from semantic normalization. Normalization answers "is this the
same finding?" Grouping answers "how should repeated instances be summarized?"

Grouping is deferred because:
1. It changes the output contract
2. The current per-finding output is more precise
3. Agents can aggregate themselves from structuredContent
