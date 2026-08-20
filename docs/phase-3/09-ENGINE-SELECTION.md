# 09 — Engine Selection

## Decision

```
ADOPT_MODERN_WITH_EXCLUSIONS
```

## Rationale

### For Adoption

1. **Identical findings:** 143/143 unique findings are identical between 1.52.0 and 1.173.0
2. **Parser improvement:** `ai-function-calling-js` regex error is fixed in modern
3. **Stricter validation:** Modern engine catches `ai-prompt-injection-langchain` rule bug that 1.52.0 missed
4. **Security/bug fixes:** 21 versions of bug fixes, parser improvements, and security patches
5. **Maintainability:** 1.52.0 is no longer supported by Semgrep.dev
6. **Cross-platform:** Modern image uses `semgrep/semgrep` namespace (official)

### For Exclusions

1. `ai-prompt-injection-langchain` must be fixed before running on modern (rule bug, not engine bug)
2. All 33 REDESIGN_REQUIRED rule bodies from Phase 2.6 remain excluded from publication
3. The engine adoption does NOT mean the rules are ready for production

### Against Retaining 1.52.0

- No longer supported
- Missing 21 versions of bug fixes
- Retaining it merely because it matches legacy defects is explicitly prohibited
- The `ai-function-calling-js` fix in modern is a net improvement

## Conclusion

Adopt Semgrep 1.173.0 as the target engine. Fix `ai-prompt-injection-langchain` as part of Phase 3.5 rule redesign. Do not retain 1.52.0.
