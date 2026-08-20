# 13 — Local Security Boundary

> **Phase -1 document.** Defines the filesystem and local privacy threat model
> for the HAIEC Agent Security Scanner. No implementation yet.

---

## Threat Model

The HAIEC scanner runs locally on a developer's machine or in CI. It scans
**untrusted repository content** — the repository itself may be adversarial
(malicious rules, prompt injection in code comments, secrets in files, symlinks
to sensitive paths). The scanner must protect the host, the AI agent context,
and the user's privacy.

### Adversary capabilities
- Repository content is fully attacker-controlled
- Code comments, variable names, and string literals may contain prompt injection
- Files may be symlinks pointing outside the project root
- Files may contain secrets or credentials
- Install scripts in the target repo may execute on `npm install` (not HAIEC's install)
- The repository may attempt to trick the scanner into reading files outside the project

### Adversary goals
- Exfiltrate secrets from the host machine via scanner output
- Inject prompt injection into AI agent context via scanner findings
- Cause the scanner to execute malicious code
- Cause the scanner to scan unrelated directories (privacy violation)
- Cause the scanner to make network calls that leak data

---

## Hard Requirements

### Filesystem access

| Requirement | Detail |
|-------------|--------|
| Explicit project root | Scanner MUST require an explicit `projectRoot` argument. No default to cwd. |
| Reject path traversal | All file access MUST be validated to be within `projectRoot`. Reject `../` traversal. |
| Reject root escape | No file outside `projectRoot` may be read, scanned, or included in output. |
| Symlink escape protection | Symlinks that point outside `projectRoot` MUST be rejected or not followed. |
| Repository-relative paths in output | All paths in findings/receipts MUST be relative to `projectRoot`. No absolute paths. |
| No scanning unrelated directories | Scanner MUST NOT scan outside `projectRoot`. No recursive parent traversal. |
| No arbitrary absolute paths | Do not expose absolute paths in any output. |

### Code execution

| Requirement | Detail |
|-------------|--------|
| Do not execute repository code | Scanner MUST NOT execute any code from the target repository. |
| Do not run repository install scripts | Scanner MUST NOT run `npm install`, `pip install`, or any install script in the target repo. |
| Do not start target MCP servers | Scanner MUST NOT start any MCP server found in the target repo. |
| Do not call target executables | Scanner MUST NOT execute any binary, script, or executable from the target repo. |
| Semgrep execution | Semgrep MUST run with local HAIEC rules only. No `--config=auto` (which fetches remote rules). |

### Network access

| Requirement | Detail |
|-------------|--------|
| Local mode = no network | Local mode MUST NOT make any network calls. No cloud fallback. |
| No silent cloud calls | Scanner MUST NOT call HAIEC Cloud, any API, or any external service in local mode. |
| No source upload | Scanner MUST NOT upload source code or findings to any remote service in local mode. |
| Semgrep telemetry | Semgrep metrics/telemetry MUST be explicitly disabled (`--disable-version-check`, `--metrics=off`). |
| Network-blocked test | A future test MUST verify that local mode works with network fully blocked (e.g., `--network=none` in Docker). |

### Privacy

| Requirement | Detail |
|-------------|--------|
| No source upload | Source code stays on the local machine. |
| No findings upload | Findings stay on the local machine (unless user explicitly exports). |
| No telemetry | No usage data, no analytics, no phone-home. |
| Local storage only | Any caches, suppressions, baselines stored locally (e.g., `.haiec/` directory). |

---

## Implementation Requirements (for later phases)

1. **Path validation function:** `isWithinProjectRoot(filePath, projectRoot): boolean`
   - Resolve symlinks before checking
   - Reject if resolved path is outside projectRoot
   - Use `path.resolve()` to normalize

2. **Symlink policy:**
   - Detect symlinks with `fs.lstat()`
   - Option A: Reject all symlinks (safest)
   - Option B: Follow symlinks but validate target is within projectRoot
   - Recommendation: Option A for v0.1 (reject symlinks), Option B for later

3. **Semgrep invocation:**
   - Use `--config=<local-haiec-rules.yaml>` only
   - Never use `--config=auto` (fetches remote rules)
   - Use `--metrics=off` to disable Semgrep telemetry
   - Use `--disable-version-check` to prevent network calls
   - Run with `cwd=projectRoot` to scope file access

4. **Output sanitization:** See `14-MCP-OUTPUT-SAFETY.md`

5. **Network-blocked test:**
   ```bash
   # Future test: run scanner in network-blocked container
   docker run --network=none -v $(pwd):/project haiec-agent-security scan /project
   ```
   Must succeed without any network access.
