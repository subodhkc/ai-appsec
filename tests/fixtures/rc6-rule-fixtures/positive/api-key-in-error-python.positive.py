# RC.6 Fixture: Positive cases for api-key-in-error-python
# These SHOULD be detected by the rule.

# 1. Direct API key variable in Exception
raise Exception("Request failed", api_key)

# 2. OpenAI API key variable
raise Exception("Auth failed", openai_api_key)

# 3. Anthropic API key
raise Exception("Error", anthropic_api_key)

# 4. Secret variable
raise Exception("Failed", client_secret)

# 5. Token variable
raise Exception("Auth error", auth_token)

# 6. Password variable
raise Exception("Login failed", user_password)

# 7. Credential variable
raise Exception("Credential error", credential)

# 8. Private key variable
raise Exception("Key error", private_key)

# 9. Access key variable
raise Exception("Access failed", access_key)

# 10. API key in ValueError
raise ValueError("Invalid key", api_key)

# 11. API key with different naming
raise Exception("Error", apiKey)

# 12. Passwd variant
raise Exception("Auth failed", passwd)
