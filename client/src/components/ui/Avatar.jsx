import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/cn';

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  default: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(name) {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];

  return initials.toUpperCase();
}

export function Avatar({ src, name, size = 'default', square = false, className }) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-surface-muted font-medium text-text-muted',
        square ? 'rounded-lg' : 'rounded-full',
        SIZE_CLASSES[size],
        className
      )}
    >
      {src && <AvatarPrimitive.Image src={src} alt={name ?? 'Avatar'} className="h-full w-full object-cover" />}
      <AvatarPrimitive.Fallback delayMs={src ? 400 : 0}>{getInitials(name)}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
