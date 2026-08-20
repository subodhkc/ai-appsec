# AI Security Public Claims Evidence Matrix

## Methodology

Every public/crawlable HAIEC claim about the AI security scanner was inspected.
Evidence was evaluated against:
- Production source code (`modal_ai_security_scanner.py`)
- Phase 2.6 frozen corpus results
- Phase 3.3 isolated test results
- Phase 3.4 corpus rerun + reproducibility experiment
- Repository artifacts (tests, docs, configs)

## Claims Matrix

| # | Claim | Location | Status | Evidence |
|---|-------|----------|--------|----------|
| 1 | "121-rule deterministic engine" | llms.txt:130 | SUPPORTED | Production code: `RULEPACK_VERSION = "121-rules-v4-soc2"`, 121 detector definitions extracted |
| 2 | "91 AI-specific security rules + 30 SOC 2 compliance rules" | llms.txt:131 | SUPPORTED | Production code comment: "91 core AI security + 30 SOC2 compliance" |
| 3 | "92 core rules" | docs/engines/ai-security-static:7,23,269 | CONFLICTING | Conflicts with 91 count in production code. Docs say 92, scanner says 91. |
| 4 | "False positive rate: under 1%" | llms.txt:180 | UNSUPPORTED | No experiment, corpus, methodology, TP/FP count, or adjudication artifacts found anywhere in the repository. The claim-registry.json blocks "500+ companies" claims for lack of evidence. |
| 5 | "validated against 500+ real-world AI repositories" | llms.txt:180 | UNSUPPORTED | No corpus, selection method, date, version, finding count, or manual adjudication exists. No test artifacts reference 500+ repos. |
| 6 | "Scan time: 60 seconds" | llms.txt:181 | CONFLICTING | how-it-works page says "30 seconds to 3 minutes depending on repository size". No universal 60-second SLA evidence. |
| 7 | "Every finding is backed by a provable data-flow path" | llms.txt:133 | FALSE_AS_WRITTEN | Many rules are simple pattern matches (e.g., `import openai`, `openai.api_key = "..."`) that do not have data-flow paths. Only taint-mode rules (6 of 121) have data flow. |
| 8 | "Deterministic" / "same input = same output" | llms.txt:91 | SUPPORTED_WITH_SCOPE | 5/5 identical runs in reproducibility experiment. Scope: deterministic under pinned rulepack, engine version, config, and source snapshot. NOT globally "100% deterministic." |
| 9 | "100% deterministic" | llms.txt:192 | SUPPORTED_WITH_SCOPE | Same as above. The claim should say "deterministic under pinned rulepack, engine, config, and source snapshot" not "100% deterministic" |
| 10 | "100% reproducible" | Implied by "same code = same findings every time" | SUPPORTED_WITH_SCOPE | 5/5 identical normalized digests. Scope-limited. |
| 11 | "AST-based" | docs/engines/ai-security-static:62 | SUPPORTED | Semgrep uses AST-based parsing (tree-sitter and internal parsers) |
| 12 | "Never runs your code or makes external requests" | docs/engines/ai-security-static:141 | SUPPORTED | Semgrep static analysis does not execute target code |
| 13 | "No code is stored or transmitted after scan completion" | how-it-works:297 | NOT_YET_TESTED | Product infrastructure claim; not verifiable from source code alone |
| 14 | "121-rule analysis" | llms.txt:475 | SUPPORTED | 121 detector definitions confirmed |
| 15 | "91 AI + 30 SOC2" | llms.txt:131 | SUPPORTED | Production code confirms this split |
| 16 | "Complete data-flow path from source to sink" | llms.txt:172 | FALSE_AS_WRITTEN | Only 6 taint-mode rules produce data-flow paths. 115 pattern-mode rules do not. |
| 17 | "No AI-based scoring - everything is deterministic" | llms.txt:192 | SUPPORTED | Production scanner uses deterministic Semgrep rules, no ML scoring |
| 18 | "60-second scans" | llms.txt:831 | CONFLICTING | See claim #6 |

## Summary Counts

| Status | Count |
|--------|-------|
| SUPPORTED | 7 |
| SUPPORTED_WITH_SCOPE | 3 |
| CONFLICTING | 2 |
| UNSUPPORTED | 2 |
| FALSE_AS_WRITTEN | 2 |
| NOT_YET_TESTED | 1 |
| STALE | 0 |
| **TOTAL** | **17** |

## Specific Evidence Status

### <1% False-Positive Claim: UNSUPPORTED
No experiment exists. No corpus, methodology, TP/FP count, confidence interval, or raw artifacts found. Synthetic fixtures do not establish a real-world FP rate.

### 500+ Repository Claim: UNSUPPORTED
No corpus, selection method, date, version, finding count, or manual adjudication exists. The claim-registry.json explicitly blocks "500+ companies" customer claims for lack of evidence.

### 60-Second Claim: CONFLICTING
The how-it-works page says "30 seconds to 3 minutes depending on repository size." No universal 60-second SLA is evidenced. The reproducibility experiment showed 22-25s for 107 fixtures, but this is not a full repository scan.

### "Every finding has data-flow path": FALSE_AS_WRITTEN
Only 6 of 121 rules use taint mode (data flow). The remaining 115 use pattern matching, which does not produce data-flow paths. Examples of findings without data flow: `import openai`, `openai.api_key = "..."`, `DEBUG = True`.

## Safe Replacement Wording

| Original Claim | Safe Replacement |
|----------------|-----------------|
| "False positive rate: under 1%" | Remove until empirically measured |
| "validated against 500+ real-world AI repositories" | Remove until corpus exists |
| "Every finding is backed by a provable data-flow path" | "Findings include pattern-based detections and data-flow taint analysis" |
| "60 seconds" | "Typically under 3 minutes depending on repository size" |
| "100% deterministic" | "Deterministic under a pinned rulepack, engine version, configuration, and source snapshot" |
| "92 core rules" | "91 core AI security rules" (align with production code) |
