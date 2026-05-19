import { useRef, useState, type CSSProperties } from 'react';
import { SearchIcon, CloseIcon, AddIcon, MaximizeIcon, GridIcon } from '@salt-ds/icons';
import { IconButton, Input, Select, ToggleGroup, Tooltip } from './primitives';
import { CAT_COLORS, STATUS_META } from '../theme';
import { T } from '../tokens';
import { nodeIcon } from '../icons';
import { INITIAL_EDGES, INITIAL_NODES, STICKIES } from '../data';
import type { EdgeData, FlowNodeData, StickyData, ViewMode } from '../types';

const NODE_SIZE = 90;
const PORT_RADIUS = 6;

const getOutputPort = (n: FlowNodeData) => ({ x: n.x + NODE_SIZE, y: n.y + NODE_SIZE / 2 });
const getInputPort = (n: FlowNodeData) => ({ x: n.x, y: n.y + NODE_SIZE / 2 });

// ─── Edges ────────────────────────────────────────────────────────────────────
function EdgeLayer({
  nodes,
  edges,
  selected,
}: {
  nodes: FlowNodeData[];
  edges: EdgeData[];
  selected: string | null;
}) {
  const findNode = (id: string) => nodes.find((n) => n.id === id);
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <marker id="wf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 z" fill={T.borderStrong} />
        </marker>
        <marker id="wf-arrow-sel" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 z" fill={T.accent} />
        </marker>
      </defs>
      {edges.map((e) => {
        const s = findNode(e.src);
        const t = findNode(e.tgt);
        if (!s || !t) return null;
        const p1 = getOutputPort(s);
        const p2 = getInputPort(t);
        const dx = Math.max(60, Math.abs(p2.x - p1.x) * 0.5);
        const sel = selected === e.src || selected === e.tgt;
        const stroke = sel ? T.accent : T.borderStrong;
        return (
          <g key={e.id}>
            <path
              d={`M${p1.x},${p1.y} C${p1.x + dx},${p1.y} ${p2.x - dx},${p2.y} ${p2.x - 8},${p2.y}`}
              fill="none"
              stroke={stroke}
              strokeWidth={sel ? 2.5 : 2}
              markerEnd={`url(#${sel ? 'wf-arrow-sel' : 'wf-arrow'})`}
              opacity={sel ? 1 : 0.75}
              style={{ transition: 'stroke 0.15s, opacity 0.15s' }}
            />
            <g
              transform={`translate(${(p1.x + p2.x) / 2},${(p1.y + p2.y) / 2})`}
              opacity={0}
              style={{ transition: 'opacity 0.15s' }}
              onMouseEnter={(ev) => ev.currentTarget.setAttribute('opacity', '1')}
              onMouseLeave={(ev) => ev.currentTarget.setAttribute('opacity', '0')}
            >
              <circle r="8" fill={T.surface} stroke={T.border} strokeWidth="1" />
              <path d="M-4,0 L4,0 M0,-4 L0,4" stroke={T.fgSecondary} strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Single Node ─────────────────────────────────────────────────────────────
function FlowNode({
  node,
  selected,
  onSelect,
  onOpenDetail,
}: {
  node: FlowNodeData;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpenDetail: (n: FlowNodeData) => void;
}) {
  const [hov, setHov] = useState(false);
  const catColor = CAT_COLORS[node.category] || T.fgSecondary;
  const status = STATUS_META[node.status];
  const isTrigger = node.isTrigger;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpenDetail(node);
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: NODE_SIZE,
        height: NODE_SIZE,
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: selected ? 5 : 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: T.surface,
          border: selected
            ? `2px solid ${T.accent}`
            : `2px solid ${hov ? T.fgSecondary : T.border}`,
          borderRadius: isTrigger ? '20px 8px 8px 20px' : 8,
          boxShadow: selected
            ? '0 0 0 4px rgba(42,156,251,0.15), 0 4px 12px rgba(0,0,0,0.08)'
            : hov
              ? '0 4px 14px rgba(0,0,0,0.45)'
              : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 6,
            background: catColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            {nodeIcon(node.type)}
          </svg>
        </div>

        <div style={{ position: 'absolute', top: -7, right: -7, display: 'flex', gap: 3 }}>
          {node.pinned && (
            <Tooltip content="Pinned data">
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: T.surface,
                  border: `1.5px solid ${T.warning}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                📌
              </span>
            </Tooltip>
          )}
          <Tooltip content={status.label}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: status.dot,
                border: `2px solid ${T.surface}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.45)',
              }}
            />
          </Tooltip>
        </div>

        {node.newerVersion && (
          <div style={{ position: 'absolute', top: -7, left: -7 }}>
            <Tooltip content={`Newer version available: ${node.newerVersion}`}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: T.success,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.45)',
                }}
              >
                ↑
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      {!isTrigger && (
        <div
          style={{
            position: 'absolute',
            left: -PORT_RADIUS - 2,
            top: NODE_SIZE / 2 - PORT_RADIUS,
            width: PORT_RADIUS * 2 + 4,
            height: PORT_RADIUS * 2 + 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: PORT_RADIUS * 2,
              height: PORT_RADIUS * 2,
              borderRadius: '50%',
              background: T.fgSecondary,
              border: `2px solid ${T.surface}`,
              boxShadow: `0 0 0 1px ${T.border}`,
            }}
          />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          right: -PORT_RADIUS - 2,
          top: NODE_SIZE / 2 - PORT_RADIUS,
          width: PORT_RADIUS * 2 + 4,
          height: PORT_RADIUS * 2 + 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: PORT_RADIUS * 2,
            height: PORT_RADIUS * 2,
            borderRadius: '50%',
            background: hov ? T.accent : T.fgSecondary,
            border: `2px solid ${T.surface}`,
            boxShadow: `0 0 0 1px ${T.border}`,
            transition: 'background 0.12s',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: NODE_SIZE + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 600, color: T.fg, marginBottom: 2 }}>
          {node.label}
        </div>
        <div style={{ fontSize: 10.5, color: T.fgSecondary, fontFamily: '"PT Mono", ui-monospace, monospace' }}>
          {node.version}
        </div>
      </div>

      {node.comments > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            background: T.accent,
            color: T.accentFg,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            padding: '0 5px',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${T.surface}`,
          }}
        >
          {node.comments}
        </div>
      )}
    </div>
  );
}

// ─── Sticky note ──────────────────────────────────────────────────────────────
function StickyNote({ note }: { note: StickyData }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.w,
        minHeight: note.h,
        background: 'rgba(255,201,74,0.12)',
        border: `1px solid ${T.warning}`,
        borderRadius: 5,
        padding: '10px 12px',
        fontSize: 12,
        color: T.warning,
        lineHeight: 1.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        transform: 'rotate(-0.5deg)',
      }}
    >
      {note.text}
    </div>
  );
}

// ─── Swim lanes ───────────────────────────────────────────────────────────────
function SwimLanes({ categories, laneH = 180 }: { categories: string[]; laneH?: number }) {
  return (
    <>
      {categories.map((cat, i) => (
        <div
          key={cat}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: i * laneH,
            height: laneH,
            background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.025)',
            borderBottom: `1px dashed ${T.border}`,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 14,
              top: 10,
              fontSize: 10,
              fontWeight: 700,
              color: CAT_COLORS[cat] || T.fgSecondary,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            {cat}
          </span>
        </div>
      ))}
    </>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface Filters {
  search: string;
  status: string;
  category: string;
  viewMode: ViewMode;
}

function CanvasToolbar({
  filters,
  onFilter,
  onClearFilters,
}: {
  filters: Filters;
  onFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  onClearFilters: () => void;
}) {
  const hasFilters = filters.search || filters.status || filters.category;
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'auto' }}>
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Input
            value={filters.search}
            onChange={(e) => onFilter('search', e.target.value)}
            placeholder="Find a node…"
            startIcon={<SearchIcon aria-hidden />}
            style={{ width: 200 }}
            aria-label="Search canvas"
          />
          <span style={{ width: 1, height: 18, background: T.border }} />
          <Select
            value={filters.status}
            onChange={(v) => onFilter('status', v)}
            options={['APPROVED', 'DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'REJECTED']}
            placeholder="Status"
            aria-label="Status filter"
            style={{ width: 130 }}
          />
          <Select
            value={filters.category}
            onChange={(v) => onFilter('category', v)}
            options={['UI', 'Logic', 'Infra', 'Data', 'External', 'Trigger']}
            placeholder="Category"
            aria-label="Category filter"
            style={{ width: 120 }}
          />
          {hasFilters && (
            <IconButton size={28} onClick={onClearFilters} aria-label="Clear filters" title="Clear filters">
              <CloseIcon aria-hidden />
            </IconButton>
          )}
        </div>
        <ToggleGroup
          options={[
            { value: 'standard', label: 'Workflow' },
            { value: 'swimlanes', label: 'Swim lanes' },
          ]}
          value={filters.viewMode}
          onChange={(v) => onFilter('viewMode', v)}
        />
      </div>
    </div>
  );
}

// ─── Zoom stack ───────────────────────────────────────────────────────────────
function CanvasFloatControls({
  zoom,
  onZoom,
  onFit,
  onLayout,
}: {
  zoom: number;
  onZoom: (z: number) => void;
  onFit: () => void;
  onLayout: () => void;
}) {
  const sep: CSSProperties = { height: 1, background: T.border, margin: '2px 4px' };
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 18,
        right: 18,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-end',
      }}
    >
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <IconButton size={28} onClick={() => onZoom(zoom + 0.1)} aria-label="Zoom in" title="Zoom in">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </IconButton>
        <div style={sep} />
        <IconButton size={28} onClick={() => onZoom(zoom - 0.1)} aria-label="Zoom out" title="Zoom out">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </IconButton>
        <div style={sep} />
        <IconButton size={28} onClick={onFit} aria-label="Fit to screen" title="Fit to screen">
          <MaximizeIcon aria-hidden />
        </IconButton>
        <div style={sep} />
        <IconButton size={28} onClick={onLayout} aria-label="Auto-layout" title="Auto-layout">
          <GridIcon aria-hidden />
        </IconButton>
      </div>
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 5,
          padding: '4px 10px',
          fontSize: 11,
          color: T.fgSecondary,
          fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          fontFamily: '"PT Mono", ui-monospace, monospace',
        }}
      >
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}

function AddNodeFab({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
      <IconButton
        size={48}
        onClick={onClick}
        aria-label="Add node"
        style={{
          borderRadius: '50%',
          background: T.accent,
          color: T.accentFg,
          boxShadow: '0 4px 14px rgba(42,156,251,0.35), 0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <AddIcon aria-hidden size={2} />
      </IconButton>
    </div>
  );
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────
export function FlowCanvas({
  onNodeSelect,
  selectedNode,
  onOpenDetail,
  onOpenNodePicker,
  defaultViewMode,
}: {
  onNodeSelect: (id: string | null) => void;
  selectedNode: string | null;
  onOpenDetail: (n: FlowNodeData) => void;
  onOpenNodePicker: () => void;
  defaultViewMode: ViewMode;
}) {
  const nodes = INITIAL_NODES;
  const [zoom, setZoom] = useState(1);
  const pan = { x: 0, y: 0 };
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    category: '',
    viewMode: defaultViewMode,
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const setFilter = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setFilters((p) => ({ ...p, [k]: v }));
  const clearFilters = () => setFilters((p) => ({ ...p, search: '', status: '', category: '' }));
  const handleZoom = (z: number) => setZoom(clamp(parseFloat(z.toFixed(2)), 0.3, 2));

  const visible = nodes.filter((n) => {
    if (
      filters.search &&
      !n.label.toLowerCase().includes(filters.search.toLowerCase()) &&
      !n.tags.some((t) => t.toLowerCase().includes(filters.search.toLowerCase()))
    )
      return false;
    if (filters.status && n.status !== filters.status) return false;
    if (filters.category && n.category !== filters.category) return false;
    return true;
  });
  const hiddenIds = new Set(nodes.filter((n) => !visible.includes(n)).map((n) => n.id));

  return (
    <div
      ref={canvasRef}
      onClick={(e) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).dataset?.canvasBg)
          onNodeSelect(null);
      }}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: T.surfaceSecondary,
        backgroundImage: `radial-gradient(circle, ${T.borderSubtle} 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      <div
        data-canvas-bg="1"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {filters.viewMode === 'swimlanes' && (
          <SwimLanes categories={['UI', 'Logic', 'Infra', 'Data', 'Trigger']} />
        )}
        {STICKIES.map((s) => (
          <StickyNote key={s.id} note={s} />
        ))}
        <EdgeLayer nodes={nodes} edges={INITIAL_EDGES} selected={selectedNode} />
        {nodes.map((n) => (
          <div
            key={n.id}
            style={{ opacity: hiddenIds.has(n.id) ? 0.18 : 1, transition: 'opacity 0.2s' }}
          >
            <FlowNode
              node={n}
              selected={selectedNode === n.id}
              onSelect={onNodeSelect}
              onOpenDetail={onOpenDetail}
            />
          </div>
        ))}
      </div>

      <CanvasToolbar filters={filters} onFilter={setFilter} onClearFilters={clearFilters} />
      <CanvasFloatControls
        zoom={zoom}
        onZoom={handleZoom}
        onFit={() => setZoom(1)}
        onLayout={() => {}}
      />
      <AddNodeFab onClick={onOpenNodePicker} />
    </div>
  );
}
