import type { ReactNode } from 'react';

/** SVG glyph paths for each node type — simple bold n8n-style icons. */
export const NODE_ICONS: Record<string, ReactNode> = {
  'order-form': <path d="M8 6h16v2H8zm0 6h16v2H8zm0 6h10v2H8zM22 18h4l-4 4v-4z" fill="currentColor" />,
  'validate-order': (
    <path
      d="M14 16l3 3 7-7-2-2-5 5-1-1-2 2zM6 6h20v20H6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  'payment-gateway': (
    <>
      <rect x="5" y="9" width="22" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 13h22" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="17" width="4" height="2" fill="currentColor" />
    </>
  ),
  'send-confirmation': (
    <path
      d="M4 8l12 8 12-8v14H4zm0 0l12 8 12-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  'audit-log': (
    <>
      <path d="M8 6h12l4 4v16H8z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 6v4h4M11 14h10M11 18h10M11 22h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  'route-request': (
    <>
      <path d="M6 8h8v6h12M14 14v10h12" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="8" r="2" fill="currentColor" />
      <circle cx="26" cy="14" r="2" fill="currentColor" />
      <circle cx="26" cy="24" r="2" fill="currentColor" />
    </>
  ),
  'webhook-trigger': (
    <>
      <circle cx="16" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 26l5-9M24 26l-5-9M11 26h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  default: <rect x="9" y="9" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />,
};

export function nodeIcon(type: string): ReactNode {
  return NODE_ICONS[type] ?? NODE_ICONS.default;
}
