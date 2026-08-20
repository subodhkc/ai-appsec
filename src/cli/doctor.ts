/**
 * HAIEC Agent Security CLI — doctor command.
 *
 * Read-only diagnostic that checks:
 * - OS/architecture
 * - Node compatibility
 * - HAIEC-managed Semgrep
 * - PATH Semgrep
 * - Exact Semgrep version
 * - Executable launch verification
 *
 * No network. No filesystem mutation.
 */
import { SemgrepResolver, getManagedSemgrepPath, getHaiecHome } from '../engines/ai-security/semgrep-resolver.js';

export interface DoctorResult {
  readonly schemaVersion: string;
  readonly platform: string;
  readonly arch: string;
  readonly nodeVersion: string;
  readonly nodeCompatible: boolean;
  readonly requiredNodeVersion: string;
  readonly semgrep: {
    readonly readiness: string;
    readonly requiredVersion: string;
    readonly detectedVersion: string | null;
    readonly managedPath: string;
    readonly managedExists: boolean;
    readonly executablePath: string | null;
    readonly setupAvailable: boolean;
    readonly remediationCode: string;
    readonly recommendedCommand: string | null;
  };
  readonly haiecHome: string;
  readonly timestamp: string;
}

const DOCTOR_SCHEMA_VERSION = '1.0.0';
const REQUIRED_NODE_MAJOR = 22;

export async function runDoctor(): Promise<DoctorResult> {
  const platform = process.platform;
  const arch = process.arch;
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  const nodeCompatible = nodeMajor >= REQUIRED_NODE_MAJOR;

  const haiecHome = getHaiecHome();
  const managedPath = getManagedSemgrepPath();

  const resolver = new SemgrepResolver();
  const semgrep = await resolver.resolve();

  // Check if managed Semgrep file exists
  const fs = await import('node:fs/promises');
  let managedExists = false;
  try {
    await fs.access(managedPath);
    managedExists = true;
  } catch {
    managedExists = false;
  }

  return {
    schemaVersion: DOCTOR_SCHEMA_VERSION,
    platform,
    arch,
    nodeVersion,
    nodeCompatible,
    requiredNodeVersion: `>=${REQUIRED_NODE_MAJOR}`,
    semgrep: {
      readiness: semgrep.readiness,
      requiredVersion: semgrep.requiredVersion,
      detectedVersion: semgrep.version,
      managedPath,
      managedExists,
      executablePath: semgrep.executablePath,
      setupAvailable: semgrep.setupAvailable,
      remediationCode: semgrep.remediationCode,
      recommendedCommand: semgrep.recommendedCommand,
    },
    haiecHome,
    timestamp: new Date().toISOString(),
  };
}

export function formatDoctorText(result: DoctorResult): string {
  const lines: string[] = [
    'HAIEC Agent Security — doctor',
    '',
    `Platform: ${result.platform} (${result.arch})`,
    `Node: ${result.nodeVersion} (required: ${result.requiredNodeVersion})`,
    `Node compatible: ${result.nodeCompatible ? 'YES' : 'NO'}`,
    '',
    'Semgrep engine:',
    `  Required version: ${result.semgrep.requiredVersion}`,
    `  Detected version: ${result.semgrep.detectedVersion ?? 'not found'}`,
    `  Readiness: ${result.semgrep.readiness}`,
    `  HAIEC-managed path: ${result.semgrep.managedPath}`,
    `  HAIEC-managed exists: ${result.semgrep.managedExists ? 'YES' : 'NO'}`,
    `  Executable: ${result.semgrep.executablePath ?? 'none'}`,
    `  Setup available: ${result.semgrep.setupAvailable ? 'YES' : 'NO'}`,
    `  Remediation: ${result.semgrep.remediationCode}`,
    result.semgrep.recommendedCommand ? `  Recommended: ${result.semgrep.recommendedCommand}` : '',
    '',
    `HAIEC home: ${result.haiecHome}`,
  ];
  return lines.filter((l) => l !== '').join('\n');
}
