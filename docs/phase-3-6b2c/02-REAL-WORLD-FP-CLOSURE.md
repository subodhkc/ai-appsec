# 02 — Real-World FP Closure

## 4 Likely FPs from Phase 2B

### SSRF Findings in openai-node (2 findings)

**Detector:** `ai-ssrf-js`
**Files:** ecosystem-tests/browser-direct-import/public/index.js:103, ecosystem-tests/bun/openai.test.ts:7
**Source code:** `const url = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3';`

**Classification: RULE_FALSE_POSITIVE**

The detector used cosmetic metavariable `$AI_RESPONSE` that matched ANY expression assigned to a URL variable. The URL is a hardcoded audio sample, not AI-generated output.

**Fix (rc.5):** Converted to taint mode with AI sources (openai.chat.completions.create, anthropic.messages.create, $LLM.invoke) and sinks (fetch, axios.get, axios.post, $HTTP.request).

**Verification:** rc.5 on openai-node produces 0 SSRF findings. FP eliminated.

### XSS Findings in llama_index (2 findings)

**Detector:** `ai-xss-js`
**Files:** docs/src/content/docs/framework/_static/js/algolia.js:611, docs/src/content/docs/framework/javascript/llms_example.js:43

**Source code (algolia.js):** `e.innerHTML = (s && s.__html) || ""` — React DOM reconciliation, not AI output.
**Source code (llms_example.js):** `exampleElement.innerHTML = marked.parse(exampleMarkdown)` — markdown rendering, not AI output.

**Classification: RULE_FALSE_POSITIVE**

The detector used cosmetic metavariables `$AI_OUTPUT` and `$RESPONSE` that matched ANY expression assigned to innerHTML.

**Fix (rc.5):** Converted to taint mode with AI sources and sinks (innerHTML, document.write, dangerouslySetInnerHTML).

**Verification:** rc.5 on llama_index produces 0 XSS findings. FP eliminated.

## 2 Unresolved Findings Resolved

The 2 previously-unresolved SSRF findings in openai-node ecosystem tests are now classified as RULE_FALSE_POSITIVE (same root cause as the other 2 SSRF findings). All 4 are resolved by the rc.5 taint-mode fix.

## Summary

| Classification | Count |
|---|---|
| TRUE_SECURITY_FINDING | 0 |
| VALID_BUT_NONPRODUCTION_SCOPE | 0 |
| RULE_FALSE_POSITIVE | 4 |
| UNRESOLVED | 0 |

All 4 FPs were caused by the same defect class: cosmetic metavariable names that don't constrain the source to AI output. Fixed by converting to taint mode in rc.5.
