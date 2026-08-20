# Phase 4B — Rulepack Distribution Options

## FACT

A fully local Semgrep scanner must have executable rule definitions locally.
If those definitions are distributed to users, they are inspectable.
Obfuscation cannot keep them secret.

## Option A — Bundled Public Core

Public npm package includes the qualified Public Core rulepack.

**Advantages:**
- Zero additional setup
- No login, no network, no API key
- Best adoption
- Deterministic package version
- Offline execution after install

**Tradeoff:**
- Public Core rule bodies become visible

## Option B — Separate Public Rulepack Package

MCP package + independently versioned public rulepack package.

**Advantages:**
- Cleaner version separation

**Tradeoff:**
- Additional installation/dependency complexity

## Option C — Private/Authenticated Rulepack

**Tradeoff:**
- Breaks no-auth/local-first adoption
- Introduces network/account/dependency
- Contradicts "local means local"

## Option D — User-Provided Rules

**Not acceptable** as default HAIEC experience.
Users don't get HAIEC's curated rules.
