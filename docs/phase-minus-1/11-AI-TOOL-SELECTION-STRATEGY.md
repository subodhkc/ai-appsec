# 11 — AI Tool-Selection Strategy

> **Phase -1 document.** Defines how to maximize the likelihood that AI agents
> correctly select HAIEC capabilities. Does NOT claim models will automatically
> choose HAIEC. Evaluation corpus in `12-AI-TOOL-SELECTION-EVALS.json`.

---

## Core Principle

**Do not assume any model or host will automatically select HAIEC.**

The architecture must support three adoption layers, tested empirically in later
phases:

1. **Discovery / Installation** — Can the developer or AI environment discover and install HAIEC?
2. **Tool Selection** — Once installed, can the model correctly determine which HAIEC capability applies?
3. **Host-Native Activation** — Can skills/rules/plugins/hooks make HAIEC naturally available at relevant moments without noisy scans?

---

## 1. Discovery / Installation Requirements

| Requirement | Detail |
|-------------|--------|
| npm package | Publish to `registry.npmjs.org` (required for MCP Registry) |
| MCP Registry | Publish `server.json` to `registry.modelcontextprotocol.io` with name `io.github.subodhkc/haiec-agent-security` |
| GitHub repo | Public repo with clear README, installation instructions, and `llms.txt` |
| One-command install | `npx haiec-agent-security` or `npm install -g haiec-agent-security` |
| MCP client config | Provide config snippets for Cursor, Claude Code, Windsurf, VS Code |
| GitHub Action | Provide a reusable GitHub Action for CI integration |
| Documentation site | Hosted docs with search, examples, and rule documentation |

---

## 2. Model-Facing Tool Name Quality

Tool names must be **semantically precise**, not promotional.

| Tool name | Good? | Rationale |
|-----------|-------|-----------|
| `scan_ai_security` | YES | Clear: scans for AI security issues in source code |
| `scan_tenant_isolation` | YES | Clear: scans for tenant isolation issues |
| `verify_llm_content` | YES | Clear: verifies LLM input/output content |
| `check_deploy_security` | YES | Clear: checks deploy readiness |
| `run_haiec` | NO | Promotional, doesn't tell the model what it does |
| `security_scan` | NO | Too generic — model can't distinguish from other scanners |
| `ai_scanner` | NO | Ambiguous — AI security scanner? Or scanner using AI? |

---

## 3. Positive Trigger Language (when to use)

Each tool description must include clear positive triggers:

### `scan_ai_security`
- "Use when reviewing source code for AI/LLM security vulnerabilities"
- "Use when the user asks to check AI code for security issues"
- "Use after writing code that calls OpenAI, Anthropic, LangChain, or other LLM APIs"
- "Use when checking for prompt injection risks in code"
- "Use when auditing AI agent implementations for dangerous tool access"

### `scan_tenant_isolation`
- "Use when reviewing multi-tenant application code for cross-tenant data access"
- "Use when the user asks about tenant isolation or data isolation"
- "Use after modifying Prisma queries that filter by tenant/organization ID"
- "Use when checking if customer A can access customer B's records"
- "Use when auditing multi-tenant SaaS boundaries"

### `verify_llm_content`
- "Use when checking an LLM response for prompt injection"
- "Use when verifying LLM output for PII exposure"
- "Use when checking if model output contains harmful content"
- "Use when assessing hallucination risk in LLM responses"
- "Use before sending LLM-generated content to users"

### `check_deploy_security`
- "Use when deciding if AI-related changes are ready to deploy"
- "Use when the user asks 'are these changes safe to deploy?'"
- "Use as a pre-deployment security gate for AI features"
- "Use when merging AI-related changes to main"

---

## 4. Negative Trigger Language (when NOT to use)

Each tool description must include clear negative triggers:

### `scan_ai_security`
- "Do NOT use for CSS/styling issues"
- "Do NOT use for general code explanations"
- "Do NOT use for performance optimization"
- "Do NOT use for non-AI security issues (use standard security tools)"
- "Do NOT use for tenant isolation (use `scan_tenant_isolation`)"

