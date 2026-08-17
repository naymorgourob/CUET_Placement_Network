import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/shared/DropdownMenu';
import { useAuth } from '@/hooks/useAuth';
import { getRoleHomePath } from '@/utils/roleRedirect';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/companies', label: 'Companies' },
  { to: '/resources', label: 'Resources' },
];

const ROLES_WITH_PROFILE_ROUTE = new Set(['student', 'recruiter']);
const SCROLL_THRESHOLD = 24;

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isElevated = isScrolled || isMenuOpen;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-200',
        isElevated
          ? 'border-b border-border bg-surface/95 backdrop-blur-md shadow-xs'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    <Avatar name={user?.fullName} size="sm" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-text">{user?.fullName}</p>
                    <p className="truncate text-xs capitalize text-text-muted">{role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate(getRoleHomePath(role))}>
                    <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Dashboard
                  </DropdownMenuItem>
                  {ROLES_WITH_PROFILE_ROUTE.has(role) && (
                    <DropdownMenuItem onSelect={() => navigate(`/${role}/profile`)}>
                      <User className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      Profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onSelect={handleLogout}>
                    <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Log In
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {isAuthenticated && <NotificationBell />}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile"
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={getRoleHomePath(role)}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                  >
                    Dashboard
                  </Link>
                  {ROLES_WITH_PROFILE_ROUTE.has(role) && (
                    <Link
                      to={`/${role}/profile`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                    >
                      Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex min-h-10 items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-surface-muted"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                  >
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-3 pt-1">
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
