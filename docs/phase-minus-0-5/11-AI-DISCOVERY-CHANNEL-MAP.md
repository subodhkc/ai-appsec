# 11 — AI Discovery Channel Map

> **Phase -0.5 document.** Separates discovery mechanisms by their actual purpose.
> Corrects the Phase -1 conflation of SEO/indexing with tool selection.

---

## Phase -1 Error

Phase -1 listed `llms.txt`, npm keywords, and GitHub README alongside MCP Registry
as "distribution channels" without distinguishing what each mechanism actually does.

---

## Channel Classification

### 1. SEARCH / AI INDEXING

**Purpose:** Help humans and AI models discover that HAIEC exists.

| Mechanism | What it does | What it does NOT do |
|-----------|-------------|---------------------|
| GitHub README | Humans find HAIEC via GitHub search/links | Does NOT cause model to invoke HAIEC |
| npm keywords | Humans find HAIEC via npm search | Does NOT cause model to invoke HAIEC |
| Website SEO | Humans find HAIEC via Google/search | Does NOT cause model to invoke HAIEC |
| Rule documentation | Humans/AIs find HAIEC via search engine indexing | Does NOT cause model to invoke HAIEC |
| `llms.txt` | AI models can read about HAIEC capabilities when explicitly fetching | Does NOT cause automatic model invocation |
| Blog posts/content | Humans discover HAIEC via content marketing | Does NOT cause model to invoke HAIEC |

**Key insight:** Search/indexing mechanisms help DISCOVERY. They do NOT cause a
model to SELECT or INVOKE HAIEC. A model knowing HAIEC exists ≠ a model choosing
to use HAIEC.

### 2. MCP INSTALLATION DISCOVERY

**Purpose:** Help users install HAIEC as an MCP server.

| Mechanism | What it does | What it does NOT do |
|-----------|-------------|---------------------|
| MCP Registry | Users browse registry, find HAIEC, install it | Does NOT cause automatic installation |
| npm package | Users install via `npm install` or `npx` | Does NOT cause automatic installation |
| Cursor Marketplace | Users find HAIEC in Cursor's MCP catalog | Does NOT cause automatic installation |
| Windsurf Marketplace | Users find HAIEC in Windsurf's MCP catalog | Does NOT cause automatic installation |
| VS Code MCP Gallery | Users find HAIEC in VS Code's MCP gallery | Does NOT cause automatic installation |
| Claude Code config/plugins | Users configure HAIEC in Claude Code | Does NOT cause automatic installation |

**Key insight:** Installation discovery helps users ADD HAIEC to their environment.
It does NOT cause the model to use HAIEC after installation.

### 3. TOOL SELECTION AFTER INSTALLATION

**Purpose:** Once HAIEC is installed, help the model correctly choose which HAIEC
tool to use (or not use).

| Mechanism | What it does | What it does NOT do |
|-----------|-------------|---------------------|
| Tool name + description | Model reads tool name/description and decides | Does NOT guarantee correct selection |
| Tool `inputSchema` | Model understands what inputs are needed | Does NOT guarantee correct selection |
| Tool `outputSchema` | Model understands what output to expect | Does NOT guarantee correct selection |
| Tool annotations | Model gets hints about tool behavior | Annotations are untrusted unless server is trusted |
| Positive/negative triggers | Model sees when to use and when NOT to use | Does NOT guarantee correct selection |

**Key insight:** Tool selection is the model's decision based on tool descriptions.
Good descriptions maximize correct selection but don't guarantee it. This is why
the 100-scenario eval corpus exists.

### 4. HOST-NATIVE ACTIVATION

**Purpose:** Make HAIEC naturally available at relevant moments without noisy scans.

| Mechanism | What it does | What it does NOT do |
|-----------|-------------|---------------------|
| Claude Code skills | Skill activates on relevant prompt patterns | Does NOT cause automatic HAIEC invocation |
| Cursor rules (`.cursorrules`) | Rules inform the model about HAIEC availability | Does NOT cause automatic HAIEC invocation |
| Windsurf rules | Rules inform the model about HAIEC availability | Does NOT cause automatic HAIEC invocation |
| VS Code MCP config | MCP server is available in VS Code | Does NOT cause automatic HAIEC invocation |
| GitHub Actions | CI runs HAIEC on PRs/pushes | This IS automatic, but in CI context, not agent context |

**Key insight:** Host-native mechanisms make HAIEC *available* at relevant moments,
not *automatic*. They should NOT cause noisy or unwanted scans.

---

## Corrected Classification

| Mechanism | Phase -1 classification | Phase -0.5 classification |
|-----------|------------------------|--------------------------|
| GitHub README | Distribution channel | SEARCH / AI INDEXING |
| npm keywords | Distribution channel | SEARCH / AI INDEXING |
| MCP Registry | Distribution channel | MCP INSTALLATION DISCOVERY |
| Cursor Marketplace | Distribution channel | MCP INSTALLATION DISCOVERY |
| Windsurf Marketplace | Distribution channel | MCP INSTALLATION DISCOVERY |
| VS Code MCP Gallery | Distribution channel | MCP INSTALLATION DISCOVERY |
| Claude Code config | Distribution channel | HOST-NATIVE ACTIVATION |
| `llms.txt` | Distribution channel | SEARCH / AI INDEXING |
| Website SEO | Distribution channel | SEARCH / AI INDEXING |
| Rule documentation | Distribution channel | SEARCH / AI INDEXING |
| GitHub Action | Distribution channel | HOST-NATIVE ACTIVATION (CI) |
| SARIF | Distribution channel | HOST-NATIVE ACTIVATION (CI) |
| Tool descriptions | (not listed as distribution) | TOOL SELECTION AFTER INSTALLATION |

---

## Key Rule

**Never describe an SEO/indexing mechanism as a tool-selection mechanism.**

`llms.txt` helps a model understand HAIEC's capabilities when the model explicitly
fetches and reads it. It does NOT cause the model to invoke HAIEC. Tool selection
happens through tool descriptions after installation.
