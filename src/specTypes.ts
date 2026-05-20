/* TypeScript interfaces mirroring the v2 spec schema emitted by spec-extractor
 * and the gap report emitted by spec-checker. Kept narrow — only the fields the
 * app's adapter consumes are typed; unknown additions ride through as unknown. */

export type SpecCategory = 'ui' | 'logic' | 'data' | 'infra' | 'external';
export type LifecycleStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export interface Lifecycle {
  status: LifecycleStatus;
  submittedBy: string | null;
  submittedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface NodeVersion {
  version: string;
  label: string;
  description: string;
  properties: Record<string, unknown>;
  tags: string[];
  lifecycle: Lifecycle;
}

export interface NodeSpec {
  id: string;
  category: SpecCategory;
  createdAt: string;
  repoRef: { name: string; file?: string; line?: number };
  versions: NodeVersion[];
}

export interface SpecEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  description: string;
  repoRef: { name: string; file?: string };
  properties: Record<string, unknown>;
  pendingLink: { hint: string; routePattern: string; method: string } | null;
}

export interface EdgeFile {
  workflowId: string;
  edges: SpecEdge[];
}

export interface WorkflowVersion {
  version: string;
  label: string;
  description: string;
  nodeRefs: { id: string; version: string }[];
  edges: string[];
  lifecycle: Lifecycle;
}

export interface WorkflowSpec {
  id: string;
  createdAt: string;
  repoRef: { name: string };
  versions: WorkflowVersion[];
}

export interface AppSpec {
  app: string;
  specVersion: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  repos: { name: string; layer: string }[];
  workflows: { ref: string; version: string; repoRef: string }[];
  nodes: { ref: string; version: string; repoRef: string }[];
}

export interface Gap {
  gapId: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  checkId: string;
  objectType: 'node' | 'edge' | 'workflow' | 'manifest';
  objectId: string;
  objectLabel: string;
  versionUnderCheck: string | null;
  repoRef: string | null;
  file: string;
  message: string;
  suggestion: string;
  autoResolvable: boolean;
  resolution: string | null;
}

export interface GapReport {
  generatedAt: string;
  schemaVersion: string;
  repos: string[];
  summary: { high: number; medium: number; low: number; info: number; total: number };
  gaps: Gap[];
}

export interface ExtractResult {
  tool: string;
  repo: { name: string; layer: string; path: string };
  framework: string;
  completedAt: string;
  counts: {
    nodes: { total: number; ui: number; logic: number; data: number; infra: number; external: number };
    edges: { total: number; resolved: number; pending: number };
    workflows: number;
    filesWritten: number;
  };
  pendingLinks: unknown[];
  warnings: unknown[];
}
