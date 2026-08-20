# Phase 4A — Input Baseline

## Frozen inputs

All inputs are pinned and digested. The canonical candidate was not modified.

### Rulepack candidate

| Field | Value |
|-------|-------|
| Version | `0.1.0-rc.5` |
| Semgrep | `1.173.0` |
| Detectors | 122 |
| Semantic checks | 79 |
| BLOCK checks | 1 (`HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION`) |

### Input digests

| Input | SHA-256 |
|-------|---------|
| Canonical YAML | `sha256:33b4a0dd4a188f38afb6a4576df1b4840b1a21c51d79a037dfe5ba2dd9ae29c1` |
| Canonical manifest | `sha256:a3f702f240e1b49282e864f037ce8e9e426cabac633157dcfcb267920834ad5f` |
| Target-scope contract | `sha256:f5eb5a305317444b338914a5723d65d69aac92ba1bb34e6481f9ea1cfd4c1276` |
| Semgrep dependency contract | `sha256:fb5f5f79d8a53190edb9df7dad30a2130049ab4b7380b12448a0af84f185288d` |
| Agent-output contract | `sha256:aaa017726846a9252adc50ef552a32684f6593cfafbe2eefdd3b09089f278346` |
| Phase 3.6B-2C qualification | `sha256:bb68bb2aa0011dc9a832f860ee4b612c64fc88ffb58aec29cadf5bf54397489a` |

### Semgrep dependency

| Field | Value |
|-------|-------|
| Required version | `1.173.0` |
| Immutable Docker digest | `sha256:67319956...` |
| Verified stable | `1.173.0` |

### Finding taxonomy

| Kind | Count |
|------|-------|
| PRESENCE | 19 |
| RISK_SIGNAL | 37 |
| CONTROL_GAP | 11 |
| VULNERABILITY | 12 |

| Disposition | Count |
|-------------|-------|
| INFORMATIONAL | 19 |
| REVIEW | 59 |
| BLOCK | 1 |
