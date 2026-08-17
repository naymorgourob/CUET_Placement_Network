import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Breadcrumbs({ items, className }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.label}>
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />}
              <li className="flex items-center">
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="rounded-sm font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className="font-medium text-text">
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
