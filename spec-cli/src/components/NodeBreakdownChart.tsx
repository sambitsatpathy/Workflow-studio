import React from 'react';
import { Box, Text } from 'ink';
import { BarChart } from '@pppp606/ink-chart';
import type { ExtractResult } from '../lib/readExtractResult.js';

const CATEGORY_COLORS: Record<string, string> = {
  ui: '#2E75B6',
  logic: '#4BACC6',
  data: '#70AD47',
  infra: '#ED7D31',
  external: '#7030A0',
};

export function NodeBreakdownChart({ counts }: { counts: ExtractResult['counts'] }) {
  const { ui, logic, data, infra, external } = counts.nodes;
  const chartData = [
    { label: 'ui', value: ui, color: CATEGORY_COLORS['ui'] },
    { label: 'logic', value: logic, color: CATEGORY_COLORS['logic'] },
    { label: 'data', value: data, color: CATEGORY_COLORS['data'] },
    { label: 'infra', value: infra, color: CATEGORY_COLORS['infra'] },
    { label: 'external', value: external, color: CATEGORY_COLORS['external'] },
  ].filter((d) => d.value > 0);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Nodes by category</Text>
      {chartData.length === 0 ? (
        <Text dimColor>(no nodes)</Text>
      ) : (
        <BarChart data={chartData} showValue="right" />
      )}
    </Box>
  );
}
