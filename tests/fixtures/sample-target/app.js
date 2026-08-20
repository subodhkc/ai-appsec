/**
 * Sample AI application target for synthetic rulepack tests.
 * TEST ONLY — exercises PRESENCE and RISK_SIGNAL finding kinds.
 */
const testai = require('testai');

function generateResponse(prompt) {
  // RISK_SIGNAL: missing max_tokens
  return testai.complete(prompt);
}
