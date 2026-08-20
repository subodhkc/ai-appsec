# Semgrep License Human Review

## Phase 4C-C — Fact Pattern Only

Engineering provides facts. Final legal interpretation remains human.

## FACT: Semgrep Is an External Executable

**EVIDENCE:** `src/engines/ai-security/semgrep-runner.ts` line 120:
`spawn(options.executablePath, args, ...)`

Semgrep is invoked as a subprocess via Node.js `child_process.spawn()`.
It is not loaded as a library, not imported, not linked.

## FACT: Semgrep Is NOT Bundled in the npm Tarball

**EVIDENCE:** `package.json` `files` field:
```json
["dist", "rules/public-core", "LICENSE", "THIRD_PARTY_NOTICES.md", "TRADEMARKS.md"]
```

No Semgrep binary, source, or package is included in the published files.
The `dist/` directory contains only compiled HAIEC TypeScript.
The `rules/public-core/` directory contains only HAIEC-authored YAML rules.

## FACT: Semgrep Is NOT Modified by HAIEC

**EVIDENCE:** HAIEC invokes Semgrep with standard CLI arguments:
`semgrep scan --config <rulepack> --json --metrics off [excludes...] <target>`

No Semgrep source code is present in the repository. No patches, forks,
or modifications exist.

## FACT: Semgrep Setup/Download Behavior

**EVIDENCE:** `src/cli/setup.ts` — the `setup` command downloads Semgrep
via `pip install semgrep==1.173.0` into a HAIEC-managed directory
(`~/.haiec/semgrep/`). This is a user-initiated action, not automatic.

Normal scanning does NOT trigger any download. The scan fails safely
with a setup-required error if Semgrep is absent.

## FACT: Source of Managed Installation

**EVIDENCE:** `src/engines/ai-security/semgrep-resolver.ts` —
HAIEC's resolver checks in this order:
1. HAIEC-managed Semgrep at `~/.haiec/semgrep/`
2. `HAIEC_SEMGREP_PATH` environment variable
3. `semgrep` on system PATH

HAIEC does NOT redistribute a Semgrep binary. The managed installation
is obtained from the official PyPI package (`pip install semgrep`).

## FACT: HAIEC Does NOT Redistribute a Semgrep Binary

**EVIDENCE:** The npm package `files` field excludes any Semgrep content.
The setup command installs from PyPI, not from a bundled binary.

## FACT: Normal Scan Does NOT Require Network

**EVIDENCE:** `src/engines/ai-security/semgrep-runner.ts` line 108:
`'--metrics', 'off'` — Semgrep metrics/telemetry are disabled.

Phase 4C-B proved hard offline execution:
`OFFLINE_HARD_ISOLATION_PASS` in Docker with `--network=none`.

Rules are bundled locally in `rules/public-core/`. No rule download
occurs during scanning.

## FACT: Semgrep Metrics Are Disabled

**EVIDENCE:** `semgrep-runner.ts` line 108: `'--metrics', 'off'`
is always passed as a CLI argument.

## FACT: Semgrep Upstream License

**EVIDENCE:** Semgrep is developed by Semgrep, Inc. (formerly r2c).
The Semgrep OSS distribution is licensed under the
**GNU Lesser General Public License v2.1 (LGPL-2.1)**
with additional permissions for rule definitions.

Source: https://github.com/semgrep/semgrep — LICENSE file

**NOTE:** The LGPL-2.1 applies to the Semgrep software itself.
HAIEC's rules are original works and are NOT derivative works of
Semgrep's rules. HAIEC rules are authored as YAML configurations
that Semgrep reads — they are not linked to or derived from Semgrep
source code.

## QUESTIONS FOR HUMAN REVIEWER

1. **Subprocess invocation:** Does invoking Semgrep as an external
   subprocess (not linked, not bundled) create any LGPL-2.1 obligation
   for HAIEC?

2. **Rule licensing:** Are HAIEC's original YAML rules "derivative
   works" of Semgrep for LGPL purposes, or are they independent
   configurations that Semgrep reads?

3. **Setup redistribution:** Does `pip install semgrep` via the
   `setup` command create any redistribution obligation?

4. **Attribution:** Is the current attribution in
   THIRD_PARTY_NOTICES.md sufficient?

5. **Metrics disable:** Does `--metrics off` have any license
   implications?

6. **LGPL compatibility:** If HAIEC chooses MIT for its package,
   is that compatible with using (not bundling) an LGPL-2.1 tool?

## Engineering Position

Engineering believes the fact pattern supports that HAIEC uses Semgrep
as an external tool without LGPL obligation, similar to how a build
system uses a compiler. However, **this is a legal interpretation,
not an engineering determination.**
