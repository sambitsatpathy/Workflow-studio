import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { readExtractResult, ExtractResult } from '../lib/readExtractResult.js';
import { NodeBreakdownChart } from '../components/NodeBreakdownChart.js';
import { PendingLinksTable } from '../components/PendingLinksTable.js';
import { Check } from './check.js';

type Props = {
  path: string;
  repoName?: string;
  layer?: string;
  runCheck: boolean;
};

export function Extract({ path, runCheck }: Props) {
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    readExtractResult(path)
      .then((r) => {
        setResult(r);
        if (runCheck) setTimeout(() => setShowCheck(true), 600);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, [path, runCheck]);

  if (error) return <Text color="red">Error: {error}</Text>;
  if (!result)
    return (
      <Box gap={1}>
        <Spinner label="Reading extract-result.json..." />
      </Box>
    );

  const { repo, framework, counts, pendingLinks, warnings } = result;

  return (
    <Box flexDirection="column" gap={2}>
      <Box gap={1}>
        <Text bold color="blue">
          Extraction complete
        </Text>
        <Text dimColor>
          {'—'} {repo.name} ({framework})
        </Text>
      </Box>

      <NodeBreakdownChart counts={counts} />

      <Box gap={3}>
        <Text>
          Edges: <Text bold>{counts.edges.total}</Text>
        </Text>
        <Text>
          Resolved: <Text bold>{counts.edges.resolved}</Text>
        </Text>
        <Text>
          Pending: <Text bold>{counts.edges.pending}</Text>
        </Text>
        <Text>
          Workflows: <Text bold>{counts.workflows}</Text>
        </Text>
        <Text>
          Files written: <Text bold>{counts.filesWritten}</Text>
        </Text>
      </Box>

      {warnings.length > 0 ? (
        <Box flexDirection="column">
          <Text color="yellow" bold>
            Warnings ({warnings.length})
          </Text>
          {warnings.map((w, i) => (
            <Text key={i} color="yellow">
              {'⚠'} {w.code}: {w.message}
            </Text>
          ))}
        </Box>
      ) : null}

      <PendingLinksTable links={pendingLinks} />

      {showCheck ? (
        <Box flexDirection="column" gap={1}>
          <Text dimColor>{'─────────────────────────────────'}</Text>
          <Text dimColor>Running spec-checker...</Text>
          <Check path={path} minSeverity="low" format="sarif" />
        </Box>
      ) : null}
    </Box>
  );
}
