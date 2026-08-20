# 03 — Performance Results

## Measured Performance Distribution

### SMALL repos (< 200 files)

| Repo | Files | Findings | Time(s) |
|---|---|---|---|
| together-python | 94 | 308 | 69.65 |

Range: ~70s for ~100 files
Rate: ~1.4 files/sec

### MEDIUM repos (200-1000 files)

| Repo | Files | Findings | Time(s) |
|---|---|---|---|
| anthropic-sdk-typescript | 330 | 138 | 71.0 |
| openai-node | 609 | 276 | 117.28 |
| pydantic-ai | 685 | 609 | 239.53 |
| llama_index | 842 | 705 | 376.42 |

Range: 71-376s for 330-842 files
Median: ~179s
Rate: ~2.5-4.6 files/sec

### LARGE repos (> 1000 files)

| Repo | Files | Findings | Time(s) |
|---|---|---|---|
| anthropic-sdk-python | 1240 | 478 | 230.15 |
| openai-python | 1753 | 846 | 357.48 |
| langchain | 2545 | 1426 | 593.55 |

Range: 230-594s for 1240-2545 files
Median: ~357s
Rate: ~4.3-5.4 files/sec

## Key Observations

1. No universal "60-second scan" claim. Performance varies from 70s to 594s.
2. Performance is primarily correlated with file count, not finding count.
3. Docker volume mount overhead on Windows adds significant latency.
4. Native Semgrep installation would likely be 2-3x faster.
5. Future MCP implementation should use configurable timeouts with sensible defaults:
   - SMALL repos: 120s default
   - MEDIUM repos: 300s default
   - LARGE repos: 600s default

## Resource Failures

None observed. All timeouts were time-based, not memory or CPU exhaustion.

## Future Performance Wording

"Scan duration ranges from ~70 seconds for small repositories (~100 source files) to ~600 seconds for large repositories (~2500 source files) when using Docker-based Semgrep. Native installation is expected to be significantly faster."
