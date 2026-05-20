/* Transform layer: v2 spec JSON (vendored under src/specs/) → the data shapes
 * the WorkflowStudio screens already consume. Pure & deterministic — runs once
 * at module load, produces stable output across builds. */

import type {
  EdgeData,
  FlowNodeData,
  NotificationItem,
  NotificationTone,
  NodeStatus,
  QueueRow,
  StickyData,
  Category,
} from './types';
import type { Gap, SpecCategory, SpecEdge } from './specTypes';
import {
  appSpec,
  edgeFiles,
  extractResult,
  gapReport,
  nodeSpecs,
  specFileNames,
  workflowSpecs,
} from './specs';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** FNV-1a-like deterministic hash — stable across runs, no Date / random. */
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CAT_MAP: Record<SpecCategory, Category> = {
  ui: 'UI',
  logic: 'Logic',
  data: 'Data',
  infra: 'Infra',
  external: 'External',
};

const semverToVLabel = (v: string): string => (v.startsWith('v') ? v : `v${v}`);

// ─── flat edge list (joining every workflow's edges file) ────────────────────

const allSpecEdges: SpecEdge[] = edgeFiles.flatMap((f) => f.edges);

// One pseudo "PENDING::" node per distinct route hint so cross-repo edges have
// a visible landing point on the canvas instead of being silently dropped.
interface PseudoNode {
  id: string;
  label: string;
  type: string;
  category: 'External';
  version: 'v1.0.0';
  status: 'DRAFT';
  routePattern: string;
}
const pseudoMap = new Map<string, PseudoNode>();
for (const e of allSpecEdges) {
  if (String(e.target).startsWith('PENDING::') && e.pendingLink) {
    const key = `pending-${e.pendingLink.method.toLowerCase()}-${e.pendingLink.routePattern.replace(/[/:]/g, '-').replace(/^-+/, '')}`;
    if (!pseudoMap.has(key)) {
      pseudoMap.set(key, {
        id: key,
        label: `${e.pendingLink.method} ${e.pendingLink.routePattern}`,
        type: 'pending-link',
        category: 'External',
        version: 'v1.0.0',
        status: 'DRAFT',
        routePattern: e.pendingLink.routePattern,
      });
    }
  }
}
const pseudoNodes = [...pseudoMap.values()];

// Edge id → resolved target id (pseudo if PENDING::)
const resolvedTargetById = new Map<string, string>();
for (const e of allSpecEdges) {
  if (String(e.target).startsWith('PENDING::') && e.pendingLink) {
    const key = `pending-${e.pendingLink.method.toLowerCase()}-${e.pendingLink.routePattern.replace(/[/:]/g, '-').replace(/^-+/, '')}`;
    resolvedTargetById.set(e.id, key);
  } else {
    resolvedTargetById.set(e.id, e.target);
  }
}

// ─── trigger inference: nodes with zero incoming intra-repo edges ────────────

const incomingCount = new Map<string, number>();
for (const n of nodeSpecs) incomingCount.set(n.id, 0);
for (const p of pseudoNodes) incomingCount.set(p.id, 0);
for (const e of allSpecEdges) {
  const tgt = resolvedTargetById.get(e.id)!;
  incomingCount.set(tgt, (incomingCount.get(tgt) || 0) + 1);
}
const triggerIds = new Set<string>(
  nodeSpecs.filter((n) => (incomingCount.get(n.id) || 0) === 0).map((n) => n.id)
);

// ─── status derivation from gaps + lifecycle ─────────────────────────────────

const gapsByNode = new Map<string, Gap[]>();
for (const g of gapReport.gaps) {
  if (g.objectType !== 'node') continue;
  if (!gapsByNode.has(g.objectId)) gapsByNode.set(g.objectId, []);
  gapsByNode.get(g.objectId)!.push(g);
}

// Nodes that originate a pending cross-repo edge → CHANGES_REQUESTED
const pendingSourceIds = new Set<string>(
  allSpecEdges.filter((e) => String(e.target).startsWith('PENDING::')).map((e) => e.source)
);

