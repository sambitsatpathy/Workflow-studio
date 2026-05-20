import React from 'react';
import { Box, Text } from 'ink';
import type { Gap } from '../lib/readSarif.js';

export function GapDetail({ gap }: { gap: Gap }) {
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      marginLeft={4}
      gap={1}
    >
      <Box gap={2}>
        <Text dimColor>File</Text>
        <Text color="cyan">{gap.file}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>Object</Text>
        <Text>
          {gap.objectLabel} ({gap.objectType})
        </Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>Repo</Text>
        <Text>{gap.repoRef}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>Message</Text>
        <Text>{gap.message}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>Suggestion</Text>
        <Text color="green">{gap.suggestion}</Text>
      </Box>
      {gap.resolution ? (
        <Box gap={2}>
          <Text dimColor>Resolution</Text>
          <Text color="greenBright">{gap.resolution}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
