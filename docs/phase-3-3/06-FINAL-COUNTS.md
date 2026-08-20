# 06 — Final Counts

## Detector Status Counts (MUST sum to 121)

| Status | Count |
|--------|-------|
| QUALIFIED_AS_IS | 72 |
| QUALIFIED_BUT_RENAME | 14 |
| QUALIFIED_BUT_MESSAGE_FIX | 0 |
| QUALIFIED_WITH_PRECISION_REPAIR | 5 |
| NEEDS_LOGIC_REPAIR | 22 |
| NEEDS_REDESIGN | 7 |
| PARSER_ERROR | 1 |
| NOT_YET_VALIDATED | 0 |
| **TOTAL** | **121** ✓ |

## Future Action Counts (MUST sum to 121)

| Action | Count |
|--------|-------|
| KEEP | 72 |
| RENAME | 14 |
| MESSAGE_FIX | 0 |
| REPAIR | 28 |
| REDESIGN | 7 |
| DEFER | 0 |
| DEPRECATE | 0 |
| **TOTAL** | **121** ✓ |

## REPAIR Breakdown

| Sub-category | Count | Description |
|--------------|-------|-------------|
| Precision repair | 5 | QUALIFIED_WITH_PRECISION_REPAIR |
| Logic repair | 22 | NEEDS_LOGIC_REPAIR |
| Parser error fix | 1 | PARSER_ERROR |
| **Total REPAIR** | **28** | |

## Logical Check Counts

| Metric | Count |
|--------|-------|
| Total logical checks | 78 |
| Qualified logical checks | 61 |
| Not-qualified logical checks | 17 |

## Qualified Detector Counts

| Metric | Count |
|--------|-------|
| Qualified detector definitions | 91 |
| Total detector definitions | 121 |

## Verification

```
72 + 14 + 0 + 5 + 22 + 7 + 1 + 0 = 121 ✓
72 + 14 + 0 + 28 + 7 + 0 + 0 = 121 ✓
```
