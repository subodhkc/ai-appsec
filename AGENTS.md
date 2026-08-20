# AGENTS.md — HAIEC Agent Security MCP (Phase -1 → Phase 18)

> **Scope:** These rules apply ONLY to the `haiec-ai-agent-security-free-mcp` build session
> (the multi-phase MCP construction project, ~16-18 phases). They do NOT apply to other
> projects on this machine. They are loaded automatically when this repo (or the
> `HAIEC-workspace/` parent) is the active workspace.
>
> **Persistence:** This file is the source of truth for session rules across phases.
> Do not delete or weaken it mid-project. If a later phase needs to amend a rule,
> edit this file explicitly and note the change in `PHASES.md`.

---

## 1. Workspace Layout

```
HAIEC-workspace/
├── haiec-ai-agent-security-free-mcp/   ← WRITE HERE (primary working repo)
├── haiec-website/                      ← READ ONLY (junction to ../Haiec Website)
├── llmverify-npm/                      ← READ ONLY (junction to ../llmverify-npm)
└── mcp-tenant-isolation/               ← READ ONLY (junction to ../mcp-tenant-isolation)
```

- **Primary write repo:** `haiec-ai-agent-security-free-mcp` (public, GitHub:
  `subodhkc/haiec-ai-agent-security-free-mcp`, default branch `main`).
- **Read-only repos** are Windows directory junctions to existing local clones.
  They share the working tree with those clones — inspect, do not modify.
- **No separate `llmverify/` repo exists.** `llmverify-npm` is the only LLMVerify
  repo in scope (user-confirmed 2026-08-16). Do not invent a `llmverify/` path.

---

## 2. Architectural Principles (apply to every phase)

1. **Not a wrapper around three scanners.** This repo becomes the public Agent
   Security control surface. LLMVerify and Tenant Isolation remain independent
   products and independent engines. Compose them ONLY where composition has an
   actual semantic reason. Never let the architecture drift into
   "run everything every time."

2. **Strict engine independence.** `scan_ai_security`, `scan_tenant_isolation`,
   `verify_llm_content`, and `check_deploy_security` NEVER automatically invoke
   one another. Each is selected on its own semantic merit.

3. **Source of truth is fragmented.** Conflicting scanner/rule/Semgrep version
   declarations have already been found inside HAIEC. Treat production executable
   code as evidence; treat older documents as hypotheses until verified. This is
   why Phase -1 exists.

4. **Evidence hierarchy:** executable source / tests / config > README / docs /
   comments. Never convert an assumption into a fact without evidence.

5. **Proactive AI use is a product acceptance criterion.** A feature is not
   finished because `npx` works. We must verify that realistic prompts cause
   Cursor/Claude/Windsurf/VS Code agents to choose the correct capability, AND
   that unrelated prompts correctly cause NO HAIEC invocation. **False
   invocation is just as important a defect as missed invocation.**

6. **Tool descriptions = semantic precision, not promotion.** Describe when to
   use AND when not to use each function. Avoid "best security scanner" /
   "most comprehensive" phrasing. The model must understand the ontology:
   - source-code security        → `scan_ai_security`
   - cross-tenant boundaries     → `scan_tenant_isolation`
   - actual LLM input/output     → `verify_llm_content`
   - merge/release/deploy        → `check_deploy_security`

7. **Scan Receipt and proof-of-fix are architectural primitives**, not optional
   marketing artifacts. Design them in from the start: reproducibility, AI
   repair loops, CI evidence, future cloud ingestion format, shareable outputs.

8. **Keep the architecture simple.** Do not rebuild HAIEC SaaS inside the
   open-source repo.

---

## 3. Hard Constraints (never violate)

- **Never modify, commit, push, publish, tag, release, migrate, or deploy
  anything unless the current phase prompt explicitly requests it.**
- **Never make opportunistic fixes while auditing.** Document them in
  `FINDINGS.md` (or per-phase findings file) and propose later fixes.
- **Read-only repos stay read-only** (`haiec-website`, `llmverify-npm`,
  `mcp-tenant-isolation`) unless a later prompt explicitly authorizes changes.
- **Local means local.** No silent cloud/network fallback.
- **Never execute target repository code during scanning.**
- **Never expose secrets / raw hostile repository content unnecessarily to AI
  context.**
- **Never bypass errors.** Fix root causes, not symptoms.
- **Preserve invariants on every fix.**
- **Critical flows must be sequential, not parallel.**
- **Frontend must not assume backend state.**
- **Backend must never fail silently at startup.**
- **Local state ≠ source of truth.**

---

## 4. Phase Discipline

- **At the start of each phase:** run the phase-entry checks BEFORE changing code.
- **At the end of each phase:** run the phase-exit gate BEFORE declaring
  completion. Do not declare done until the gate passes.
- **If evidence contradicts the current plan:** report it; do not force
  implementation to match the plan.
- **Track every phase** in `PHASES.md` (status, key decisions, evidence refs,
  findings). This is how context survives across 16-18 phases.
- **Context preservation:** before ending a phase, update `PHASES.md` with
  what was decided, what was deferred, and what the next phase must pick up.

---

## 5. Git Discipline

- Branch: use the branch specified by the task, or create a descriptive branch
  name if none specified.
- **Always pull before pushing:** `git pull origin <branch>` then
  `git push -u origin <branch>`.
- **Never force-push or rewrite git history.**
- **Never update git config.**
- **Never use `-i` flags** (interactive mode not supported).
- **Do not push unless explicitly asked.**
- **Do not commit if no changes exist.**

