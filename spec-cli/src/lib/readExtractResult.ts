import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const PendingLinkSchema = z.object({
  edgeId: z.string(),
  fromNode: z.string(),
  fromLabel: z.string(),
  label: z.string(),
  targetHint: z.string(),
  routePattern: z.string(),
  method: z.string(),
});

const ExtractResultSchema = z.object({
  tool: z.literal('spec-extractor'),
  repo: z.object({
    name: z.string(),
    layer: z.string(),
    path: z.string(),
  }),
  framework: z.string(),
  completedAt: z.string(),
  counts: z.object({
    nodes: z.object({
      total: z.number(),
      ui: z.number(),
      logic: z.number(),
      data: z.number(),
      infra: z.number(),
      external: z.number(),
    }),
    edges: z.object({
      total: z.number(),
      resolved: z.number(),
      pending: z.number(),
    }),
    workflows: z.number(),
    filesWritten: z.number(),
  }),
  pendingLinks: z.array(PendingLinkSchema),
  warnings: z.array(
    z.object({
      code: z.string(),
      message: z.string(),
      file: z.string(),
      line: z.number().nullable(),
    })
  ),
});

export type ExtractResult = z.infer<typeof ExtractResultSchema>;

export async function readExtractResult(specsDir: string): Promise<ExtractResult> {
  const filePath = path.join(specsDir, 'extract-result.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return ExtractResultSchema.parse(JSON.parse(raw));
}