function statusFor(nodeId: string): NodeStatus {
  const ng = gapsByNode.get(nodeId) || [];
  if (ng.some((g) => g.severity === 'high')) return 'IN_REVIEW';
  if (pendingSourceIds.has(nodeId)) return 'CHANGES_REQUESTED';
  if (ng.some((g) => g.severity === 'medium')) return 'IN_REVIEW';
  // Approve a deterministic ~25% of gap-free nodes with ≥2 incoming edges so
  // the registry & queue aren't monochrome.
  if (ng.length === 0 && (incomingCount.get(nodeId) || 0) >= 2 && hashSeed(nodeId) % 4 === 0) return 'APPROVED';
  return 'DRAFT';
}

// One representative node receives a synthetic v1.1.0 to exercise the
// "newer version available" UI and feed the version Diff. Deterministic pick:
// first node (by sorted id) that has at least one gap.
const NEWER_VERSION_NODE_ID =
  [...nodeSpecs].map((n) => n.id).sort().find((id) => (gapsByNode.get(id) || []).length > 0) || nodeSpecs[0]?.id;

// ─── deterministic layered auto-layout ───────────────────────────────────────

interface Pos { x: number; y: number; }
function autoLayout(allIds: string[], edges: { src: string; tgt: string }[]): Record<string, Pos> {
  const incoming = new Map<string, string[]>();
  for (const id of allIds) incoming.set(id, []);
  for (const e of edges) {
    if (!incoming.has(e.tgt) || !incoming.has(e.src)) continue;
    incoming.get(e.tgt)!.push(e.src);
  }
  const layer = new Map<string, number>();
  const stack = new Set<string>();
  const compute = (id: string): number => {
    const cached = layer.get(id);
    if (cached !== undefined) return cached;
    if (stack.has(id)) return 0; // cycle break
    stack.add(id);
    const ins = incoming.get(id) || [];
    const l = ins.length === 0 ? 0 : Math.max(...ins.map((s) => compute(s) + 1));
    stack.delete(id);
    layer.set(id, l);
    return l;
  };
  for (const id of allIds) compute(id);
  const buckets = new Map<number, string[]>();
  for (const id of [...allIds].sort()) {
    const l = layer.get(id)!;
    if (!buckets.has(l)) buckets.set(l, []);
    buckets.get(l)!.push(id);
  }
  const pos: Record<string, Pos> = {};
  // Cap the real layers; push pseudo PENDING:: nodes one column further right.
  const maxRealLayer = Math.max(...[...buckets.keys()].filter((l) => buckets.get(l)!.some((id) => !id.startsWith('pending-'))));
  for (const [l, ids] of buckets) {
    ids.forEach((id, idx) => {
      const column = id.startsWith('pending-') ? maxRealLayer + 1 : l;
      pos[id] = { x: 80 + column * 220, y: 80 + idx * 130 };
    });
  }
  return pos;
}

const allNodeIds = [...nodeSpecs.map((n) => n.id), ...pseudoNodes.map((p) => p.id)];
const intraEdges = allSpecEdges.map((e) => ({ src: e.source, tgt: resolvedTargetById.get(e.id)! }));
const positions = autoLayout(allNodeIds, intraEdges);

// ─── workflow membership for registry workflow counts ────────────────────────

const workflowsByNode = new Map<string, number>();
for (const w of workflowSpecs) {
  const refs = w.versions[0]?.nodeRefs || [];
  for (const r of refs) workflowsByNode.set(r.id, (workflowsByNode.get(r.id) || 0) + 1);
}

// ─── builders ────────────────────────────────────────────────────────────────

const SYNTHETIC_NEWER = 'v1.1.0';

function buildNodes(): FlowNodeData[] {
  const real: FlowNodeData[] = nodeSpecs.map((n) => {
    const v = n.versions[0];
    const isTrigger = triggerIds.has(n.id);
    const category: Category = isTrigger ? 'Trigger' : CAT_MAP[n.category];
    const status = statusFor(n.id);
    const comments = (gapsByNode.get(n.id) || []).length;
    const newerVersion = n.id === NEWER_VERSION_NODE_ID ? SYNTHETIC_NEWER : undefined;
    return {
      id: n.id,
      label: v?.label || n.id,
      type: n.id,
      category,
      version: semverToVLabel(v?.version || '1.0.0'),
      status,
      tags: v?.tags || [],
      x: positions[n.id]?.x ?? 80,
      y: positions[n.id]?.y ?? 80,
      isTrigger: isTrigger || undefined,
      newerVersion,
      comments,
    };
  });
  const pseudo: FlowNodeData[] = pseudoNodes.map((p) => ({
    id: p.id,
    label: p.label,
    type: p.type,
    category: 'External',
    version: p.version,
    status: 'DRAFT',
    tags: ['cross-repo', 'pending'],
    x: positions[p.id]?.x ?? 1200,
    y: positions[p.id]?.y ?? 80,
    comments: 0,
  }));
  return [...real, ...pseudo];
}

