# 22 — Phase Gate Checklist

> **Phase -1 document.** Every future phase MUST pass this gate before being
> marked COMPLETE. A phase is not complete merely because code compiles.

---

## A. Evidence Gate

| Question | Pass criteria |
|----------|---------------|
| Are dependencies and assumptions verified? | Every dependency version, API surface, and external claim has been verified against executable source or official documentation. No assumption converted to fact without evidence. |

## B. Independence Gate

| Question | Pass criteria |
|----------|---------------|
| Did any specialized capability begin invoking another specialized engine? | **Zero** unauthorized cascading. `scan_ai_security` does not call LLMVerify or tenant isolation. `scan_tenant_isolation` does not call AI security or LLMVerify. `verify_llm_content` only calls LLMVerify. `check_deploy_security` is the only composite, and it reports all engines. |

## C. AI Selection Gate

| Question | Pass criteria |
|----------|---------------|
| Did this phase preserve or improve correct HAIEC selection? | Tool descriptions remain semantically precise. No promotional language added. |
| Did this phase preserve correct specialized-tool selection? | Each tool's positive/negative triggers remain accurate. |
| Did this phase preserve non-selection for irrelevant work? | No new behavior that causes HAIEC to run on irrelevant prompts. |
| Is tool ambiguity low? | No new ambiguity introduced between tools. |

## D. Security / Privacy Gate

| Question | Pass criteria |
|----------|---------------|
| Did filesystem access expand? | No new filesystem access outside `projectRoot`. No symlink following without validation. |
| Did network access expand? | No new network calls in local mode. No cloud fallback. |
| Can raw code or secrets enter model output? | Output sanitizer remains in place. No raw source in tool results. Secrets redacted. |
| Can target code execute? | No execution of target repository code. No install scripts run. No target MCP servers started. |

## E. Determinism / Provenance Gate

| Question | Pass criteria |
|----------|---------------|
| Did schemas, rules, engine versions, policy, or hashes change? | All changes documented. Version bumps recorded. |
| Are revisions/version bumps required? | If rules or engine changed, version must bump. Rulepack hash must be recomputed. |

## F. Claims Gate

| Question | Pass criteria |
|----------|---------------|
| Are README/docs/marketing still supported by actual code? | Every public claim verified against executable code. No claim of "safe", "secure", "certified", "compliant", "complete", "zero false positives/negatives", or "guaranteed" unless extremely specifically verified. |

## G. Regression Gate

| Question | Pass criteria |
|----------|---------------|
| Do unit tests still pass? | All existing tests pass. |
| Do fixtures still pass? | All fixture-based tests pass. |
| Do tool-selection tests still pass? | AI tool-selection evals maintain target rates. |
| Do privacy tests still pass? | Network-blocked test, output sanitization test, path traversal test pass. |
| Do performance tests still pass? | Scan latency within targets. |
| Do cross-platform tests still pass? | macOS, Linux, Windows (if applicable). |

---

## Phase Completion Criteria

A phase is COMPLETE only when ALL of the following are true:
1. All applicable gates (A-G) pass
2. `PHASES.md` is updated with status, decisions, deferred items, next-phase prerequisites
3. Any new findings are documented in `FINDINGS.md`
4. Any rule/version changes are reflected in version constants
5. No P0 blockers remain for the next phase's entry

A phase is NOT complete if:
- Code compiles but tests fail
- Tests pass but independence is violated
- Independence holds but output safety regressed
- Everything works but public claims are unsupported

---

## Phase Entry Checks (run before changing code)

1. Read `AGENTS.md` and `PHASES.md` to load context
2. Verify read-only repos are unmodified (`git status` clean for haiec-website, llmverify-npm, mcp-tenant-isolation)
3. Confirm the phase's entry prerequisites from the previous phase are met
4. Create a branch (if not already on one)
5. State the phase's scope and what will NOT be done
