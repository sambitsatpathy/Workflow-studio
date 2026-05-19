import { useState, type ReactNode } from 'react';
import { Switch } from '@salt-ds/core';
import {
  HomeIcon,
  WorkflowIcon,
  DiamondIcon,
  ClockIcon,
  SettingsIcon,
  HelpIcon,
  NotificationIcon,
  ShareIcon,
  ExportIcon,
  SuccessTickIcon,
  EditIcon,
  MicroMenuIcon,
  SearchIcon,
} from '@salt-ds/icons';
import { Badge, Button, Dot, IconButton, Input, Menu, Tag, Tooltip, ToggleGroup } from './primitives';
import { STATUS_META } from '../theme';
import { T } from '../tokens';
import type { ScreenId } from '../types';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: ReactNode;
  badge?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon aria-hidden /> },
  { id: 'flow', label: 'Workflows', icon: <WorkflowIcon aria-hidden /> },
  { id: 'nodes', label: 'Nodes', icon: <DiamondIcon aria-hidden /> },
  { id: 'queue', label: 'Review queue', icon: <ClockIcon aria-hidden />, badge: true },
  { id: 'admin', label: 'Admin', icon: <SettingsIcon aria-hidden /> },
];

// ─── Left rail ────────────────────────────────────────────────────────────────
export function LeftRail({ screen, onScreen }: { screen: ScreenId; onScreen: (s: ScreenId) => void }) {
  return (
    <div
      style={{
        width: 60,
        background: T.overlay,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        flexShrink: 0,
        borderRight: `1px solid ${T.borderSubtle}`,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 7,
            background: T.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.accentFg,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: '"PT Mono", monospace',
          }}
        >
          W
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = screen === item.id;
          return (
            <Tooltip key={item.id} content={item.label} placement="right">
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <IconButton
                  size={42}
                  active={active}
                  onClick={() => onScreen(item.id)}
                  aria-label={item.label}
                  style={{ borderRadius: 7 }}
                >
                  {item.icon}
                </IconButton>
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      background: T.accent,
                      borderRadius: '50%',
                      border: `2px solid ${T.overlay}`,
                    }}
                  />
                )}
              </span>
            </Tooltip>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          alignItems: 'center',
          paddingTop: 8,
          borderTop: `1px solid ${T.border}`,
          width: 36,
        }}
      >
        <Tooltip content="Help & feedback" placement="right">
          <IconButton size={34} aria-label="Help" style={{ borderRadius: 7 }}>
            <HelpIcon aria-hidden />
          </IconButton>
        </Tooltip>
        <Tooltip content="Alice · maker" placement="right">
          <button
            aria-label="User"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: T.accent,
              color: T.accentFg,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            A
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

// ─── Workflow Top Bar ─────────────────────────────────────────────────────────
export function WorkflowTopBar({
  onBell,
  unread,
  onExport,
  onSubmit,
}: {
  onBell: () => void;
  unread: number;
  onExport: () => void;
  onSubmit: () => void;
}) {
  const [tab, setTab] = useState<'editor' | 'executions' | 'evaluation'>('editor');
  const [active, setActive] = useState(true);
  return (
    <div
      style={{
        height: 56,
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        flexShrink: 0,
        gap: 14,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ fontSize: 12, color: T.fgSecondary }}>Workflows /</span>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: T.fg }}>submit-order</h2>
        <Tag color={STATUS_META.APPROVED.status} size="sm">
          <Dot color={STATUS_META.APPROVED.dot} size={6} /> APPROVED
        </Tag>
        <span style={{ fontSize: 11, color: T.fgSecondary, fontFamily: '"PT Mono", monospace' }}>v3.0.0</span>
        <Tooltip content="Edit workflow details">
          <IconButton size={26} aria-label="Edit">
            <EditIcon aria-hidden />
          </IconButton>
        </Tooltip>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <ToggleGroup
          options={[
            { value: 'editor', label: 'Editor' },
            { value: 'executions', label: 'Executions' },
            { value: 'evaluation', label: 'Evaluation' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px',
            background: T.surfaceSecondary,
            borderRadius: 5,
          }}
        >
          <span style={{ fontSize: 11.5, color: T.fgSecondary, fontWeight: 500 }}>
            {active ? 'Active' : 'Inactive'}
          </span>
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            aria-label="Toggle workflow active"
          />
        </div>
        <span style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />
        <Tooltip content="Notifications">
          <Badge value={unread}>
            <IconButton onClick={onBell} aria-label="Notifications">
              <NotificationIcon aria-hidden />
            </IconButton>
          </Badge>
        </Tooltip>
        <Tooltip content="Share workflow">
          <IconButton aria-label="Share">
            <ShareIcon aria-hidden />
          </IconButton>
        </Tooltip>
        <Button variant="secondary" onClick={onExport}>
          <ExportIcon aria-hidden />
          Export
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          <SuccessTickIcon aria-hidden />
          Save
        </Button>
        <Menu
          items={[
            { label: 'Test workflow' },
            { label: 'Duplicate' },
            { label: 'Download as JSON' },
            { divider: true },
            { label: 'Settings' },
            { divider: true },
            { label: 'Delete workflow', danger: true },
          ]}
          trigger={
            <IconButton aria-label="More actions">
              <MicroMenuIcon aria-hidden />
            </IconButton>
          }
        />
      </div>
    </div>
  );
}

// ─── Generic top bar ──────────────────────────────────────────────────────────
export function GenericTopBar({
  title,
  onBell,
  unread,
}: {
  title: string;
  onBell: () => void;
  unread: number;
}) {
  return (
    <div
      style={{
        height: 56,
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        flexShrink: 0,
        justifyContent: 'space-between',
      }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 600, color: T.fgSecondary }}>{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Input
          placeholder="Search anything…"
          aria-label="Global search"
          startIcon={<SearchIcon aria-hidden />}
          style={{ width: 260, marginRight: 6 }}
        />
        <Tooltip content="Notifications">
          <Badge value={unread}>
            <IconButton onClick={onBell} aria-label="Notifications">
              <NotificationIcon aria-hidden />
            </IconButton>
          </Badge>
        </Tooltip>
      </div>
    </div>
  );
}
