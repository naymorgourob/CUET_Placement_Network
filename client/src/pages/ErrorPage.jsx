import { AlertTriangle } from 'lucide-react';

export function ErrorPage({ onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <AlertTriangle className="h-10 w-10 text-danger" strokeWidth={1.5} />
      <h1 className="text-lg font-semibold text-text">Something went wrong</h1>
      <p className="max-w-sm text-sm text-text-muted">
        An unexpected error occurred. Please try again, or come back later.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Try again
        </button>
      )}
    </div>
  );
}
