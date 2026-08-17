import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <ShieldAlert className="h-10 w-10 text-warning" strokeWidth={1.5} />
      <h1 className="text-lg font-semibold text-text">Access denied</h1>
      <p className="max-w-sm text-sm text-text-muted">You don&apos;t have permission to view this page.</p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
