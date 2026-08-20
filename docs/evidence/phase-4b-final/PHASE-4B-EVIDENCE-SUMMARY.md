# Phase 4B Final Evidence Summary (C2R RECONCILIATION)

> **Status:** TECHNICALLY_READY_FOR_PHASE_4C — all local mandatory C2R
> reconciliation gates passed. Package is NOT yet ready for public release.
> Offline firewall-level isolation test and remote OS testing remain
> explicit Phase 4C blockers. Historical reports remain as evidence and
> are not overwritten — see RETIREMENT-LEDGER.md for supersession.

## Prior status correction

The prior C2R report stated both `PHASE_4B_C2_PARTIAL` and "GO for Phase 4C"
simultaneously, which was contradictory. This reconciliation corrects that
contradiction. The prior status `PHASE_4B_C2_PARTIAL` was truthful; the
"GO" language was not. After this reconciliation pass, all local mandatory
gates have passed, and the correct status is `TECHNICALLY_READY_FOR_PHASE_4C`
(local mandatory gates only).

## What was tested (C2R RECONCILIATION)

- Accounting reconciliation with 5 hard invariants (raw = accepted + unmapped,
  accepted = canonical + dupes, canonical = scoped + suppressed,
  scoped = actionable + observations, concernSum = actionable)
- Security Concern Family terminology correction (concern family ≠ material
  issue, ≠ vulnerability, ≠ root cause)
- Concern Priority v0.1 review (deterministic lexicographic, no evidence-strength
  dimension — the evidence model does not support it)
- Rule quality fix: `api-key-in-error-js/python` missing `metavariable-regex`
  constraint caused 803 false positives (93% FPR for that check)
- Immutable Kestrel snapshot via `git worktree add --detach` (5528 files,
  0 untracked, 0 dirty — truly immutable, not dirty working tree)
- Full unbounded Kestrel forensics (not bounded output)
- High-volume detector quality review (top 5 families inspected)
- Parser error classification (102 errors, all Semgrep limitations, 0 genuine
  syntax errors)
- Proof-of-fix check-evaluation safety (scenario 14: NOT_VERIFIABLE when
  security check was not evaluated in rescan)
- Three-run Kestrel determinism on immutable snapshot (finding-level PASS)
- Direct vs actual npm tarball equivalence (EXACT_MATCH)
- Architecture spec DRAFT_REFERENCE status
- Report terminology update (concern family, not material issue)

## What actually passed (C2R RECONCILIATION)

- 239 tests, 0 fail, typecheck clean
- 5 accounting invariants: ALL PASS
- Kestrel scan (immutable snapshot, post-rule-fix):
  - rawEngineMatches: 859
  - detectorInstancesAccepted: 859
  - canonicalFindingInstances: 859
  - scopedFindingInstances: 848
  - actionableFindingInstances: 798
  - observationInstances: 50
  - concernFamiliesFound: 13
  - concernFamilyInstanceSum: 798 (matches actionable)
- Parser errors: 102 (99 TSX parser limitation, 2 encoding errors, 1 Semgrep edge case)
- Three-run determinism: finding-level PASS (all 23 finding-level fields match)
  - filesSkippedByEngine varies (108, 103, 106) — Semgrep operational non-determinism
- Direct vs tarball: EXACT_MATCH (all 15 fields identical)
- Proof-of-fix: 24 tests passing (scenario 14 now correctly returns NOT_VERIFIABLE)
- Tarball SHA-256: `sha256:5dd04958dfa89b2c94961afbfe3fb424ec18737a1d96b183f7c3121c1cebc903`

## What remains unverified (Phase 4C blockers)

- Offline firewall-level isolation test: PARTIALLY_VERIFIED (source inspection only)
- Remote Linux/macOS: UNVERIFIED
- Final legal/provenance review: pending
- npm publication decision: pending
- MCP Registry decision: pending
- Remove private:true for publication: pending

## Key digests (C2R RECONCILIATION)

- Public Core rulepack: `sha256:013e2da09d22ceb9786109a2c04f82a80288213a42427d85c1a301ad5640289e`
- Public Core manifest: `sha256:6d68142fd91210fbd5da4c802ad3f3613c45e4bb0ae595444a00991f22724699`
- Rulepack version: `0.1.0-rc.6-public-core`
- Kestrel file-set digest: `sha256:c6b73e45046c40454c2f3ad985a4c1ff18833197a4df4c565d5c5df0cb72a5b2`
- Kestrel immutable export: `git worktree add --detach C:\ks 0f131ea63...`
- Tarball SHA-256: `sha256:5dd04958dfa89b2c94961afbfe3fb424ec18737a1d96b183f7c3121c1cebc903`
- Semgrep executable SHA-256: `sha256:ce1c79aff9eed4d79163e73450d621eb5a5e829af920425efe43f9796a7e7ed0`
- Kestrel full forensics: `sha256:7c6d8ede5b16bd4faa61e695813e651fe8a243e19faaf2df4c90049355aa3c1b`
- Parser error classification: `sha256:1d5c6a782a733fd9a4558c493d1fe9acf3bce94460cc3c1546b7b1a9719b7394`
- Three-run determinism: `sha256:94f43c5316fbf83d5b502514cb5730c9a7358b012342763abc5df0ffe1ec2aa4`
- Direct vs tarball: `sha256:5b5fd5fbc3cf87fdc3fd5ca32cc3a24e74f3f7611a45500d407b7bb4e0bb7524`

## Superseded digests (from prior C2R — see RETIREMENT-LEDGER.md)

- Prior rulepack: `sha256:33b4a0dd...` (SUPERSEDED — rule fix)
- Prior manifest: `sha256:0f9247ab...` (SUPERSEDED — version bump)
- Prior evidence index: `sha256:63aa097b...` (SUPERSEDED — all evidence changed)

## Provenance correction (unchanged from prior C2R)

Previous claim of "122/122 HAIEC_ORIGINAL" was based on external non-similarity
search alone. External non-similarity is useful evidence but is not independent
proof of authorship. Corrected classification:
- originEvidence: STRONG (based on Phase 2.5 records and external similarity check)
- licenseDisposition: HAIEC_CAN_LICENSE (subject to final legal review in Phase 4C)

Final legal review remains Phase 4C.

## Product-unification defects (verified, unchanged)

11 defects verified by read-only inspection of HAIEC main repo:
- 3 P0 defects (engine ID mismatch, evidence truncation, fabricated 50% coverage)
- 6 P1 defects (coarse dedup, empty evidence refs, weak outputHash, Date.now() freshness, separate scoring, zero-rules-means-PASS)
- 2 P2 defects (dead compliance engine, native CFG gap)

These defects are in the HAIEC main repository, NOT in this MCP repository.
They are documented but NOT fixed in this phase (read-only repo).

See `product-unification-defects.md` for full evidence.
See `docs/architecture/RETIREMENT-LEDGER.md` for retirement candidates and superseded evidence.
See `docs/HAIEC-MASTER-ROADMAP.md` for Platform U0-U8 repair sequence.
