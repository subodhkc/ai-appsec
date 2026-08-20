# 11 — Error Contract

> Phase 0 document. Machine-readable error codes.

## Error Codes (12)

| Code | Meaning | Recoverable |
|------|---------|-------------|
| ENGINE_NOT_INTEGRATED | Engine adapter not yet implemented | No |
| ENGINE_UNAVAILABLE | Engine exists but cannot run | Maybe |
| UNSUPPORTED_SCOPE | Requested scope not supported by engine | No |
| PATH_OUTSIDE_ROOT | Path traversal outside allowed root | No |
| SYMLINK_ESCAPE | Symlink points outside allowed root | No |
| INVALID_INPUT | Input validation failed | Yes |
| UNSUPPORTED_LANGUAGE | Target language not supported | No |
| PARTIAL_COVERAGE | Scan completed with partial coverage | Yes |
| SCAN_FAILED | Scan execution failed | Maybe |
| DEPENDENCY_MISSING | Required dependency not installed | No |
| RATE_LIMITED | Rate limit exceeded | Yes |
| INTERNAL_ERROR | Unexpected internal error | No |

## HaiecError Interface

```typescript
interface HaiecError {
  code: ErrorCode;
  message: string;
  recoverable: boolean;
  causeCategory?: CauseCategory;
  engine?: string;
  details?: Record<string, unknown>; // sanitized — no secrets, no stack traces
}
```

## Cause Categories

- `configuration` — misconfiguration
- `filesystem` — filesystem/path issue
- `engine` — engine-specific failure
- `input` — invalid user input
- `environment` — environment/dependency issue
- `unknown` — unclassified

## Design Principles

- No secrets in default model-facing output
- No stack traces in default model-facing output
- Errors are machine-readable (code + recoverable flag)
- Details are sanitized before exposure
