import React, { useState } from 'react';
import { Box, Text, useInput, useStdin } from 'ink';
import type { Gap } from '../lib/readSarif.js';
import { GapDetail } from './GapDetail.js';

const LEVEL_SYMBOL: Record<string, string> = {
  error: '●',
  warning: '○',
  note: '·',
  none: ' ',
};

const LEVEL_COLOR: Record<string, string> = {
  error: 'red',
  warning: 'yellow',
  note: 'cyan',
  none: 'gray',
};

export function GapTable({ gaps }: { gaps: Gap[] }) {
  const [cursor, setCursor] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { isRawModeSupported } = useStdin();

  // Only register input handlers when raw mode is available (TTY).
  useInput(
    (input, key) => {
      if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
      if (key.downArrow) setCursor((c) => Math.min(gaps.length - 1, c + 1));
      if (key.return) setExpanded((e) => (e === cursor ? null : cursor));
      if (input === 'q') process.exit(0);
    },
    { isActive: Boolean(isRawModeSupported) }
  );

  if (gaps.length === 0) {
    return <Text dimColor>(no gaps to show)</Text>;
  }

  return (
    <Box flexDirection="column">
      {isRawModeSupported ? (
        <Text dimColor>
          {'↑↓'} navigate {'·'} Enter expand {'·'} q quit
        </Text>
      ) : (
        <Text dimColor>Gap list ({gaps.length} items)</Text>
      )}
      {gaps.map((gap, i) => (
        <Box key={gap.gapId || `gap-${i}`} flexDirection="column">
          <Box gap={2}>
            <Text color={LEVEL_COLOR[gap.level]}>
              {cursor === i ? '›' : ' '} {LEVEL_SYMBOL[gap.level]}
            </Text>
            <Text bold={cursor === i}>{gap.gapId}</Text>
            <Text color={LEVEL_COLOR[gap.level]}>{gap.level.toUpperCase().padEnd(7)}</Text>
            <Text>{gap.objectLabel.padEnd(24)}</Text>
            <Text dimColor>{gap.ruleId}</Text>
          </Box>
          {expanded === i ? <GapDetail gap={gap} /> : null}
        </Box>
      ))}
    </Box>
  );
}
