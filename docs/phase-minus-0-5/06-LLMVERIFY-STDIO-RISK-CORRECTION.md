# 06 — LLMVerify stdio Risk Correction

> **Phase -0.5 document.** Corrects the Phase -1 conclusion that "LLMVerify is
> not MCP-stdio-safe." That was too strong without an execution test.

---

## Phase -1 Error

Phase -1 stated: "LLMVerify postinstall prints to stdout — breaks MCP stdio."

**This was too strong.** The verified facts are:
- `package.json:43` contains `"postinstall": "node dist/postinstall.js || true"`
- `src/postinstall.ts:106` uses `console.log(banner)` to print to stdout

But we did NOT test whether this stdout output actually reaches the MCP client's
captured server stdout during real MCP installation and operation.

---

## Corrected Classification

**`MCP_STDIO_FIRST_RUN_RISK`** — not "broken", not "safe", but "untested risk."

### What we know

1. The postinstall script writes to stdout via `console.log`
2. MCP stdio protocol requires stdout to contain only protocol messages
3. Postinstall runs during `npm install` / `npx` — BEFORE the MCP server starts
4. Whether the MCP client captures postinstall stdout depends on:
   - How the client spawns the server process
   - Whether the client captures stdout from the npm/npx wrapper or from the
     actual server process
   - Whether the client's stdout pipe is connected during postinstall

### What we don't know

- Whether npm/npx postinstall output reaches the MCP client's captured stdout
- Whether it occurs before server startup (likely yes, but unverified)
- Whether the host tolerates or rejects non-protocol stdout before the first
  protocol message

---

## Future Test Specification

### Test: LLMVerify stdout cleanliness in MCP context

**Objective:** Determine whether LLMVerify's postinstall output pollutes stdout
in a real MCP installation scenario.

**Method:**
1. Create a minimal MCP server that imports `llmverify` as a library
2. Launch it via `npx` exactly as an MCP client would:
   ```bash
   npx -y haiec-test-mcp-server 2>stderr.log 1>stdout.log
   ```
3. Capture stdout and stderr separately
4. Wait for server startup
5. Analyze stdout content:
   - Is there any non-protocol output before the first JSON-RPC message?
   - Is there any banner text in stdout?
   - Does the server eventually start and respond to protocol messages?

**Pass criteria:**
- stdout contains ONLY JSON-RPC protocol messages (after any initial whitespace)
- No banner text, no log lines, no npm output in stdout
- Server starts and responds to `initialize` request

**Fail criteria:**
- stdout contains banner text or non-protocol output
- Server fails to start due to stdout pollution

### Test: Host tolerance

**Objective:** Determine whether MCP clients tolerate pre-protocol stdout.

**Method:**
1. Configure the test MCP server in Cursor, Claude Code, Windsurf, VS Code
2. Attempt to connect and list tools
3. Record whether the connection succeeds or fails

**This test is deferred to pre-Beta phase gates.**

---

## Recommendation (unchanged)

Regardless of test outcome, **recommend removing the postinstall banner in
LLMVerify 1.6.0** for:
- Supply-chain cleanliness (postinstall scripts are a security concern)
- Low-noise installation (banners are noise in CI/CD and MCP contexts)
- MCP stdio safety (eliminate the risk entirely rather than relying on host tolerance)

**Do NOT modify LLMVerify yet.** This is a recommendation for a future LLMVerify
release, not an action for this phase.

---

## Corrected Phase -1 Language

| Phase -1 | Phase -0.5 |
|----------|------------|
| "LLMVerify is not MCP-stdio-safe" | "LLMVerify has MCP_STDIO_FIRST_RUN_RISK — postinstall writes to stdout, but whether this reaches the MCP client's captured stdout is untested" |
| "Breaks MCP stdio protocol" | "May break MCP stdio protocol if postinstall stdout reaches the client's protocol pipe — requires empirical testing" |
| "Required fix before MCP integration" | "Recommended fix in LLMVerify 1.6.0; risk must be empirically tested before Beta" |
