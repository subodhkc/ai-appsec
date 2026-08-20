# 06 — Rule Semantics Method

## Two-Axis Classification

Each detector receives TWO independent judgments:

### TEST STATUS (was the test correct?)

| Status | Meaning |
|--------|---------|
| HISTORICAL_TEST_CORRECT | Historical test expectation was semantically correct |
| HISTORICAL_TEST_WRONG | Historical test expectation was semantically wrong |
| PHASE26_FIXTURE_CORRECT | Phase 2.6 fixture correctly tested the rule |
| PHASE26_FIXTURE_WRONG | Phase 2.6 fixture had wrong source/pattern for the rule |
| EXPECTED_DETECTOR_WRONG | Expected detector ID was mapped incorrectly |
| NO_PREVIOUS_SEMANTIC_TEST | No prior test actually tested this rule's semantics |

### RULE STATUS (does the rule work?)

| Status | Meaning |
|--------|---------|
| WORKS_AS_DESIGNED | Rule fires correctly on intended patterns, doesn't fire on negatives |
| WORKS_BUT_NAME_MISLEADING | Rule works but name implies different behavior |
| WORKS_BUT_MESSAGE_OVERSTATES | Rule works but message claims more than it proves |
| WORKS_BUT_TOO_BROAD | Rule fires correctly but also fires on unintended patterns |
| WORKS_BUT_TOO_NARROW | Rule fires correctly but misses valid patterns due to limited syntax |
| PARSER_ERROR | Rule has a syntax error that prevents execution |
| LOGIC_ERROR | Rule's pattern logic is fundamentally flawed |
| NEEDS_REPAIR | Minor fix needed (e.g., remove invalid pattern) |
| NEEDS_REDESIGN | Fundamental approach is wrong |

## Isolated Testing Method

For each detector:
1. Read the exact rule body from production YAML
2. Identify whether it's TAINT or PATTERN mode
3. For TAINT: identify sources and sinks
4. For PATTERN: identify exact structural patterns
5. Build a MINIMAL positive fixture derived DIRECTLY from the rule pattern
6. Build a negative fixture that should NOT match
7. Run ONLY THAT RULE in isolation against the fixtures
8. Record actual result
9. Classify both TEST STATUS and RULE STATUS independently
