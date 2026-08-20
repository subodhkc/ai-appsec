# Evidence Sanitization Report — C2R Final

> **Date:** 2026-09-17
> **Status:** Complete

---

## Sanitization Rules

| Pattern | Replacement |
|---------|-------------|
| `C:\Users\Subodh Kc\...` | `<HAIEC_HOME>` |
| Absolute target paths | `<TARGET_ROOT>` |
| Temp directory paths | `<TEMP_ROOT>` |
| Usernames | Removed/replaced |
| Private rule-body contents | Not present in evidence |

---

## Artifacts Audited

| Artifact | Contains absolute paths? | Contains usernames? | Sanitized? |
|----------|------------------------|---------------------|------------|
| c1r-scans.json | No | No | N/A (clean) |
| direct-vs-packaged-equivalence.json | No | No | N/A (clean) |
| kestrel-qualification.json | No (already sanitized in script) | No | N/A (clean) |
| kestrel-qualification-report.md | No | No | N/A (clean) |
| offline-proof.md | No | No | N/A (clean) |
| product-unification-defects.md | No | No | N/A (clean) |
| public-core-provenance.json | No | No | N/A (clean) |
| reuse-audit.md | No | No | N/A (clean) |
| runtime-matrix.md | No | No | N/A (clean) |
| semgrep-fingerprint.json | No (sanitized in script) | No | N/A (clean) |
| **three-run-determinism.json** | **Yes** | **Yes** | **YES — sanitized** |
| timeout-process-tree.json | No (sanitized in script) | No | N/A (clean) |

---

## Sanitized Artifacts

### three-run-determinism.json

- **Before:** Contained `C:\Users\Subodh Kc\Desktop\...` in `target` field
- **After:** Replaced with `<HAIEC_HOME>\Desktop\...`
- **Status:** CLEAN — no usernames or absolute home paths remain

---

## Superseded Artifacts

No artifacts were marked as SUPERSEDED in this phase. All prior evidence
remains valid. The evidence index will be regenerated as the final artifact.

---

## SHA-256 Verification

All evidence artifacts will receive SHA-256 digests in the regenerated
evidence index (the final phase artifact).