---

## 6. Efficiency Rules (this project)

- **Do not launch sub-agents for tasks doable directly.** Use Grep/Glob/Read
  directly. Only use Agent/subagent when a task genuinely requires parallel
  isolation or would consume >30 tool calls in the main context.
- **Never launch more than 2 parallel agents at once.**
- **Fix files directly:** read → edit → done. No "fix agent" wrappers.
- **Targeted reads only.** When fixing a bug, read only the specific file and
  the files it imports that are relevant to the bug. Do not read entire
  directories speculatively.
- **Batch related edits.** When multiple files need the same type of fix, do
  all of them in one pass.
- **No exploratory agents for known codebases.** After the first audit of a
  module, treat the codebase as known — search directly.

---

## 7. Code Quality Rules

- **Never skip the read before editing.** Always read current file content
  before any Edit call.
- **Fix the root cause, not the symptom.** (e.g. if a crash is caused by a
  wrong Prisma model name, fix the name — don't add a try/catch around it.)
- **Do not add or remove comments unless asked.** If you accidentally delete
  an existing comment, restore it.
- **Follow existing codebase conventions** (naming, libraries, patterns) —
  inspect neighboring files before writing.
- **Never assume a library is available.** Check `package.json` / equivalent
  first. Prefer package-manager commands (`npm add`, etc.) over hand-editing
  manifests. Avoid brand-new releases (<7 days old) and unbounded floating
  ranges (`latest`, `*`, `>=`).

---

## 8. Project-Specific Conventions (carry over from haiec-website where relevant)

- **Prisma:** all accessors are snake_case (`prisma.monitored_systems`,
  `prisma.system_alerts`). Inside `$transaction`, cast: `(tx as any).model_name`.
  Relation includes must use the exact schema field name.
- **Next.js 15:** dynamic route `params` is `Promise<{...}>` — always
  `await params`. `headers()` is async — use `request.headers.get()` inside
  route handlers. `'use client'` must be the literal first line for any
  component using hooks, browser APIs, or lucide-react icons.
- **Auth:** Org ID is always `session.user.organizationId` — never fall back to
  `session.user.id`. Bearer extraction:
  `authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''`.

---

## 9. Standing Product Principle — ONE WORKFLOW, FOUR CHECKS

HAIEC Agent Security represents:

**ONE AGENT-SECURITY WORKFLOW.
FOUR INDEPENDENT SECURITY CHECKS.**

Security moments:

1. **SCAN AI CODE** → `scan_ai_security`
2. **CHECK TENANT BOUNDARIES** → `scan_tenant_isolation`
3. **CHECK MODEL INTERACTIONS** → `verify_llm_content`
4. **GATE THE RELEASE** → `check_deploy_security`

This describes the developer/security journey. It does NOT mean all four
engines execute sequentially. Tool independence remains mandatory:

- A source-security request calls `scan_ai_security` only.
- A tenant-isolation request calls `scan_tenant_isolation` only.
- An LLM-content request calls `verify_llm_content` only.
- The future release gate is the only orchestration layer.

---

## 10. Phase -1 Status (forensic / setup) — COMPLETE

- [x] Workspace assembled at `HAIEC-workspace/` with 1 write repo + 3 read-only
      junctions.
- [x] New repo `haiec-ai-agent-security-free-mcp` cloned (was empty on GitHub;
      local branch `main`, no commits yet).
- [x] Session rules persisted to this file.
- [x] Phase tracker created at `PHASES.md`.
- [x] Phase -1 forensic audit complete — 24 documents in `docs/phase-minus-1/`.
- [x] Read-only repos confirmed unmodified.
- [x] Decision: READY_FOR_PHASE_0.
- **Next:** Phase 0 (scaffolding & interface design) — see
  `docs/phase-minus-1/24-PHASE-0-ENTRY-DECISION.md` and `PHASES.md`.

---

## 10. Key Decisions Log (append-only)

| Date       | Decision                                                              | Rationale                                  |
|------------|-----------------------------------------------------------------------|--------------------------------------------|
| 2026-08-16 | Drop separate `llmverify/` repo; use `llmverify-npm` only             | No `llmverify` repo exists on GitHub       |
| 2026-08-16 | Junctions to existing local clones for read-only repos                | Fast, no re-clone; user-confirmed          |
| 2026-08-16 | Persist rules in `AGENTS.md` + tracker in `PHASES.md`                 | Survive context loss across 16-18 phases   |
| 2026-08-16 | Target MCP SDK v2 + 2026-07-28 spec                                    | Current stable; v1 enters maintenance      |
| 2026-08-16 | All 91 Semgrep rules DO_NOT_PUBLISH_YET                                | Provenance unknown; no license headers     |
| 2026-08-16 | Tenant isolation: direct scan() import (not MCP-to-MCP)                | Clean architecture; engine independence    |
| 2026-08-16 | LLMVerify postinstall stdout fix REQUIRED before MCP integration       | Breaks MCP stdio protocol                  |
| 2026-08-16 | Scan Receipt + proof-of-fix = BUILD_IN_V0.1                            | Signature differentiator; AI repair loops  |
| 2026-08-16 | Reuse canonical hash from `fingerprint.ts`; reject timestamp-in-hash   | Determinism required for receipts          |
| 2026-08-16 | Replace fabricated numeric confidence with qualitative evidence        | Not empirically calibrated                  |
| 2026-08-16 | Phase -1 COMPLETE; READY_FOR_PHASE_0                                   | All 24 docs done; read-only repos clean    |
