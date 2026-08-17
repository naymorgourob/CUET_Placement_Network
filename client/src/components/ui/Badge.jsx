import { CheckCircle2, Clock, XCircle, Info, Circle } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANT_CLASSES = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning-bg/15 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
  default: 'bg-surface-muted text-text-muted',
};

const DEFAULT_ICONS = {
  success: CheckCircle2,
  warning: Clock,
  danger: XCircle,
  info: Info,
  default: Circle,
};

export function Badge({ children, variant = 'default', icon, className }) {
  const Icon = icon === null ? null : icon ?? DEFAULT_ICONS[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />}
      {children}
    </span>
  );
}
