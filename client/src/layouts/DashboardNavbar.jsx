import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shared/DropdownMenu';

const ROLES_WITH_PROFILE_ROUTE = new Set(['student', 'recruiter']);

export function DashboardNavbar({ onOpenSidebar }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface md:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="flex-1" />

      <NotificationBell />
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface md:hidden"
          >
            <Avatar name={user?.fullName} size="sm" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-text">{user?.fullName}</p>
            <p className="truncate text-xs text-text-muted">{role}</p>
          </div>
          <DropdownMenuSeparator />
          {ROLES_WITH_PROFILE_ROUTE.has(role) && (
            <DropdownMenuItem onSelect={() => navigate(`/${role}/profile`)}>
              <User className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem destructive onSelect={handleLogout}>
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
