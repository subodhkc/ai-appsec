# 07 — BLOCK Disposition Review

## Context

Phase 2A produced one default BLOCK: `SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT`.

Phase 2B repaired `dangerous-eval-exec-ai-output-python/js` with taint mode, creating a second BLOCK-eligible check: `SC-EVAL-EXEC-COSMETIC-METAVAR`.

## Test Scenarios

7 test cases were run against the rc.4 rulepack:

| # | Scenario | Expected | Result | Pass |
|---|---|---|---|---|
| 1 | Direct AI output -> eval | FIRE | FIRED (line 8) | YES |
| 2 | Direct AI output -> exec | FIRE | FIRED (line 13) | YES |
| 3 | AI output -> intermediate variable -> sink | FIRE | FIRED (line 19) | YES |
| 4 | Fixed eval unrelated to AI | NOT FIRE | NOT FIRED | YES |
| 5 | Sink without AI source | NOT FIRE | NOT FIRED | YES |
| 6 | AI source without sink | NOT FIRE | NOT FIRED | YES |
| 7 | AI output used safely | NOT FIRE | NOT FIRED | YES |

## Decision

**BLOCK_ELIGIBLE** for both checks:

1. `SC-AI-OUTPUT-TO-CODE-EXECUTION-TAINT` (ai-tool-abuse-output-exec)
   - Clear dangerous action: AI output to eval/exec/os.system/os.popen
   - High semantic precision: taint mode
   - Positive/negative/adversarial success
   - No known fixture FP
   - No ambiguous source/sink interpretation

2. `SC-EVAL-EXEC-COSMETIC-METAVAR` (dangerous-eval-exec-ai-output-python/js)
   - Clear dangerous action: AI output to eval/exec/new Function
   - High semantic precision: taint mode (rc.4)
   - Positive/negative/adversarial success
   - No known fixture FP
   - No ambiguous source/sink interpretation

## Final BLOCK Count: 2

Both detectors prove the same security proposition (AI output to dangerous code execution). Cross-rule interference: both fire on the same lines, which normalization should handle by grouping under their respective securityCheckIds.

## Rationale

BLOCK is appropriate because:
- AI output flowing to eval/exec is a direct code injection vector
- The taint-proven detection has high semantic precision
- False positive rate is zero on tested fixtures
- The risk of NOT blocking (allowing AI output to eval in production) is severe

Deploy policy may later decide whether REVIEW findings block. The BLOCK disposition here means the default recommendation is to block.
