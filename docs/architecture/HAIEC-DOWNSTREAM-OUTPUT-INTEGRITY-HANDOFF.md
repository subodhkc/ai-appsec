# HAIEC Downstream Output-Integrity Handoff (DRAFT REFERENCE)

> Phase 4C-A Part 16 — Verified downstream semantic risks identified during MCP work.
>
> HAIEC main repo remains READ-ONLY. This document does NOT fix these items.
> It records candidates for Platform U0-U6 reconciliation.

## Purpose

The MCP produces correct, deterministic, well-contracted evidence. However,
existing HAIEC SaaS consumers may reinterpret this evidence incorrectly. This
document records verified semantic risks so that Platform U0-U6 can reconcile
downstream contracts before MCP evidence is wired into SaaS.

## Risk Register

### STATIC BADGE — P0_TRUST_SEMANTICS

- **Risk:** `NO_FINDINGS` may depend only on finding count without scan completeness
- **Impact:** A PARTIAL zero-finding scan could appear as "clean" (green badge)
- **Evidence:** Badge logic in HAIEC SaaS may not check `completeness` field
- **Classification:** P0_TRUST_SEMANTICS — incorrect trust signal

### STATIC TRUST ARTIFACT — P0_TRUST_SEMANTICS

- **Risk:** `SECURED` / `PROTECTED` semantics may conflate CI/CD + finding count
  with security posture
- **Impact:** Scan completeness may not be considered in trust artifact generation
- **Classification:** P0_TRUST_SEMANTICS

### BLOCKING — P0_TRUST_SEMANTICS

- **Risk:** `hasBlocking` may derive from `criticalIssues > 0` rather than
  canonical disposition semantics
- **Impact:** BLOCK disposition (advisory) may be treated as a hard block,
  or vice versa
- **Note:** MCP distinguishes BLOCK disposition from severity; SaaS may not
- **Classification:** P0_TRUST_SEMANTICS

### COMPLIANCE ARTIFACT — P1_UNIFICATION

- **Risk:** Wizard score may be converted into `rulesPassed/rulesFailed`
- **Impact:** `evidenceUploadPercent` may be synthesized from tier rather than
  measured
- **Classification:** P1_UNIFICATION

### BADGE IDENTITY — P1_UNIFICATION

- **Risk:** Artifact generator may support 12-character IDs while generic badge
  route accepts only 8-character real IDs
- **Classification:** P1_UNIFICATION

### PUBLIC ARTIFACT PAYLOAD — P0_TRUST_SEMANTICS

- **Risk:** Stored `scopeVerified/scopeNotVerified` may be replaced with empty
  arrays during reconstruction
- **Impact:** Scope verification evidence may be silently lost
- **Classification:** P0_TRUST_SEMANTICS

### STATIC REPORT — P0_TRUST_SEMANTICS

- **Risk:** Top 100 findings may be fetched BEFORE analytical conclusions
- **Risk:** Findings may be called "vulnerabilities" (they are finding instances)
- **Risk:** Legacy `riskScore` may be presented as canonical risk
- **Risk:** Vulnerability density may use raw finding counts
- **Risk:** Financial-impact estimates may derive from raw finding instances
- **Risk:** Positive claims may be generated without sufficient evidence
- **Risk:** File coverage may use `filesScanned/(filesScanned+filesSkipped)`
  which is non-deterministic due to ENGINE_OPERATIONAL_NONDETERMINISM
- **Classification:** P0_TRUST_SEMANTICS

### REPORT OWNERSHIP — P1_UNIFICATION

- **Risk:** Organization authorization vs `userId` transformer lookup mismatch
- **Classification:** P1_UNIFICATION

### AUDIT PACKAGE — P1_UNIFICATION

- **Risk:** Dependent on current Decision Pipeline semantics
- **Risk:** `noncanonical JSON.stringify` hashing (not canonical)
- **Risk:** `signatureHash` may not be a true digital signature
- **Classification:** P1_UNIFICATION

### ARTIFACT GENERATORS — P1_UNIFICATION

- **Risk:** Framework-specific generators may reinvent IDs, hashes, provenance,
  validity, and badge semantics
- **Classification:** P1_UNIFICATION

### LEGACY REPORT INVENTORY — P2_CLEANUP

- **Risk:** Historical document claiming "zero orphaned systems" and "production
  readiness" is no longer authoritative
- **Classification:** P2_CLEANUP

## Classification Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0_TRUST_SEMANTICS | 5 | Incorrect trust signals — must be fixed before MCP integration |
| P1_UNIFICATION | 4 | Contract/identity unification needed |
| P2_CLEANUP | 1 | Legacy cleanup |

## MCP→SaaS Integration Hold

These risks are why MCP Scan Receipts, Findings, and Concern Families must NOT
be wired directly into existing HAIEC SaaS until Platform U0-U6 reconcile
downstream semantic contracts. See `MCP_TO_SAAS_EVIDENCE_INGESTION_HOLD`.
