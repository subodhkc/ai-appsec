# 17 — Candidate Manifest

## Manifest Schema

```json
{
  "manifestSchemaVersion": "1.0",
  "candidateRulepackVersion": "0.1.0-candidate.1",
  "sourceScannerVersion": "semgrep-1.52.0",
  "sourceCommit": "d0ed945d",
  "sourceRulepackHash": "<sha256 of extracted YAML>",
  "detectorDefinitions": 121,
  "logicalChecks": 80,
  "detectors": [
    {
      "detectorId": "ai-prompt-injection-openai",
      "checkId": "R1",
      "ruleRevision": 1,
      "languages": ["python"],
      "category": "Prompt Injection Exposure",
      "findingKind": "VULNERABILITY",
      "legacySeverity": "WARNING",
      "recommendedSeverity": "WARNING",
      "defaultDisposition": "REVIEW",
      "provenanceStatus": "STRONG_HAIEC_ORIGIN_EVIDENCE",
      "publicationStatus": "CANDIDATE",
      "patternHash": "<sha256-16>",
      "ruleBodyHash": "<sha256>"
    }
  ]
}
```

## Manifest Hash

```
c82d4fe928b8f28f...
```

The manifest hash is computed over the deterministic manifest data (no timestamps). Timestamps may exist separately as metadata.

## Candidate Version

`0.1.0-candidate.1`

### Why Not v1.0?

- This is a migration candidate, not a production release
- Provenance audit is strong but not complete (external similarity check pending)
- License has not been chosen
- Rule quality issues are documented but not fixed
- Semgrep execution validation in isolated environment is pending

## Tracked File

The manifest is written to `rules/candidate-manifest.json` — metadata only, no rule patterns.
