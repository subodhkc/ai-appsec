/**
 * MCP server factory — creates the AI AppSec MCP server.
 *
 * Uses MCP TypeScript SDK v2 with registerTool() for tool registration.
 *
 * Phase 4B: scan_ai_security hardened with:
 * - Explicit outputSchema (structuredContent)
 * - Concise TextContent summary (not full JSON duplication)
 * - Truthful annotations (readOnlyHint, openWorldHint only)
 * - Corrected description (no prompt-injection overstatement)
 * - isError semantics for error results
 *
 * stdout is MCP protocol traffic ONLY. Diagnostics go to stderr.
 */
import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { SERVER_NAME, SERVER_VERSION } from './protocol.js';
import { scanAiSecurity } from '../engines/ai-security/scanner.js';
import type { ScannerOptions, ScanResult } from '../engines/ai-security/scanner.js';

/**
 * Build a concise human-readable text summary of the scan result.
 * This is NOT a full JSON dump — it's a compact summary for agents that
 * prefer text. The full structured data is in structuredContent.
 */
function buildTextSummary(result: ScanResult): string {
  const lines: string[] = [
    `AI AppSec scan_ai_security result:`,
    `  Verdict: ${result.verdict} (advisory)`,
    `  Completeness: ${result.completeness}`,
    `  ${result.summary.concernFamiliesFound} security concern family/families supported by ${result.summary.actionableFindingInstances} actionable finding instance(s)`,
    `  Pipeline: ${result.summary.rawEngineMatches} raw matches → ${result.summary.detectorInstancesAccepted} accepted → ${result.summary.canonicalFindingInstances} canonical → ${result.summary.scopedFindingInstances} scoped (${result.summary.suppressedInstances} suppressed)`,
    `  Actionable: ${result.summary.actionableFindingInstances}, Observations: ${result.summary.observationInstances}`,
    `  Concern families: ${result.summary.concernFamiliesFound}`,
    `  Actionable shown: ${result.truncation.actionableReturned} of ${result.truncation.actionableTotal}`,
    `  Files analyzed: ${result.summary.filesAnalyzed}`,
  ];

  if (result.completenessReasons.length > 0) {
    lines.push(`  Completeness reasons:`);
    for (const reason of result.completenessReasons) {
      lines.push(`    - ${reason}`);
    }
  }

  if (result.errors.length > 0) {
    lines.push(`  Errors:`);
    for (const err of result.errors.slice(0, 5)) {
      lines.push(`    - [${err.code}] ${err.message}`);
    }
  }

  if (result.limitations.length > 0) {
    lines.push(`  Limitations:`);
    for (const lim of result.limitations.slice(0, 5)) {
      lines.push(`    - ${lim}`);
    }
  }

  // Decision-quality: show top concern families (not raw alert stream)
  // NOTE: "concern family" ≠ "material issue" — see structuredContent for details.
  if (result.securityConcernFamilies.length > 0) {
    lines.push(`  Top security concern families (Concern Priority v0.1):`);
    for (const c of result.securityConcernFamilies.slice(0, 5)) {
      lines.push(`    - [${c.defaultDisposition}/${c.canonicalSeverity}] ${c.securityCheckId}: ${c.title}`);
      lines.push(`        ${c.instanceCount} instance(s) across ${c.affectedFileCount} file(s), ${c.affectedDetectorCount} detector(s)`);
      if (c.representativePaths.length > 0) {
        lines.push(`        representative: ${c.representativePaths.slice(0, 2).join(', ')}`);
      }
    }
    if (result.securityConcernFamilies.length > 5) {
      lines.push(`    ... and ${result.securityConcernFamilies.length - 5} more concern family/families (see structuredContent)`);
    }
  }

  lines.push(`  Versions: scanner=${result.versions.scannerVersion}, rulepack=${result.versions.rulepackVersion}, semgrep=${result.versions.semgrepVersion}`);

  return lines.join('\n');
}

/**
 * Create the AI AppSec MCP server with scan_ai_security registered.
 */
