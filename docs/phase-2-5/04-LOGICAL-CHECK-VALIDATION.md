# 04 — Logical Check Validation

## Method

Each of the 80 checkId groups was reviewed semantically:
- Are the detectors in this group actually describing the same security concept?
- For language splits, do the variants implement equivalent semantics?
- Was any detector incorrectly merged?
- Should related detectors be grouped together?

## Results

| Group Status | Count |
|--------------|-------|
| GROUP_VERIFIED | 75 |
| SPLIT_REQUIRED | 0 |
| MERGE_REQUIRED | 0 |
| AMBIGUOUS | 5 |

## AMBIGUOUS Groups (5)

These 5 groups have multiple detectors without a clean language-split pattern. They need manual review before the checkId grouping is frozen:

1. **checkBase: `ai-prompt-injection-openai`** — Contains `ai-prompt-injection-openai` (python) and `ai-prompt-injection-openai-js` (js). Different patterns for different languages but same concept. Likely GROUP_VERIFIED after manual review.

2. **checkBase: `hardcoded-api-key`** — Contains `hardcoded-api-key-python` and `hardcoded-api-key-js`. Same concept, different languages. Likely GROUP_VERIFIED.

3. **checkBase: `hardcoded-anthropic-api-key`** — Contains `hardcoded-anthropic-api-key-python` and `hardcoded-anthropic-api-key-js`. Same concept. Likely GROUP_VERIFIED.

4. **checkBase: `api-key-in-error`** — Contains `api-key-in-error-python` and `api-key-in-error-js`. Same concept. Likely GROUP_VERIFIED.

5. **checkBase: `api-key-in-logs`** — Contains `api-key-in-logs-python` and `api-key-in-logs-js`. Same concept. Likely GROUP_VERIFIED.

## Conclusion

All 5 AMBIGUOUS groups are likely GROUP_VERIFIED after manual review — they are language splits with slightly different message wording but the same security concept. The final logical-check count remains **80**.

No AMBIGUOUS logical identity will become canonical until manually verified.
