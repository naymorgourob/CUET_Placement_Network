import { useState } from 'react';
import { cn } from '@/utils/cn';
import { env } from '@/utils/env';

const SIZE_CLASSES = {
  sm: 'h-6 w-6 text-[10px]',
  default: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-2xl',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return initials.toUpperCase();
}

export function CompanyLogo({ name, logoPath, size = 'default', className }) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = logoPath ? `${env.uploadBaseUrl}/${logoPath.replace(/^\/?/, '')}` : null;

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-control)] bg-surface-muted font-semibold text-text-muted',
        SIZE_CLASSES[size],
        className
      )}
      title={name}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt={name ?? 'Company logo'}
          className="h-full w-full object-contain p-1.5"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
