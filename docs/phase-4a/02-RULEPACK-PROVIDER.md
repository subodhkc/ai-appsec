# Phase 4A — Rulepack Provider

## Architecture

The rulepack provider abstraction ensures private HAIEC production rule
bodies are never committed to the public repository.

```
RulepackProvider (interface)
├── PrivateLocalRulepackProvider   (HAIEC_RULEPACK_PATH / HAIEC_MANIFEST_PATH)
└── SyntheticTestRulepackProvider  (tests/fixtures/synthetic-rulepack/)
```

## Runtime resolution

Development and private deployments resolve the rulepack via:

- `HAIEC_RULEPACK_PATH` — path to the authorized YAML
- `HAIEC_MANIFEST_PATH` — path to the canonical manifest JSON

Both paths are resolved to absolute paths at resolution time. The provider
validates:
- File existence (clear error if missing)
- Manifest schema version
- Rulepack version
- SHA-256 digests of both files

## Test/CI resolution

Tests and CI use the synthetic rulepack at:
- `tests/fixtures/synthetic-rulepack/test-rules.yml`
- `tests/fixtures/synthetic-rulepack/test-manifest.json`

The synthetic rulepack contains 4 trivial detectors with no proprietary
production rule bodies.

## What is NOT done

- No private YAML copied into `src/` or `rules/`
- No private YAML embedded in JavaScript
- No base64 encoding or obfuscation
- No encrypted detector bodies committed
- No private rulepack published

## Runtime independence

The scanner runtime does not depend on how an authorized rulepack is
ultimately distributed. The provider abstraction allows future
distribution mechanisms (signed bundle, private registry, etc.) without
changing scanner code.
