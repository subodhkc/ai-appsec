# 07 — Benchmark & Financial Claims Audit

## Industry Benchmarks

**Path:** `lib/reports/benchmarks/industry-averages.ts`

### Benchmark 1: Prompt Injection Vulnerabilities per Application

| Company Size | Average | Source Claimed |
|-------------|---------|----------------|
| startup | 8.3 | OWASP LLM Security Report 2024 |
| smb | 12.7 | OWASP LLM Security Report 2024 |
| mid-market | 18.4 | OWASP LLM Security Report 2024 |
| enterprise | 31.2 | OWASP LLM Security Report 2024 |

**Classification:** UNVERIFIED

**Reason:** OWASP publishes the LLM Top 10 (a list of vulnerability types), NOT "per-application vulnerability averages by company size." No URL or citation is provided. The numbers appear to be internal assumptions presented as external benchmarks.

### Benchmark 2: Data Exposure Risks

| Company Size | Average | Source Claimed |
|-------------|---------|----------------|
| startup | 5.1 | Verizon DBIR 2024 |
| smb | 8.9 | Verizon DBIR 2024 |
| mid-market | 14.2 | Verizon DBIR 2024 |
| enterprise | (truncated) | Verizon DBIR 2024 |

**Classification:** UNVERIFIED

**Reason:** Verizon DBIR covers data breach incidents, not "data exposure risks per AI application." The metric doesn't exist in DBIR. No URL or citation provided.

## Financial Impact

**Path:** `lib/reports/calculators/financial-impact.ts`

### Exploitation Probabilities

| Severity | Probability | Source |
|----------|-------------|--------|
| CRITICAL | 45% | NONE |
| HIGH | 28% | NONE |
| MEDIUM | 15% | NONE |
| LOW | 5% | NONE |
| INFO | 1% | NONE |

**Classification:** INTERNAL_ASSUMPTION

**Reason:** No source cited. These appear to be fabricated numbers. Real exploitation probabilities vary wildly by vulnerability type, context, and attacker motivation.

### Incident Cost Ranges

| Incident Type | Startup Avg | SMB Avg | Mid-Market Avg | Enterprise Avg |
|---------------|-------------|---------|----------------|----------------|
| data-breach | $250K | $1M | $4M | $12M |
| prompt-injection-attack | $150K | $750K | $2.5M | $8M |
| unauthorized-access | $200K | $900K | $3M | $10M |
| compliance-violation | $100K | $500K | $2M | $6M |
| reputational-damage | $200K | $1.5M | $5M | $25M |

**Classification:** UNVERIFIED

**Reason:** No citations. IBM Cost of a Data Breach Report publishes breach costs, but "prompt-injection-attack" costs are not published by any known source.

### Regulatory Fine Ranges

| Framework | Violation Type | Avg Fine |
|-----------|---------------|----------|
| GDPR | data-breach | $15M |
| HIPAA | willful-neglect | $500K |
| NYC-LL144 | bias-audit-failure | $1K |
| SOC2 | customer-breach | $2M |
| PCI-DSS | data-breach | $200K |

**Classification:** UNVERIFIED

**Reason:** No citations. GDPR fines are public but vary enormously. NYC LL144 fines are $500-$1,500 per day (this matches). SOC2 "fines" don't exist (SOC2 is an attestation, not a regulatory framework with fines). PCI-DSS fines are contractual, not regulatory.

### "Estimated Value Protected" Calculation

```
valueProtected = sum(for each finding:
  averageCost[incidentType][companySize] *
  exploitationProbability[severity] *
  confidenceMultiplier[conservative=0.7]
)
```

**Classification:** UNSUPPORTED

**Reason:** Derived from unverified probabilities × unverified cost ranges × arbitrary confidence multiplier. The result is presented as a meaningful dollar figure ("$X.XM") in reports and dashboards.

## Summary

| Claim | Classification | Action Needed |
|-------|---------------|---------------|
| OWASP LLM benchmark | UNVERIFIED | Add citation or remove |
| Verizon DBIR benchmark | UNVERIFIED | Add citation or remove |
| 45/28/15/5% probabilities | INTERNAL_ASSUMPTION | Cite source or label as illustrative |
| Incident cost ranges | UNVERIFIED | Cite source or label as illustrative |
| Regulatory fine ranges | UNVERIFIED | Cite source; remove SOC2 "fines" |
| "Estimated Value Protected" | UNSUPPORTED | Label as ILLUSTRATIVE or remove |
