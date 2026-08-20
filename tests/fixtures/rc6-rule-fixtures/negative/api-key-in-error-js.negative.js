// RC.6 Fixture: Negative cases for api-key-in-error-js
// These should NOT be detected by the rule.

// 1. Ordinary error message
throw new Error("Connection failed");

// 2. Error with message variable
throw new Error(error.message);

// 3. Error with reason
throw new Error(reason);

// 4. Error with status text
throw new Error(response.statusText);

// 5. Error with generic message variable
throw new Error(message);

// 6. Error with exception info
throw new Error(err.toString());

// 7. Error with user-facing message
throw new Error("Please check your input");

// 8. Error with code
throw new Error(`Error code: ${errorCode}`);

// 9. Error with description
throw new Error(errorDescription);

// 10. Error with detail
throw new Error(detail);

// 11. Error with context
throw new Error(context);

// 12. Error with result
throw new Error(result.error);
