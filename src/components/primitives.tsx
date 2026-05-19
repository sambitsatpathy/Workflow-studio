import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import {
  Badge as SaltBadge,
  Banner as SaltBanner,
  BannerContent,
  Button as SaltButton,
  Card as SaltCard,
  Dialog as SaltDialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  Divider,
  Drawer as SaltDrawer,
  DrawerCloseButton,
  Dropdown,
  FormField as SaltFormField,
  FormFieldHelperText,
  FormFieldLabel,
  InteractableCard,
  Input as SaltInput,
  Menu as SaltMenu,
  MenuItem,
  MenuPanel,
  MenuTrigger,
  MultilineInput,
  Option,
  Text,
  Tooltip as SaltTooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@salt-ds/core';
import { statusColors, type SaltStatus } from '../theme';
import { T } from '../tokens';

type Size = 'sm' | 'md' | 'lg';
export type StatusKind = SaltStatus;

const SALT_STATUS = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

// ─── Button ──────────────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';

const BUTTON_MAP: Record<
  ButtonVariant,
  { appearance: 'solid' | 'bordered' | 'transparent'; sentiment: 'accented' | 'neutral' | 'negative' }
> = {
  primary: { appearance: 'solid', sentiment: 'accented' },
  secondary: { appearance: 'bordered', sentiment: 'neutral' },
  tertiary: { appearance: 'transparent', sentiment: 'neutral' },
  danger: { appearance: 'bordered', sentiment: 'negative' },
  ghost: { appearance: 'transparent', sentiment: 'neutral' },
};

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: Size;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  title?: string;
  'aria-label'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = 'tertiary', size = 'md', onClick, disabled, style, title, 'aria-label': ariaLabel },
  ref
) {
  const map = BUTTON_MAP[variant];
  const sizeStyle: CSSProperties =
    size === 'sm'
      ? { minHeight: 'auto', padding: '2px 8px', fontSize: 12 }
      : size === 'lg'
        ? { padding: '6px 18px' }
        : {};
  return (
    <SaltButton
      ref={ref}
      appearance={map.appearance}
      sentiment={map.sentiment}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      style={{ gap: 6, ...sizeStyle, ...style }}
    >
      {children}
    </SaltButton>
  );
});

// ─── IconButton ──────────────────────────────────────────────────────────────
interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  'aria-label'?: string;
  size?: number;
  style?: CSSProperties;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, onClick, active, title, 'aria-label': ariaLabel, size = 32, style },
  ref
) {
  return (
    <SaltButton
      ref={ref}
      appearance={active ? 'bordered' : 'transparent'}
      sentiment={active ? 'accented' : 'neutral'}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={active || undefined}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        padding: 0,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </SaltButton>
  );
});

