# 18 — Organic Coverage Opportunities

## Principle

Do not market "121 security protections" simply because 121 detectors exist. The public positioning should focus on security coverage domains.

## Supported Coverage Domains

These categories are derived from the actual rule taxonomy (see `11-SECURITY-TAXONOMY.md`). Only categories actually supported by detectors are listed.

### AI Agent Security
- Agent loop detection
- Recursive agent detection
- Agent safety control gaps
- Function calling patterns

### Prompt Injection in AI Applications
- OpenAI prompt injection patterns
- Anthropic prompt injection patterns
- LangChain prompt injection patterns
- LlamaIndex, HuggingFace, Google AI prompt injection patterns

### Secure AI Tool Calling
- Dangerous tool definitions (shell, SQL, filesystem, browser, API requests)
- AI output to code execution
- Tool output injection

### RAG Security
- RAG poisoning detection
- Vector store validation
- Embedding security
- Retrieved context validation

### LLM Secret Exposure
- Hardcoded API keys (OpenAI, Anthropic)
- API keys in logs, errors, URLs
- Sensitive data in embeddings

### AI API Security
- AI provider REST API detection
- SDK usage detection
- Missing authentication controls
- Missing rate limiting
- CORS misconfiguration

### Agent Filesystem Security
- Filesystem access by AI agents
- Multimodal input handling
- Audio/visual processing

### AI-Generated Code Security
- AI output to eval/exec
- AI output to shell execution
- Chain-of-thought exposure
- Streaming response handling

## NOT Supported (Do Not Claim)

- SOC2 compliance — code detectors do not prove SOC2 compliance
- ISO 27001 compliance — same reasoning
- GDPR compliance — legal compliance cannot be verified by code scanning
- HIPAA compliance — same reasoning
- "121 security protections" — 121 detectors ≠ 121 protections (80 logical checks, many are PRESENCE)
