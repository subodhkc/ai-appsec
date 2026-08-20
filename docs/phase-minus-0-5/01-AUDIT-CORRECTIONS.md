# 01 — Audit Corrections

> **Phase -0.5 document.** Detailed audit trail of every Phase -1 conclusion that
> changed, with evidence.

---

## Correction 1: Rule Count

### Phase -1 conclusion
"121 rules is FALSE; actual count is 91."

### Evidence found in Phase -0.5
- `AI_SECURITY_RULES` in `modal_ai_security_scanner.py:989-3358` contains **121**
  unique `ai-*` Semgrep rule IDs (programmatic count)
- `semgrep_rules.yaml` contains **91** unique Semgrep rule IDs (programmatic count)
- The 30 extra rules in Python are language-specific splits (e.g.,
  `ai-agent-loop-js` + `ai-agent-loop-python` vs. one `ai-agent-loop`)
- **0** `soc2-*` rule definitions exist anywhere

### Corrected conclusion
"121 detector definitions execute in Modal (all `ai-*`); 91 in YAML file;
0 SOC2 rules execute. The '121' count is real but it's 121 AI rules, NOT
91 AI + 30 SOC2 as claimed."

### Why Phase -1 was wrong
Phase -1 counted only `semgrep_rules.yaml` (91) and did not check the embedded
`AI_SECURITY_RULES` string in the Python file (121). It also did not trace the
actual `setup_rules()` execution path to determine which file is used in production.

---

## Correction 2: SOC2 Rule Status

### Phase -1 conclusion
"30 SOC2 rules not found in any YAML file."

### Evidence found in Phase -0.5
- 0 SOC2 Semgrep rule definitions exist (no `.semgrep/` directory, no `soc2-*.yml` files)
- 30 phantom mapping entries in Modal (`soc2-*` IDs → `R-*` display IDs, but no Semgrep definitions)
- 21 TypeScript RuleMeta objects in `soc2-static-rules.ts` (not 27, not 30)
- `patterns` arrays in TypeScript SOC2 rules are NEVER evaluated by any code
- `docs/RULE-COUNT-REFERENCE.md` references `.semgrep/soc2-*.yml` files that DON'T EXIST

### Corrected conclusion
"0 SOC2 rules execute anywhere. 30 phantom mappings, 21 metadata-only TypeScript
objects, 0 Semgrep definitions. The SOC2 static rules are entirely non-functional."

---

## Correction 3: Rule Provenance

### Phase -1 conclusion
"Provenance is UNKNOWN for all 91 rules" based on absence of license headers.

### Evidence found in Phase -0.5
- `git log --follow semgrep_rules.yaml`: all 6 commits by Subodh Kc (HAIEC email)
- `git blame`: initial commit `ab461d563` by Subodh Kc, 2026-01-19
- No external contributors
- AI-specific rules (~63) are unlikely to exist in public rule packs

### Corrected conclusion
"~63 PROVEN_HAIEC_ORIGINAL (git history + AI-specific patterns), ~28
STRONG_HAIEC_ORIGIN_EVIDENCE (git history shows HAIEC author, but patterns
structurally similar to public rules — need manual comparison)."

---

## Correction 4: LLMVerify stdio

### Phase -1 conclusion
"LLMVerify is not MCP-stdio-safe."

### Evidence found in Phase -0.5
- Postinstall writes to stdout (`console.log(banner)` at `src/postinstall.ts:106`)
- But we did NOT test whether this reaches the MCP client's captured stdout
- Postinstall runs during `npm install`, BEFORE the MCP server starts
- Whether the MCP client captures postinstall stdout is host-dependent

### Corrected conclusion
"MCP_STDIO_FIRST_RUN_RISK — postinstall writes to stdout, but whether this
reaches the MCP client's captured stdout is untested. Not confirmed broken."

---

## Correction 5: Tenant Isolation

### Phase -1 conclusion
"Tenant Isolation has no MCP coupling."

### Evidence found in Phase -0.5
- The package DOES include MCP functionality (`src/mcp/server.ts`)
- The engine (`src/engine/`) does not import from `src/mcp/`
- But the package as a whole is an MCP server

### Corrected conclusion
"Tenant Isolation includes MCP functionality, but its `scan()` API can be imported
directly, bypassing the MCP wrapper. HAIEC should import `scan()` directly."

---

## Correction 6: Evidence Canonicalization

### Phase -1 conclusion
"Canonical JSON from `fingerprint.ts` is directly reusable (REUSE_IMPLEMENTATION)."

### Evidence found in Phase -0.5
- `fingerprint.ts` uses a custom `sortedReplacer` — not a recognized standard
- Not externally verifiable (no one outside HAIEC can reproduce the canonical form)
- Not tested against number serialization edge cases
- RFC 8785 JCS is a published standard with the same properties plus external verifiability

### Corrected conclusion
"REUSE_CONCEPT + REIMPLEMENT_HASHING using RFC 8785 JCS. Do NOT copy
`sortedReplacer` into the public repo."

---

## Correction 7: Competitive Claims

### Phase -1 conclusion
"Scan Receipt + proof-of-fix is a unique differentiator — no other free scanner has this."

### Evidence found in Phase -0.5
- SARIF fingerprints provide stable finding identification
- GitHub Code Scanning provides new/fixed issue lifecycle
- Semgrep, CodeQL, Snyk all have baseline/diff finding capabilities

### Corrected conclusion
"COMPETITIVE_VALIDATION_REQUIRED. Potential differentiation is the COMBINATION of
AI-specific security + tenant isolation + agent-native invocation + coverage +
deterministic provenance + deploy verdict + multi-engine receipt + proof-of-fix.
No single feature is unique."

---

## Correction 8: MCP Architecture

### Phase -1 conclusion
"MCP 2026 is stateless."

### Evidence found in Phase -0.5
- stdio is a long-lived connection (one process, one connection, many requests)
- HTTP is per-request/stateless
- The 2026-07-28 revision adds features but doesn't change transport semantics

### Corrected conclusion
"stdio is long-lived; HTTP is stateless. Do NOT say 'MCP 2026 is stateless' as a
blanket statement."

---

## Correction 9: MCP Client Compatibility

### Phase -1 conclusion
"Client spec support unknown = P0 blocker."

### Evidence found in Phase -0.5
- MCP SDK v2 `serveStdio()` supports BOTH 2025-era and 2026-07-28 via era negotiation
- Default `legacy: 'serve'` serves 2025-era clients from the same factory
- Unknown client spec revisions do NOT block build-time scaffolding

### Corrected conclusion
"Build-time: dual-era SDK handles both. Host validation: deferred to pre-Beta
phase gates. Unknown spec revision is not a P0 blocker."

---

## Correction 10: AI Discovery

### Phase -1 conclusion
Listed `llms.txt`, npm keywords, and GitHub README as "distribution channels"
without distinguishing their purposes.

### Evidence found in Phase -0.5
- `llms.txt` helps AI indexing, NOT tool selection
- npm keywords help npm search, NOT model invocation
- Tool selection happens through tool descriptions after installation

### Corrected conclusion
"Separate: SEARCH/AI INDEXING, MCP INSTALLATION DISCOVERY, TOOL SELECTION AFTER
INSTALLATION, HOST-NATIVE ACTIVATION. Never describe an SEO/indexing mechanism
as a tool-selection mechanism."
