/**
 * Secret redaction utility — detects and redacts common secret patterns.
 *
 * Deterministic: same input always produces same output.
 * Does NOT call any LLM. Pure pattern matching.
 */

// Common secret patterns (regexes match the secret value, not surrounding context)
const SECRET_PATTERNS: readonly { pattern: RegExp; label: string }[] = [
  // AWS Access Key ID (20 uppercase alphanumeric chars starting with AKIA/ASIA/etc.)
  { pattern: /\b((?:AKIA|ASIA|AGPA|AIDA|AROA|ANPA|ANVA|ASCA)[A-Z0-9]{16})\b/g, label: '[REDACTED_AWS_KEY]' },
  // AWS Secret Access Key (40 base64 chars)
  { pattern: /\b([A-Za-z0-9/+=]{40})\b/g, label: '[REDACTED_AWS_SECRET]' },
  // GitHub PAT (ghp_/gho_/ghu_/ghs_/ghr_ prefixes)
  { pattern: /\b(gh[pousr]_[A-Za-z0-9]{36})\b/g, label: '[REDACTED_GITHUB_TOKEN]' },
  // Generic API key patterns (sk-... for OpenAI, etc.)
  { pattern: /\b(sk-[A-Za-z0-9]{20,})\b/g, label: '[REDACTED_API_KEY]' },
  // Private key blocks
  { pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g, label: '[REDACTED_PRIVATE_KEY]' },
  // Bearer tokens
  { pattern: /\b(Bearer\s+[A-Za-z0-9\-._~+\/]+=*)\b/g, label: '[REDACTED_BEARER_TOKEN]' },
  // Generic password assignments (password = "..." or password: "...")
  { pattern: /((?:password|passwd|pwd)\s*[:=]\s*["']?)([^\s"']{4,})(["']?)/gi, label: '[REDACTED_PASSWORD]' },
  // Generic secret/token assignments
  { pattern: /((?:secret|api[_-]?key|auth[_-]?token|access[_-]?token)\s*[:=]\s*["']?)([^\s"']{8,})(["']?)/gi, label: '[REDACTED_SECRET]' },
];

export interface RedactionResult {
  readonly redacted: string;
  readonly redactionCount: number;
}

/**
 * Redact common secret patterns from text.
 * Returns the redacted text and a count of redactions.
 */
export function redactSecrets(input: string): RedactionResult {
  let result = input;
  let count = 0;

  for (const { pattern, label } of SECRET_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    const matches = result.matchAll(pattern);
    for (const match of matches) {
      if (match[0] && match[0].length > 0) {
        count++;
      }
    }
    result = result.replace(pattern, label);
  }

  return { redacted: result, redactionCount: count };
}

/**
 * Check if text contains potential secrets without redacting.
 */
export function containsSecrets(input: string): boolean {
  for (const { pattern } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) {
      pattern.lastIndex = 0;
      return true;
    }
  }
  return false;
}
