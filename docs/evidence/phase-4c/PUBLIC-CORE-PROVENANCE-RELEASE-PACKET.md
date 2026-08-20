# Public Core Provenance Release Packet (rc.6)

> Phase 4C-A — Provenance and license review for the rc.6 Public Core rulepack.

## rc.6 Rulepack Identity

- **Rulepack version:** `0.1.0-rc.6-public-core`
- **Rulepack SHA-256:** `sha256:013e2da09d22ceb9786109a2c04f82a80288213a42427d85c1a301ad5640289e`
- **Manifest SHA-256:** `sha256:2117f9b97865a42d57a3b0c44bea7e3d7171cbf9d6591c8c728421118b13327a`
- **Detector count:** 122
- **Security check count:** 79

## Changed Detectors Since rc.5

Two detectors were materially changed during C2R:

### 1. `api-key-in-error-python`
- **Change:** Added `metavariable-regex` constraint to require API-key-like variable names
- **Before (rc.5):** Matched any `raise Exception(..., $API_KEY, ...)` without constraint
- **After (rc.6):** Requires `$API_KEY` to match `(?i).*(api_key|apikey|api-key|secret|token|password|passwd|credential|private_key|access_key|auth_token).*`
- **Revision field:** Updated from `rc.5` to `rc.6`
- **Provenance:** `HAIEC_ORIGIN` (unchanged)
- **License disposition:** `HAIEC_CAN_LICENSE` (unchanged — HAIEC-originated rule)

### 2. `api-key-in-error-js`
- **Change:** Same metavariable-regex constraint as Python variant
- **Before (rc.5):** Matched any `throw new Error(..., $API_KEY, ...)` without constraint
- **After (rc.6):** Same regex constraint as Python variant
- **Revision field:** Updated from `rc.5` to `rc.6`
- **Provenance:** `HAIEC_ORIGIN` (unchanged)
- **License disposition:** `HAIEC_CAN_LICENSE` (unchanged — HAIEC-originated rule)

## Provenance Distribution (all 122 detectors)

| Provenance | Count |
|------------|-------|
| `HAIEC_ORIGIN` | 122 |

All detectors are HAIEC-originated. No third-party rules are included.

## License Disposition Summary

| Disposition | Count | Description |
|-------------|-------|-------------|
| `HAIEC_CAN_LICENSE` | 122 | HAIEC-originated, can be licensed under final package license |
| `ATTRIBUTION_REQUIRED` | 0 | None |
| `REVIEW_REQUIRED` | 0 | None — no publication blocker |

## Origin Evidence

| Evidence Level | Count |
|----------------|-------|
| `STRONG` | 122 | All detectors have HAIEC-origin provenance in manifest |

## Attribution Obligations

None. All 122 detectors are HAIEC-originated with no third-party attribution requirements.

## Unresolved Legal Questions

1. **Final license selection** — remains a founder/IP decision. The repository
   currently has no license file. This is a publication blocker but NOT a
   Phase 4C-A local qualification blocker.

2. **Semgrep dependency licensing** — Semgrep 1.173.0 is distributed under the
   Semgrep License (not OSI-approved for all uses). The MCP package depends on
   Semgrep as an external executable, not as a bundled dependency. Users must
   obtain Semgrep separately. This is a documentation obligation, not a code
   obligation.

## Changed-Detector Coverage Verification

The two changed detectors (`api-key-in-error-js`, `api-key-in-error-python`):
- Remain `HAIEC_ORIGIN` provenance ✓
- Remain `PUBLIC_READY` candidate status ✓
- Remain `PUBLIC_READY` public status ✓
- Have updated `revision: "rc.6"` ✓
- Have `HAIEC_CAN_LICENSE` disposition ✓

## Conclusion

**Provenance status:** `HAIEC_CAN_LICENSE` for all 122 detectors.
**REVIEW_REQUIRED:** 0 detectors.
**Publication blocker:** None from provenance perspective.

**Windsurf does NOT provide final legal approval.**
Final human/founder/legal approval remains external.
