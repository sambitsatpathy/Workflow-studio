import type { NodeStatus, NotificationTone } from './types';
import { T } from './tokens';

/** Salt validation/status sentiment used across chips, banners and indicators. */
export type SaltStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent';

/** Node category accent colors. Logic/Infra/Trigger ride the Salt accent;
 *  Data uses the Salt positive status; UI/External keep distinct hues since
 *  Salt has no semantic token for them. */
export const CAT_COLORS: Record<string, string> = {
  UI: '#a07bff',
  Logic: T.accent,
  Infra: T.accent,
  Data: T.success,
  External: '#e0529c',
  Trigger: T.accent,
};

export interface StatusMeta {
  label: string;
  status: SaltStatus;
  dot: string;
}

export const STATUS_META: Record<NodeStatus, StatusMeta> = {
  APPROVED: { label: 'Approved', status: 'success', dot: T.success },
  DRAFT: { label: 'Draft', status: 'neutral', dot: T.fgSecondary },
  SUBMITTED: { label: 'Submitted', status: 'info', dot: T.info },
  IN_REVIEW: { label: 'In Review', status: 'warning', dot: T.warning },
  CHANGES_REQUESTED: { label: 'Changes requested', status: 'warning', dot: T.warning },
  REJECTED: { label: 'Rejected', status: 'error', dot: T.error },
};

export const TONE_STATUS: Record<NotificationTone, SaltStatus> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  danger: 'error',
};

/** Resolve a SaltStatus to its themed foreground / background / border colors. */
export function statusColors(s: SaltStatus): { fg: string; bg: string; border: string } {
  switch (s) {
    case 'success':
      return { fg: T.success, bg: T.successBg, border: T.success };
    case 'warning':
      return { fg: T.warning, bg: T.warningBg, border: T.warning };
    case 'error':
      return { fg: T.error, bg: T.errorBg, border: T.error };
    case 'info':
      return { fg: T.info, bg: T.infoBg, border: T.info };
    case 'accent':
      return { fg: T.accent, bg: 'var(--salt-accent-background-disabled)', border: T.accent };
    default:
      return { fg: T.fgSecondary, bg: T.surfaceSecondary, border: T.border };
  }
}
