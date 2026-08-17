import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <FileQuestion className="h-10 w-10 text-text-muted" strokeWidth={1.5} />
      <h1 className="text-lg font-semibold text-text">Page not found</h1>
      <p className="max-w-sm text-sm text-text-muted">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
