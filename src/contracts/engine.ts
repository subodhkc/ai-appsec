/**
 * Engine contract — describes a security engine's identity and capabilities.
 */
export type EngineId =
  | 'ai-security'
  | 'tenant-isolation'
  | 'llmverify'
  | 'deploy-security';

export interface EngineInfo {
  readonly id: EngineId;
  readonly name: string;
  readonly version: string;
  /** Whether this engine is currently integrated (vs. contract-only). */
  readonly integrated: boolean;
}

export const ENGINES: Readonly<Record<EngineId, EngineInfo>> = {
  'ai-security': {
    id: 'ai-security',
    name: 'HAIEC AI Security',
    version: '0.0.0',
    integrated: false,
  },
  'tenant-isolation': {
    id: 'tenant-isolation',
    name: 'Tenant Isolation',
    version: '0.0.0',
    integrated: false,
  },
  'llmverify': {
    id: 'llmverify',
    name: 'LLMVerify',
    version: '0.0.0',
    integrated: false,
  },
  'deploy-security': {
    id: 'deploy-security',
    name: 'Deploy Security Gate',
    version: '0.0.0',
    integrated: false,
  },
} as const;
