# 01 — Version Reconciliation

## Executable Truth

### Modal Scanner (modal_ai_security_scanner.py:38)
```python
SCANNER_VERSION = os.environ.get("APP_VERSION", "3.28.0")
```
- **Fallback version:** 3.28.0
- **Can be overridden by:** `APP_VERSION` env var
- **Reported in health endpoint:** `{"version": SCANNER_VERSION, ...}`
- **Reported in scan results:** `scannerVersion=SCANNER_VERSION`

### Next.js config (lib/ai-security/config.ts:21)
```typescript
export const SCANNER_VERSION = '3.28.0';
```
- **Was:** 3.27.0 (Phase 3.6B-1 did not change this — it was already stale)
- **Now:** 3.28.0 (corrected in Phase 3.6B-1.1 to match Modal fallback)

### Health checker (lib/ai-security/scanner-health.ts:166)
```typescript
const expectedVersion = process.env.SCANNER_EXPECTED_VERSION || SCANNER_VERSION;
```
- **Was:** Hardcoded `'3.27.0'` (Phase 3.6B-1 changed from 3.28.0 to 3.27.0 — WRONG)
- **Now:** Imports `SCANNER_VERSION` from config.ts (single source of truth)

### Cron health check (app/api/cron/health-check/route.ts:20)
```typescript
const EXPECTED_VERSION = process.env.SCANNER_EXPECTED_VERSION || SCANNER_VERSION;
```
- **Was:** Hardcoded `'3.27.0'` (Phase 3.6B-1 changed from 3.28.0 to 3.27.0 — WRONG)
- **Now:** Imports `SCANNER_VERSION` from config.ts

### Scan results page (app/dashboard/ai-security/scan/[scanId]/page.tsx:1615)
```tsx
Scanner version {SCANNER_VERSION} • ...
```
- **Was:** Hardcoded `'3.27.0'` (Phase 3.6B-1)
- **Now:** Uses `SCANNER_VERSION` constant

### Artifact generator (lib/ai-security/artifact-generator.ts:681)
```typescript
version: SCANNER_VERSION,
```
- **Was:** Hardcoded `'3.22.0'` (pre-existing bug, not caught by Phase 3.6B-1)
- **Now:** Uses `SCANNER_VERSION` constant

### Scan notification email (lib/ai-security/scan-notification.ts:147)
```typescript
HAIEC AI Security Scanner v${SCANNER_VERSION} • ${TOTAL_STATIC_RULES} Detector Definitions
```
- **Was:** Hardcoded `'v3.22.0 • 91 Semgrep Rules'` (pre-existing bug)
- **Now:** Uses `SCANNER_VERSION` and `TOTAL_STATIC_RULES` constants

## Version Architecture Decision

1. **Single source of truth:** `config.ts:SCANNER_VERSION` is the authoritative Next.js-side version constant.
2. **Modal scanner is the deployable truth:** `modal_ai_security_scanner.py:SCANNER_VERSION` (fallback 3.28.0) is what the scanner actually reports. `config.ts` MUST match this.
3. **Health checkers import from config:** Both `scanner-health.ts` and `cron/health-check/route.ts` now import `SCANNER_VERSION` from `config.ts` instead of hardcoding a version.
4. **Env override preserved:** `SCANNER_EXPECTED_VERSION` env var can still override the expected version for testing/deployment scenarios.
5. **No Modal changes:** `modal_ai_security_scanner.py` was NOT modified (read-only per phase rules).

## Unsafe 3.27/3.28 Change Corrected

**Phase 3.6B-1 error:** Changed health checker from 3.28.0 (correct, matching Modal) to 3.27.0 (wrong, matching stale config.ts). This would have caused false VERSION_MISMATCH warnings in production.

**Phase 3.6B-1.1 fix:** Updated config.ts to 3.28.0 (matching Modal) and made health checkers import from config.ts instead of hardcoding.

## Distinct Version Meanings

| Version | Meaning | Source |
|---------|---------|--------|
| 3.28.0 | Scanner version (Modal fallback) | modal_ai_security_scanner.py:38 |
| 3.28.0 | Scanner version (Next.js config) | lib/ai-security/config.ts:21 |
| 121-rules-v4-soc2 | Rulepack version | modal_ai_security_scanner.py:41 |
| 2025.1 | Rule version (display only) | scan results page |
| Semgrep (varies) | Semgrep engine version | Modal container (not hardcoded) |

## E2E Test Fix

**Old:** `expect(data.scanner_version).toBe(SCANNER_VERSION)` + `expect(data.scanner_version).toBe('3.26.0')` (contradictory + wrong field name)
**New:** `expect(data.version).toBe(SCANNER_VERSION)` (correct field name from Modal health endpoint, uses constant)
