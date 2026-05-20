import fs from 'fs/promises';
import path from 'path';
import type { Gap } from './readSarif.js';

// Collect unique rules from gaps
function buildRules(gaps: Gap[]) {
  const seen = new Set<string>();
  return gaps
    .filter((g) => {
      const n = !seen.has(g.ruleId);
      seen.add(g.ruleId);
      return n;
    })
    .map((g) => ({
      id: g.ruleId,
      name: g.ruleId.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()),
      shortDescription: { text: g.message.split('.')[0] },
      defaultConfiguration: { level: g.level },
    }));
}

export async function writeSarif(gaps: Gap[], outDir: string): Promise<string> {
  const sarif = {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'spec-checker',
            version: '1.0.0',
            rules: buildRules(gaps),
          },
        },
        results: gaps.map((g) => ({
          ruleId: g.ruleId,
          level: g.level,
          message: { text: g.message },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: g.file },
                region: { startLine: 1 },
              },
            },
          ],
          properties: {
            gapId: g.gapId,
            objectLabel: g.objectLabel,
            objectType: g.objectType,
            repoRef: g.repoRef,
            suggestion: g.suggestion,
            autoResolvable: g.autoResolvable,
            resolution: g.resolution,
          },
        })),
      },
    ],
  };
  const outPath = path.join(outDir, 'gap-report.sarif');
  await fs.writeFile(outPath, JSON.stringify(sarif, null, 2), 'utf8');
  return outPath;
}

export async function writeGapJson(gaps: Gap[], outDir: string): Promise<string> {
  const summary = {
    high: gaps.filter((g) => g.level === 'error').length,
    medium: gaps.filter((g) => g.level === 'warning').length,
    low: gaps.filter((g) => g.level === 'note').length,
    info: gaps.filter((g) => g.level === 'none').length,
    total: gaps.length,
  };
  const payload = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 'v2',
    summary,
    gaps,
  };
  const outPath = path.join(outDir, 'gap-report.json');
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2), 'utf8');
  return outPath;
}
