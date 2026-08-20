# 06 — Golden Corpus Results

## Fixture Count

| Category | Python | JavaScript | Total |
|----------|--------|------------|-------|
| Positive | 80 | 13 | 93 |
| Negative | 5 | 2 | 7 |
| False-positive | 5 | 2 | 7 |
| **Total** | **90** | **17** | **107** |

## Coverage

### Positive Fixtures (93)
- 80 Python fixtures covering all Python detectors
- 13 JavaScript fixtures covering key JS detectors
- Each fixture contains synthetic code that should trigger the corresponding detector

### Negative Fixtures (7) — BLOCK Candidates Only
- `hardcoded-api-key-negative.py`: Uses `os.environ.get()` instead of hardcoded key
- `hardcoded-api-key-negative.js`: Uses `process.env.OPENAI_API_KEY`
- `hardcoded-openai-api-key-negative.py`: Uses `os.environ.get()`
- `api-key-in-url-negative.py`: Uses Authorization header instead of URL parameter
- `api-key-in-url-negative.js`: Uses Authorization header
- `ai-tool-abuse-output-exec-negative.py`: Prints AI output instead of executing
- `dangerous-eval-exec-negative.py`: Uses `json.loads()` instead of `eval()`

### False-Positive Fixtures (7) — BLOCK Candidates Only
- `hardcoded-api-key-falsepos.py`: Placeholder key `sk-xxxx...your-key-here`
- `hardcoded-openai-api-key-falsepos.py`: `YOUR_API_KEY` placeholder
- `api-key-in-url-falsepos.py`: Signed URL with temporary token
- `ai-tool-abuse-output-exec-falsepos.py`: Logging AI output (not executing)
- `dangerous-eval-exec-falsepos.py`: `eval("1 + 2")` test code (not AI output)
- `hardcoded-api-key-falsepos.js`: `YOUR_API_KEY` placeholder
- `api-key-in-url-falsepos.js`: Signed URL with temporary token

## Synthetic Only

All fixtures are synthetic. No customer code, private repository code, or production secrets were used.

## Fixture Hashes

All fixture hashes are recorded in `baseline/semgrep-1.52/fixture-hashes.json` for deterministic verification.
