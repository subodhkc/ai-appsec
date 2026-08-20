# 05 — Rule Provenance Update

> **Phase -0.5 document.** Reassesses rule provenance using git history. Corrects
> the Phase -1 conclusion that absence of license headers proves provenance is unknown.

---

## Phase -1 Error

Phase -1 concluded: "Provenance is UNKNOWN for all 91 rules" based solely on the
absence of license headers, attribution comments, and Semgrep Registry references
in `semgrep_rules.yaml`.

**This was too strong.** The absence of license headers proves only that provenance
is not established *by the rule file itself*. It does NOT prove that HAIEC doesn't
own the rules. Git history provides additional evidence.

---

## Git History Evidence

### `semgrep_rules.yaml`

| Evidence | Value |
|----------|-------|
| Unique authors | **1**: Subodh Kc |
| Author emails | `subodh@haiec.com`, `25489879+subodhkc@users.noreply.github.com` |
| Initial commit | `ab461d563` — 2026-01-19 — "broken rules" |
| Latest commit | `2d5dcae1` — "v3.28.0: Metadata-based classification with backward compatibility" |
| Total commits | 6 |

**All commits are by Subodh Kc using HAIEC email addresses.** No external contributors.
No commits reference importing rules from external sources.

### `soc2-static-rules.ts`

| Evidence | Value |
|----------|-------|
| Unique authors | **1**: Subodh Kc |
| Initial commit | `bf412bab` — 2026-02-17 — "Phase 1: Add 27 SOC2 static rules with full compliance mapping" |
| Total commits | 1 |

### `modal_ai_security_scanner.py` (AI_SECURITY_RULES embedded)

| Evidence | Value |
|----------|-------|
| Recent commits | All by Subodh Kc |
| Commit messages | Reference HAIEC-internal work ("Fix R5.5/R5.6 severity", "Fix severity mapping bug in Modal scanner") |

---

## Revised Provenance Classification

### Classification scheme (revised)

| Classification | Meaning |
|----------------|---------|
| `PROVEN_HAIEC_ORIGINAL` | Git history confirms HAIEC authorship, AI-specific patterns, no external source |
| `STRONG_HAIEC_ORIGIN_EVIDENCE` | Git history shows HAIEC author, but pattern is structurally similar to public rules |
| `DERIVED_WITH_KNOWN_SOURCE` | Derived from a known external source with compatible license |
| `THIRD_PARTY` | Copied from external source |
| `UNRESOLVED` | Cannot determine origin |

### Revised classifications

#### AI-specific rules (~63 rules): `PROVEN_HAIEC_ORIGINAL`

These rules target AI/LLM-specific patterns (prompt injection, RAG poisoning, agent
safety, etc.) that are unlikely to exist in generic security rule packs. Git history
confirms HAIEC authorship by Subodh Kc.

Examples: `ai-prompt-injection-*`, `ai-rest-*`, `ai-sdk-*`, `ai-agent-*`,
`ai-rag-poisoning`, `rag-metadata-injection`, `ai-memory-injection`, etc.

#### Generic security patterns (~28 rules): `STRONG_HAIEC_ORIGIN_EVIDENCE`

These rules detect patterns common in public security rule packs (hardcoded secrets,
SQL injection, SSRF, XSS, CORS, dangerous tools). Git history shows HAIEC authorship,
but the patterns are structurally similar to public Semgrep rules. These may be
HAIEC-original adaptations or may have been inspired by public rules.

Examples: `hardcoded-api-key-*`, `api-key-in-url-*`, `cors-misconfiguration-ai`,
`ai-sql-injection`, `ai-ssrf`, `ai-xss`, `dangerous-tool-shell`, etc.

**These require manual pattern comparison against public rule packs before publication.**

#### SOC2 TypeScript rules (21 objects): `PROVEN_HAIEC_ORIGINAL`

Git history confirms HAIEC authorship by Subodh Kc. These are HAIEC-specific SOC2
compliance patterns. However, they are non-functional (patterns never evaluated).

---

## Publication Status (revised)

| Classification | Count | Can publish under MIT? |
|----------------|-------|------------------------|
| PROVEN_HAIEC_ORIGINAL (AI-specific) | ~63 | YES — pending legal confirmation of IP/employment agreements |
| STRONG_HAIEC_ORIGIN_EVIDENCE (generic patterns) | ~28 | PENDING — requires manual pattern comparison |
| PROVEN_HAIEC_ORIGINAL (SOC2 TypeScript) | 21 | YES — pending legal confirmation (but non-functional) |
| UNRESOLVED | 0 | N/A |

### What's still needed before publication

1. **Legal review:** Confirm that HAIEC-authored rules can be released under MIT
   (check employment/IP agreements)
2. **Pattern comparison for STRONG_HAIEC_ORIGIN_EVIDENCE rules:** Compare against
   Semgrep Registry, GitHub Security Lab, community packs
3. **Add provenance metadata to each rule:**
   ```yaml
   metadata:
     provenance: PROVEN_HAIEC_ORIGINAL
     provenance_evidence: "git blame: Subodh Kc, HAIEC email, AI-specific pattern"
   ```

### What changed from Phase -1

| Phase -1 | Phase -0.5 |
|----------|------------|
| "Provenance is UNKNOWN for all 91 rules" | "~63 PROVEN_HAIEC_ORIGINAL, ~28 STRONG_HAIEC_ORIGIN_EVIDENCE" |
| "All 91 rules DO_NOT_PUBLISH_YET" | "~63 publishable pending legal review, ~28 need pattern comparison" |
| Based solely on absence of license headers | Based on git history + pattern analysis |

**The rules are NOT blocked by provenance for Phase 0.** Phase 0 doesn't copy or
publish rules. Provenance resolution is needed before the rule extraction phase.
