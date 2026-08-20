# RC2 Preparation Decision

## Phase 4C-C — Part 19

## Can RC2 Be Prepared Now?

**NO — not yet.**

RC2 cannot be prepared because unresolved human license/copyright decisions
still affect package bytes.

## Blocking Human Decisions

The following decisions MUST be resolved before RC2 can be prepared,
because they affect files included in the npm tarball:

1. **Package license** (Decision 1) — affects `package.json` `license` field,
   `LICENSE` file, `README.md` license section, `THIRD_PARTY_NOTICES.md`,
   `TRADEMARKS.md`

2. **Public Core license** (Decision 2) — affects `THIRD_PARTY_NOTICES.md`,
   rulepack manifest metadata

3. **Copyright owner** (Decision 3) — affects `LICENSE` file,
   `package.json` `author` field

4. **Whether current public RC MIT exposure was intentional** — affects
   whether LICENSE file stays MIT or changes

## What CAN Be Prepared Now (Repository-Only Changes)

The following changes do NOT affect package bytes and can be committed
without waiting for human decisions:

- `SECURITY.md` post-release-ready wording
- `docs/evidence/phase-4c-c/` governance evidence documents

However, per phase instructions, even these should wait until the phase
report is delivered and the founder reviews the decisions.

## Automatable Public-Contract Corrections (Ready to Apply After Decisions)

Once human decisions are made, the following automatable corrections
will be applied to create RC2:

1. `package.json` — description, license, repository, homepage, bugs, author, keywords
2. `README.md` — full reconciliation per README-RECONCILIATION.md
3. `LICENSE` — confirm or replace
4. `THIRD_PARTY_NOTICES.md` — resolve MIT contradiction
5. `TRADEMARKS.md` — resolve MIT contradiction
6. `SECURITY.md` — post-release-ready wording

## RC2 Branch Name

```
release/mcp-v0.1.0-rc2
```

## Status

**RC2_NOT_YET_PREPARED** — Waiting for human decisions on license,
copyright, and MIT exposure intention.
