import { useEffect, useState, type CSSProperties } from 'react';
import { H3 } from '@salt-ds/core';
import {
  SearchIcon,
  CloseIcon,
  MicroMenuIcon,
  ChevronLeftIcon,
  SuccessCircleIcon,
  WarningSolidIcon,
  ErrorSolidIcon,
  InfoSolidIcon,
  NotificationIcon,
  DownloadIcon,
  SuccessTickIcon,
} from '@salt-ds/icons';
import {
  Banner,
  Button,
  Card,
  Dialog,
  Dot,
  Drawer,
  FormField,
  IconButton,
  Input,
  Menu,
  Select,
  Tag,
  Textarea,
} from './primitives';
import { CAT_COLORS, STATUS_META } from '../theme';
import { T } from '../tokens';
import { nodeIcon } from '../icons';
import { DIFF_LINES, NOTIFICATIONS, PICKER_NODES } from '../data';
import type { DetailNode, NotificationItem, QueueRow } from '../types';

function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: T.accent,
        color: T.accentFg,
        fontSize: size * 0.45,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {name[0].toUpperCase()}
    </span>
  );
}

const panelHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: `1px solid ${T.border}`,
  flexShrink: 0,
  background: T.surface,
};

// ─── Node Picker ──────────────────────────────────────────────────────────────
export function NodePicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const filterFn = (items: typeof PICKER_NODES[string]) =>
    items.filter(
      (n) =>
        !search ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.desc.toLowerCase().includes(search.toLowerCase())
    );
  return (
    <Drawer open={open} onClose={onClose} width={380} hideCloseButton>
      <div style={{ ...panelHeader, flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <H3 styleAs="h4">Add a node</H3>
          <IconButton onClick={onClose} size={26} aria-label="Close">
            <CloseIcon aria-hidden />
          </IconButton>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search nodes…"
          aria-label="Search nodes"
          startIcon={<SearchIcon aria-hidden />}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {Object.entries(PICKER_NODES).map(([cat, items]) => {
          const visible = filterFn(items);
          if (!visible.length) return null;
          const expanded = !selectedCat || selectedCat === cat;
          return (
            <div key={cat}>
              <div
                onClick={() => setSelectedCat(selectedCat === cat ? null : cat)}
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: T.surfaceSecondary,
                  cursor: 'pointer',
                  borderBottom: expanded ? `1px solid ${T.borderSubtle}` : 'none',
                  borderTop: `1px solid ${T.borderSubtle}`,
                  userSelect: 'none',
                }}
              >
                <Dot color={CAT_COLORS[cat] || T.fgSecondary} size={6} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.fgSecondary,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    flex: 1,
                  }}
                >
                  {cat}
                </span>
                <span style={{ fontSize: 11, color: T.fgSecondary }}>{visible.length}</span>
              </div>
              {expanded &&
                visible.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      cursor: 'grab',
                      borderBottom: `1px solid ${T.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 5,
                        flexShrink: 0,
                        background: CAT_COLORS[cat],
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 32 32">
                        {nodeIcon(n.id)}
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.fg }}>{n.name}</div>
                      <div style={{ fontSize: 11.5, color: T.fgSecondary, marginTop: 1 }}>{n.desc}</div>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}

// ─── Node Detail Drawer ───────────────────────────────────────────────────────
export function NodeDetailDrawer({
  node,
  onClose,
  initialTab = 'parameters',
}: {
  node: DetailNode | null;
  onClose: () => void;
  initialTab?: string;
}) {
  const [tab, setTab] = useState(initialTab);
  const [comment, setComment] = useState('');
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, node?.id]);
  if (!node) return null;
  const catColor = CAT_COLORS[node.category] || T.fgSecondary;
  const status = STATUS_META[node.status];
  const tabs = [
    { id: 'parameters', label: 'Parameters', warn: node.status === 'CHANGES_REQUESTED' },
    { id: 'details', label: 'Details' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'comments', label: 'Comments', badge: node.comments },
    { id: 'versions', label: 'Versions' },
  ];
  const versionHistory = [
    { ver: 'v1.1.0', status: 'APPROVED', author: 'alice', date: 'Apr 12', msg: 'Initial approval' },
    { ver: 'v1.0.1', status: 'APPROVED', author: 'bob', date: 'Mar 28', msg: 'Fix null-guard on order_id' },
    { ver: 'v1.0.0', status: 'REJECTED', author: 'alice', date: 'Mar 20', msg: 'Missing validation logic' },
  ];

  return (
    <Drawer open={!!node} onClose={onClose} width={520} hideCloseButton>
      <div style={panelHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 5,
              background: catColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32">
              {nodeIcon(node.type)}
            </svg>
          </div>
          <div>
            <H3 styleAs="h4">{node.label}</H3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Tag color={status.status} size="sm">
                <Dot color={status.dot} size={5} /> {status.label}
              </Tag>
              <span style={{ fontSize: 11, color: T.fgSecondary, fontFamily: '"PT Mono", monospace' }}>
                {node.version}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Menu
            items={[
              { label: 'Execute node' },
              { label: 'Pin data' },
              { divider: true },
              { label: 'Duplicate as DRAFT' },
              { label: 'Submit for review' },
              { divider: true },
              { label: 'Delete', danger: true },
            ]}
            trigger={
              <IconButton size={28} aria-label="More">
                <MicroMenuIcon aria-hidden />
              </IconButton>
            }
          />
          <IconButton onClick={onClose} size={28} aria-label="Close">
            <CloseIcon aria-hidden />
          </IconButton>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${T.border}`,
          padding: '0 14px',
          flexShrink: 0,
          background: T.surfaceSecondary,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
              color: tab === t.id ? T.fg : T.fgSecondary,
              fontWeight: tab === t.id ? 600 : 500,
              fontSize: 12.5,
              cursor: 'pointer',
              marginBottom: -1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            {t.label}
            {t.warn && <Dot color={T.error} size={6} />}
            {!!t.badge && t.badge > 0 && (
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 5px',
                  background: T.surfaceSecondary,
                  border: `1px solid ${T.border}`,
                  color: T.fgSecondary,
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
        {tab === 'parameters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {node.status === 'CHANGES_REQUESTED' && (
              <Banner tone="warning">
                Schema validation errors found. Fix highlighted fields before saving.
              </Banner>
            )}
            <FormField label="Strict mode" helper="Reject any input that doesn't match schema exactly">
              <Select
                value="true"
                options={[
                  { value: 'true', label: 'On' },
                  { value: 'false', label: 'Off' },
                ]}
                aria-label="Strict mode"
              />
            </FormField>
            <FormField label="Max retries" helper="0–10 retries on transient errors">
              <Input value="3" aria-label="Max retries" />
            </FormField>
            <FormField label="Timeout (ms)" error="Must be a positive integer">
              <Input value="-1" aria-label="Timeout" error />
            </FormField>
            <FormField label="Schema reference">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 10px',
                  background: T.surfaceSecondary,
                  border: `1px solid ${T.border}`,
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                <span style={{ fontFamily: '"PT Mono", monospace' }}>/specs/schemas/logic.schema.json</span>
                <Button variant="tertiary" size="sm">
                  Open ↗
                </Button>
              </span>
            </FormField>
            <FormField label="Description">
              <Textarea
                value="Handles order validation including null-guard on order_id and field-level checks."
                rows={3}
                aria-label="Description"
              />
            </FormField>
          </div>
        )}

        {tab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Node ID">
              <Input value={node.id} readOnly aria-label="Node ID" style={{ fontFamily: '"PT Mono", monospace' }} />
            </FormField>
            <FormField label="Label">
              <Input value={node.label} aria-label="Label" />
            </FormField>
            <FormField label="Category">
              <Input value={String(node.category)} readOnly aria-label="Category" />
            </FormField>
            <FormField label="Tags">
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {node.tags.map((t) => (
                  <Tag key={t} color="neutral">
                    {t}
                  </Tag>
                ))}
                <Button variant="tertiary" size="sm">
                  + Add tag
                </Button>
              </div>
            </FormField>
          </div>
        )}

        {tab === 'lifecycle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { l: 'Status', v: status.label },
              { l: 'Submitted by', v: 'alice' },
              { l: 'Submitted at', v: 'May 18, 2026 09:14' },
              { l: 'Reviewed by', v: 'checker-dan' },
              { l: 'Reviewed at', v: 'May 18, 2026 15:30' },
            ].map((f) => (
              <FormField key={f.l} label={f.l}>
                <Input value={f.v} readOnly aria-label={f.l} />
              </FormField>
            ))}
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 6,
                paddingTop: 14,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <Button variant="primary" size="sm">
                Submit for review
              </Button>
              <Button variant="secondary" size="sm">
                Withdraw submission
              </Button>
            </div>
          </div>
        )}

        {tab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Select
                value="unresolved"
                options={['unresolved', 'all', 'orphaned']}
                aria-label="Comment filter"
                style={{ width: 140 }}
              />
            </div>
            {[
              {
                author: 'checker-dan',
                time: 'May 18',
                body: 'Logic does not handle null order_id. Please add validation guard before processing.',
                fromPrev: true,
              },
              {
                author: 'alice',
                time: 'May 18',
                body: 'Acknowledged. Will fix in v2.1.0 with explicit null-guard.',
                fromPrev: false,
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  background: c.fromPrev ? T.warningBg : T.surfaceSecondary,
                  border: `1px solid ${c.fromPrev ? T.warning : T.border}`,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <Avatar name={c.author} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
                  <span style={{ fontSize: 10.5, color: T.fgSecondary }}>· {c.time}</span>
                  {c.fromPrev && (
                    <Tag color="warning" size="sm">
                      from previous review
                    </Tag>
                  )}
                  <span style={{ flex: 1 }} />
                  <Button variant="tertiary" size="sm">
                    Resolve
                  </Button>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: T.fg }}>{c.body}</p>
              </div>
            ))}
            <div
              style={{
                marginTop: 4,
                paddingTop: 14,
                borderTop: `1px solid ${T.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
                rows={2}
                aria-label="Add comment"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" size="sm" disabled={!comment.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === 'versions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: T.fgSecondary }}>{versionHistory.length} versions</span>
              <Button variant="secondary" size="sm">
                Compare versions
              </Button>
            </div>
            {versionHistory.map((v, i) => (
              <Card key={i} accent={v.status === 'APPROVED' ? T.success : T.error} style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        fontFamily: '"PT Mono", monospace',
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: T.fg,
                      }}
                    >
                      {v.ver}
                    </span>
                    <Tag color={v.status === 'APPROVED' ? 'success' : 'error'} size="sm">
                      <Dot color={v.status === 'APPROVED' ? T.success : T.error} size={5} /> {v.status}
                    </Tag>
                  </div>
                  <Menu
                    items={[
                      { label: 'View at this version' },
                      { label: 'Compare to current' },
                      { label: 'Duplicate as DRAFT' },
                    ]}
                    trigger={
                      <IconButton size={24} aria-label="Version actions">
                        <MicroMenuIcon aria-hidden />
                      </IconButton>
                    }
                  />
                </div>
                <div style={{ fontSize: 11.5, color: T.fgSecondary, marginTop: 6 }}>
                  <strong style={{ color: T.fg }}>{v.author}</strong> · {v.date}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{v.msg}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ─── Review Panel ─────────────────────────────────────────────────────────────
export function ReviewPanel({ item, onClose }: { item: QueueRow | null; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [dialog, setDialog] = useState<null | 'approve' | 'reject' | 'changes'>(null);
  const [reason, setReason] = useState('');
  if (!item) return null;
  const isWorkflow = item.type === 'Workflow';
  const comments = [
    {
      author: 'alice',
      time: 'May 18 09:14',
      body: 'Added null-guard for order_id as requested. Also bumped strictMode to true.',
      fromPrev: false,
    },
    {
      author: 'checker-dan',
      time: 'May 17 16:30',
      body: 'Please add null-guard on order_id before processing. This caused a prod issue last sprint.',
      fromPrev: true,
    },
  ];
  const lineColor = (t: string) => (t === 'added' ? T.success : t === 'removed' ? T.error : T.fgSecondary);
  const lineBg = (t: string, side: string) =>
    t === 'unchanged'
      ? 'transparent'
      : side === 'left'
        ? t === 'removed'
          ? T.errorBg
          : 'transparent'
        : t === 'added'
          ? T.successBg
          : 'transparent';

  return (
    <>
      <Drawer open={!!item} onClose={onClose} width="68%" hideCloseButton>
        <div style={{ ...panelHeader, padding: '14px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconButton onClick={onClose} aria-label="Close" size={32}>
              <ChevronLeftIcon aria-hidden />
            </IconButton>
            <div>
              <H3 styleAs="h3" style={{ marginBottom: 3 }}>
                {item.name}
              </H3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={STATUS_META[item.status].status}>
                  <Dot color={STATUS_META[item.status].dot} size={6} /> {STATUS_META[item.status].label}
                </Tag>
                <span style={{ fontSize: 11.5, color: T.fgSecondary, fontFamily: '"PT Mono", monospace' }}>
                  {item.version}
                </span>
                <span style={{ fontSize: 11.5, color: T.fgSecondary }}>
                  · {item.type} · submitted by <strong style={{ color: T.fg }}>{item.submittedBy}</strong>
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => setDialog('changes')}>
              Request changes
            </Button>
            <Button variant="danger" onClick={() => setDialog('reject')}>
              Reject
            </Button>
            <Button variant="primary" onClick={() => setDialog('approve')}>
              <SuccessTickIcon aria-hidden />
              Approve
            </Button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: T.surfaceSecondary,
          }}
        >
          {isWorkflow && (
            <Banner tone="warning">
              This workflow contains node refs with non-APPROVED status. Approval is blocked until all
              dependencies are APPROVED.
            </Banner>
          )}

          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: 'v1.1.0 · current APPROVED', side: 'left', dot: T.success },
                { label: 'v1.2.0 · incoming', side: 'right', dot: T.warning },
              ].map((col, ci) => (
                <div key={ci} style={{ borderRight: ci === 0 ? `1px solid ${T.border}` : 'none' }}>
                  <div
                    style={{
                      padding: '9px 14px',
                      background: T.surfaceSecondary,
                      borderBottom: `1px solid ${T.border}`,
                      fontSize: 11.5,
                      color: T.fgSecondary,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Dot color={col.dot} size={6} />
                    {col.label}
                  </div>
                  <div
                    style={{
                      padding: '10px 0',
                      fontFamily: '"PT Mono", ui-monospace, monospace',
                      fontSize: 11.5,
                      lineHeight: '19px',
                    }}
                  >
                    {DIFF_LINES.map((line, i) => {
                      const show = ci === 0 ? line.t !== 'added' : line.t !== 'removed';
                      return show ? (
                        <div
                          key={i}
                          style={{
                            color: lineColor(line.t),
                            background: lineBg(line.t, col.side),
                            padding: '0 14px',
                            display: 'flex',
                            gap: 8,
                          }}
                        >
                          <span style={{ width: 14, color: T.fgSecondary, userSelect: 'none', fontSize: 10 }}>
                            {i + 1}
                          </span>
                          <span style={{ width: 10, color: T.fgSecondary, userSelect: 'none' }}>
                            {line.t === 'added' ? '+' : line.t === 'removed' ? '-' : ' '}
                          </span>
                          <span>{line.text}</span>
                        </div>
                      ) : (
                        <div key={i} style={{ height: 19 }}>
                          &nbsp;
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.fgSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Conversation ({comments.length})
              </h4>
              <Select value="open" options={['open', 'all', 'resolved']} aria-label="Comment filter" style={{ width: 130 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comments.map((c, i) => (
                <Card key={i} style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Avatar name={c.author} size={24} />
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.author}</span>
                    <span style={{ fontSize: 11, color: T.fgSecondary }}>· {c.time}</span>
                    {c.fromPrev && (
                      <Tag color="warning" size="sm">
                        from previous review
                      </Tag>
                    )}
                    <span style={{ flex: 1 }} />
                    <Button variant="tertiary" size="sm">
                      Resolve
                    </Button>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: T.fg }}>{c.body}</p>
                </Card>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                rows={2}
                aria-label="Add comment"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" size="sm" disabled={!comment.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Dialog
        open={dialog === 'approve'}
        title="Approve submission"
        onClose={() => setDialog(null)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setDialog(null)}>
              Confirm approval
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>
          Approve{' '}
          <strong>
            {item.name} {item.version}
          </strong>
          ?
        </p>
        <p style={{ fontSize: 12.5, color: T.fgSecondary, marginTop: 8, lineHeight: 1.5 }}>
          This will move the spec to APPROVED status and notify <strong>{item.submittedBy}</strong>. Any open
          comments will be carried forward to the next submission.
        </p>
      </Dialog>
      <Dialog
        open={dialog === 'reject'}
        title="Reject submission"
        onClose={() => setDialog(null)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={!reason.trim()} onClick={() => setDialog(null)}>
              Confirm rejection
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 13 }}>
            Rejecting{' '}
            <strong>
              {item.name} {item.version}
            </strong>
            . Please provide a reason for the maker:
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection…"
            rows={4}
            aria-label="Rejection reason"
          />
        </div>
      </Dialog>
      <Dialog
        open={dialog === 'changes'}
        title="Request changes"
        onClose={() => setDialog(null)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!reason.trim()} onClick={() => setDialog(null)}>
              Send request
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 13 }}>
            Specify what changes are needed for{' '}
            <strong>
              {item.name} {item.version}
            </strong>
            :
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe required changes…"
            rows={4}
            aria-label="Changes description"
          />
        </div>
      </Dialog>
    </>
  );
}

// ─── Notification Center ──────────────────────────────────────────────────────
export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions'>('all');
  const [typeF, setTypeF] = useState('');
  const unreadCount = items.filter((n) => n.unread).length;
  const markAll = () => setItems((ns) => ns.map((n) => ({ ...n, unread: false })));
  const visible = items.filter((n) => {
    if (filter === 'unread' && !n.unread) return false;
    if (typeF && n.type !== typeF) return false;
    return true;
  });
  const toneIcon = {
    success: <SuccessCircleIcon aria-hidden style={{ color: T.success }} />,
    warning: <WarningSolidIcon aria-hidden style={{ color: T.warning }} />,
    danger: <ErrorSolidIcon aria-hidden style={{ color: T.error }} />,
    info: <InfoSolidIcon aria-hidden style={{ color: T.info }} />,
  };
  return (
    <Drawer open onClose={onClose} width={420} hideCloseButton>
      <div style={panelHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <H3 styleAs="h4">Notifications</H3>
          {unreadCount > 0 && (
            <Tag color="accent" size="sm">
              {unreadCount} new
            </Tag>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Button variant="tertiary" size="sm" onClick={markAll}>
            Mark all read
          </Button>
          <IconButton onClick={onClose} size={28} aria-label="Close">
            <CloseIcon aria-hidden />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          padding: '10px 14px',
          display: 'flex',
          gap: 8,
          borderBottom: `1px solid ${T.borderSubtle}`,
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        <Select
          value={filter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'mentions', label: 'Mentions' },
          ]}
          onChange={(v) => setFilter(v as 'all' | 'unread' | 'mentions')}
          aria-label="Notification filter"
          style={{ width: 130 }}
        />
        <Select
          value={typeF}
          options={['Submission', 'Approval', 'Rejection', 'Comment', 'Upgrade']}
          placeholder="Event type"
          onChange={setTypeF}
          aria-label="Event type filter"
          style={{ flex: 1 }}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {visible.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 14,
              color: T.fgSecondary,
            }}
          >
            <NotificationIcon aria-hidden size={2} />
            <span style={{ fontSize: 13 }}>You're all caught up.</span>
          </div>
        ) : (
          visible.map((n) => (
            <div
              key={n.id}
              onClick={() => setItems((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
              style={{
                display: 'flex',
                gap: 10,
                padding: '12px 18px',
                borderBottom: `1px solid ${T.borderSubtle}`,
                background: n.unread ? 'rgba(42,156,251,0.06)' : 'transparent',
                borderLeft: n.unread ? `3px solid ${T.accent}` : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ marginTop: 3 }}>{toneIcon[n.tone]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: T.fgSecondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    marginBottom: 3,
                  }}
                >
                  {n.type}
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, color: n.unread ? T.fg : T.fgSecondary }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 11, color: T.fgSecondary, marginTop: 5 }}>{n.time}</div>
              </div>
              <Menu
                items={[
                  { label: 'Mark as read' },
                  { label: 'Open spec' },
                  { label: 'Mute this spec' },
                ]}
                trigger={
                  <IconButton size={24} aria-label="More">
                    <MicroMenuIcon aria-hidden />
                  </IconButton>
                }
              />
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────
export function ExportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState('full');
  const [format, setFormat] = useState('json');
  const [scope, setScope] = useState('Entire app');
  const tabs = [
    { id: 'full', label: 'Full' },
    { id: 'approved', label: 'Approved only' },
    { id: 'delta', label: 'Delta', beta: true },
  ];
  const fileTree = `submit-order/
├── workflow.json
├── nodes/
│   ├── webhook-trigger.v1.0.0.json
│   ├── order-form.v1.1.0.json
│   ├── validate-order.v2.0.1.json
│   ├── payment-gateway.v1.3.0.json
│   ├── route-request.v1.0.0.json
│   ├── send-confirmation.v1.0.2.json
│   └── audit-log.v1.1.1.json
└── schemas/
    └── logic.schema.json`;
  return (
    <Dialog
      open={open}
      title="Export spec"
      onClose={onClose}
      width={600}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose}>
            <DownloadIcon aria-hidden />
            Download ZIP
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 14px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
              color: tab === t.id ? T.fg : T.fgSecondary,
              fontWeight: tab === t.id ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: -1,
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t.label}
            {t.beta && (
              <Tag color="warning" size="sm" style={{ padding: '0 4px', fontSize: 9 }}>
                BETA
              </Tag>
            )}
          </button>
        ))}
      </div>
      {tab === 'delta' && (
        <Banner tone="warning" style={{ marginBottom: 14 }}>
          Delta export is experimental. Validate that your target agent benefits from deltas before relying on
          this export.
        </Banner>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FormField label="Scope">
          <Select
            value={scope}
            onChange={setScope}
            options={['Entire app', 'Specific workflow', 'Specific node']}
            aria-label="Scope"
          />
        </FormField>
        {tab !== 'delta' && (
          <FormField label="Format">
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { v: 'json', l: 'JSON' },
                { v: 'yaml', l: 'YAML', beta: true },
              ].map((f) => (
                <label
                  key={f.v}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 5,
                    border: `1px solid ${format === f.v ? T.accent : T.border}`,
                    background: format === f.v ? 'rgba(42,156,251,0.13)' : T.surfaceSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: format === f.v ? 600 : 500,
                    color: format === f.v ? T.accent : T.fgSecondary,
                  }}
                >
                  <input
                    type="radio"
                    name="fmt"
                    value={f.v}
                    checked={format === f.v}
                    onChange={() => setFormat(f.v)}
                    style={{ accentColor: T.accent }}
                  />
                  {f.l}
                  {f.beta && (
                    <Tag color="warning" size="sm" style={{ padding: '0 4px', fontSize: 9 }}>
                      BETA
                    </Tag>
                  )}
                </label>
              ))}
            </div>
          </FormField>
        )}
        {tab === 'delta' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormField label="From version">
              <Select options={['v1.0.0', 'v1.1.0', 'v2.0.0']} placeholder="From…" aria-label="From version" />
            </FormField>
            <FormField label="To version">
              <Select options={['v1.1.0', 'v1.2.0', 'v2.0.1']} placeholder="To…" aria-label="To version" />
            </FormField>
          </div>
        )}
        <FormField label="File tree preview">
          <pre
            style={{
              background: T.overlay,
              color: T.fg,
              border: `1px solid ${T.border}`,
              fontFamily: '"PT Mono", ui-monospace, monospace',
              fontSize: 11.5,
              padding: '12px 14px',
              borderRadius: 5,
              overflow: 'auto',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {fileTree}
          </pre>
        </FormField>
      </div>
    </Dialog>
  );
}
