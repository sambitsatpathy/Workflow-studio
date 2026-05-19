import type {
  EdgeData,
  FlowNodeData,
  NotificationItem,
  QueueRow,
  StickyData,
} from './types';

export const INITIAL_NODES: FlowNodeData[] = [
  { id: 'n0', label: 'Webhook', type: 'webhook-trigger', category: 'Trigger', version: 'v1.0.0', status: 'APPROVED', tags: ['trigger'], x: 80, y: 240, isTrigger: true, comments: 0 },
  { id: 'n1', label: 'order-form', type: 'order-form', category: 'UI', version: 'v1.1.0', status: 'APPROVED', tags: ['form', 'checkout'], x: 240, y: 160, pinned: true, comments: 0 },
  { id: 'n2', label: 'validate-order', type: 'validate-order', category: 'Logic', version: 'v2.0.1', status: 'IN_REVIEW', tags: ['validation'], x: 240, y: 340, comments: 2 },
  { id: 'n3', label: 'payment-gateway', type: 'payment-gateway', category: 'Infra', version: 'v1.3.0', status: 'APPROVED', tags: ['payment'], x: 440, y: 160, newerVersion: 'v1.4.0', comments: 0 },
  { id: 'n4', label: 'route-request', type: 'route-request', category: 'Logic', version: 'v1.0.0', status: 'CHANGES_REQUESTED', tags: ['routing'], x: 440, y: 340, comments: 1 },
  { id: 'n5', label: 'send-confirmation', type: 'send-confirmation', category: 'Data', version: 'v1.0.2', status: 'DRAFT', tags: ['email'], x: 640, y: 200, comments: 1 },
  { id: 'n6', label: 'audit-log', type: 'audit-log', category: 'Data', version: 'v1.1.1', status: 'REJECTED', tags: ['audit'], x: 640, y: 380, comments: 3 },
];

export const INITIAL_EDGES: EdgeData[] = [
  { id: 'e0', src: 'n0', tgt: 'n1' },
  { id: 'e1', src: 'n0', tgt: 'n2' },
  { id: 'e2', src: 'n1', tgt: 'n3' },
  { id: 'e3', src: 'n2', tgt: 'n4' },
  { id: 'e4', src: 'n3', tgt: 'n5' },
  { id: 'e5', src: 'n4', tgt: 'n6' },
];

export const STICKIES: StickyData[] = [
  { id: 's1', x: 60, y: 60, w: 200, h: 90, text: 'Entry trigger — fires on POST /orders' },
  { id: 's2', x: 620, y: 80, w: 220, h: 80, text: 'After payment success, branch to email + audit' },
];

export const QUEUE_DATA: QueueRow[] = [
  { id: 'q1', name: 'order-form', type: 'Node', version: 'v1.2.0', submittedBy: 'alice', submittedAt: '2026-05-18 09:14', status: 'IN_REVIEW', category: 'UI' },
  { id: 'q2', name: 'validate-order', type: 'Node', version: 'v2.1.0', submittedBy: 'bob', submittedAt: '2026-05-18 10:32', status: 'SUBMITTED', category: 'Logic' },
  { id: 'q3', name: 'submit-order', type: 'Workflow', version: 'v3.0.0', submittedBy: 'alice', submittedAt: '2026-05-17 16:05', status: 'CHANGES_REQUESTED', category: '—' },
  { id: 'q4', name: 'payment-gateway', type: 'Node', version: 'v1.4.0', submittedBy: 'carol', submittedAt: '2026-05-17 11:20', status: 'SUBMITTED', category: 'Infra' },
  { id: 'q5', name: 'audit-log', type: 'Node', version: 'v1.2.0', submittedBy: 'bob', submittedAt: '2026-05-16 14:55', status: 'REJECTED', category: 'Data' },
  { id: 'q6', name: 'send-confirmation', type: 'Node', version: 'v1.1.0', submittedBy: 'carol', submittedAt: '2026-05-15 08:30', status: 'IN_REVIEW', category: 'Data' },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', unread: true, type: 'Submission', title: 'alice submitted order-form v1.2.0 for review', time: '2m ago', tone: 'info' },
  { id: 'n2', unread: true, type: 'Comment', title: 'bob commented on validate-order v2.1.0', time: '15m ago', tone: 'warning' },
  { id: 'n3', unread: true, type: 'Upgrade', title: 'payment-gateway v1.4.0 is now APPROVED', time: '1h ago', tone: 'success' },
  { id: 'n4', unread: false, type: 'Rejection', title: 'audit-log v1.1.1 was rejected by checker-dan', time: '3h ago', tone: 'danger' },
  { id: 'n5', unread: false, type: 'Approval', title: 'route-request v1.0.0 was approved', time: '1d ago', tone: 'success' },
  { id: 'n6', unread: false, type: 'Comment', title: 'carol replied to your comment on submit-order', time: '2d ago', tone: 'warning' },
];

