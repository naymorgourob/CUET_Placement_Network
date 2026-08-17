import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SkeletonTableRow } from '@/components/ui/Skeleton';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className={cn('w-full border-collapse text-sm', className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn('sticky top-0 z-10 bg-surface-muted', className)}>
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHead({ children, className }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border bg-surface">{children}</tbody>;
}

export function TableRow({ children, onClick, className }) {
  return (
    <tr
      onClick={onClick}
      className={cn('h-12', onClick && 'cursor-pointer hover:bg-surface-muted', className)}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }) {
  return <td className={cn('px-4 py-3 text-text', className)}>{children}</td>;
}

export function TableEmptyState({ colSpan, icon: Icon = Inbox, title = 'No results found', description }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <Icon className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-sm font-semibold text-text">{title}</p>
          {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
        </div>
      </td>
    </tr>
  );
}

export function TableLoadingState({ columns, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonTableRow key={index} columns={columns} />
      ))}
    </>
  );
}
