# Phase 4A — Agent Output

## Output bounds (Phase 4A tight bounds)

| Bound | Value |
|-------|-------|
| Actionable findings returned | 20 |
| Observations (PRESENCE) returned | 10 |
| Serialized response max | 48KB (49152 bytes) |

## Truncation behavior

When findings exceed caps:
- `truncated: true` is set
- `actionableReturned` shows how many actionable findings are in the response
- `actionableTotal` shows the exact total (not just the returned count)
- `observationsReturned` and `observationsTotal` same for observations
- No silent discard — totals always reflect the true count

## PRESENCE routing

`PRESENCE` findings are routed to `observations[]`, not `actionableFindings[]`.
This separates "this thing exists" from "this thing is a problem."

## Prioritization algorithm

1. `BLOCK` disposition first, then `REVIEW`, then `INFORMATIONAL`
2. Within disposition: `VULNERABILITY` > `CONTROL_GAP` > `RISK_SIGNAL` > `PRESENCE`
3. Within kind: `CRITICAL` > `HIGH` > `MEDIUM` > `LOW` > `INFO`
4. Tie-breakers: `securityCheckId` (asc), `relativePath` (asc), `startLine` (asc), `evidenceHash` (asc)

## Advisory verdict

The verdict is advisory, not enforcement:
- `BLOCK` verdict = "a BLOCK finding exists; review before proceeding"
- The tool does NOT deploy, block production, or enforce any gate
- `check_deploy_security` (future) owns release enforcement

## Raw findings persistence

Raw finding data is NOT described as durably persisted. The output is
ephemeral — it exists only in the scan response. Future phases may add
Scan Receipt persistence.

## Path sanitization

- All paths in output are repository-relative
- No absolute paths
- Windows backslashes converted to forward slashes

## Secret redaction

- Messages are redacted using `redactSecrets()` from `secret-redaction.ts`
- AWS keys, GitHub tokens, OpenAI keys, private keys, bearer tokens,
  passwords, and generic secret assignments are redacted
- Redacted values replaced with `[REDACTED_*]` tags
