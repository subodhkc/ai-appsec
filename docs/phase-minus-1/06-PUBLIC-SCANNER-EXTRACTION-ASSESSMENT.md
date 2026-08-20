# 06 — Public Scanner Extraction Assessment

> **Phase -1 forensic document.** Assesses whether the existing HAIEC scanner
> components can be reused in the public open-source repo. No code changed.

---

## Components Assessed

### 1. `modal_ai_security_scanner.py` (Modal FastAPI scanner)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **DO_NOT_REUSE** | 5500+ line Modal-coupled FastAPI app |
| Modal coupling | Hard coupling: `import modal`, `modal.App("haiec-ai-security-scanner")` | Line 18, 35 |
| Database coupling | `asyncpg==0.29.0` — direct Postgres access | Line 63 |
| Network coupling | `httpx==0.25.2` — HTTP client | Line 67 |
| Auth coupling | `SCANNER_API_KEY` env var, `MODAL_TOKEN_ID/SECRET` | `.env.example:96,85-86` |
| Semgrep version | Pinned `semgrep==1.52.0` | Line 64 |
| Rule loading | Loads `semgrep_rules.yaml` from Modal volume | (inferred from Modal image setup) |
| Finding normalization | In-file severity mapping, rule_id mapping | Lines 1017+ (severity definitions) |

**Verdict: DO_NOT_REUSE.** This is a private infrastructure component deeply
coupled to Modal, Postgres, and HAIEC auth. The new public scanner should be a
fresh TypeScript implementation that runs Semgrep locally via subprocess or
the Semgrep CLI, without Modal/Postgres/auth dependencies.

**Reusable concepts:** Severity mapping ontology, rule_id display mapping,
compliance framework mapping (the metadata schema, not the code).

---

### 2. `public-repo-scanner/` (Python CLI scanner)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **REUSE_AFTER_FIX** (concepts only, not code) | Python; new repo is TypeScript |
| Language mismatch | Python; new repo is TypeScript/Node | — |
| `--config=auto` fallback | **YES — RISK**: Falls back to generic Semgrep rules if HAIEC rules not found | `analyzer.py:54` |
| Network requests | GitHub API only (controlled) | `fetcher.py`, `github_client.py:55` |
| Subprocess handling | Runs Semgrep via subprocess; does NOT run target repo code | `analyzer.py:95,104,131,160` |
| Unsafe subprocess | Uses `subprocess.run` with list args (not shell=True) — reasonably safe | `analyzer.py:160` |
| Trusts arbitrary paths | Runs on fetched repo dirs in temp | `analyzer.py:26-31` |
| Follows symlinks | Not explicitly handled | UNKNOWN |
| Returns raw source snippets | **YES — RISK**: `code_snippet = result.get("extra", {}).get("lines", "")` | `analyzer.py:231` |
| Fabricates numeric confidence | **YES — RISK**: Maps HIGH→0.9, MEDIUM→0.7, LOW→0.5, default→0.8 | `analyzer.py:299-311` |
| Runs target repo code | NO — only runs Semgrep on files | VERIFIED |
| Could leak secrets in findings | **YES — RISK**: Raw code snippets may contain secrets | `analyzer.py:249` |
| Prompt injection risk | **YES — RISK**: Raw code snippets returned to caller could contain prompt injection | `analyzer.py:249` |

**Verdict: REUSE_AFTER_FIX (concepts only).** The Python code cannot be directly
reused (language mismatch). The following concepts are reusable but must be fixed:
- **Rule loading:** Remove `--config=auto` fallback. If HAIEC rules not found, FAIL explicitly.
- **Code snippets:** Do not return raw source lines. Return location + sanitized evidence + hash.
- **Confidence:** Remove fabricated numeric values. Use qualitative evidence strength.
- **Symlink handling:** Add explicit symlink rejection.

---

### 3. `lib/ai-security/` (Next.js scanner orchestration)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **DO_NOT_REUSE** | Heavily coupled to Prisma, NextAuth, app context |
| Prisma coupling | Direct `prisma.*` calls in 10+ files | `scan-timeout.ts:50,96,133,168,209`, `scan-state-machine.ts:129,150,239,328,373,401,425`, `scan-intent.ts:51,79,106,121,135,145`, `scan-audit.ts:58,80,111,220,238`, `artifact-storage.ts:62,137,203,234,282,310,341,355,389,410`, `github-token.ts:56`, `consent-enforcement.ts`, `scan-authorization.ts`, `scan-limiter.ts`, `scan-cleanup.ts` |
| NextAuth coupling | References NextAuth OAuth storage (via Prisma accounts table) | `github-token.ts:32` (comment) |
| GitHub OAuth coupling | Tokens retrieved from Prisma `accounts` table | `github-token.ts:56` |
| Modal coupling | References Modal scanner in comments/config | `scan-timeout.ts:11,24` (comments) |

**Verdict: DO_NOT_REUSE.** This is private application orchestration logic. The
new public scanner must be standalone — no Prisma, no NextAuth, no Modal, no
database. It should be a pure function: `scan(projectRoot, options) → ScanResult`.