export interface RegistryNode {
  id: string;
  category: 'UI' | 'Logic' | 'Infra' | 'Data' | 'External' | 'Trigger';
  version: string;
  status: import('./types').NodeStatus;
  workflows: number;
  type: string;
  newerVersion?: string;
}

export const REGISTRY_NODES: RegistryNode[] = [
  { id: 'order-form', category: 'UI', version: 'v1.1.0', status: 'APPROVED', workflows: 3, type: 'order-form' },
  { id: 'validate-order', category: 'Logic', version: 'v2.0.1', status: 'IN_REVIEW', workflows: 2, type: 'validate-order' },
  { id: 'payment-gateway', category: 'Infra', version: 'v1.3.0', status: 'APPROVED', workflows: 4, type: 'payment-gateway', newerVersion: 'v1.4.0' },
  { id: 'send-confirmation', category: 'Data', version: 'v1.0.2', status: 'DRAFT', workflows: 1, type: 'send-confirmation' },
  { id: 'audit-log', category: 'Data', version: 'v1.1.1', status: 'REJECTED', workflows: 2, type: 'audit-log' },
  { id: 'route-request', category: 'Logic', version: 'v1.0.0', status: 'CHANGES_REQUESTED', workflows: 1, type: 'route-request' },
  { id: 'webhook-trigger', category: 'Trigger', version: 'v1.0.0', status: 'APPROVED', workflows: 8, type: 'webhook-trigger' },
];

export interface PickerNode {
  id: string;
  name: string;
  desc: string;
}

export const PICKER_NODES: Record<string, PickerNode[]> = {
  Trigger: [
    { id: 'webhook', name: 'Webhook', desc: 'Wait for HTTP requests' },
    { id: 'schedule', name: 'Schedule', desc: 'Run on cron/interval' },
    { id: 'manual', name: 'Manual', desc: 'Run manually' },
  ],
  UI: [
    { id: 'order-form', name: 'order-form', desc: 'Checkout form component' },
    { id: 'header-nav', name: 'header-nav', desc: 'Top navigation bar' },
    { id: 'modal-dialog', name: 'modal-dialog', desc: 'Modal/dialog component' },
    { id: 'data-table', name: 'data-table', desc: 'Sortable data grid' },
  ],
  Logic: [
    { id: 'validate-order', name: 'validate-order', desc: 'Order validation rules' },
    { id: 'route-request', name: 'route-request', desc: 'Request routing' },
    { id: 'transform-data', name: 'transform-data', desc: 'Data transformation' },
    { id: 'rate-limiter', name: 'rate-limiter', desc: 'Rate limit by key' },
  ],
  Infra: [
    { id: 'payment-gateway', name: 'payment-gateway', desc: 'Payment processing' },
    { id: 'message-queue', name: 'message-queue', desc: 'Pub/sub messaging' },
    { id: 'cache-layer', name: 'cache-layer', desc: 'In-memory cache' },
  ],
  Data: [
    { id: 'audit-log', name: 'audit-log', desc: 'Compliance logging' },
    { id: 'event-store', name: 'event-store', desc: 'Event sourcing' },
    { id: 'send-confirmation', name: 'send-confirmation', desc: 'Email notifications' },
  ],
  External: [
    { id: 'stripe-api', name: 'Stripe', desc: 'Payments API integration' },
    { id: 'sendgrid', name: 'SendGrid', desc: 'Transactional email' },
    { id: 'auth0', name: 'Auth0', desc: 'Identity provider' },
  ],
};

export const DIFF_LINES: { t: 'unchanged' | 'removed' | 'added'; text: string }[] = [
  { t: 'unchanged', text: 'id: validate-order' },
  { t: 'unchanged', text: 'category: Logic' },
  { t: 'removed', text: 'version: 2.0.1' },
  { t: 'added', text: 'version: 2.1.0' },
  { t: 'unchanged', text: 'label: Validate Order' },
  { t: 'removed', text: 'description: Basic validation' },
  { t: 'added', text: 'description: Full validation with null-guard on order_id' },
  { t: 'unchanged', text: 'tags:' },
  { t: 'unchanged', text: '  - validation' },
  { t: 'added', text: 'properties:' },
  { t: 'added', text: '  strictMode: true' },
  { t: 'added', text: '  maxRetries: 3' },
];
