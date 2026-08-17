import { cn } from '@/utils/cn';

export function Card({ children, interactive = false, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface shadow-sm',
        interactive && 'cursor-pointer transition-shadow duration-150 hover:shadow-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn('border-b border-border p-6', className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-lg font-semibold text-text', className)}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={cn('mt-1 text-sm text-text-muted', className)}>{children}</p>;
}

export function CardBody({ children, className }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={cn('border-t border-border p-6', className)}>{children}</div>;
}
