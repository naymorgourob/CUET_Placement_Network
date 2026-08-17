import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/PageLoader';
import { getRoleHomePath } from '@/utils/roleRedirect';

export function GuestRoute() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <Outlet />;
}
