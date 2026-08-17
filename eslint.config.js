import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
          {
            group: ['../ai-security/*', '../../engines/ai-security/*'],
            message: 'ai-security engine must not import from other engines. Tool independence violation.',
            allow: [],
          },
          {
            group: ['../tenant-isolation/*', '../../engines/tenant-isolation/*'],
            message: 'tenant-isolation engine must not import from other engines. Tool independence violation.',
            allow: [],
          },
          {
            group: ['../llmverify/*', '../../engines/llmverify/*'],
            message: 'llmverify engine must not import from other engines. Tool independence violation.',
            allow: [],
          },
        ],
        paths: [
          {
            name: '@modelcontextprotocol/server',
            message: 'Engine modules must not import MCP SDK directly. Only src/mcp/ may import MCP SDK.',
            allowTypes: true,
          },
        ],
      },
    },
  },
  {
    files: ['src/mcp/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-console': 'off',
      'no-restricted-imports': 'off',
    },
  },
);
