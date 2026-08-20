# 15 — Evidence Architecture Reuse Assessment

> **Phase -1 forensic document.** Reviews existing HAIEC evidence/fingerprint
> architecture for reuse in the Scan Receipt.

---

## Existing Implementations

### 1. `lib/audit-orchestrator/fingerprint.ts`

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| Canonical JSON | `canonicalizeForHash()` with `sortedReplacer` — sorts keys recursively | `fingerprint.ts:26-43` |
| SHA-256 | Uses `sha256()` from `lib/audit/hash.ts` | `fingerprint.ts:12` |
| Hash-chained event log | `computeEventHash()`, `verifyEventChain()` | `fingerprint.ts:129-228` |
| Config snapshot hashing | `hashConfigSnapshot()` | `fingerprint.ts:85-88` |
| Run fingerprint | `computeRunFingerprint()` = SHA-256(configHash + sorted(engineOutputHashes)) | `fingerprint.ts:100-116` |
| Engine output hashing | `hashEngineOutput()`, `hashEngineOutputFields()` | `fingerprint.ts:53-67` |
| Audit pack fingerprint | `computeAuditPackFingerprint()` = SHA-256(runFp + eventLogFinalHash) | `fingerprint.ts:250-260` |
| Determinism | **DETERMINISTIC** — no timestamps in hash inputs | VERIFIED |
| Prisma coupling | NONE — pure functions | VERIFIED |
| Working tree state | **NOT INCLUDED** — no file manifest, no diff hash | GAP |
| File manifest | **NOT INCLUDED** | GAP |

**Classification: REUSE_IMPLEMENTATION**

The `canonicalizeForHash` + `sortedReplacer` pattern is directly reusable for
the Scan Receipt's deterministic digest. The hash-chained event log is reusable
for tamper-evident scan audit trails.

**Gaps to fill:**
- No file manifest hash (list of files considered/scanned/excluded)
- No diff hash (for incremental scans)
- No working tree dirty state
- No engine version / rulepack version in the hash inputs

---

### 2. `lib/safety/evidence-integrity.ts`

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| Content hash | SHA-256 of file content | `evidence-integrity.ts:39` |
| Composite hash | HMAC-SHA256 of `contentHash:fileSize:userId:uploadTimestampStr` | `evidence-integrity.ts:44-47` |
| Timestamp in hash | **YES — NOT DETERMINISTIC** | `evidence-integrity.ts:44` |
| User-specific | HMAC with `EVIDENCE_HMAC_SECRET` | `evidence-integrity.ts:15,45` |
| Prisma coupling | `import { prisma }` — used for duplicate detection | `evidence-integrity.ts:12,99` |
| Insecure default | `EVIDENCE_HMAC_SECRET` defaults to `'default-evidence-secret-change-in-production'` | `evidence-integrity.ts:15` |

**Classification: REUSE_CONCEPT**

The collision-resistant identity concept (hash + size + user + timestamp) is
interesting for evidence integrity, but:
- NOT deterministic (timestamp varies) — cannot reproduce across reruns
- Prisma-coupled — cannot move to open source
- User-specific — not applicable to local scanner (no user concept)
- Insecure default secret

**Reusable concept:** Multi-field composite hash for collision resistance.
**Do NOT reuse implementation.**

---

### 3. `lib/scoring/deterministic-engine.ts`

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| CURRENT_RULE_VERSION | `2025.1.0` | `deterministic-engine.ts:14` |

**Classification: UNKNOWN** — not fully audited. May contain scoring logic relevant
to finding confidence. Flagged for later review.

---

## Scan Receipt Deterministic Digest Design (concept — NOT implemented)

The Scan Receipt needs a **deterministic digest** that:
1. Reproduces across identical reruns (same code, same rules, same config → same digest)
2. Excludes observational metadata (timestamps, duration, execution IDs)
3. Includes all inputs that affect the result

### Deterministic content (enters the digest)

| Field | Why |
|-------|-----|
| `engineVersion` | Different engine versions may produce different findings |
| `rulepackVersion` | Different rulepack versions may produce different findings |
| `rulepackHash` | Exact rulepack content |
| `policyVersion` | Different policy versions may change verdicts |
| `fileManifestHash` | Which files were considered (set of relative paths + content hashes) |
| `diffHash` | For incremental scans, the diff being scanned |
| `scope` | What scope was scanned (full, diff, specific files) |
| `config` | Scanner configuration (severity filters, rule filters, etc.) |
| `normalizedFindings` | Canonicalized finding set (rule IDs + locations + severities, NO raw source) |

### Observational metadata (does NOT enter the digest)

| Field | Why excluded |
|-------|-------------|
| `timestamp` | Varies per run |
| `duration` | Varies per run |
| `executionId` | Unique per run |
| `hostName` | Environment-specific |
| `userName` | Environment-specific |

### Formula (concept)

```
resultDigest = SHA-256(canonicalize({
  engineVersion,
  rulepackVersion,
  rulepackHash,
  policyVersion,
  scope,
  config,
  fileManifestHash,
  diffHash,
  normalizedFindings
}))
```

Two scans with identical inputs produce the same `resultDigest`. Any change to
rules, code, or config produces a different digest.

---

## Classification Summary

| Concept | Classification | Action |
|---------|----------------|--------|
| Canonical JSON serialization | REUSE_IMPLEMENTATION | Copy `canonicalizeForHash` + `sortedReplacer` pattern |
| SHA-256 hashing | REUSE_IMPLEMENTATION | Standard crypto, no special implementation needed |
| Hash-chained event log | REUSE_IMPLEMENTATION | Copy `computeEventHash` + `verifyEventChain` pattern |
| Config snapshot hashing | REUSE_IMPLEMENTATION | Copy `hashConfigSnapshot` pattern |
| Run fingerprint | REUSE_IMPLEMENTATION | Copy `computeRunFingerprint` pattern, extend with file manifest |
| Composite hash with timestamp | REJECT | Not deterministic; timestamp must not enter digest |
| HMAC with user-specific secret | REJECT | Not applicable to local scanner; no user concept |
| Evidence integrity (Prisma-coupled) | REJECT | Cannot move to open source; Prisma-coupled |
| File manifest hash | REIMPLEMENT | Does not exist; must be built |
| Diff hash | REIMPLEMENT | Does not exist; must be built |
| Working tree dirty state | REIMPLEMENT | Does not exist; must be built |
| Normalized findings in digest | REIMPLEMENT | Must define canonical finding format |
