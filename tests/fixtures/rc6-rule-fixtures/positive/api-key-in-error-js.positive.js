// RC.6 Fixture: Positive cases for api-key-in-error-js
// These SHOULD be detected by the rule.

// 1. Direct API key variable in Error
throw new Error(apiKey);

// 2. OpenAI API key variable
throw new Error(openaiApiKey);

// 3. Anthropic API key with underscores
throw new Error(anthropic_api_key);

// 4. API key in interpolated error
throw new Error(`Failed with key: ${apiKey}`);

// 5. Secret variable
throw new Error(clientSecret);

// 6. Token variable
throw new Error(authToken);

// 7. Password variable
throw new Error(userPassword);

// 8. Credential variable
throw new Error(credential);

// 9. Private key variable
throw new Error(privateKey);

// 10. Access key variable
throw new Error(accessKey);

// 11. API key as argument among others
throw new Error("Request failed", apiKey);

// 12. API key in ValueError-like pattern (JS equivalent)
throw new Error(`Auth failed for ${api_key}`);
