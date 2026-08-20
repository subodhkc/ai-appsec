# 01 — Production Rule Extraction

## Source

- **File:** `haiec-website/modal_ai_security_scanner.py`
- **Variable:** `AI_SECURITY_RULES` (triple-quoted string, line 989)
- **Consumed by:** `setup_rules()` and `run_semgrep()`
- **First commit:** `38b17d66` (2026-01-04, Subodh)
- **Latest commit:** `d0ed945d` (2026-08-01, Subodh)

## Extraction Method

A migration utility (`extract-rules.mjs`) programmatically extracts the YAML content between the `AI_SECURITY_RULES = """` and closing `"""` markers. No manual copy/paste.

## Extraction Results

| Property | Value |
|----------|-------|
| Extracted bytes | 80,839 |
| Valid YAML | Yes |
| Total definitions | 121 |
| Unique IDs | 121 |
| Duplicate IDs | 0 |
| Rules without ID | 0 |
| Rules with metadata | 121 |

## Languages

| Language | Detector Count |
|----------|---------------|
| python | 80 |
| javascript | 59 |
| typescript | 59 |

Note: Many detectors target multiple languages, so counts exceed 121.

## Severity Distribution

| Severity | Count |
|----------|-------|
| INFO | 54 |
| WARNING | 45 |
| ERROR | 22 |

## Metadata Keys Present

- `category`
- `compliance_frameworks`
- `cwe`
- `gdpr_controls`
- `hipaa_controls`
- `iso27001_controls`
- `owasp_categories`
- `owasp_top_10`
- `rule_id`
- `soc2_controls`

## Fidelity

The extracted YAML was not altered during extraction. Patterns, messages, severity, metadata, and rule structure are preserved exactly as they appear in production.