**Reusable concepts:** Scan state machine concept (but reimplement without DB),
scan audit concept (but log to file/stderr, not DB).

---

### 4. `semgrep_rules.yaml` (the rulepack)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **DO_NOT_PUBLISH_YET** | Provenance unknown — see `05-RULE-PROVENANCE-AUDIT.md` |
| Rule quality | Good metadata (CWE, compliance, severity, category) | `04-RULEPACK-FORENSIC-INVENTORY.md` |
| Rule count | 91 (not 121 as claimed) | VERIFIED |
| License/attribution | NONE | VERIFIED |

**Verdict: DO_NOT_PUBLISH_YET.** Rules cannot be copied until provenance is
established for each rule/rule family.

**Reusable concepts:** Metadata schema (category, cwe, rule_id, compliance_frameworks,
soc2_controls, etc.) — the schema is reusable even if individual rules need provenance work.

---

### 5. `lib/audit-orchestrator/fingerprint.ts` (canonical hashing)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **REUSE_IMPLEMENTATION** | Clean, no Prisma/auth coupling |
| Canonical JSON | `canonicalizeForHash()` with `sortedReplacer` — sorts keys recursively | `fingerprint.ts:26-43` |
| SHA-256 hashing | `sha256()` from `lib/audit/hash.ts` | `fingerprint.ts:12,55,66,74,87,115,144,239,260` |
| Hash-chained event log | `computeEventHash()`, `verifyEventChain()` | `fingerprint.ts:129-228` |
| Config snapshot hashing | `hashConfigSnapshot()` | `fingerprint.ts:85-88` |
| Run fingerprint | `computeRunFingerprint()` — configHash + sorted engine hashes | `fingerprint.ts:100-116` |
| Determinism | Deterministic (no timestamps in hash inputs) | VERIFIED |

**Verdict: REUSE_IMPLEMENTATION.** This is the most reusable component. The
`canonicalizeForHash` + `sortedReplacer` pattern is directly reusable for the
Scan Receipt's deterministic digest. The hash-chained event log is reusable for
tamper-evident scan audit trails.

**Caveat:** Does not include working tree state or file manifest hashing —
must be extended for the Scan Receipt. See `15-EVIDENCE-ARCHITECTURE-REUSE-ASSESSMENT.md`.

---

### 6. `lib/safety/evidence-integrity.ts` (evidence fingerprinting)

| Aspect | Assessment | Evidence |
|--------|------------|---------|
| **Can move to open source?** | **REUSE_CONCEPT** (not implementation) | Coupled to Prisma |
| Prisma coupling | `import { prisma } from '@/lib/prisma'` | `evidence-integrity.ts:12` |
| HMAC secret | `EVIDENCE_HMAC_SECRET` env var with insecure default | `evidence-integrity.ts:15` |
| Timestamp in hash | **YES — NOT DETERMINISTIC**: `compositeData = contentHash:fileSize:userId:uploadTimestampStr` | `evidence-integrity.ts:44` |
| User-specific hashing | HMAC with user-specific secret | `evidence-integrity.ts:45` |

**Verdict: REUSE_CONCEPT.** The collision-resistant identity concept (hash +
size + user + timestamp) is interesting for evidence integrity, but the
implementation is NOT deterministic (timestamp varies) and is Prisma-coupled.
The Scan Receipt needs a deterministic digest that excludes timestamps. See
`15-EVIDENCE-ARCHITECTURE-REUSE-ASSESSMENT.md`.

---

## Summary Table

| Component | Verdict | Reuse |
|-----------|---------|-------|
| `modal_ai_security_scanner.py` | DO_NOT_REUSE | Concepts only (severity ontology, compliance mapping) |
| `public-repo-scanner/` | REUSE_AFTER_FIX | Concepts only (language mismatch); fix: no auto-fallback, no raw snippets, no fabricated confidence |
| `lib/ai-security/` | DO_NOT_REUSE | Concepts only (state machine, audit) — reimplement without DB |
| `semgrep_rules.yaml` | DO_NOT_PUBLISH_YET | Metadata schema reusable; rules blocked by provenance |
| `lib/audit-orchestrator/fingerprint.ts` | REUSE_IMPLEMENTATION | Canonical JSON, SHA-256, hash chain — directly reusable |
| `lib/safety/evidence-integrity.ts` | REUSE_CONCEPT | Collision-resistant identity concept; implementation not deterministic |

---

## Security Issues Found (documented, not fixed)

1. **`public-repo-scanner/analyzer.py:54`** — `--config=auto` fallback could run untrusted generic rules
2. **`public-repo-scanner/analyzer.py:231,249`** — Raw code snippets in findings could leak secrets or deliver prompt injection
3. **`public-repo-scanner/analyzer.py:299-311`** — Fabricated numeric confidence values
4. **`lib/safety/evidence-integrity.ts:15`** — Insecure default HMAC secret
5. **`lib/safety/evidence-integrity.ts:44`** — Timestamp in hash makes it non-deterministic

These are documented for later fix proposals. NOT fixed during Phase -1.
