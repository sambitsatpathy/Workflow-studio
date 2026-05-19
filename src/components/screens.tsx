import { useState, type ReactNode } from 'react';
import { H1, H4, Table, TBody, TD, TH, THead, TR, Text } from '@salt-ds/core';
import {
  ClockIcon,
  AddIcon,
  SearchIcon,
  MicroMenuIcon,
  ArrowUpIcon,
} from '@salt-ds/icons';
import {
  Banner,
  Button,
  Card,
  Dialog,
  Dot,
  FormField,
  IconButton,
  Input,
  Menu,
  Select,
  Tag,
} from './primitives';
import { CAT_COLORS, STATUS_META } from '../theme';
import { T } from '../tokens';
import { nodeIcon } from '../icons';
import { QUEUE_DATA, REGISTRY_NODES } from '../data';
import type { DetailNode, QueueRow, ScreenId } from '../types';

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: T.fgSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: T.accent,
        color: T.accentFg,
        fontSize: size * 0.42,
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

// ─── HOME ─────────────────────────────────────────────────────────────────────
export function HomeScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const stats: { label: string; value: string; delta: string; color: string }[] = [
    { label: 'Total workflows', value: '12', delta: '+2 this week', color: T.fgSecondary },
    { label: 'Active nodes', value: '48', delta: '+5 this week', color: T.fgSecondary },
    { label: 'Pending review', value: '6', delta: '2 overdue', color: T.warning },
    { label: 'Approved', value: '31', delta: '94% pass rate', color: T.success },
  ];
  const recent = [
    { user: 'alice', action: 'submitted', spec: 'order-form v1.2.0', time: '2m ago', status: 'IN_REVIEW' as const },
    { user: 'bob', action: 'commented on', spec: 'validate-order v2.1.0', time: '15m ago', status: 'IN_REVIEW' as const },
    { user: 'carol', action: 'approved', spec: 'payment-gateway v1.4.0', time: '1h ago', status: 'APPROVED' as const },
    { user: 'checker-dan', action: 'rejected', spec: 'audit-log v1.1.1', time: '3h ago', status: 'REJECTED' as const },
    { user: 'dan', action: 'approved', spec: 'route-request v1.0.0', time: '1d ago', status: 'APPROVED' as const },
  ];
  const workflows = [
    { name: 'submit-order', nodes: 6, status: 'APPROVED' as const, version: 'v3.0.0', updated: '10:32' },
    { name: 'checkout-flow', nodes: 9, status: 'IN_REVIEW' as const, version: 'v2.4.1', updated: 'Yest.' },
    { name: 'user-onboarding', nodes: 4, status: 'DRAFT' as const, version: 'v1.0.0', updated: '2d ago' },
    { name: 'refund-process', nodes: 5, status: 'APPROVED' as const, version: 'v1.8.0', updated: '4d ago' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px', background: T.surfaceSecondary }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <H1 styleAs="h2" style={{ marginBottom: 4 }}>
            Welcome back, Alice
          </H1>
          <Text color="secondary">Here's what's happening with your workflows today.</Text>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => onNavigate('queue')}>
            <ClockIcon aria-hidden />
            Review queue
            <Tag color="warning" size="sm">
              6
            </Tag>
          </Button>
          <Button variant="primary" onClick={() => onNavigate('flow')}>
            <AddIcon aria-hidden />
            New workflow
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: '16px 18px' }}>
            <Text color="secondary" style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, display: 'block' }}>
              {s.label}
            </Text>
            <div style={{ fontSize: 30, fontWeight: 700, color: T.fg, lineHeight: 1, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: s.color, fontWeight: 500 }}>{s.delta}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <H4 styleAs="h4">Your workflows</H4>
            <Button variant="tertiary" size="sm" onClick={() => onNavigate('flow')}>
              View all →
            </Button>
          </div>
          <Table>
            <THead>
              <TR>
                {['Name', 'Nodes', 'Status', 'Version', 'Updated'].map((c) => (
                  <TH key={c} style={{ ...TH_STYLE, padding: '9px 18px' }}>
                    {c}
                  </TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {workflows.map((w) => (
                <TR key={w.name} onClick={() => onNavigate('flow')} style={{ cursor: 'pointer' }}>
                  <TD style={{ padding: '10px 18px', fontWeight: 600 }}>{w.name}</TD>
                  <TD style={{ padding: '10px 18px', color: T.fgSecondary }}>{w.nodes} nodes</TD>
                  <TD style={{ padding: '10px 18px' }}>
                    <Tag color={STATUS_META[w.status].status} size="sm">
                      <Dot color={STATUS_META[w.status].dot} size={6} /> {STATUS_META[w.status].label}
                    </Tag>
                  </TD>
                  <TD style={{ padding: '10px 18px', fontFamily: '"PT Mono", monospace', fontSize: 11.5, color: T.fgSecondary }}>
                    {w.version}
                  </TD>
                  <TD style={{ padding: '10px 18px', color: T.fgSecondary, fontSize: 11.5 }}>{w.updated}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
            <H4 styleAs="h4">Recent activity</H4>
          </div>
          <div>
            {recent.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: '11px 18px',
                  borderBottom: `1px solid ${T.borderSubtle}`,
                  display: 'flex',
                  gap: 11,
                  alignItems: 'flex-start',
                }}
              >
                <Avatar name={a.user} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                    <strong>{a.user}</strong> <span style={{ color: T.fgSecondary }}>{a.action}</span>{' '}
                    <span style={{ fontFamily: '"PT Mono", monospace', fontSize: 11.5 }}>{a.spec}</span>
                  </div>
                  <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Dot color={STATUS_META[a.status].dot} size={6} />
                    <span style={{ fontSize: 11, color: T.fgSecondary }}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── REVIEW QUEUE ─────────────────────────────────────────────────────────────
export function ReviewQueue({ onOpenReview }: { onOpenReview: (r: QueueRow) => void }) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [typeF, setTypeF] = useState('');
  const filtered = QUEUE_DATA.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF && r.status !== statusF) return false;
    if (typeF && r.type !== typeF) return false;
    return true;
  });
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.surfaceSecondary }}>
      <div style={{ padding: '22px 32px 16px', borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <H1 styleAs="h2" style={{ marginBottom: 3 }}>
              Review queue
            </H1>
            <Text color="secondary">Submissions waiting for your review</Text>
          </div>
          <Tag color="warning" style={{ padding: '4px 10px', fontSize: 12 }}>
            {QUEUE_DATA.filter((r) => ['IN_REVIEW', 'SUBMITTED'].includes(r.status)).length} pending
          </Tag>
        </div>
      </div>
      <div
        style={{
          padding: '12px 32px',
          display: 'flex',
          gap: 10,
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          flexShrink: 0,
        }}
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search submissions…"
          startIcon={<SearchIcon aria-hidden />}
          style={{ width: 260 }}
          aria-label="Search"
        />
        <Select
          value={statusF}
          options={['IN_REVIEW', 'SUBMITTED', 'CHANGES_REQUESTED', 'REJECTED', 'APPROVED']}
          onChange={setStatusF}
          placeholder="Status"
          aria-label="Status"
          style={{ width: 170 }}
        />
        <Select
          value={typeF}
          options={['Node', 'Workflow']}
          onChange={setTypeF}
          placeholder="Type"
          aria-label="Type"
          style={{ width: 130 }}
        />
        {(search || statusF || typeF) && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatusF('');
              setTypeF('');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 32px' }}>
        <Card>
          <Table>
            <THead>
              <TR>
                {['Name', 'Type', 'Version', 'Submitted by', 'Submitted at', 'Status', ''].map((c, i) => (
                  <TH key={i} style={{ ...TH_STYLE, padding: '10px 16px' }}>
                    {c}
                  </TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {filtered.map((row) => (
                <TR key={row.id} onClick={() => onOpenReview(row)} style={{ cursor: 'pointer' }}>
                  <TD style={{ padding: '11px 16px', fontWeight: 600 }}>{row.name}</TD>
                  <TD style={{ padding: '11px 16px', color: T.fgSecondary }}>{row.type}</TD>
                  <TD style={{ padding: '11px 16px', fontFamily: '"PT Mono", monospace', fontSize: 11.5 }}>
                    {row.version}
                  </TD>
                  <TD style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <Avatar name={row.submittedBy} size={22} />
                      {row.submittedBy}
                    </span>
                  </TD>
                  <TD style={{ padding: '11px 16px', color: T.fgSecondary, fontSize: 12 }}>{row.submittedAt}</TD>
                  <TD style={{ padding: '11px 16px' }}>
                    <Tag color={STATUS_META[row.status].status}>
                      <Dot color={STATUS_META[row.status].dot} size={6} />
                      {STATUS_META[row.status].label}
                    </Tag>
                  </TD>
                  <TD style={{ padding: '11px 16px', textAlign: 'right' }}>
                    <Button variant="tertiary" size="sm">
                      Open →
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          {filtered.length === 0 && (
            <div style={{ padding: '48px 16px', textAlign: 'center', color: T.fgSecondary, fontSize: 13 }}>
              No submissions match the current filters.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── NODE REGISTRY ────────────────────────────────────────────────────────────
export function NodesScreen({ onOpenDetail }: { onOpenDetail: (n: DetailNode) => void }) {
  const [cat, setCat] = useState('');
  const filtered = REGISTRY_NODES.filter((n) => !cat || n.category === cat);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.surfaceSecondary }}>
      <div style={{ padding: '22px 32px 14px', background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <H1 styleAs="h2">Node registry</H1>
            <Text color="secondary">Reusable specs you can drop into workflows</Text>
          </div>
          <Button variant="primary">
            <AddIcon aria-hidden /> New node
          </Button>
        </div>
      </div>
      <div
        style={{
          padding: '12px 32px',
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          gap: 8,
        }}
      >
        {['', 'Trigger', 'UI', 'Logic', 'Infra', 'Data', 'External'].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCat(c)}
            style={{
              padding: '5px 12px',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 500,
              background: cat === c ? T.accent : T.surfaceSecondary,
              color: cat === c ? T.accentFg : T.fgSecondary,
              border: `1px solid ${cat === c ? T.accent : T.border}`,
              cursor: 'pointer',
              transition: 'all 0.12s',
              fontFamily: 'inherit',
            }}
          >
            {c || 'All categories'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {filtered.map((n) => (
            <Card
              key={n.id}
              onClick={() => onOpenDetail({ ...n, label: n.id, tags: [n.category] })}
              style={{ padding: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    flexShrink: 0,
                    background: CAT_COLORS[n.category],
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 32 32">
                    {nodeIcon(n.type)}
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: T.fg,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {n.id}
                  </h4>
                  <div style={{ fontSize: 11, color: T.fgSecondary, fontFamily: '"PT Mono", monospace', marginTop: 2 }}>
                    {n.version}
                  </div>
                </div>
                <Menu
                  items={[
                    { label: 'View detail' },
                    { label: 'Submit for review' },
                    { label: 'Duplicate as DRAFT' },
                    { divider: true },
                    { label: 'View history' },
                  ]}
                  trigger={
                    <IconButton size={26} aria-label="More" style={{ flexShrink: 0 }}>
                      <MicroMenuIcon aria-hidden />
                    </IconButton>
                  }
                />
              </div>
              {n.newerVersion && (
                <div
                  style={{
                    marginBottom: 10,
                    padding: '5px 9px',
                    background: T.successBg,
                    border: `1px solid ${T.success}`,
                    borderRadius: 4,
                    fontSize: 11,
                    color: T.success,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <ArrowUpIcon aria-hidden size={1} />
                  {n.newerVersion} available
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${T.borderSubtle}`,
                  paddingTop: 10,
                  gap: 8,
                }}
              >
                <Tag color={STATUS_META[n.status].status} size="sm">
                  <Dot color={STATUS_META[n.status].dot} size={5} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {STATUS_META[n.status].label}
                  </span>
                </Tag>
                <span style={{ fontSize: 11.5, color: T.fgSecondary, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {n.workflows} workflow{n.workflows === 1 ? '' : 's'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export function AdminScreen() {
  const [addOpen, setAddOpen] = useState(false);
  const [scopeType, setScopeType] = useState('global');
  const assignments = [
    { user: 'alice', role: 'maker', scope: 'Global', by: 'admin', at: 'May 01, 2026' },
    { user: 'bob', role: 'maker', scope: 'Category: Logic', by: 'admin', at: 'May 02, 2026' },
    { user: 'checker-dan', role: 'checker', scope: 'Global', by: 'admin', at: 'Apr 28, 2026' },
    { user: 'carol', role: 'checker', scope: 'Category: Infra', by: 'admin', at: 'May 05, 2026' },
    { user: 'eve', role: 'viewer', scope: 'Workflow: submit-order', by: 'admin', at: 'May 10, 2026' },
  ];
  const roleColor: Record<string, 'info' | 'accent' | 'neutral' | 'purple'> = {
    maker: 'info',
    checker: 'accent',
    viewer: 'neutral',
    admin: 'purple',
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.surfaceSecondary }}>
      <div
        style={{
          padding: '22px 32px 14px',
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <H1 styleAs="h2">Roles &amp; permissions</H1>
          <Text color="secondary">Who can submit, review, and approve specs</Text>
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <AddIcon aria-hidden /> Add assignment
        </Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 32px' }}>
        <Card>
          <Table>
            <THead>
              <TR>
                {['User', 'Role', 'Scope', 'Assigned by', 'Assigned at', 'Actions'].map((c) => (
                  <TH key={c} style={{ ...TH_STYLE, padding: '10px 16px' }}>
                    {c}
                  </TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {assignments.map((a, i) => (
                <TR key={i}>
                  <TD style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={a.user} />
                      <strong>{a.user}</strong>
                    </span>
                  </TD>
                  <TD style={{ padding: '11px 16px' }}>
                    <Tag color={roleColor[a.role]}>{a.role}</Tag>
                  </TD>
                  <TD style={{ padding: '11px 16px' }}>
                    <Tag color="neutral" style={{ fontFamily: '"PT Mono", monospace', fontSize: 11 }}>
                      {a.scope}
                    </Tag>
                  </TD>
                  <TD style={{ padding: '11px 16px', color: T.fgSecondary }}>{a.by}</TD>
                  <TD style={{ padding: '11px 16px', color: T.fgSecondary, fontSize: 11.5 }}>{a.at}</TD>
                  <TD style={{ padding: '11px 16px' }}>
                    <Menu
                      items={[
                        { label: 'Edit' },
                        { label: 'Remove', danger: true },
                      ]}
                      trigger={
                        <IconButton size={26} aria-label="Actions">
                          <MicroMenuIcon aria-hidden />
                        </IconButton>
                      }
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      <Dialog
        open={addOpen}
        title="Add role assignment"
        onClose={() => setAddOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setAddOpen(false)}>
              Save assignment
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="User" required>
            <Select options={['alice', 'bob', 'carol', 'dan', 'eve']} placeholder="Select user…" aria-label="User" />
          </FormField>
          <FormField label="Role" required>
            <Select options={['maker', 'checker', 'viewer', 'admin']} placeholder="Select role…" aria-label="Role" />
          </FormField>
          <FormField label="Scope type">
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { v: 'global', l: 'Global' },
                { v: 'category', l: 'Category' },
                { v: 'workflow', l: 'Workflow' },
              ].map((s) => (
                <label
                  key={s.v}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: `1px solid ${scopeType === s.v ? T.accent : T.border}`,
                    background: scopeType === s.v ? 'rgba(42,156,251,0.13)' : T.surfaceSecondary,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: scopeType === s.v ? 600 : 500,
                    color: scopeType === s.v ? T.accent : T.fgSecondary,
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="radio"
                    name="st"
                    value={s.v}
                    checked={scopeType === s.v}
                    onChange={() => setScopeType(s.v)}
                    style={{ display: 'none' }}
                  />
                  {s.l}
                </label>
              ))}
            </div>
          </FormField>
          {scopeType === 'category' && (
            <FormField label="Category">
              <Select options={['UI', 'Logic', 'Infra', 'Data', 'External']} placeholder="Select category…" aria-label="Category" />
            </FormField>
          )}
          {scopeType === 'workflow' && (
            <FormField label="Workflow">
              <Select
                options={['submit-order', 'checkout-flow', 'user-onboarding']}
                placeholder="Select workflow…"
                aria-label="Workflow"
              />
            </FormField>
          )}
          <Banner tone="info">
            Global admin assignments override all scopes and can force-approve any spec. Grant sparingly.
          </Banner>
        </div>
      </Dialog>
    </div>
  );
}

export type { ReactNode };
