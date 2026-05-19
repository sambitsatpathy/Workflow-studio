/**
 * Semantic bridge to Salt design tokens. The flow canvas and a handful of
 * bespoke surfaces aren't Salt components, so they consume Salt's CSS custom
 * properties through these names to stay on-theme in any Salt mode.
 */
export const T = {
  surface: 'var(--salt-container-primary-background)',
  surfaceSecondary: 'var(--salt-container-secondary-background)',
  surfaceTertiary: 'var(--salt-container-tertiary-background)',
  overlay: 'var(--salt-overlayable-background)',
  fg: 'var(--salt-content-primary-foreground)',
  fgSecondary: 'var(--salt-content-secondary-foreground)',
  border: 'var(--salt-separable-secondary-borderColor)',
  borderStrong: 'var(--salt-separable-primary-borderColor)',
  borderSubtle: 'var(--salt-separable-tertiary-borderColor)',
  accent: 'var(--salt-accent-background)',
  accentFg: 'var(--salt-accent-foreground)',
  selectable: 'var(--salt-selectable-background)',
  success: 'var(--salt-status-success-foreground)',
  successBg: 'var(--salt-status-success-background)',
  warning: 'var(--salt-status-warning-foreground)',
  warningBg: 'var(--salt-status-warning-background)',
  error: 'var(--salt-status-error-foreground)',
  errorBg: 'var(--salt-status-error-background)',
  info: 'var(--salt-status-info-foreground)',
  infoBg: 'var(--salt-status-info-background)',
} as const;
