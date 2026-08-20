# 10 — AI Inventory Downstream Impact

## Sync Path

**Path:** `lib/ai-inventory/discovery/ai-security-sync.ts`

```
ai_security_scans (completed scan)
  → extractRepoName(repositoryUrl)
  → extractProvider(aiProvidersDetected)
  → extractLibraries(frameworksDetected)
  → inferSystemType(libraries, provider)
  → prisma.ai_systems.create({
      name: repoName,
      systemType,
      provider,
      category: 'ai_application',
      environment: 'production',
      isProduction: true,
      discoveryMethod: 'ai_security_scan',
      metadata: { scanId, scanDate, repositoryUrl, branch, commitSha, libraries, confidence, totalFindings, criticalFindings, highFindings, modelCallsFound, promptsFound }
    })
  → prisma.risk_assessments.create({
      aiSystemId,
      riskScore: scan.riskScore / 10,  // Normalize to 0-10 scale
      riskLevel: scan.riskScore >= 80 ? 'CRITICAL' : scan.riskScore >= 60 ? 'HIGH' : scan.riskScore >= 40 ? 'MEDIUM' : 'LOW',
      securityRisk: scan.criticalCount + scan.highCount
    })
  → prisma.security_issues.create({
      aiSystemId,
      issueType: finding.ruleId || 'UNKNOWN',  // Raw rule ID
      severity: finding.severity,
      description: finding.description || finding.title,
      filePath: finding.filePath,
      lineNumber: finding.lineStart,
      evidence: finding.codeSnippet,
      recommendation: finding.fixSummary,
      status: 'open'
    })
```

## Impact of Changing Rule IDs, Display IDs, Severity, Finding Counts, Risk Score

### Raw Detector IDs (ruleId)

**Impact:** `security_issues.issueType` stores raw `ruleId`. If rc.3 changes rule IDs (e.g., splits `dangerous-eval-exec-ai-output` into `dangerous-eval-exec-ai-output-py` and `dangerous-eval-exec-ai-output-js`):
- OLD scans will have `dangerous-eval-exec-ai-output`
- NEW scans will have the split IDs
- No migration needed (no customers), but UI must handle both old and new IDs
- Issue grouping/deduplication by `issueType` will change

### Legacy Display IDs

**Impact:** Display IDs (R1.1, R5.1, etc.) are used in:
- `lib/ai-security/rule-names.ts` — display name mapping
- `lib/ai-security/outputs/trust-page.ts` — ruleToControl mapping
- Report display
- Dashboard display

If rc.3 changes display IDs, all these mappings need updating.

### Normalized securityCheckId

**Impact:** rc.3 introduces `securityCheckId` (from manifest). This is NOT currently stored in the database. Future schema change needed:
- Add `securityCheckId` column to `ai_security_findings`
- Add `securityCheckId` column to `security_issues`
- Populate from canonical manifest

### Severity

**Impact:** rc.3 normalization resolves 11 severity conflicts. If a finding was CRITICAL in production but becomes HIGH in rc.3:
- `security_issues.severity` will change
- `risk_assessments.securityRisk` (criticalCount + highCount) will change
- Risk score will change
- Dashboard severity counts will change

### Finding Counts

**Impact:** rc.3 normalization removes 23 duplicate findings. Total finding count drops from 183 to 160 (in test). This affects:
- `ai_security_scans.totalFindings`
- `ai_security_scans.criticalCount`, `highCount`, `mediumCount`, `lowCount`
- `ai_systems.metadata.totalFindings`
- Dashboard metrics
- Report metrics

### Risk Score

**Impact:** rc.3 normalization + deduplication will LOWER the risk score (fewer findings, fewer severity conflicts). This affects:
- `ai_security_scans.riskScore`
- `risk_assessments.riskScore` (divided by 10)
- `risk_assessments.riskLevel` (may drop from CRITICAL to HIGH, etc.)
- Dashboard risk score display
- Report risk score
- Email risk score
- Trust page risk statement

## Future Scan Requirements (No Customer Migration Needed)

1. Schema must support `securityCheckId` (future migration)
2. Sync must handle both old and new rule IDs during transition
3. Risk score version must be tracked (`v1-raw`, `v1-normalized`, `v2-raw`, `v2-normalized`)
4. `riskScore / 10` normalization in sync must validate input range (0-100)
5. `issueType` should eventually store `securityCheckId` instead of raw `ruleId`
