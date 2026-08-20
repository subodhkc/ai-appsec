"""
Sample AI application target for synthetic rulepack tests.
TEST ONLY — exercises all four finding kinds.
"""
import testai

def generate_response(prompt):
    # RISK_SIGNAL: missing max_tokens
    response = testai.complete(prompt)
    return response

def dangerous_eval(prompt):
    # VULNERABILITY: AI output to eval
    response = testai.generate(prompt)
    # This is the dangerous pattern
    result = eval(response)
    return result

def no_error_handling(prompt):
    # CONTROL_GAP: missing error handling
    response = testai.complete(prompt)
    return response
