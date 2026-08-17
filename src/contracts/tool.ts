/**
 * Tool contracts — the four model-facing MCP tool descriptors.
 *
 * Each descriptor optimizes for model SELECTION, not marketing.
 * Descriptions include positive use cases AND negative boundaries.
 *
 * Invariants:
 * - scan_ai_security MUST NOT invoke LLMVerify or Tenant Isolation.
 * - scan_tenant_isolation MUST NOT invoke LLMVerify or AI security.
 * - verify_llm_content MUST NOT invoke source or tenant scanners.
 * - check_deploy_security is the ONLY composite tool, and must disclose
 *   which engines ran and why.
 *
 * Phase 0 defines descriptors only. Handlers are NOT implemented.
 */
import type { EngineId } from './engine.js';

export type ToolName =
  | 'scan_ai_security'
  | 'scan_tenant_isolation'
  | 'verify_llm_content'
  | 'check_deploy_security';

export interface ToolDescriptor {
  readonly name: ToolName;
  readonly title: string;
  readonly description: string;
  readonly positiveUseCases: readonly string[];
  readonly negativeUseCases: readonly string[];
  readonly engine: EngineId;
  readonly readOnly: boolean;
  readonly destructive: boolean;
  readonly openWorld: boolean;
  /** Whether this tool is implemented (vs. contract-only in Phase 0). */
  readonly implemented: boolean;
}

export const SCAN_AI_SECURITY: ToolDescriptor = {
  name: 'scan_ai_security',
  title: 'Scan AI/LLM Source Code Security',
  description: [
    'Scan AI/LLM/agent application source code for AI-specific security risks',
    'such as unsafe tool execution, prompt-injection exposure, secrets, RAG risks,',
    'insecure AI APIs, and production security patterns.',
    '',
    'Use for: security review of AI source code, AI-generated code, changed AI code,',
    'repository AI security, RAG/agent/tool security.',
    '',
    'Do NOT use for: tenant-boundary-only analysis, evaluating an actual LLM response,',
    'generic non-security code review.',
  ].join('\n'),
  positiveUseCases: [
    'Security review of AI source code',
    'AI-generated code security review',
    'Changed AI code security review',
    'Repository AI security scan',
    'RAG/agent/tool security review',
  ],
  negativeUseCases: [
    'Tenant-boundary-only analysis (use scan_tenant_isolation)',
    'Evaluating an actual LLM response (use verify_llm_content)',
    'Generic non-security code review',
    'CSS/UI/style changes',
    'Documentation tasks',
  ],
  engine: 'ai-security',
  readOnly: true,
  destructive: false,
  openWorld: false,
  implemented: false,
};

export const SCAN_TENANT_ISOLATION: ToolDescriptor = {
  name: 'scan_tenant_isolation',
  title: 'Scan Tenant Isolation Security',
  description: [
    'Analyze multi-tenant SaaS or MCP server code for cross-tenant data exposure,',
    'missing tenant filters, IDOR, RLS gaps, shared caches, session/credential scoping,',
    'vector namespaces, and tenant isolation risks.',
    '',
    'Use when: tenants, organizations, workspaces, accounts, RLS, tenant-aware databases,',
    'shared vector stores, or tenant-aware MCP tools are relevant.',
    '',
    'Do NOT use for: general source security or LLM content verification.',
  ].join('\n'),
  positiveUseCases: [
    'Multi-tenant SaaS tenant isolation review',
    'RLS (row-level security) gap detection',
    'Cross-tenant data exposure analysis',
    'Shared cache/vector store tenant scoping',
    'Tenant-aware MCP tool boundary review',
  ],
  negativeUseCases: [
    'General AI source security (use scan_ai_security)',
    'LLM content verification (use verify_llm_content)',
    'Non-tenant-related security issues',
    'Single-tenant applications',
  ],
  engine: 'tenant-isolation',
  readOnly: true,
  destructive: false,
  openWorld: false,
  implemented: false,
};

export const VERIFY_LLM_CONTENT: ToolDescriptor = {
  name: 'verify_llm_content',
  title: 'Verify LLM Input/Output Content',
  description: [
    'Analyze supplied LLM input or output for prompt-injection indicators,',
    'PII exposure, harmful-content patterns, and other LLMVerify-supported risk signals.',
    '',
    'Use ONLY for actual AI/LLM input/output content.',
    '',
    'Do NOT use to scan source-code repositories.',
  ].join('\n'),
  positiveUseCases: [
    'Checking an LLM response for PII',
    'Detecting prompt injection in LLM output',
    'Verifying LLM-generated content safety',
    'Analyzing LLM input for harmful patterns',
  ],
  negativeUseCases: [
    'Scanning source-code repositories (use scan_ai_security)',
    'Tenant isolation analysis (use scan_tenant_isolation)',
    'Deploy/release gating (use check_deploy_security)',
    'Non-LLM text analysis',
  ],
  engine: 'llmverify',
  readOnly: true,
  destructive: false,
  openWorld: false,
  implemented: false,
};

export const CHECK_DEPLOY_SECURITY: ToolDescriptor = {
  name: 'check_deploy_security',
  title: 'Check Deploy/Release Security Gate',
  description: [
    'Future explicit pre-merge/release/deployment security gate.',
    'May orchestrate explicitly applicable security engines.',
    'Must disclose: enginesRun, enginesSkipped, and reason for each.',
    'Must NOT silently invoke engines merely because they exist.',
    '',
    'Use for: pre-merge security checks, release readiness, deploy gating.',
    '',
    'Do NOT use for: individual security scans (use the specific scan tool).',
    '',
    'Note: This tool is not yet implemented.',
  ].join('\n'),
  positiveUseCases: [
    'Pre-merge security gate',
    'Release readiness check',
    'Deploy security verification',
  ],
  negativeUseCases: [
    'Individual AI security scans (use scan_ai_security)',
    'Individual tenant isolation scans (use scan_tenant_isolation)',
    'LLM content verification (use verify_llm_content)',
  ],
  engine: 'deploy-security',
  readOnly: true,
  destructive: false,
  openWorld: false,
  implemented: false,
};

export const TOOL_DESCRIPTORS: readonly ToolDescriptor[] = [
  SCAN_AI_SECURITY,
  SCAN_TENANT_ISOLATION,
  VERIFY_LLM_CONTENT,
  CHECK_DEPLOY_SECURITY,
] as const;

export const TOOL_MAP: Readonly<Record<ToolName, ToolDescriptor>> = {
  scan_ai_security: SCAN_AI_SECURITY,
  scan_tenant_isolation: SCAN_TENANT_ISOLATION,
  verify_llm_content: VERIFY_LLM_CONTENT,
  check_deploy_security: CHECK_DEPLOY_SECURITY,
} as const;
