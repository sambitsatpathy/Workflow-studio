import React from 'react';
import { Box, Text, useStdin } from 'ink';
import { Select } from '@inkjs/ui';

type Props = { onSelect: (format: string) => void };

export function ExportSelect({ onSelect }: Props) {
  const { isRawModeSupported } = useStdin();

  if (!isRawModeSupported) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold>Export report as:</Text>
        <Text dimColor>
          (interactive picker disabled — re-run with a TTY or pass --format)
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Export report as:</Text>
      <Select
        options={[
          {
            label: 'SARIF (VS Code Problems panel, GitHub Code Scanning)',
            value: 'sarif',
          },
          { label: 'JSON (annotate resolution field, return to re-run)', value: 'json' },
          { label: 'Markdown', value: 'md' },
          { label: 'All three', value: 'all' },
        ]}
        onChange={onSelect}
      />
    </Box>
  );
}
