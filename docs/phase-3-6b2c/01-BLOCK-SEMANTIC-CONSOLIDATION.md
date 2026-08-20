# 01 — BLOCK Semantic Consolidation

## Problem

Phase 2B produced two BLOCK checks:
- `SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT` (detector: ai-tool-abuse-output-exec, Python)
- `SC-EVAL-EXEC-COSMETIC-METAVAR` (detectors: dangerous-eval-exec-ai-output-python/js)

The second name described an OLD implementation defect ("cosmetic metavar"), not a security proposition.

## Analysis

Both checks prove the SAME security proposition: AI/LLM model output flows to dynamic code execution sinks (eval, exec, os.system, os.popen, new Function).

Both use Semgrep taint mode with AI invocation sources (openai.chat.completions.create, anthropic.messages.create, $LLM.invoke, $CHAIN.run, $CHAIN.invoke).

Both share legacy display ID R2. Both have findingKind VULNERABILITY, severity ERROR, disposition BLOCK.

The only difference is language/sink coverage:
- Check 1: Python only, sinks: eval, exec, os.system, os.popen
- Check 2: Python + JS/TS, sinks: eval, exec, new Function

## Decision: SAME PROPOSITION — MERGE

Merged under canonical securityCheckId: `HAIEC-AI-OUTPUT-TO-DYNAMIC-CODE-EXECUTION`

All 3 detectors map to this single check:
- `ai-tool-abuse-output-exec` (Python, sinks: eval, exec, os.system, os.popen)
- `dangerous-eval-exec-ai-output-python` (Python, sinks: eval, exec)
- `dangerous-eval-exec-ai-output-js` (JS/TS, sinks: eval, new Function)

## BLOCK Revalidation

After merge, the single BLOCK check was revalidated:
- 7/7 test scenarios passed (direct flow, intermediate variable, sink-without-source, source-without-sink, safe usage)
- No known fixture FP
- No real-repo FP (0 BLOCK findings in real repos)
- Clear dangerous action, high semantic precision, taint-proven

**BLOCK_ELIGIBLE confirmed.**

## Implementation-Defect Name Removal

No securityCheckId contains: COSMETIC_METAVAR, BUG, FIX, RC3, RC4, or legacy implementation terminology.

`SC-DEBUG-MODE-PRODUCTION` is legitimate — "DEBUG" is a security concept (debug mode in production), not an implementation defect name.

## Final BLOCK Count: 1
