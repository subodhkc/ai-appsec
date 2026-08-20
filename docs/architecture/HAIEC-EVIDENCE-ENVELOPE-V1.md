# HAIEC Evidence Envelope v1

> **Status:** DRAFT_REFERENCE
> **Purpose:** Define a source-agnostic evidence envelope that any HAIEC
> evidence producer can emit and any HAIEC report consumer can ingest.
> **Conformance:** MCP currently conforms to relevant static-evidence portions.
> Platform U0/U1 will reconcile this document against HAIEC main architecture.
> Authoritative product-level specifications will be established there.
> No runtime coupling is introduced by this document.
> **Rule:** MCP must NOT require HAIEC SaaS or a shared online service to
> implement this. The contract is the unification layer — not a runtime
> dependency.

---

## 1. Design Principles

1. **Source-independent:** Any evidence producer (MCP, SaaS, runtime tester,
   inventory, wizard, regulatory engine, native engine, SARIF converter) can
   produce a valid envelope.
2. **Independently executable:** A producer does not need another producer to
   finish its envelope.
3. **Deterministic identity:** Evidence digests are content-sensitive and
   ordering-independent. Operational metadata does not alter evidence identity.
4. **Honest completeness:** Completeness and limitations are first-class fields,
   not optional metadata.
5. **No hidden coupling:** The envelope schema is self-describing. A consumer
   does not need producer-specific knowledge to parse the envelope.

---

## 2. Envelope Structure

```json
{
  "schemaVersion": "haiec-evidence-envelope/1.0",
  "envelopeVersion": "1.0.0",

  "producer": {
    "producerId": "haiec-mcp-static",
    "producerType": "static-scanner",
    "producerVersion": "0.1.0",
    "contractVersion": "1.0.0"
  },

  "subject": {
    "subjectType": "repository",
    "subjectId": null,
    "repositoryIdentity": {
      "targetRoot": "<TARGET_ROOT>",
      "scanInputDigest": "sha256:...",
      "vcsCommit": null,
      "vcsBranch": null,
      "vcsDirty": null
    }
  },

  "execution": {
    "runId": "scan-...",
    "executionMode": "local-stdio",
    "completeness": "COMPLETE",
    "status": "OK"
  },

  "coverage": {
    "coverageStatus": "COMPLETE",
    "coverageDigest": "sha256:...",
    "analyzedFileSetDigest": "sha256:...",
    "targetedFileSetDigest": "sha256:...",
    "intentionallyExcludedFileSetDigest": "sha256:...",
    "parseFailureFileSetDigest": "sha256:...",
    "unsupportedFileSetDigest": "sha256:...",
    "filesAnalyzed": 2473,
    "filesTargeted": 2473,
    "quantitativeCoverage": null
  },

  "evidence": {
    "evidenceDigest": "sha256:...",
    "payloadDigest": "sha256:...",
    "evidenceItemCount": 1636,
    "findingSetDigest": "sha256:...",
    "concernSetDigest": "sha256:...",
    "receiptDigest": "sha256:..."
  },

  "limitations": [
    "Scan timed out — partial results available."
  ],
  "assumptions": [
    "Production scope only (DEFAULT_PRODUCTION)."
  ],

  "operationalMetadata": {
    "startedAt": "2026-09-17T07:14:03Z",
    "durationMs": 196000,
    "pid": 12345,
    "platform": "win32",
    "nodeVersion": "v24.11.1"
  }
}
```

---

## 3. Field Semantics

### 3.1 producer

| Field | Required | Description |
|-------|----------|-------------|
| `producerId` | yes | Stable identifier for the producer (e.g. `haiec-mcp-static`). |
| `producerType` | yes | Category: `static-scanner`, `runtime-tester`, `inventory`, `wizard`, `regulatory-engine`, `native-engine`, `sarif-converter`. |
| `producerVersion` | yes | Version of the producer implementation. |
| `contractVersion` | yes | Version of this envelope contract the producer conforms to. |

### 3.2 subject

