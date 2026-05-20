import fs from 'fs/promises';
import path from 'path';
import type { Gap } from './readSarif.js';

const SEVERITY_LABEL: Record<string, string> = {
  error: 'High',
  warning: 'Medium',
  note: 'Low',
  none: 'Info',
};

export async function writeMarkdown(gaps: Gap[], outDir: string): Promise<string> {
  const summary = {
    error: gaps.filter((g) => g.level === 'error').length,
    warning: gaps.filter((g) => g.level === 'warning').length,
    note: gaps.filter((g) => g.level === 'note').length,
    none: gaps.filter((g) => g.level === 'none').length,
  };

  const lines: string[] = [];
  lines.push('# Spec Gap Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|----------|-------|');
  lines.push(`| High     | ${summary.error} |`);
  lines.push(`| Medium   | ${summary.warning} |`);
  lines.push(`| Low      | ${summary.note} |`);
  lines.push(`| Info     | ${summary.none} |`);
  lines.push(`| **Total**| **${gaps.length}** |`);
  lines.push('');

  for (const level of ['error', 'warning', 'note', 'none'] as const) {
    const subset = gaps.filter((g) => g.level === level);
    if (subset.length === 0) continue;
    lines.push(`## ${SEVERITY_LABEL[level]} severity gaps`);
    lines.push('');
    for (const g of subset) {
      lines.push(`### ${g.objectLabel || g.gapId} (\`${g.gapId}\`)`);
      lines.push('');
      lines.push(`- **Rule**: \`${g.ruleId}\``);
      lines.push(`- **File**: \`${g.file}\``);
      lines.push(`- **Repo**: ${g.repoRef}`);
      lines.push(`- **Message**: ${g.message}`);
      lines.push(`- **Suggestion**: ${g.suggestion}`);
      if (g.resolution) lines.push(`- **Resolution**: ${g.resolution}`);
      lines.push('');
    }
  }

  const outPath = path.join(outDir, 'gap-report.md');
  await fs.writeFile(outPath, lines.join('\n'), 'utf8');
  return outPath;
}
