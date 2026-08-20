# 04 — Rule Versioning

## ruleRevision

Every detector starts at `ruleRevision: 1` upon migration.

### When to Increment

A revision MUST increment when:

- Matching semantics change (pattern altered to match different code)
- Severity meaning changes materially
- `findingKind` changes
- `defaultDisposition` changes
- Remediation meaning changes materially

### When NOT to Increment

- Cosmetic changes to messages (typos, wording)
- Metadata additions that don't change detection behavior
- Compliance mapping additions/removals

### Rules

1. Never reuse an existing revision number after a semantic change
2. Revisions are per-detector, not per-check
3. Revisions are monotonic — they only increase
4. The initial migration sets all detectors to revision 1

## Current State

All 121 detectors are at `ruleRevision: 1` for the initial migration candidate `0.1.0-candidate.1`.

## Future Process

When a detector is improved in a future phase:

1. Increment its `ruleRevision`
2. Document the change in a revision log
3. Update the candidate manifest
4. Re-run parity tests against the golden corpus
