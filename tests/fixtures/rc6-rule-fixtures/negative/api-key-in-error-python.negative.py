# RC.6 Fixture: Negative cases for api-key-in-error-python
# These should NOT be detected by the rule.

# 1. Ordinary error message
raise Exception("Connection failed")

# 2. Error with message variable
raise Exception(error.message)

# 3. Error with reason
raise Exception(reason)

# 4. Error with status text
raise Exception(response.status_text)

# 5. Error with generic message variable
raise Exception(message)

# 6. Error with exception info
raise Exception(str(err))

# 7. Error with user-facing message
raise Exception("Please check your input")

# 8. Error with code
raise Exception(f"Error code: {error_code}")

# 9. Error with description
raise Exception(error_description)

# 10. Error with detail
raise Exception(detail)

# 11. Error with context
raise Exception(context)

# 12. Error with result
raise Exception(result.error)
