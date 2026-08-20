# Phase 4B — IP/Provenance Model

## Principles

- Do NOT attempt hidden malware-like watermarking
- Do NOT add hidden code behavior
- No secret identifier should affect rule behavior

## Legitimate provenance mechanisms

For source-visible Public Core:

| Mechanism | Purpose |
|-----------|---------|
| Copyright headers | Attribution |
| Canonical HAIEC detector IDs | Identification |
| Canonical securityCheckIds | Identification |
| Manifest digests | Integrity verification |
| Rulepack digest | Integrity verification |
| Version identifiers | Provenance tracking |
| HAIEC namespace strings | Attribution |
| Source provenance records | Audit trail |
| Package provenance | Supply chain |
| Signed manifest (future) | Authenticity |
| NOTICE/license files | Legal |

## What these do NOT do

They do not prevent copying. They strengthen:
- Attribution
- Provenance
- Forensic comparison
- Licensing enforcement

## No hidden signatures

No hidden behavioral watermark. No secret identifier affects rule behavior.
All rule behavior is deterministic and inspectable.