export function createServer(options?: ScannerOptions): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register scan_ai_security — the first implemented tool
  server.registerTool(
    'scan_ai_security',
    {
      title: 'Scan AI/LLM Source Code Security',
      description: [
        'Audit AI applications and agents for security risks before commit, PR,',
        'merge, or deployment. Produces deterministic findings with explicit',
        'coverage, Security Concern Families, Scan Receipts, and Evidence Envelopes.',
        '',
        'USE when a developer asks to:',
        '- "check this for security issues"',
        '- "audit this task before I push"',
        '- "review this change for security problems"',
        '- "scan this AI agent" or "scan this AI app"',
        '- "check my LLM application"',
        '- "security review this PR"',
        '- "is this safe to merge"',
        '- "check this before deployment"',
        '- "audit this code for vulnerabilities"',
        '- "run a security scan"',
        '- "check for security risks before commit"',
        '- "review this implementation before pushing"',
        '',
        'Also use for:',
        '- reviewing AI/LLM/agent source code for security',
        '- validating AI code before merge',
        '- checking an agent before deployment',
        '- reviewing RAG or model integration security',
        '- looking for unsafe AI source-code patterns',
        '- checking AI-output-to-dangerous-action flows',
        '- checking AI source-code secrets/security controls',
        '',
        'DO NOT use for:',
        '- actual LLM response/content verification (use verify_llm_content)',
        '- tenant/RLS/cross-customer isolation (use scan_tenant_isolation)',
        '- generic compliance questionnaires or compliance certification',
        '- generic non-AI source scanning where no AI check applies',
        '',
        'This tool performs static analysis only. It does NOT execute target code,',
        'make network requests, or emit telemetry. BLOCK findings are advisory —',
        'deployment enforcement is handled by check_deploy_security (not yet implemented).',
      ].join('\n'),
      inputSchema: z.object({
        targetPath: z.string().describe('Absolute or relative path to the AI application source code to scan.'),
        extendedScope: z.boolean().optional().describe('Include tests/docs/examples in the scan. Default: false (production scope only).'),
        timeout: z.number().optional().describe('Scan timeout in seconds. Default: 300.'),
      }),
      outputSchema: z.object({
        schemaVersion: z.string(),
        scanId: z.string(),
        verdict: z.enum(['PASS', 'REVIEW', 'BLOCK', 'ERROR']),
        completeness: z.enum(['COMPLETE', 'PARTIAL', 'UNSUPPORTED', 'ERROR']),
        completenessReasons: z.array(z.string()),
        summary: z.object({
          filesAnalyzed: z.number(),
          filesWithFindings: z.number(),
          filesSkippedByEngine: z.number(),
          filesUnscannedDueToTimeout: z.number(),
          rawEngineMatches: z.number(),
          manifestUnmappedInstances: z.number(),
          detectorInstancesAccepted: z.number(),
          normalizationDuplicatesCollapsed: z.number(),
          canonicalFindingInstances: z.number(),
          suppressedInstances: z.number(),
          scopedFindingInstances: z.number(),
          actionableFindingInstances: z.number(),
          observationInstances: z.number(),
          concernFamiliesFound: z.number(),
          vulnerabilityTotal: z.number(),
          controlGapTotal: z.number(),
          riskSignalTotal: z.number(),
          presenceTotal: z.number(),
          blockTotal: z.number(),
          reviewTotal: z.number(),
          informationalTotal: z.number(),
        }),
        actionableFindings: z.array(z.object({
          securityCheckId: z.string(),
          canonicalName: z.string(),
          findingKind: z.enum(['PRESENCE', 'RISK_SIGNAL', 'CONTROL_GAP', 'VULNERABILITY']),
          canonicalSeverity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
          defaultDisposition: z.enum(['INFORMATIONAL', 'REVIEW', 'BLOCK']),
          relativePath: z.string(),
          startLine: z.number(),
          startColumn: z.number(),
          endLine: z.number(),
          endColumn: z.number(),
          detectorIds: z.array(z.string()),
          message: z.string(),
          evidenceHash: z.string(),
          remediationClass: z.string(),
          scope: z.enum(['PRODUCTION', 'NON_PRODUCTION']),
        })),
        observations: z.array(z.object({
          securityCheckId: z.string(),
          canonicalName: z.string(),
          findingKind: z.enum(['PRESENCE', 'RISK_SIGNAL', 'CONTROL_GAP', 'VULNERABILITY']),
          canonicalSeverity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
          defaultDisposition: z.enum(['INFORMATIONAL', 'REVIEW', 'BLOCK']),
          relativePath: z.string(),
          startLine: z.number(),
          startColumn: z.number(),
          endLine: z.number(),
          endColumn: z.number(),
          detectorIds: z.array(z.string()),
          message: z.string(),
          evidenceHash: z.string(),
          remediationClass: z.string(),
          scope: z.enum(['PRODUCTION', 'NON_PRODUCTION']),
        })),
        securityConcernFamilies: z.array(z.object({
          concernId: z.string(),
          securityCheckId: z.string(),
          findingKind: z.enum(['PRESENCE', 'RISK_SIGNAL', 'CONTROL_GAP', 'VULNERABILITY']),
          canonicalSeverity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
          defaultDisposition: z.enum(['INFORMATIONAL', 'REVIEW', 'BLOCK']),
          title: z.string(),
          remediationClass: z.string(),
          instanceCount: z.number(),
          affectedFileCount: z.number(),
          affectedDetectorCount: z.number(),
          affectedDetectors: z.array(z.string()),
          representativeFindings: z.array(z.object({
            securityCheckId: z.string(),
            canonicalName: z.string(),
            findingKind: z.enum(['PRESENCE', 'RISK_SIGNAL', 'CONTROL_GAP', 'VULNERABILITY']),
            canonicalSeverity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
            defaultDisposition: z.enum(['INFORMATIONAL', 'REVIEW', 'BLOCK']),
            relativePath: z.string(),
            startLine: z.number(),
            startColumn: z.number(),
            endLine: z.number(),
            endColumn: z.number(),
            detectorIds: z.array(z.string()),
            message: z.string(),
            evidenceHash: z.string(),
            remediationClass: z.string(),
            scope: z.enum(['PRODUCTION', 'NON_PRODUCTION']),
          })),
          representativePaths: z.array(z.string()),
          limitations: z.array(z.string()),
        })),
        evaluatedSecurityCheckIds: z.array(z.string()),
        evaluatedDetectorIds: z.array(z.string()),
        limitations: z.array(z.string()),
        versions: z.object({
          scanner: z.string(),
          scannerVersion: z.string(),
          rulepack: z.string(),
          rulepackVersion: z.string(),
          rulepackDigest: z.string(),
          manifest: z.string(),
          manifestVersion: z.string(),
          manifestDigest: z.string(),
          semgrep: z.string(),
          semgrepVersion: z.string(),
        }),
        truncation: z.object({
          actionableReturned: z.number(),
          actionableTotal: z.number(),
          observationsReturned: z.number(),
          observationsTotal: z.number(),
          truncated: z.boolean(),
          checksRepresented: z.number(),
          checksTotal: z.number(),
          checksOmittedDueToDisplayBounds: z.number(),
        }),
        errors: z.array(z.object({
          code: z.string(),
          message: z.string(),
          recoverable: z.boolean(),
          remediation: z.object({
            dependency: z.string(),
            dependencyStatus: z.string(),
            requiredVersion: z.string(),
            detectedVersion: z.string().nullable(),
            remediationCode: z.string(),
            setupAvailable: z.boolean(),
            recommendedCommand: z.string().nullable(),
          }).optional(),
        })),
        receipt: z.object({
          receiptVersion: z.string(),
          schemaVersion: z.string(),
          scannerName: z.string(),
          scannerVersion: z.string(),
          semgrepVersion: z.string(),
          publicCoreVersion: z.string(),
          rulepackDigest: z.string(),
          manifestDigest: z.string(),
          gitCommit: z.string().nullable(),
          dirtyState: z.boolean(),
          scanInputDigest: z.string(),
          coverageDigest: z.string(),
          discoveredFileSetDigest: z.string(),
          targetedFileSetDigest: z.string(),
          intentionallyExcludedFileSetDigest: z.string(),
          unsupportedFileSetDigest: z.string(),
          engineReportedScannedFileSetDigest: z.string(),
          parseFailureFileSetDigest: z.string(),
          successfullyAnalyzedFileSetDigest: z.string(),
          scopeMode: z.string(),
          fileAccounting: z.object({
            filesAnalyzed: z.number(),
            filesWithFindings: z.number(),
            filesSkippedByEngine: z.number(),
            filesUnscannedDueToTimeout: z.number(),
            findingsExcludedByReportingScope: z.number(),
          }),
          completeness: z.string(),
          verdict: z.string(),
          findingCounts: z.object({
            rawFindingCount: z.number(),
            actionableTotal: z.number(),
            vulnerabilityTotal: z.number(),
            controlGapTotal: z.number(),
            riskSignalTotal: z.number(),
            presenceTotal: z.number(),
            blockTotal: z.number(),
            reviewTotal: z.number(),
            informationalTotal: z.number(),
          }),
          findingSetDigest: z.string(),
          concernFamilySetDigest: z.string(),
          evaluatedSecurityCheckIds: z.array(z.string()),
          evaluatedSecurityCheckSetDigest: z.string(),
          evaluatedDetectorIds: z.array(z.string()),
          evaluatedDetectorSetDigest: z.string(),
          limitations: z.array(z.string()),
          errorCodes: z.array(z.string()),
          semanticReceiptDigest: z.string(),
          receiptDocumentDigest: z.string(),
        }).optional(),
        evidenceEnvelope: z.object({
          schemaVersion: z.string(),
          envelopeVersion: z.string(),
          producerId: z.string(),
          producerType: z.literal('STATIC_SECURITY'),
          producerVersion: z.string(),
          targetIdentity: z.object({
            scanInputDigest: z.string(),
            gitCommit: z.string().nullable(),
            dirtyState: z.boolean(),
          }),
          executionStatus: z.string(),
          completeness: z.string(),
          evidenceStatus: z.enum(['PRODUCED', 'NOT_PRODUCED']),
          semanticReceiptDigest: z.string(),
          receiptDocumentDigest: z.string(),
          findingSetDigest: z.string(),
          concernFamilySetDigest: z.string(),
          coverageDigest: z.string(),
          limitations: z.array(z.string()),
          envelopeDigest: z.string(),
        }).optional(),
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      const result = await scanAiSecurity(
        {
          targetPath: args.targetPath,
          extendedScope: args.extendedScope ?? false,
          timeoutMs: (args.timeout ?? 300) * 1000,
        },
        options,
      );

      // isError: true when verdict is ERROR or completeness is ERROR
      const isError = result.verdict === 'ERROR' || result.completeness === 'ERROR';

      return {
        content: [
          {
            type: 'text' as const,
            text: buildTextSummary(result),
          },
        ],
        structuredContent: result,
        isError,
      };
    },
  );

  // Other tools (scan_tenant_isolation, verify_llm_content, check_deploy_security)
  // are NOT registered. They remain contract-only in src/contracts/tool.ts.
  // Their handlers will be implemented in future phases.

  return server;
}
