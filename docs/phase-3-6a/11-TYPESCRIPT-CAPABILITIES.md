# 11 — TypeScript Capabilities

## Reconciliation with Phase 3.5

Phase 3.5 inspected the TypeScript deterministic engine and identified salvageable components. This phase reconciles the terminology: CFGBuilder, CFGReachability, AndersenAnalysis, HeapAnalysis, etc. are **analyzer capabilities**, NOT **security rules**.

## Classification

### ANALYZER_CAPABILITY (8)

| Component | Path | Capability | Value |
|-----------|------|-----------|-------|
| FlowGraphBuilder | lib/ai-security/flow-graph.ts | CFG construction + path enumeration | Foundation for taint analysis; explicitly documents limitations (no full interprocedural, no alias analysis, no control-flow analysis) |
| CFGReachability | lib/ai-security/cfg-reachability.ts | CFG reachability queries | Determines if a source can reach a sink |
| AliasAnalysis | lib/ai-security/alias-analysis.ts | Variable alias tracking | Tracks when two variables point to same object |
| HeapAnalysis | lib/ai-security/heap-analysis.ts | Heap state modeling | Tracks object mutations across function calls |
| DataFlowAnalysis | lib/ai-security/data-flow-analysis.ts | Forward/backward data-flow | Tracks taint propagation |
| DeterministicTaint | lib/ai-security/deterministic-taint.ts | Taint source → sink tracking | Combines CFG + data-flow for taint analysis |
| ConservativeFlagging | lib/ai-security/conservative-flagging.ts | Uncertainty-aware flagging | Reduces FPs by flagging uncertain findings conservatively |
| UncertaintyTracker | lib/ai-security/uncertainty-tracker.ts | Confidence/uncertainty tracking | Tracks analysis confidence per finding |

### SECURITY_CHECK (0)

None of these components test a security proposition directly. They are analysis infrastructure.

### POST_PROCESSOR (2)

| Component | Path | Function |
|-----------|------|----------|
| FalsePositiveFilter | lib/ai-security/false-positive-filter.ts | Filters known FP patterns |
| BestPracticesDetector | lib/ai-security/best-practices-detector.ts | Detects positive security practices |

### QUALITY_CONTROL (2)

| Component | Path | Function |
|-----------|------|----------|
| ConfidenceScorer | lib/ai-security/scoring/confidence-scorer.ts | Calculates confidence scores |
| ValidationAnalyzer | lib/ai-security/validation-analyzer.ts | Validates input/output handling |

### EVIDENCE_CAPABILITY (3)

| Component | Path | Function |
|-----------|------|----------|
| EvidenceBuilder | lib/ai-security/evidence/evidence-builder.ts | Builds evidence packs |
| ArtifactGenerator | lib/ai-security/artifact-generator.ts | Generates trust artifacts |
| RuleEvaluationTracker | lib/ai-security/rule-evaluation-tracker.ts | Tracks which rules ran |

### DEAD/EXPERIMENTAL (1)

| Component | Path | Status |
|-----------|------|--------|
| V2 RulesEngineAdapter | lib/ai-security/v2/rules-engine-adapter.ts | Experimental V2 architecture; reuses old flow-graph and rules engine |

## Capabilities That Might Improve Future Static Scanner Beyond Semgrep

1. **FlowGraph + CFGReachability:** Semgrep has taint mode but limited interprocedural analysis. HAIEC's CFG could provide deeper path analysis for specific high-value rules.
2. **AliasAnalysis + HeapAnalysis:** Semgrep doesn't do alias analysis. These could reduce FPs in taint rules where aliases are involved.
3. **ConservativeFlagging + UncertaintyTracker:** Semgrep doesn't have uncertainty tracking. This could add confidence tiers to findings.
4. **BestPracticesDetector:** Semgrep detects violations, not positive practices. This could enable true negative evidence.

## Integration Status

**NOT integrated into production scan path.** The TypeScript engine is imported by `lib/ai-security/index.ts` and used by:
- Compliance wizard questionnaires (soc2-questionnaire.tsx, gdpr-questionnaire.tsx)
- Readiness engine (lib/outcome/readiness-engine.ts)
- Outcome generator (lib/outcome/outcome-generator.ts)
- Adapter runtime proof tests

But it is NOT called by the Modal scanner or the scan completion handler. The production scan path is:
```
Modal (Python/Semgrep) → SARIF → ScanCompletionHandler → Aggregation → DB → Reports
```

The TypeScript engine runs separately for compliance wizard / readiness assessments, NOT for static security scans.

## Recommendation

Do NOT integrate the TypeScript engine as a second production scanner. Instead:
1. Preserve the analyzer capabilities as a FUTURE_CANONICAL_ANALYZER layer
2. Use ConservativeFlagging + UncertaintyTracker concepts in the normalization layer
3. Use BestPracticesDetector for true positive evidence in trust pages
4. Do NOT call it from `scan_ai_security` MCP tool
