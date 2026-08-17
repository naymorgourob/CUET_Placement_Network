import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const windowSize = 1;

  for (let page = 1; page <= totalPages; page += 1) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= windowSize;

    if (isEdge || isNearCurrent) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 0) {
    return null;
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-text-muted">
        Showing {start}–{end} of {total}
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-text-muted">
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? 'page' : undefined}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                pageNumber === page ? 'bg-primary text-white' : 'text-text hover:bg-surface-muted'
              )}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </nav>
    </div>
  );
}