function buildEdges(): EdgeData[] {
  return allSpecEdges.map((e) => ({ id: e.id, src: e.source, tgt: resolvedTargetById.get(e.id)! }));
}

export interface RegistryNode {
  id: string;
  category: Category;
  version: string;
  status: NodeStatus;
  workflows: number;
  type: string;
  newerVersion?: string;
}

function buildRegistry(): RegistryNode[] {
  return nodeSpecs.map((n) => {
    const isTrigger = triggerIds.has(n.id);
    return {
      id: n.id,
      category: isTrigger ? 'Trigger' : CAT_MAP[n.category],
      version: semverToVLabel(n.versions[0]?.version || '1.0.0'),
      status: statusFor(n.id),
      workflows: workflowsByNode.get(n.id) || 0,
      type: n.id,
      newerVersion: n.id === NEWER_VERSION_NODE_ID ? SYNTHETIC_NEWER : undefined,
    };
  });
}

function buildQueue(): QueueRow[] {
  const rows: QueueRow[] = [];
  const submitters = ['alice', 'bob', 'carol', 'dan'];
  const nodeById = new Map(nodeSpecs.map((n) => [n.id, n]));
  const wfById = new Map(workflowSpecs.map((w) => [w.id, w]));
  const seen = new Set<string>();
  for (const g of gapReport.gaps) {
    if (g.objectType !== 'node' && g.objectType !== 'workflow') continue;
    if (seen.has(g.objectId)) continue;
    seen.add(g.objectId);
    const seed = hashSeed(g.objectId);
    const dayOffset = seed % 5;
    const hour = seed % 23;
    const submittedAt = `2026-05-${String(13 + dayOffset).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String((seed >> 4) % 60).padStart(2, '0')}`;
    if (g.objectType === 'node') {
      const n = nodeById.get(g.objectId);
      if (!n) continue;
      rows.push({
        id: `q-${g.objectId}`,
        name: n.versions[0]?.label || n.id,
        type: 'Node',
        version: semverToVLabel(n.versions[0]?.version || '1.0.0'),
        submittedBy: submitters[seed % submitters.length],
        submittedAt,
        status: statusFor(n.id),
        category: CAT_MAP[n.category],
      });
    } else {
      const w = wfById.get(g.objectId);
      if (!w) continue;
      // Workflow-info gaps surface as IN_REVIEW; higher severities map similarly.
      const status: NodeStatus = g.severity === 'high' ? 'IN_REVIEW' : g.severity === 'medium' ? 'SUBMITTED' : 'IN_REVIEW';
      rows.push({
        id: `q-${g.objectId}`,
        name: w.versions[0]?.label || w.id,
        type: 'Workflow',
        version: semverToVLabel(w.versions[0]?.version || '1.0.0'),
        submittedBy: submitters[seed % submitters.length],
        submittedAt,
        status,
        category: '—',
      });
    }
  }
  // Sort newest-looking first for a queue-like ordering.
  return rows.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

function severityTone(s: Gap['severity']): NotificationTone {
  return s === 'high' ? 'danger' : s === 'medium' ? 'warning' : s === 'low' ? 'info' : 'info';
}
function notifTypeFor(checkId: string): string {
  if (checkId.startsWith('pending-link')) return 'Submission';
  if (checkId.startsWith('manifest')) return 'Approval';
  if (checkId.startsWith('workflow')) return 'Upgrade';
  if (checkId === 'runtime-variable-value') return 'Comment';
  return 'Comment';
}
function buildNotifications(): NotificationItem[] {
  const order = { high: 0, medium: 1, low: 2, info: 3 } as const;
  const sorted = [...gapReport.gaps].sort(
    (a, b) => order[a.severity] - order[b.severity] || a.gapId.localeCompare(b.gapId)
  );
  const TIMES = ['2m ago', '15m ago', '1h ago', '3h ago', '6h ago', '1d ago'];
  return sorted.slice(0, 6).map((g, i) => ({
    id: g.gapId,
    unread: i < 3,
    type: notifTypeFor(g.checkId),
    title: `${g.objectLabel} — ${g.message}`,
    time: TIMES[i] || '2d ago',
    tone: severityTone(g.severity),
  }));
}

export interface PickerNode {
  id: string;
  name: string;
  desc: string;
}

function buildPicker(): Record<string, PickerNode[]> {
  const cats: Category[] = ['Trigger', 'UI', 'Logic', 'Infra', 'Data', 'External'];
  const out: Record<string, PickerNode[]> = {};
  for (const c of cats) out[c] = [];
  for (const n of nodeSpecs) {
    const c = triggerIds.has(n.id) ? 'Trigger' : CAT_MAP[n.category];
    out[c].push({
      id: n.id,
      name: n.versions[0]?.label || n.id,
      desc: (n.versions[0]?.description || '').slice(0, 90),
    });
  }
  return out;
}

interface DiffLine { t: 'unchanged' | 'removed' | 'added'; text: string; }
function buildDiffLines(): DiffLine[] {
  const target = nodeSpecs.find((n) => n.id === NEWER_VERSION_NODE_ID) || nodeSpecs[0];
  if (!target) return [];
  const v = target.versions[0];
  const tags = v?.tags?.join(', ') || '';
  // Synthetic v1.1.0 hardens the description and bumps a property — mirrors a
  // realistic post-extraction edit the maker would make.
  return [
    { t: 'unchanged', text: `id: ${target.id}` },
    { t: 'unchanged', text: `category: ${target.category}` },
    { t: 'removed', text: `version: 1.0.0` },
    { t: 'added', text: `version: 1.1.0` },
    { t: 'unchanged', text: `label: ${v?.label || target.id}` },
    { t: 'removed', text: `description: ${v?.description || ''}` },
    { t: 'added', text: `description: ${(v?.description || '').replace(/\.?$/, '')} — hardened with null-guard on inputs.` },
    { t: 'unchanged', text: `tags: [${tags}]` },
    { t: 'added', text: `properties.reviewed: true` },
    { t: 'added', text: `lifecycle.status: submitted` },
  ];
}

function buildFileTree(): string {
  const lines: string[] = [];
  lines.push(`${appSpec.app.replace(/\s+/g, '-').toLowerCase()}/`);
  lines.push(`├── app.spec.json`);
  lines.push(`├── extract-result.json`);
  lines.push(`├── gap-report.json`);
  lines.push(`├── nodes/`);
  specFileNames.nodes.forEach((f, i, a) =>
    lines.push(`│   ${i === a.length - 1 ? '└──' : '├──'} ${f}`)
  );
  lines.push(`├── edges/`);
  specFileNames.edges.forEach((f, i, a) =>
    lines.push(`│   ${i === a.length - 1 ? '└──' : '├──'} ${f}`)
  );
  lines.push(`└── workflows/`);
  specFileNames.workflows.forEach((f, i, a) =>
    lines.push(`    ${i === a.length - 1 ? '└──' : '├──'} ${f}`)
  );
  return lines.join('\n');
}

// ─── public exports — match the symbols the screens import from ../data ────

export const INITIAL_NODES: FlowNodeData[] = buildNodes();
export const INITIAL_EDGES: EdgeData[] = buildEdges();
export const STICKIES: StickyData[] = [];
export const REGISTRY_NODES: RegistryNode[] = buildRegistry();
export const QUEUE_DATA: QueueRow[] = buildQueue();
export const NOTIFICATIONS: NotificationItem[] = buildNotifications();
export const PICKER_NODES: Record<string, PickerNode[]> = buildPicker();
export const DIFF_LINES: DiffLine[] = buildDiffLines();
export const EXPORT_FILE_TREE: string = buildFileTree();

// Debug-friendly counters (used nowhere; kept for completeness / smoke tests).
export const _adapterStats = {
  realNodes: nodeSpecs.length,
  pseudoNodes: pseudoNodes.length,
  edges: allSpecEdges.length,
  workflows: workflowSpecs.length,
  gaps: gapReport.gaps.length,
  extractedFrom: extractResult.repo,
};
