export type NodeStatus =
  | 'APPROVED'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'REJECTED';

export type Category = 'UI' | 'Logic' | 'Infra' | 'Data' | 'External' | 'Trigger';

export type ScreenId = 'home' | 'flow' | 'nodes' | 'queue' | 'admin';

export type ViewMode = 'standard' | 'swimlanes';

export interface FlowNodeData {
  id: string;
  label: string;
  type: string;
  category: Category;
  version: string;
  status: NodeStatus;
  tags: string[];
  x: number;
  y: number;
  isTrigger?: boolean;
  pinned?: boolean;
  newerVersion?: string;
  comments: number;
}

export interface EdgeData {
  id: string;
  src: string;
  tgt: string;
}

export interface StickyData {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
}

export interface QueueRow {
  id: string;
  name: string;
  type: 'Node' | 'Workflow';
  version: string;
  submittedBy: string;
  submittedAt: string;
  status: NodeStatus;
  category: string;
}

export type NotificationTone = 'info' | 'warning' | 'success' | 'danger';

export interface NotificationItem {
  id: string;
  unread: boolean;
  type: string;
  title: string;
  time: string;
  tone: NotificationTone;
}

/** Shape consumed by the Node Detail drawer — a superset of canvas / registry nodes. */
export interface DetailNode {
  id: string;
  label: string;
  type: string;
  category: Category | string;
  version: string;
  status: NodeStatus;
  tags: string[];
  comments?: number;
}
