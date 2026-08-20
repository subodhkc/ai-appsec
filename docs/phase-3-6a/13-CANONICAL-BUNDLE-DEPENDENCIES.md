# 13 — Canonical Bundle Dependencies

## Future Architecture

```
canonical-static-security/
  haiec-ai-security.yml    ← YAML owns executable detector logic
  manifest.json            ← Manifest owns metadata
```

## YAML Ownership

The YAML file owns:
- Semgrep rule patterns
- Languages
- Paths
- Pattern-either / patterns
- Metavariables
- Taint mode configuration

## Manifest Ownership

The manifest owns:
- `securityCheckId` — canonical check identifier
- `canonicalName` — human-readable name
- `securityProposition` — what security proposition this check tests
- `findingKind` — PRESENCE / RISK_SIGNAL / VULNERABILITY / CONTROL_GAP
- `canonicalSeverity` — CRITICAL / HIGH / MEDIUM / LOW / INFO
- `defaultDisposition` — BLOCK / REVIEW / INFORMATIONAL
- `applicability` — languages, frameworks, profiles
- `limitations` — known blind spots
- `detectorMapping` — maps to Semgrep rule ID in YAML
- `provenance` — origin, license, author
- `publicStatus` — PUBLIC_READY / READY_AFTER_REPAIR / REDESIGN_REQUIRED

## Hash Binding

```
rulepackDigest = SHA-256(haiec-ai-security.yml)
manifestDigest = SHA-256(manifest.json)
bundleDigest = SHA-256(rulepackDigest + manifestDigest)
```

Every scan receipt includes all three hashes. Verification: recompute hashes from deployed files and compare.

## HAIEC SaaS Values That Should Derive from Manifest

| Current Hardcoded Value | Location | Should Become |
|------------------------|----------|---------------|
| TOTAL_STATIC_RULES = 121 | config.ts:62 | manifest.detectors.length |
| CORE_AI_RULES_COUNT = 91 | config.ts:38 | manifest.detectors.filter(kind=AI_SECURITY).length |
| SOC2_STATIC_RULES_COUNT = 30 | config.ts:55 | manifest.detectors.filter(kind=SOC2).length |
| "82 security rules" | ai-security-report.ts:208 | manifest.detectors.length |
| "78+ AI-specific security rules" | SampleReportsContent.tsx:136 | manifest.detectors.filter(public=true).length |
| "91 rule patterns" | self-audit, what-is-haiec, etc. | manifest.detectors.filter(kind=AI_SECURITY).length |
| "92 core rules" | docs pages | manifest.detectors.length |
| "121 detection rules" | page.tsx:1029 | manifest.detectors.length |
| "91 core + 27 SOC2" | dashboard:1532,1615 | manifest.detectors.filter(kind=AI_SECURITY).length + manifest.detectors.filter(kind=SOC2).length |
| RULE_NAMES registry | rule-names.ts | manifest.detectors.map(d => ({[d.id]: d.canonicalName})) |
| ruleToControl mapping | trust-page.ts:123-158 | manifest.detectors.map(d => ({[d.id]: d.controlMapping})) |
| RULE_COMPLIANCE_MAPPINGS | compliance-mappings.ts | manifest.detectors.map(d => ({[d.id]: d.complianceFrameworks})) |
| SEVERITY_WEIGHTS | aggregation.ts:243-249 | manifest.detectors.map(d => ({[d.id]: d.canonicalSeverity})) → weight map |

## Status

**NOT_YET_BUILT.** The canonical bundle is a future architecture. Do NOT implement yet.
