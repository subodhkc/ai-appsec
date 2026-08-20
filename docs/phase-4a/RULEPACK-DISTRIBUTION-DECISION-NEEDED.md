# Rulepack Distribution — Decision Needed

## Status: DECISION NEEDED

The private HAIEC rc.5 rulepack bodies must not be published to the public
repository. Phase 4A introduced a rulepack provider abstraction that
allows runtime resolution via `HAIEC_RULEPACK_PATH` / `HAIEC_MANIFEST_PATH`,
but the long-term distribution mechanism has not been decided.

## Options

### Option A: Bring-your-own-rulepack

Users provide their own Semgrep rulepack. HAIEC publishes only the scanner
infrastructure. Users point `HAIEC_RULEPACK_PATH` at their own YAML.

- **Pro**: No private rule distribution needed. Simplest.
- **Con**: Users don't get HAIEC's curated rules. Less value.

### Option B: Signed private bundle

HAIEC distributes a signed, encrypted bundle through a private channel
(e.g., HAIEC SaaS download, private npm package, or license-key-gated
endpoint). The scanner verifies the signature before use.

- **Pro**: Users get HAIEC's curated rules. Rules remain private.
- **Con**: Requires distribution infrastructure. License management.

### Option C: Public rules with private extensions

HAIEC publishes a base rulepack publicly. Advanced rules remain private
and are distributed via Option B.

- **Pro**: Public users get immediate value. Private users get more.
- **Con**: Two-tier rulepack complexity.

### Option D: HAIEC SaaS only

Rules are only available through the HAIEC SaaS product. The open-source
scanner is a runtime that connects to HAIEC SaaS for rules.

- **Pro**: Simplest distribution. Strong SaaS value.
- **Con**: Not "local" anymore. Requires network. Contradicts "local means local."

## Recommendation

Defer to Phase 4B. The current abstraction supports any of these options
without code changes. The decision should be made with business and
licensing input, not engineering input alone.

## Current state

- Scanner works with any valid Semgrep rulepack + HAIEC manifest
- Tests use synthetic rulepack (no proprietary bodies)
- Private bundle is gitignored
- No private rule bodies committed
