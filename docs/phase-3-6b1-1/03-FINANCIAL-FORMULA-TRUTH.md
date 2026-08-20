# 03 — Financial Formula Truth

## Exact Executable Formula

### Risk Avoided (per finding)
```
potentialSavings = INCIDENT_COST_RANGES[incidentType][companySize].average
                 × severityWeight(finding.severity)
                 × confidenceMultiplier(confidenceLevel)
```

Where:
- `incidentType = mapCategoryToIncidentType(finding.category)`
- `severityWeight` = {CRITICAL: 0.45, HIGH: 0.28, MEDIUM: 0.15, LOW: 0.05, INFO: 0.01}
- `confidenceMultiplier` = {conservative: 0.7, moderate: 1.0, optimistic: 1.3}

### GDPR Fine (per finding with GDPR mapping)
```
potentialSavings = REGULATORY_FINE_RANGES.GDPR[violationType].average
                 × (severityWeight × 0.3)
```

### HIPAA Fine (per finding with HIPAA mapping)
```
potentialSavings = REGULATORY_FINE_RANGES.HIPAA['reasonable-cause'].average
                 × (severityWeight × 0.25)
```

### SOC 2 (per finding with SOC2 mapping)
```
potentialSavings = 0  (qualitative only, no dollar model)
```

### Total
```
totalPotentialSavings = Σ(risksAvoided.potentialSavings) + Σ(finesPrevented.potentialSavings)
savingsRange = {min: total × 0.75, max: total × 1.25}
```

## Mathematical Inputs ACTUALLY Used

| Variable | Source | Used? | Displayed? | Classification |
|----------|--------|-------|------------|----------------|
| finding.severity | Finding data | YES | YES (in finding list) | Input |
| finding.category | Finding data | YES | YES (in finding list) | Input |
| finding.complianceMapping | Finding data | YES | YES (in compliance section) | Input |
| companySize | Function parameter | YES | YES (in methodology) | HAIEC assumption |
| confidenceLevel | Function parameter | YES | YES (in methodology) | HAIEC assumption |
| severityWeight | Hardcoded in function | YES | YES (in methodology) | HAIEC_MODEL_ASSUMPTION |
| INCIDENT_COST_RANGES | Hardcoded constant | YES | NO (not directly shown) | HAIEC_MODEL_ASSUMPTION |
| REGULATORY_FINE_RANGES | Hardcoded constant | YES | NO (not directly shown) | HAIEC_MODEL_ASSUMPTION |
| confidenceMultiplier | Hardcoded in function | YES | YES (in methodology) | HAIEC_MODEL_ASSUMPTION |

## Factors Previously Claimed but NOT Mathematically Used

| Factor | Claimed in copy? | Actually used? | Action |
|--------|-----------------|----------------|--------|
| evidence strength | YES (Phase 3.6B-1 copy) | NO — not a parameter | REMOVED from copy |
| affected scope | YES (Phase 3.6B-1 copy) | NO — not a parameter | REMOVED from copy |
| organization profile | YES (Phase 3.6B-1 copy) | PARTIAL — companySize used, industry NOT used | Copy now says "company size" |
| published breach-cost research | YES (Phase 3.6B-1 copy) | NO — not a direct input (only context) | Copy now says "informed by published breach-cost context" |
| industry | NO (received as parameter) | NO — adjustForIndustry never called | Dead parameter, not in copy |

## External Source Metrics Mathematically Used Count

**0** — No external source metric is a direct mathematical input. IBM/Verizon/OWASP/NIST/AICPA values are NOT used in the calculation. They appear only in the methodology text and source list as context.

## Disclosed HAIEC Model Assumptions Count

**5** — All are explicitly classified as HAIEC_MODEL_ASSUMPTION in the evidence source registry:
1. Severity weights (0.45/0.28/0.15/0.05/0.01)
2. Incident cost ranges (by company size)
3. Regulatory fine ranges (GDPR, HIPAA, NYC LL144, PCI-DSS)
4. Confidence multipliers (0.7/1.0/1.3)
5. Fine probability reduction factors (0.3 for GDPR, 0.25 for HIPAA)

## Unsupported External Numeric Claims Publicly Rendered Count

**0** — All numeric inputs are either HAIEC_MODEL_ASSUMPTION (disclosed) or finding data (factual). No external source metric is presented as a direct calculation input.

## Final Modeled Potential Impact Copy

"A HAIEC scenario planning estimate of $X.XM over the next 12 months, based on finding severity, finding category, company size, confidence level, compliance mapping, and disclosed HAIEC scenario assumptions. Informed by published breach-cost context (IBM 2026 Cost of a Data Breach Report). Designed to support remediation prioritization; it is a modeled scenario, not a prediction of actual loss."

## SOC 2 Dollar-Impact Status

**QUALITATIVE ONLY.** SOC 2 findings now produce `potentialSavings: 0` with `regulation: 'SOC 2 Assurance Relevance'` and `violationType: 'attestation-readiness-relevance'`. No dollar amount is calculated for SOC 2. The previous invented $100K–$1M range has been removed.
