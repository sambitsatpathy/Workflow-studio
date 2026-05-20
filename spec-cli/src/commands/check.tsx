import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useStdin } from 'ink';
import { Spinner } from '@inkjs/ui';
import { readSarif, Gap } from '../lib/readSarif.js';
import { SeverityChart } from '../components/SeverityChart.js';
import { GapTable } from '../components/GapTable.js';
import { ExportSelect } from '../components/ExportSelect.js';
import { writeSarif, writeGapJson } from '../lib/sarifWriter.js';
import { writeMarkdown } from '../lib/markdownWriter.js';

type Props = {
  path: string;
  minSeverity: 'high' | 'medium' | 'low' | 'info';
  format: 'sarif' | 'json' | 'md';
};

const LEVEL_ORDER = ['error', 'warning', 'note', 'none'];

function minIndexFor(min: Props['minSeverity']): number {
  if (min === 'high') return 0;
  if (min === 'medium') return 1;
  if (min === 'low') return 2;
  return 3; // info
}

export function Check({ path, minSeverity, format }: Props) {
  const [gaps, setGaps] = useState<Gap[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);
  const { isRawModeSupported } = useStdin();
  const autoExportFired = useRef(false);

  useEffect(() => {
    readSarif(path)
      .then(setGaps)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, [path]);

  const doExport = async (fmt: string) => {
    if (!gaps) return;
    const written: string[] = [];
    if (fmt === 'sarif' || fmt === 'all') written.push(await writeSarif(gaps, path));
    if (fmt === 'json' || fmt === 'all') written.push(await writeGapJson(gaps, path));
    if (fmt === 'md' || fmt === 'all') written.push(await writeMarkdown(gaps, path));
    setExported(`${fmt} (${written.join(', ')})`);
  };

  // In non-TTY contexts the interactive picker cannot accept input, so auto-export
  // with the requested format once gaps are loaded.
  useEffect(() => {
    if (autoExportFired.current) return;
    if (gaps && !isRawModeSupported && !exported) {
      autoExportFired.current = true;
      void doExport(format);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaps, isRawModeSupported]);

  if (error) return <Text color="red">Error: {error}</Text>;
  if (!gaps)
    return (
      <Box gap={1}>
        <Spinner label="Reading gap-report.sarif..." />
      </Box>
    );

  const minIdx = minIndexFor(minSeverity);
  const filtered = gaps.filter((g) => LEVEL_ORDER.indexOf(g.level) <= minIdx);
  const highCount = gaps.filter((g) => g.level === 'error').length;

  return (
    <Box flexDirection="column" gap={2}>
      <SeverityChart gaps={gaps} />
      <Text>
        Showing <Text bold>{filtered.length}</Text> of {gaps.length} gaps (severity {'≥'}{' '}
        {minSeverity})
      </Text>
      <GapTable gaps={filtered} />
      {highCount > 0 ? (
        <Text color="red">
          {highCount} high-severity gap{highCount > 1 ? 's' : ''} must be resolved before
          import into the Spec Visualizer.
        </Text>
      ) : null}
      {!isRawModeSupported ? (
        exported ? (
          <Text color="green">
            {'✓'} Exported as {exported}. Files written to {path}
          </Text>
        ) : (
          <Text dimColor>Exporting in {format} format...</Text>
        )
      ) : !exported ? (
        <ExportSelect onSelect={doExport} />
      ) : (
        <Text color="green">
          {'✓'} Exported as {exported}. Files written to {path}
        </Text>
      )}
    </Box>
  );
}