### `scan_tenant_isolation`
- "Do NOT use for general AI security (use `scan_ai_security`)"
- "Do NOT use for LLM output verification (use `verify_llm_content`)"
- "Do NOT use for single-tenant applications"

### `verify_llm_content`
- "Do NOT use for source code analysis (use `scan_ai_security`)"
- "Do NOT use for tenant boundary issues (use `scan_tenant_isolation`)"
- "Do NOT use for static code analysis"

### `check_deploy_security`
- "Do NOT use for single-issue checks — use the specific tool instead"
- "Do NOT use for non-AI deploys"

### All tools
- "Do NOT use for: CSS fixes, React hooks explanation, build config, documentation writing, test writing, refactoring, formatting"

---

## 5. Host-Native Skills / Rules / Plugins / Hooks

| Host | Mechanism | HAIEC usage |
|------|-----------|-------------|
| Claude Code | Skills, rules files | Provide a HAIEC skill that activates on AI security-related prompts |
| Cursor | MCP config, rules | Provide `.cursorrules` snippet for AI security awareness |
| Windsurf | MCP config, rules | Provide Windsurf rules snippet |
| VS Code | MCP extension | Provide VS Code MCP config |
| GitHub | GitHub Action | Reusable workflow for PR-time scanning |

**Key requirement:** Host-native mechanisms must NOT cause noisy or unwanted
scans. They should make HAIEC *available* at relevant moments, not *automatic*
on every prompt.

---

## 6. Latency / Context-Size Requirements

| Requirement | Target |
|-------------|--------|
| Tool scan latency (small project) | < 30 seconds |
| Tool scan latency (medium project) | < 2 minutes |
| Tool description length | < 500 characters (concise but complete) |
| Finding output context size | Minimize — prefer structured data + summaries over raw code |
| Max findings returned to model | Configurable, default 50 (with count of total) |
| Receipt size | < 10KB for typical scan |

---

## 7. Non-Selection for Irrelevant Work

**False invocation is a product defect.** The following prompts MUST NOT trigger
HAIEC:

- "Fix the CSS spacing on the login page"
- "Explain this React hook"
- "Write a unit test for the utility function"
- "Refactor this function to use async/await"
- "Update the README"
- "Fix the TypeScript error on line 42"
- "Add a dark mode toggle"
- "What does this regex do?"
- "Format this file with Prettier"

The evaluation corpus (`12-AI-TOOL-SELECTION-EVALS.json`) includes 100 scenarios
with expected tool selections, including 30+ negative cases.

---

## 8. Tool-Selection Evaluation Strategy

### Methodology
1. Create 100 natural-language scenarios (see evals corpus)
2. For each scenario, define the expected tool selection (or "NO_HAIEC")
3. Run each scenario through target AI agents (Cursor, Claude Code, Windsurf, VS Code)
4. Measure:
   - **Correct selection rate** (model picks the right HAIEC tool)
   - **False positive rate** (model invokes HAIEC when it shouldn't)
   - **False negative rate** (model doesn't invoke HAIEC when it should)
   - **Ambiguity rate** (model invokes wrong HAIEC tool)
5. Iterate on tool descriptions until rates meet targets

### Targets
| Metric | Target |
|--------|--------|
| Correct selection rate | > 90% |
| False positive rate | < 5% |
| False negative rate | < 10% |
| Ambiguity rate | < 5% |

### Scenario distribution
| Category | Count |
|----------|-------|
| Obvious positive (clear AI security) | 20 |
| Obvious positive (clear tenant isolation) | 15 |
| Obvious positive (clear LLM content) | 15 |
| Obvious positive (deploy decision) | 10 |
| Obvious negative (unrelated coding) | 25 |
| Ambiguous (could be AI security or general) | 10 |
| Multi-tenant edge cases | 5 |

---

## Ontology Summary

```
source-code security       → scan_ai_security
cross-tenant boundaries    → scan_tenant_isolation
actual LLM input/output    → verify_llm_content
merge/release/deploy       → check_deploy_security
anything else              → NO HAIEC
```
