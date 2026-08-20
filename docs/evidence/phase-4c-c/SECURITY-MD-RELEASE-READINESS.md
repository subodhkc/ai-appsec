# SECURITY.md Release Readiness

## Phase 4C-C — Part 11

## Current State

SECURITY.md says "pre-release and under active development. No security
guarantee is provided at this stage."

## Issues

1. After publication, v0.1 IS a supported version. Calling it "pre-release"
   after publication is contradictory.
2. The policy does not clearly state which versions are supported.
3. GitHub Security Advisory / private reporting availability is mentioned
   conditionally ("if available") — should be verified and stated clearly.
4. Response expectations are vague.

## Post-Release-Ready Policy Wording (Prepared, NOT Applied)

The following wording is prepared for RC2. It should NOT be applied until
publication is authorized.

### Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x | YES (current release) |
| < 0.1 | NO (pre-release) |

### Reporting a Vulnerability

1. **Do not disclose publicly** before review.
2. Use [GitHub private vulnerability reporting](https://github.com/subodhkc/haiec-ai-agent-security-free-mcp/security/advisories/new).
3. For non-sensitive bugs, use [GitHub Issues](https://github.com/subodhkc/haiec-ai-agent-security-free-mcp/issues).

### Scope

- This policy applies only to the `haiec-ai-agent-security-free-mcp` repository.
- Related repositories (LLMVerify, Tenant Isolation, HAIEC website) have
  their own security policies.
- Vulnerabilities in Semgrep itself should be reported to Semgrep, Inc.

### Bounty

No bug bounty program exists at this time.

### Response Expectations

This project is maintained by a small team. We aim to acknowledge reports
within 5 business days. We appreciate responsible disclosure and patience.

## Verification Required Before Publication

- [ ] Verify GitHub private vulnerability reporting is enabled for the repository
- [ ] Confirm the security/advisories URL works
- [ ] Confirm no SLA or bounty is promised that doesn't exist

## Status

**PREPARED** — Not applied. Will be applied in RC2.
