import React from 'react';
import { Box, Text } from 'ink';
import type { ExtractResult } from '../lib/readExtractResult.js';

type Row = {
  from: string;
  label: string;
  target: string;
  route: string;
  method: string;
};

const COLUMNS: Array<{ key: keyof Row; header: string }> = [
  { key: 'from', header: 'From node' },
  { key: 'label', header: 'Label' },
  { key: 'target', header: 'Target hint' },
  { key: 'route', header: 'Route' },
  { key: 'method', header: 'Method' },
];

export function PendingLinksTable({ links }: { links: ExtractResult['pendingLinks'] }) {
  if (links.length === 0) return null;

  const rows: Row[] = links.map((l) => ({
    from: l.fromLabel,
    label: l.label,
    target: l.targetHint,
    route: l.routePattern,
    method: l.method,
  }));

  // Compute column widths from header + data
  const widths = COLUMNS.map((col) => {
    const header = col.header;
    const max = rows.reduce(
      (acc, row) => Math.max(acc, String(row[col.key] ?? '').length),
      header.length
    );
    return max;
  });

  const sep = widths.map((w) => '─'.repeat(w + 2)).join('┼');

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="yellow">
        Pending cross-repo edges ({links.length})
      </Text>
      <Box flexDirection="column">
        <Text bold>
          {COLUMNS.map((c, i) => ` ${c.header.padEnd(widths[i] ?? 0)} `).join('│')}
        </Text>
        <Text dimColor>{sep}</Text>
        {rows.map((r, idx) => (
          <Text key={idx}>
            {COLUMNS.map(
              (c, i) => ` ${String(r[c.key] ?? '').padEnd(widths[i] ?? 0)} `
            ).join('│')}
          </Text>
        ))}
      </Box>
      <Text dimColor>
        Run `spec merge` with the other repo&apos;s specs to resolve these.
      </Text>
    </Box>
  );
}
