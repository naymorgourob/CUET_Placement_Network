import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { env } from '@/utils/env';

const SIZE_CLASSES = {
  sm: 'text-sm',
  default: 'text-base',
  lg: 'text-lg',
};

export function Logo({ to = '/', size = 'default', className }) {
  return (
    <Link
      to={to}
      className={cn(
        'flex min-w-0 items-center gap-2 font-display font-semibold tracking-tight text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm',
        SIZE_CLASSES[size],
        className
      )}
      title={env.appName}
    >
      <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white">
        C
      </span>
      <span className="truncate">{env.appName}</span>
    </Link>
  );
}
