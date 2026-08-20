/**
 * COMPLETE_GOLDEN_CORPUS — JavaScript component.
 * Parser-stable, supported file type, representative positive/negative rules.
 */

// Positive: API key in error (api-key-in-error-js, rc.6.1)
function handleError(privateKey, accessKey) {
  throw new Error(privateKey);
  throw new Error(accessKey);
}

// Positive: hardcoded API key (api-key-hardcoded-js)
const OPENAI_API_KEY = "sk-1234567890abcdef";

// Positive: unvalidated LLM output in eval (llm-output-eval-js)
function runLlmCode(llmOutput) {
  eval(llmOutput);
}

// Negative: safe error handling
function safeError(key) {
  throw new Error("Authentication failed — check credentials");
}

// Negative: safe config (env var)
const apiKey = process.env.OPENAI_API_KEY;

// Clean file: no security concerns
function add(a, b) {
  return a + b;
}
