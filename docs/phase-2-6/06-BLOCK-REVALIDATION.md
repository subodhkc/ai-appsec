# 06 — BLOCK Revalidation

## Result: ZERO Confirmed BLOCK Detectors

All 9 BLOCK candidates from Phase 2.5 have been downgraded to `REDESIGN_BEFORE_BLOCK`.

## Why All Failed

### Fixture Validation Criteria
A BLOCK detector must pass:
1. Positive fixture triggers the expected detector
2. Negative fixture does NOT trigger
3. False-positive fixture does NOT trigger
4. Detector fires in full scan

### Results

| Detector | Pos | Neg | FP | Fired | Classification |
|----------|-----|-----|-----|-------|----------------|
| `ai-tool-abuse-output-exec` | PASS | FAIL | FAIL | YES | REDESIGN_BEFORE_BLOCK |
| `dangerous-eval-exec-ai-output` | FAIL | N/A | N/A | YES | REDESIGN_BEFORE_BLOCK |
| `hardcoded-api-key-python` | FAIL | N/A | N/A | YES | REDESIGN_BEFORE_BLOCK |
| `hardcoded-api-key-js` | FAIL | N/A | N/A | NO | REDESIGN_BEFORE_BLOCK |
| `hardcoded-anthropic-api-key-python` | FAIL | N/A | N/A | NO | REDESIGN_BEFORE_BLOCK |
| `hardcoded-anthropic-api-key-js` | FAIL | N/A | N/A | NO | REDESIGN_BEFORE_BLOCK |
| `hardcoded-openai-api-key` | FAIL | PASS | FAIL | NO | REDESIGN_BEFORE_BLOCK |
| `api-key-in-url-python` | FAIL | N/A | N/A | NO | REDESIGN_BEFORE_BLOCK |
| `api-key-in-url-js` | FAIL | N/A | N/A | NO | REDESIGN_BEFORE_BLOCK |

### Detailed Failures

#### `ai-tool-abuse-output-exec`
- Positive: PASS (fired on positive fixture)
- Negative: FAIL — `ai-openai-import` and `ai-prompt-injection-openai` fired on the negative fixture (which uses `print()` not `subprocess.run()`)
- False-positive: FAIL — same detectors fired on the false-positive fixture
- **Issue:** The detector itself may be fine, but the fixture contains OpenAI API calls that trigger other broad detectors. The BLOCK classification fails because the overall scan produces false positives on this fixture.

#### `dangerous-eval-exec-ai-output`
- Positive: FAIL — `ai-prompt-injection-openai` and `ai-openai-import` fired instead of the expected detector
- **Issue:** The fixture contains `openai.ChatCompletion.create()` which triggers broad detectors before the eval detector can match

#### `hardcoded-api-key-python`
- Positive: FAIL — `ai-openai-import` fired instead
- Fired in scan: YES (fired on other fixtures, not its own positive fixture)
- **Issue:** The positive fixture's key pattern doesn't match the detector's pattern syntax

#### `hardcoded-openai-api-key`
- Positive: FAIL — `ai-openai-import` and `hardcoded-api-key-python` fired instead
- False-positive: FAIL — `hardcoded-api-key-python` fired on `YOUR_API_KEY` placeholder
- **Issue:** The detector didn't fire on the real key but `hardcoded-api-key-python` fired on the placeholder

## Conclusion

**No detector can be CONFIRMED_BLOCK** because:
1. Most detectors don't fire on their intended positive fixtures
2. Broad detectors (`ai-prompt-injection-openai`, `ai-openai-import`) fire on almost everything
3. Secret detectors cannot distinguish real keys from placeholders
4. The overall false-positive rate is too high for automated deployment blocking

All 9 are classified `REDESIGN_BEFORE_BLOCK` with current disposition `REVIEW`.
