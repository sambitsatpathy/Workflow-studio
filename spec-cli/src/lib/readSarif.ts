import fs from 'fs/promises';
import path from 'path';
import type { Log, Result } from 'sarif';

export type GapLevel = 'error' | 'warning' | 'note' | 'none';

export type Gap = {
  gapId: string;
  ruleId: string;
  level: GapLevel;
  message: string;
  file: string;
  objectLabel: string;
  objectType: string;
  repoRef: string;
  suggestion: string;
  autoResolvable: boolean;
  resolution: string | null;
};

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asLevel(value: unknown): GapLevel {
  if (value === 'error' || value === 'warning' || value === 'note' || value === 'none') {
    return value;
  }
  return 'none';
}

export async function readSarif(specsDir: string): Promise<Gap[]> {
  const filePath = path.join(specsDir, 'gap-report.sarif');
  const raw = await fs.readFile(filePath, 'utf8');
  const sarif = JSON.parse(raw) as Log;
  const results: Result[] = sarif.runs?.[0]?.results ?? [];
  return results.map((r: Result): Gap => {
    const props = (r.properties ?? {}) as Record<string, unknown>;
    return {
      gapId: asString(props.gapId),
      ruleId: asString(r.ruleId),
      level: asLevel(r.level),
      message: asString(r.message?.text),
      file:
        asString(r.locations?.[0]?.physicalLocation?.artifactLocation?.uri),
      objectLabel: asString(props.objectLabel),
      objectType: asString(props.objectType),
      repoRef: asString(props.repoRef),
      suggestion: asString(props.suggestion),
      autoResolvable: asBool(props.autoResolvable),
      resolution: typeof props.resolution === 'string' ? props.resolution : null,
    };
  });
}
