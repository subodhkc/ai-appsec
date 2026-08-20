# 16 — Scan Receipt Spec Draft

> **Phase -1 document.** Draft contract for the HAIEC Scan Receipt. NOT
> implemented. This is called "HAIEC Scan Receipt" — not "certificate", not
> "proof of security", not "attestation", not "safe-to-deploy certificate".

---

## Purpose

The Scan Receipt is a **reproducible, machine-readable record** of a security
scan. It supports:
- Reproducibility (same inputs → same digest)
- AI repair loops (model can compare receipts before/after a fix)
- CI evidence (artifact for compliance/audit)
- Future cloud ingestion format (structured data for HAIEC platform)
- Shareable outputs (developers can share receipts without exposing source)

---

## Schema (draft)

```typescript
interface HaiecScanReceipt {
  // === IDENTITY ===
  receiptVersion: string;           // Schema version of the receipt itself (e.g., "1.0.0")
  resultDigest: string;             // SHA-256 deterministic digest (see 15-EVIDENCE-ARCHITECTURE)
  scanId: string;                   // Unique ID for this scan (UUID)

  // === ENGINE VERSIONS ===
  engines: {
    [engineName: string]: {
      engineVersion: string;        // e.g., "1.0.0"
      rulepackVersion: string;      // e.g., "1.0.0"
      rulepackHash: string;         // SHA-256 of canonical rulepack
      policyVersion: string;        // e.g., "1.0.0"
      semgrepVersion?: string;      // For scan_ai_security only
    }
  };

  // === SCOPE ===
  scope: {
    type: 'full' | 'diff' | 'files';
    projectRoot: string;            // Relative reference, NOT absolute path
    commitSha?: string;             // Git commit if available
    dirty: boolean;                 // Working tree dirty state
    diffHash?: string;              // SHA-256 of diff (for diff scans)
    fileManifestHash: string;       // SHA-256 of file manifest
  };

  // === COVERAGE ===
  coverage: {
    filesConsidered: number;        // Total files evaluated
    filesScanned: number;           // Files actually scanned
    filesExcluded: number;          // Files excluded (by config, .gitignore, etc.)
    languagesDetected: string[];    // e.g., ["typescript", "python", "javascript"]
    unsupportedCoverage: string[];  // Languages/patterns not supported
  };

  // === ENGINES RUN ===
  enginesRun: {
    [engineName: string]: {
      ran: boolean;
      status: 'PASSED' | 'FINDINGS' | 'NOT_APPLICABLE' | 'PARTIAL' | 'SKIPPED' | 'FAILED';
      reasonRan?: string;           // Why it ran (if ran=true)
      reasonSkipped?: string;       // Why it was skipped (if ran=false)
      findingsCount: number;
      duration: number;             // Observational, NOT in digest
    }
  };

  // === VERDICT ===
  verdict: 'PASS' | 'REVIEW' | 'BLOCK' | 'ERROR';
  verdictReason: string;            // Human-readable explanation

  // === FINDINGS ===
  findings: {
    new: Finding[];                 // Findings not in baseline
    existing: Finding[];            // Findings already in baseline
    resolved: Finding[];            // Findings in baseline but not in current scan
  };

  // === FINDING FINGERPRINTS ===
  findingFingerprints: string[];    // SHA-256 of each normalized finding

  // === LIMITATIONS ===
  limitations: string[];            // e.g., "Semgrep not installed", "Unsupported language: Rust"

  // === OBSERVATIONAL METADATA (NOT in digest) ===
  metadata: {
    timestamp: string;              // ISO 8601
    durationMs: number;             // Total scan duration
    hostname: string;               // Redacted if configured
    haiecVersion: string;           // HAIEC scanner version
  };
}

interface Finding {
  ruleId: string;                   // Semgrep rule ID
  displayRuleId: string;            // Display rule ID (e.g., "R1")
  file: string;                     // Relative path
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  category: string;
  cwe?: string;
  findingKind: 'PRESENCE' | 'RISK_SIGNAL' | 'CONTROL_GAP' | 'VULNERABILITY';
  defaultDisposition: 'INFORMATIONAL' | 'REVIEW' | 'BLOCK';
  evidenceHash: string;             // SHA-256 of evidence (no raw source)
  remediation?: string;             // From rule metadata, NOT from repo content
  complianceFrameworks?: string[];  // e.g., ["SOC2", "ISO27001"]
}
```

---

## Deterministic Digest Computation

```
resultDigest = SHA-256(canonicalize({
  receiptVersion,
  engines: { engineVersion, rulepackVersion, rulepackHash, policyVersion, semgrepVersion },
  scope: { type, fileManifestHash, diffHash, dirty },
  coverage: { filesConsidered, filesScanned, filesExcluded, languagesDetected },
  enginesRun: { ran, status, findingsCount },  // NOT duration
  verdict,
  findingFingerprints  // Sorted
}))
```

**Excluded from digest:** `scanId`, `timestamp`, `durationMs`, `hostname`,
`metadata`, `limitations` (observational), raw findings (only fingerprints enter).

---

## Lifecycle: NEW / EXISTING / RESOLVED

| State | Meaning |
|-------|---------|
| `new` | Finding exists in current scan but NOT in baseline |
| `existing` | Finding exists in both current scan and baseline |
| `resolved` | Finding exists in baseline but NOT in current scan |

This enables **proof-of-fix**: a developer fixes a finding, re-scans, and the
receipt shows the finding moved from `new`/`existing` to `resolved`.

---

## What This Is NOT

| Term | Why not |
|------|---------|
| "Certificate" | Implies authority/issuance; this is a record, not a certificate |
| "Proof of security" | A scan cannot prove security; it records what was checked |
| "Security attestation" | Implies formal attestation; this is evidence, not attestation |
| "Safe-to-deploy certificate" | A scan cannot certify safe deployment; verdict is a recommendation |

---

## Future Directions (NOT in v0.1)

- Signed receipts (cryptographic signature for verifiable provenance)
- Hosted receipt storage (HAIEC Cloud ingestion)
- Organizational evidence aggregation (multi-scan rollup)
- Receipt comparison API (diff two receipts)
