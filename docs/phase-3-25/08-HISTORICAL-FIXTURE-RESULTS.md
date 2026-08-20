# 08 — Historical Fixture Results

## test_sample_code.py

| Line | Code | Expected Rule | Actually Fires? | Old Expectation Correct? |
|------|------|---------------|-----------------|--------------------------|
| 9 | `openai.chat.completions.create(...)` | `ai-prompt-injection-openai` | YES | YES (rule fires on all API calls) |
| 18 | `openai.chat.completions.create(..., user_input)` | `ai-prompt-injection-openai` | YES | YES |
| 30 | `os.system("ls -la")` | `ai-tool-abuse-output-exec` | NO | **NO** — taint rule requires AI source |
| 35 | `subprocess.run("echo hello", shell=True)` | `ai-tool-abuse-output-exec` | YES (false positive) | **NO** — should not fire, but does due to engine bug |
| 39 | `lambda x: os.popen(x).read()` | `ai-dangerous-lambda-shell` | Not tested | Unknown |
| 45 | `api_key = "sk-..."` | `hardcoded-api-key-python` | YES | YES |
| 55 | `Chroma.from_documents(documents=user_docs)` | `ai-rag-poisoning` | Not tested | Unknown (user_docs undefined) |
| 63 | `f"User email: {user_email}, SSN: {user_ssn}"` | `pii-in-llm-prompt` | Not tested | Unknown (taint rule) |
| 75 | `requests.get(user_provided_url)` | `ai-ssrf` | Not tested | Unknown (user_provided_url undefined) |
| 82 | `cursor.execute(f"SELECT ... {user_id}")` | `ai-sql-injection` | Not tested | Unknown (user_id undefined) |

## Summary

- **2/10** expectations are semantically correct
- **2/10** are definitively WRONG (lines 30, 35)
- **6/10** are untestable due to undefined variables or untested rules

## Key Finding

The historical test_sample_code.py was NEVER an automated test. It's a manual sample file with inline comments. It was never run through Semgrep in any CI pipeline. The expectations in comments are informal and at least 2 are semantically wrong.
