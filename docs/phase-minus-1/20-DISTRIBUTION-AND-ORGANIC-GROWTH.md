# 20 — Distribution and Organic Growth

> **Phase -1 document.** Distribution architecture tied to product architecture.
> No generic SEO recommendations.

---

## Distribution Channels

### 1. GitHub

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Public repo, README, topics, GitHub search |
| AI discovery | GitHub is indexed by AI training data; `llms.txt` helps models understand HAIEC |
| Installation | `git clone` + `npm install`, or `npx` |
| Repeated use | Star, watch, fork for customization |
| Brand authority | Stars, contributors, issue activity signal quality |
| Backlinks | GitHub repo linked from blogs, docs, registries |

**Requirements:** Clear README, `llms.txt`, topics (`mcp`, `ai-security`, `semgrep`, `static-analysis`, `llm-security`), issue templates, contributing guide.

### 2. npm

| Aspect | How it helps |
|--------|-------------|
| Human discovery | npm search, npm trends |
| AI discovery | npm is indexed; package description helps models |
| Installation | `npm install -g haiec-agent-security` or `npx haiec-agent-security` |
| Repeated use | Global install, project-level dev dependency |
| Brand authority | Download count, maintainers, update frequency |

**Requirements:** Clear package name, description, keywords, `bin` entry, `files` field, LICENSE.

### 3. MCP Registry

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Registry search at `registry.modelcontextprotocol.io` |
| AI discovery | MCP clients can browse registry |
| Installation | One-click install in MCP clients |
| Repeated use | Persistent in client config |
| Brand authority | Verified publisher, namespace ownership |

**Requirements:** `server.json` with name `io.github.subodhkc/haiec-agent-security`, npm package published first, `mcpName` in `package.json`.

**Caveat:** Registry is in preview. Do NOT rush to publish. Wait until v0.1 is stable.

### 4. Cursor plugin/marketplace

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Cursor extension marketplace |
| AI discovery | Cursor can suggest MCP servers |
| Installation | One-click in Cursor settings |
| Repeated use | Persistent in Cursor config |

**Requirements:** MCP config snippet for Cursor, documentation page.

### 5. Windsurf MCP marketplace

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Windsurf MCP catalog |
| AI discovery | Windsurf can suggest MCP servers |
| Installation | One-click in Windsurf |
| Repeated use | Persistent in Windsurf config |

**Requirements:** MCP config snippet for Windsurf, documentation page.

### 6. VS Code MCP gallery

| Aspect | How it helps |
|--------|-------------|
| Human discovery | VS Code extensions gallery |
| AI discovery | VS Code MCP support |
| Installation | Extension install or MCP config |
| Repeated use | Persistent in VS Code settings |

**Requirements:** VS Code MCP config snippet, documentation.

### 7. Claude Code configuration/plugins

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Claude Code docs, skills marketplace |
| AI discovery | Claude Code skills/rules |
| Installation | MCP config + optional skill |
| Repeated use | Skill activates on relevant prompts |

**Requirements:** MCP config snippet, optional Claude Code skill file.

### 8. GitHub Actions

| Aspect | How it helps |
|--------|-------------|
| Human discovery | GitHub Actions marketplace |
| AI discovery | CI integration is a strong signal |
| Installation | `uses: subodhkc/haiec-agent-security-action@v1` |
| Repeated use | Every PR/push triggers scan |
| Brand authority | Action usage count |

**Requirements:** Reusable GitHub Action, SARIF output for GitHub Code Scanning.

### 9. SARIF / GitHub Code Scanning

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Security tab in GitHub |
| AI discovery | N/A (CI-side) |
| Installation | Upload SARIF via GitHub Action |
| Repeated use | Every PR shows findings inline |
| Brand authority | Professional security integration |

**Requirements:** SARIF 2.1.0 output (already supported by tenant-isolation engine).

### 10. High-quality rule documentation

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Search engine indexing of rule docs |
| AI discovery | Models can reference rule docs |
| Brand authority | Detailed docs signal expertise |
| Backlinks | Developers link to specific rule docs |

**Requirements:** Per-rule documentation page with: description, example vulnerable code, remediation, CWE, compliance mapping.

### 11. HAIEC website docs

| Aspect | How it helps |
|--------|-------------|
| Human discovery | Search, direct traffic |
| AI discovery | Indexed content |
| Brand authority | Professional documentation site |
| Backlinks | Inbound from blogs, registries |

### 12. llms.txt

| Aspect | How it helps |
|--------|-------------|
| AI discovery | `llms.txt` at repo root and docs site helps models understand HAIEC |
| AI selection | Clear capability description helps models select HAIEC correctly |

**Requirements:** `llms.txt` with concise description of HAIEC capabilities, when to use, when not to use.

### 13. Machine-readable schemas

| Aspect | How it helps |
|--------|-------------|
| AI discovery | JSON Schema for Scan Receipt, Finding, Verdict |
| Integration | CI systems can programmatically consume results |
| Brand authority | Schema publication signals maturity |

**Requirements:** JSON Schema files for Scan Receipt, Finding, Verdict, published with docs.

---

## Key Insight

**MCP Registry alone does not create distribution.** It is one channel among many.
The strongest distribution comes from:
1. **GitHub Actions + SARIF** — every PR shows findings inline (high value, low friction)
2. **npm + MCP Registry** — standard installation path
3. **Rule documentation** — SEO + AI discovery + developer trust
4. **Host-native skills/rules** — make HAIEC available at the right moment

The product architecture (Scan Receipt, SARIF, structured output) directly enables
these channels. Distribution is not separate from architecture.
