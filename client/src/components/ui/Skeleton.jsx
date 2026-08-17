import { cn } from '@/utils/cn';

export function Skeleton({ className }) {
  return <div className={cn('animate-shimmer rounded-md', className)} />;
}

export function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('h-4', index === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'default', className }) {
  const sizeClass = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  return <Skeleton className={cn('rounded-full', sizeClass, className)} />;
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-6', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-4" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 4 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
