/* Build-time barrel: Vite's eager glob bundles every vendored JSON spec at
 * build time (no runtime fetch). Types come from src/specTypes.ts. */

import type {
  AppSpec,
  EdgeFile,
  ExtractResult,
  GapReport,
  NodeSpec,
  WorkflowSpec,
} from '../specTypes';

import appSpecJson from './app.spec.json';
import gapReportJson from './gap-report.json';
import extractResultJson from './extract-result.json';

const nodeModules = import.meta.glob<{ default: NodeSpec }>('./nodes/*.json', { eager: true });
const workflowModules = import.meta.glob<{ default: WorkflowSpec }>('./workflows/*.json', { eager: true });
const edgeModules = import.meta.glob<{ default: EdgeFile }>('./edges/*.json', { eager: true });

const byId = <T extends { id?: string; workflowId?: string }>(modules: Record<string, { default: T }>): T[] =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, m]) => m.default);

export const nodeSpecs: NodeSpec[] = byId(nodeModules);
export const workflowSpecs: WorkflowSpec[] = byId(workflowModules);
export const edgeFiles: EdgeFile[] = byId(edgeModules);
export const appSpec: AppSpec = appSpecJson as AppSpec;
export const gapReport: GapReport = gapReportJson as GapReport;
export const extractResult: ExtractResult = extractResultJson as ExtractResult;

/** Tree listing of the vendored specs/ directory for the Export modal. */
export const specFileNames = {
  nodes: Object.keys(nodeModules).map((p) => p.replace('./nodes/', '')).sort(),
  workflows: Object.keys(workflowModules).map((p) => p.replace('./workflows/', '')).sort(),
  edges: Object.keys(edgeModules).map((p) => p.replace('./edges/', '')).sort(),
};
