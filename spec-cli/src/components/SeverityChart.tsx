import React from 'react';
import { Box, Text } from 'ink';
import { BarChart } from '@pppp606/ink-chart';
import type { Gap } from '../lib/readSarif.js';

export function SeverityChart({ gaps }: { gaps: Gap[] }) {
  const counts = {
    error: gaps.filter((g) => g.level === 'error').length,
    warning: gaps.filter((g) => g.level === 'warning').length,
    note: gaps.filter((g) => g.level === 'note').length,
    none: gaps.filter((g) => g.level === 'none').length,
  };

  const data = [
    { label: 'High (error)', value: counts.error, color: '#C00000' },
    { label: 'Medium (warning)', value: counts.warning, color: '#ED7D31' },
    { label: 'Low (note)', value: counts.note, color: '#4BACC6' },
    { label: 'Info', value: counts.none, color: '#888888' },
  ].filter((d) => d.value > 0);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Gaps by severity</Text>
      {data.length === 0 ? (
        <Text dimColor>(no gaps)</Text>
      ) : (
        <BarChart data={data} showValue="right" />
      )}
    </Box>
  );
}