// ─── Status Tag / chip ────────────────────────────────────────────────────────
interface TagProps {
  children: ReactNode;
  color?: StatusKind | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function Tag({ children, color = 'neutral', size = 'md', style }: TagProps) {
  const c =
    color === 'purple'
      ? { fg: '#c39bff', bg: 'rgba(160,123,255,0.14)', border: 'rgba(160,123,255,0.4)' }
      : statusColors(color as SaltStatus);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '1px 6px' : '2px 8px',
        borderRadius: 'var(--salt-palette-corner-weak, 2px)',
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 600,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────
export function Dot({ color = T.fgSecondary, size = 8 }: { color?: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  startIcon?: ReactNode;
  readOnly?: boolean;
  style?: CSSProperties;
  'aria-label'?: string;
  type?: string;
  error?: boolean;
}

export function Input({
  value,
  onChange,
  placeholder,
  startIcon,
  readOnly,
  style,
  'aria-label': ariaLabel,
  type = 'text',
  error,
}: InputProps) {
  return (
    <SaltInput
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      bordered
      validationStatus={error ? 'error' : undefined}
      startAdornment={startIcon}
      inputProps={{ onChange, type, 'aria-label': ariaLabel }}
      style={style}
    />
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  options?: (string | SelectOption)[];
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function Select({
  value,
  options = [],
  onChange,
  placeholder = 'Select…',
  style,
  'aria-label': ariaLabel,
}: SelectProps) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const display = norm.find((o) => o.value === value)?.label;
  return (
    <Dropdown
      bordered
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={display ?? ''}
      selected={value ? [value] : []}
      onSelectionChange={(_e, sel) => onChange?.(sel[0] ?? '')}
      style={style}
    >
      {norm.map((o) => (
        <Option key={o.value} value={o.value}>
          {o.label}
        </Option>
      ))}
    </Dropdown>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  readOnly,
  style,
  'aria-label': ariaLabel,
}: TextareaProps) {
  return (
    <MultilineInput
      value={value}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      bordered
      textAreaProps={{ onChange, 'aria-label': ariaLabel }}
      style={{ width: '100%', ...style }}
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  accent?: string;
}

export function Card({ children, style, onClick, accent }: CardProps) {
  const accentStyle: CSSProperties = accent
    ? { borderLeft: `3px solid ${accent}` }
    : {};
  if (onClick) {
    return (
      <InteractableCard
        accent="left"
        onClick={onClick}
        style={{ padding: 0, ...accentStyle, ...style }}
      >
        {children}
      </InteractableCard>
    );
  }
  return (
    <SaltCard style={{ padding: 0, ...accentStyle, ...style }}>{children}</SaltCard>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const RefSpan = forwardRef<HTMLSpanElement, { children: ReactNode } & React.HTMLAttributes<HTMLSpanElement>>(
  function RefSpan({ children, ...rest }, ref) {
    return (
      <span ref={ref} style={{ display: 'inline-flex' }} {...rest}>
        {children}
      </span>
    );
  }
);

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'right' | 'left';
}

export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  return (
    <SaltTooltip content={content} placement={placement} hideIcon enterDelay={150}>
      <RefSpan>{children}</RefSpan>
    </SaltTooltip>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
export interface MenuItemDef {
  label?: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface MenuProps {
  items: MenuItemDef[];
  trigger: ReactNode;
}

export function Menu({ items, trigger }: MenuProps) {
  return (
    <SaltMenu>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuPanel>
        {items.map((item, i) =>
          item.divider ? (
            <Divider key={i} variant="secondary" style={{ margin: '4px 0' }} />
          ) : (
            <MenuItem key={i} onClick={item.onClick}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  color: item.danger ? T.error : undefined,
                }}
              >
                {item.icon && <span style={{ opacity: 0.75 }}>{item.icon}</span>}
                {item.label}
                {item.shortcut && (
                  <span style={{ marginLeft: 'auto', color: T.fgSecondary, fontSize: 11 }}>
                    {item.shortcut}
                  </span>
                )}
              </span>
            </MenuItem>
          )
        )}
      </MenuPanel>
    </SaltMenu>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────
interface DialogProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  width?: number;
}

export function Dialog({ open, title, onClose, children, actions, width = 520 }: DialogProps) {
  const size: 'small' | 'medium' | 'large' = width <= 460 ? 'small' : width <= 640 ? 'medium' : 'large';
  return (
    <SaltDialog open={open} onOpenChange={(o) => !o && onClose()} size={size}>
      <DialogHeader header={title} />
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
      <DialogCloseButton onClick={onClose} />
    </SaltDialog>
  );
}

// ─── Drawer (right slide-in panel) ────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  hideCloseButton?: boolean;
}

export function Drawer({ open, onClose, children, width = 520, hideCloseButton }: DrawerProps) {
  return (
    <SaltDrawer
      open={open}
      onOpenChange={(o) => !o && onClose()}
      position="right"
      style={{
        width,
        maxWidth: '100vw',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {!hideCloseButton && (
        <DrawerCloseButton
          onClick={onClose}
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
        />
      )}
      {children}
    </SaltDrawer>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────
type BannerTone = 'info' | 'warning' | 'danger' | 'success';

interface BannerProps {
  tone?: BannerTone;
  children: ReactNode;
  style?: CSSProperties;
}

export function Banner({ tone = 'info', children, style }: BannerProps) {
  const status = tone === 'danger' ? 'error' : SALT_STATUS[tone];
  return (
    <SaltBanner status={status} variant="primary" style={style}>
      <BannerContent>{children}</BannerContent>
    </SaltBanner>
  );
}

// ─── ToggleGroup ──────────────────────────────────────────────────────────────
interface ToggleGroupProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={(e) => onChange(e.currentTarget.value as T)}
    >
      {options.map((o) => (
        <ToggleButton key={o.value} value={o.value}>
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

// ─── Badge (count overlay on an icon) ─────────────────────────────────────────
export function Badge({ value, children }: { value: number; children: ReactNode }) {
  return <SaltBadge value={value}>{children}</SaltBadge>;
}

// ─── FormField ────────────────────────────────────────────────────────────────
interface FormFieldProps {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  required?: boolean;
  style?: CSSProperties;
}

export function FormField({ label, helper, error, children, required, style }: FormFieldProps) {
  return (
    <SaltFormField
      labelPlacement="top"
      validationStatus={error ? 'error' : undefined}
      necessity={required ? 'asterisk' : undefined}
      style={style}
    >
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      {children}
      {error ? (
        <FormFieldHelperText>{error}</FormFieldHelperText>
      ) : helper ? (
        <FormFieldHelperText>{helper}</FormFieldHelperText>
      ) : null}
    </SaltFormField>
  );
}

// Re-export a couple of Salt primitives used directly by screens.
export { Text };
export type { ReactNode };
