# PHASE-4-INPUT — Phase 4 Input Contract

## What Phase 4 Is Allowed to Consume

### Canonical Rulepack

- **Path:** `.private-rule-staging/canonical-static-security-v2/haiec-ai-security.yml`
- **Version:** `0.1.0-rc.4`
- **Digest:** `sha256:7846dafcc0c576befd512e8161933e4a40ba1d986741ff0ef086a0f6b4e3168c`
- **Status:** Private. Do NOT publish detector bodies.

### Canonical Manifest

- **Path:** `.private-rule-staging/canonical-static-security-v2/manifest.json`
- **Digest:** `sha256:ac6e9c4c3b394f618494f4ed2863264a1b0dad5320b11967e7884bab029c5d24`
- **Contents:** 80 security checks, 122 detectors, detector-to-check mapping

### Public Core

- **Path:** `.private-rule-staging/canonical-static-security-v2/public-core/public-core.yml`
- **Digest:** Same as canonical (all 122 detectors are Public Core eligible in rc.4)
- **Detector count:** 122
- **Security-check count:** 80

### Semgrep Engine

- **Version:** 1.173.0
- **Docker image:** `semgrep/semgrep:1.173.0`
- **Digest:** `sha256:67319956da3dcb58baf5b322899c15458e3963e7018a86aeeb5cd224e69cb77a`
- **Platform:** linux/amd64
- **GitHub release:** v1.173.0 (2026-08-12)

### Security Check IDs

Phase 4 may reference these 80 securityCheckIds in MCP handler logic. The full list is in the manifest.

### Detector IDs

Phase 4 may reference these 122 detectorIds for mapping raw Semgrep findings to security checks. The full list is in the manifest.

### Normalization Contract

- **Path:** `.private-rule-staging/phase36b2b/completeness-contract.json` (for completeness)
- **Normalization key:** `securityCheckId | repo-relative-path | line | evidence-fingerprint`
- **Evidence fingerprint:** SHA-256 of `check_id | path | start_line | start_col | end_line | end_col`
- **Rule:** Different security propositions on the same line MUST remain separate findings

### Completeness Contract

- **Statuses:** COMPLETE, PARTIAL, UNSUPPORTED, ERROR
- **Rule:** Zero findings does NOT imply COMPLETE if timeout/parser error/skipped files occurred
- **Timeouts:** SMALL=120s, MEDIUM=300s, LARGE=600s (configurable)
- **On timeout:** Return PARTIAL with reason='scan_timeout'

### Finding Contract

Each normalized finding MUST include:
- `securityCheckId`
- `findingKind` (PRESENCE, RISK_SIGNAL, CONTROL_GAP, VULNERABILITY)
- `canonicalSeverity`
- `defaultDisposition` (INFORMATIONAL, REVIEW, BLOCK)
- `path` (repo-relative)
- `line`
- `detectorIds[]`
- `evidenceHash`

### Local-First Execution Constraints

- Local HAIEC rule file only
- Semgrep metrics disabled (`--metrics off`)
- No login (`--no-git-ignore` if needed, but NO `--login`)
- No registry config
- No community rule download
- Network-none compatible

### Timeout Behavior

- Configurable per scan
- Default: 300s
- On timeout: return PARTIAL status with any captured findings
- Do NOT silently return COMPLETE on timeout

### Error Behavior

- On parser error: return PARTIAL with reason='parser_error'
- On harness failure: return ERROR with reason='harness_failure'
- On resource failure: return PARTIAL or ERROR with reason='resource_limit'

## What Phase 4 Is NOT Allowed to Do

- Publish detector bodies
- Modify the canonical rulepack
- Add new detectors without going through the qualification process
- Bypass the completeness contract
- Claim COMPLETE status when timeout/parser error occurred
- Implement Tenant Isolation or LLMVerify handlers
- Implement deploy gate
- Implement Scan Receipt or proof-of-fix (those are separate Phase 4+ tasks)