| Field | Required | Description |
|-------|----------|-------------|
| `subjectType` | yes | `repository`, `service`, `configuration`, `llm-output`. |
| `subjectId` | no | Safe-to-share subject identifier. Omit if sensitive. |
| `repositoryIdentity.scanInputDigest` | yes (for repository) | Canonical digest of analyzed file contents. |
| `repositoryIdentity.vcsCommit` | no | VCS commit hash if available. |
| `repositoryIdentity.vcsDirty` | no | Whether working tree was dirty. |

### 3.3 execution

| Field | Required | Description |
|-------|----------|-------------|
| `runId` | yes | Producer-specific run identifier. NOT deterministic identity. |
| `executionMode` | yes | `local-stdio`, `local-cli`, `saas`, `ci`. |
| `completeness` | yes | `COMPLETE`, `PARTIAL`, `UNSUPPORTED`, `ERROR`. |
| `status` | yes | `OK`, `PARTIAL`, `ERROR`. |

### 3.4 coverage

| Field | Required | Description |
|-------|----------|-------------|
| `coverageStatus` | yes | `COMPLETE`, `PARTIAL`, `UNKNOWN`. |
| `coverageDigest` | yes | Digest reflecting material coverage state (not just counts). |
| `analyzedFileSetDigest` | yes | Digest of canonical sorted relative paths of analyzed files. |
| `targetedFileSetDigest` | no | Digest of files intended for analysis. |
| `intentionallyExcludedFileSetDigest` | no | Digest of files excluded by scope rules. |
| `parseFailureFileSetDigest` | no | Digest of files with parse errors. |
| `unsupportedFileSetDigest` | no | Digest of files in unsupported languages. |
| `filesAnalyzed` | yes | Count of files actually analyzed. |
| `filesTargeted` | no | Count of files intended for analysis. |
| `quantitativeCoverage` | no | Percentage ONLY when defensible. `null` otherwise. |

**Critical:** A scan with the same counts but different analyzed file sets
MUST produce a different `coverageDigest` and `analyzedFileSetDigest`.

### 3.5 evidence

| Field | Required | Description |
|-------|----------|-------------|
| `evidenceDigest` | yes | Digest of the full evidence payload. |
| `payloadDigest` | yes | Digest of the serialized findings/concerns payload. |
| `evidenceItemCount` | yes | Number of evidence items (findings or observations). |
| `findingSetDigest` | yes (if findings) | Digest of the canonical finding set. |
| `concernSetDigest` | no | Digest of the Security Concern set if computed. |
| `receiptDigest` | yes | Digest of the Scan Receipt. |

### 3.6 limitations / assumptions

Free-text arrays. Limitations describe what was NOT covered or what may be
unreliable. Assumptions describe what the producer assumed about the subject.

### 3.7 operationalMetadata

**NOT part of deterministic identity.** Two envelopes with identical evidence
digests but different timestamps/durations/PIDs represent the same evidence.

---

## 4. Determinism Rules

1. `scanInputDigest` = canonical `relativePath + SHA256(fileContents)` for
   analyzed files. Path-separator-independent, ordering-independent,
   mtime-independent, absolute-root-independent.
2. `coverageDigest` reflects material coverage state (file sets + completeness),
   not just counts.
3. `findingSetDigest` is computed over canonical finding identities, sorted
   deterministically.
4. `concernSetDigest` is computed over concern identities + instance counts,
   sorted deterministically.
5. `receiptDigest` is computed over all deterministic receipt fields, excluding
   operational metadata.

---

## 5. MCP Conformance

The HAIEC MCP static scanner (`scan_ai_security`) produces evidence that
conforms to this envelope. Specifically:

- `producerId`: `haiec-mcp-static`
- `producerType`: `static-scanner`
- `executionMode`: `local-stdio`
- The Scan Receipt provides `receiptDigest`.
- The scanner provides `scanInputDigest`, `coverageDigest`, `findingSetDigest`.
- Security Concerns provide `concernSetDigest` (v0.1).
- Completeness and limitations are first-class fields.

MCP does NOT require HAIEC SaaS to produce a valid envelope.

---

## 6. Non-Goals

- This envelope does NOT define the report format (see Report Contract v1).
- This envelope does NOT mandate a shared serialization library.
- This envelope does NOT require all producers to produce all optional fields.
- This envelope does NOT define numeric risk/confidence scores.
