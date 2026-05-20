import React from 'react';
import { Static, Box, Text } from 'ink';
import { StatusMessage } from '@inkjs/ui';

export type Phase = {
  label: string;
  status: 'done' | 'running' | 'warn';
  detail?: string;
};

export function PhaseLog({ phases }: { phases: Phase[] }) {
  const done = phases.filter((p) => p.status !== 'running');
  if (done.length === 0) return null;
  return (
    <Static items={done}>
      {(phase, i) => (
        <Box key={i} gap={1}>
          <StatusMessage variant={phase.status === 'done' ? 'success' : 'warning'}>
            <Text>{phase.label}</Text>
            {phase.detail ? <Text dimColor> {'—'} {phase.detail}</Text> : null}
          </StatusMessage>
        </Box>
      )}
    </Static>
  );
}
