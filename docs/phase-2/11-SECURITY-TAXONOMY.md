# 11 — Security Taxonomy

## Categories

| Category | Detector Count |
|----------|---------------|
| AI API / Authentication | 34 |
| Agent / Tool Execution | 23 |
| Production Controls | 12 |
| Secrets & Credentials | 11 |
| Output Handling | 9 |
| RAG / Retrieval Security | 8 |
| Prompt Injection Exposure | 7 |
| AI Data Exposure | 7 |
| Model / Supply Integrity | 5 |
| Multimodal / File Handling | 5 |

## Category Definitions

### AI API / Authentication (34)
Detectors for AI provider imports, SDK usage, REST API calls, authentication controls, rate limiting, and CORS configuration.

### Agent / Tool Execution (23)
Detectors for AI agent loops, recursive agents, tool definitions, function calling, tool output injection, memory injection, context overflow, and dangerous tools.

### Production Controls (12)
Detectors for debug mode in production, verbose error messages, missing error logging, missing cost tracking, missing max tokens, missing input validation.

### Secrets & Credentials (11)
Detectors for hardcoded API keys, API keys in logs, errors, and URLs.

### Output Handling (9)
Detectors for XSS, SQL injection, SSRF, streaming responses, and chain-of-thought exposure in AI outputs.

### RAG / Retrieval Security (8)
Detectors for RAG poisoning, vector store validation, embedding security, similarity search, and retrieved context validation.

### Prompt Injection Exposure (7)
Detectors for prompt injection patterns across OpenAI, Anthropic, LangChain, LlamaIndex, HuggingFace, and Google AI.

### AI Data Exposure (7)
Detectors for PII in prompts, sensitive DB fields in prompts, data minimization, LLM response PII, and training data leakage.

### Model / Supply Integrity (5)
Detectors for unverified model loading, model poisoning, missing model integrity, and model extraction.

### Multimodal / File Handling (5)
Detectors for multimodal input, audio/visual processing, and filesystem access by AI agents.

## Design Principles

1. **Developer comprehension:** Categories map to what developers search for
2. **AI tool reasoning:** Categories help AI agents select the right scan
3. **Organic discovery:** Categories align with search terms developers use
4. **Not compliance-oriented:** Categories focus on security, not audit frameworks
