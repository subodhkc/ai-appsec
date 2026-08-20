"""
COMPLETE_GOLDEN_CORPUS — deterministic release qualification corpus.

Purpose: qualify COMPLETE coverage, Receipt reproducibility, and
semantic Receipt identity across independent processes.

This corpus is NOT intended to prove detector recall. It uses
parser-stable syntax and supported file types only.
"""

# Positive: API key in error (api-key-in-error-python, rc.6.1)
def send_error(key):
    raise Exception(f"Failed with key: {key}")

# Positive: hardcoded API key (api-key-hardcoded-python)
OPENAI_API_KEY = "sk-1234567890abcdef"

# Positive: unvalidated LLM output used in exec (llm-output-exec-python)
def run_llm_command(llm_output):
    exec(llm_output)

# Negative: safe error handling
def safe_error(key):
    raise Exception("Authentication failed — check your credentials")

# Negative: safe config (env var, not hardcoded)
import os
API_KEY = os.environ.get("OPENAI_API_KEY")
