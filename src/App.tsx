import { useState } from 'react';
import { SaltProvider } from '@salt-ds/core';
import { FlowCanvas } from './components/canvas';
import { HomeScreen, ReviewQueue, NodesScreen, AdminScreen } from './components/screens';
import {
  NodePicker,
  NodeDetailDrawer,
  ReviewPanel,
  NotificationCenter,
  ExportModal,
} from './components/overlays';
import { LeftRail, WorkflowTopBar, GenericTopBar, NAV_ITEMS } from './components/shell';
import { INITIAL_NODES } from './data';
import { T } from './tokens';
import type { DetailNode, FlowNodeData, QueueRow, ScreenId, ViewMode } from './types';

function AppShell() {
  const [screen, setScreen] = useState<ScreenId>('flow');
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [detailNode, setDetailNode] = useState<DetailNode | null>(null);
  const [detailTab, setDetailTab] = useState('parameters');
  const [reviewItem, setReviewItem] = useState<QueueRow | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [canvasView] = useState<ViewMode>('standard');
  const unread = 3;

  const handleSelect = (id: string | null) => {
    setSelectedNode(id);
    if (id) {
      const n = INITIAL_NODES.find((x) => x.id === id);
      if (n) {
        setDetailNode(n);
        setDetailTab('parameters');
      }
    }
  };
  const handleOpenDetail = (node: DetailNode | FlowNodeData) => {
    setDetailNode(node);
    setDetailTab('parameters');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: T.surfaceSecondary }}>
      <LeftRail screen={screen} onScreen={setScreen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'flow' ? (
          <WorkflowTopBar
            onBell={() => setNotifOpen(true)}
            unread={unread}
            onExport={() => setExportOpen(true)}
            onSubmit={() => {}}
          />
        ) : (
          screen !== 'home' && (
            <GenericTopBar
              title={NAV_ITEMS.find((n) => n.id === screen)?.label || ''}
              onBell={() => setNotifOpen(true)}
              unread={unread}
            />
          )
        )}

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
          {screen === 'flow' && (
            <FlowCanvas
              selectedNode={selectedNode}
              onNodeSelect={handleSelect}
              onOpenDetail={handleOpenDetail}
              onOpenNodePicker={() => setPickerOpen(true)}
              defaultViewMode={canvasView}
            />
          )}
          {screen === 'nodes' && <NodesScreen onOpenDetail={handleOpenDetail} />}
          {screen === 'queue' && <ReviewQueue onOpenReview={setReviewItem} />}
          {screen === 'admin' && <AdminScreen />}
        </div>
      </div>

      {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
      <ReviewPanel item={reviewItem} onClose={() => setReviewItem(null)} />
      <NodeDetailDrawer node={detailNode} initialTab={detailTab} onClose={() => setDetailNode(null)} />
      <NodePicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <SaltProvider mode="dark" density="high">
      <AppShell />
    </SaltProvider>
  );
}
