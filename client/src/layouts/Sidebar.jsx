import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_BY_ROLE } from '@/layouts/navigationConfig';
import { Logo } from '@/components/shared/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { useStudentDashboard } from '@/features/student/studentQueries';

const ROLE_LABELS = {
  student: 'Student',
  recruiter: 'Recruiter',
  admin: 'Administrator',
};

function NavItems({ collapsed, onNavigate }) {
  const { role } = useAuth();
  const { pathname } = useLocation();
  const items = NAVIGATION_BY_ROLE[role] ?? [];

  // When one item's `to` is a path-prefix of another's (e.g. "My Jobs" at
  // /recruiter/jobs vs "Post a Job" at /recruiter/jobs/new), only the item
  // with the longest matching `to` should be treated as active — otherwise
  // both light up together on the more specific route.
  const activeTo = items
    .map((item) => item.to)
    .filter((to) => pathname === to || pathname.startsWith(`${to}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label={`${ROLE_LABELS[role] ?? ''} navigation`}>
      {items.map(({ label, to, icon: Icon }) => {
        const isActive = to === activeTo;

        return (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              'group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-muted transition-colors duration-100',
              'hover:bg-surface-muted hover:text-text',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
              collapsed && 'justify-center px-0',
              isActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-100',
                isActive ? 'opacity-100' : 'opacity-0'
              )}
            />
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}

function ProfileCardBody({ user }) {
  const { role } = useAuth();
  const isStudent = role === 'student';
  const { data: dashboard } = useStudentDashboard({ enabled: isStudent });
  const profile = dashboard?.profile;

  if (isStudent && profile) {
    const meta = [profile.department, profile.batchYear ? `Batch ${profile.batchYear}` : null].filter(Boolean).join(' • ');

    return (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text">{user?.fullName}</p>
        <p className="truncate text-xs text-text-muted">{meta || user?.email}</p>
        {typeof dashboard?.profileCompletionPercentage === 'number' && (
          <p className="mt-0.5 truncate text-xs font-medium text-primary">
            {dashboard.profileCompletionPercentage}% profile complete
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-text">{user?.fullName}</p>
      <p className="truncate text-xs text-text-muted">{user?.email}</p>
    </div>
  );
}

function SidebarContent({ collapsed, onNavigate, onToggleCollapse }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center gap-2 border-b border-border px-4', collapsed && 'justify-center px-0')}>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <Logo size="sm" to={`/${role ?? ''}/dashboard`} />
            {role && <p className="mt-0.5 truncate pl-9 text-xs text-text-muted">{ROLE_LABELS[role]}</p>}
          </div>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      <NavItems collapsed={collapsed} onNavigate={onNavigate} />

      <div className={cn('border-t border-border p-3', collapsed && 'flex flex-col items-center')}>
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-1 py-1">
            <Avatar name={user?.fullName} size="sm" />
            <ProfileCardBody user={user} />
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className={cn(
            'flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-muted transition-colors duration-100',
            'hover:bg-surface-muted hover:text-text',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export function DesktopSidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface transition-[width] duration-150 lg:block',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  );
}

export function TabletSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[72px] shrink-0 border-r border-border bg-surface md:block lg:hidden">
      <SidebarContent collapsed />
    </aside>
  );
}

export function MobileSidebarDrawer({ open, onClose }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount className="md:hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-surface shadow-lg"
              >
                <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>
                <SidebarContent collapsed={false} onNavigate={onClose} />
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
