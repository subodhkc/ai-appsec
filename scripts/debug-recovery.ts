import { scanAiSecurity } from '../src/engines/ai-security/scanner.js';
import { SyntheticTestRulepackProvider } from '../src/engines/ai-security/rulepack-provider.js';
import { RecoverableSemgrepResolver } from '../tests/fixtures/test-resolvers.js';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const fixtureDir = path.resolve(__dirname, '..', 'tests', 'fixtures', 'synthetic-rulepack');
const provider = new SyntheticTestRulepackProvider(
  path.join(fixtureDir, 'test-rules.yml'),
  path.join(fixtureDir, 'test-manifest.json'),
);
const targetPath = path.resolve(__dirname, '..', 'tests', 'fixtures', 'sample-target');
const resolver = new RecoverableSemgrepResolver();

async function main() {
  const r1 = await scanAiSecurity({ targetPath, timeoutMs: 10000 }, { rulepackProvider: provider, semgrepResolver: resolver });
  console.log('R1 verdict:', r1.verdict);

  const r2 = await scanAiSecurity({ targetPath, timeoutMs: 180000 }, { rulepackProvider: provider, semgrepResolver: resolver });
  console.log('R2 verdict:', r2.verdict);
  console.log('R2 has receipt:', !!r2.receipt);
  console.log('R2 has envelope:', !!r2.evidenceEnvelope);
}

main().catch(e => { console.error('ERROR:', e); process.exit(1); });
