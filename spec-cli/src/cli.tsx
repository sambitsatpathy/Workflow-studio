#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { Extract } from './commands/extract.js';
import { Check } from './commands/check.js';

const cli = meow(
  `
  Usage
    $ spec <command> <path> [options]

  Commands
    extract <path>   Render extraction results from extract-result.json
    check   <path>   Render gap report from gap-report.sarif

  Options
    --repo-name      Repo identifier (extract only)
    --layer          ui | backend | fullstack (extract only)
    --no-check       Skip auto-run of checker after extract
    --format         sarif | json | md (check only)
    --severity       high | medium | low | info (check filter)
`,
  {
    importMeta: import.meta,
    flags: {
      repoName: { type: 'string' },
      layer: { type: 'string' },
      check: { type: 'boolean', default: true },
      format: { type: 'string', default: 'sarif' },
      severity: { type: 'string', default: 'low' },
    },
  }
);

const [command, targetPath] = cli.input;

type Severity = 'high' | 'medium' | 'low' | 'info';
type Format = 'sarif' | 'json' | 'md';

function asSeverity(s: string): Severity {
  return s === 'high' || s === 'medium' || s === 'low' || s === 'info' ? s : 'low';
}

function asFormat(s: string): Format {
  return s === 'sarif' || s === 'json' || s === 'md' ? s : 'sarif';
}

if (command === 'extract') {
  render(
    <Extract
      path={targetPath ?? '.'}
      repoName={cli.flags.repoName}
      layer={cli.flags.layer}
      runCheck={cli.flags.check}
    />
  );
} else if (command === 'check') {
  render(
    <Check
      path={targetPath ?? './specs'}
      minSeverity={asSeverity(cli.flags.severity)}
      format={asFormat(cli.flags.format)}
    />
  );
} else {
  cli.showHelp();
}
