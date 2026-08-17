import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
  Bell,
  FileCheck2,
  Eye,
  Star,
  Trophy,
  XCircle,
  UserPlus,
  ShieldCheck,
  ShieldX,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { useAuth } from '@/hooks/useAuth';
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/features/notifications/notificationQueries';

const NOTIFICATION_ICONS = {
  APPLICATION_SUBMITTED: FileCheck2,
  APPLICATION_UNDER_REVIEW: Eye,
  APPLICATION_SHORTLISTED: Star,
  APPLICATION_SELECTED: Trophy,
  APPLICATION_REJECTED: XCircle,
  NEW_APPLICATION: FileCheck2,
  NEW_RECRUITER_REGISTRATION: UserPlus,
  RECRUITER_VERIFIED: ShieldCheck,
  RECRUITER_REJECTED: ShieldX,
};

function resolveNotificationRoute(notification, role) {
  if (notification.relatedEntityType === 'APPLICATION') {
    if (role === 'recruiter') {
      return `/recruiter/applications/${notification.relatedEntityId}`;
    }
    if (role === 'student') {
      return '/student/applications';
    }
  }

  if (notification.relatedEntityType === 'RECRUITER') {
    if (role === 'admin') {
      return '/admin/recruiters';
    }
    if (role === 'recruiter') {
      return '/recruiter/dashboard';
    }
  }

  return null;
}

function NotificationItem({ notification, role, onNavigate }) {
  const markAsRead = useMarkNotificationAsRead();
  const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;

  function handleClick() {
    if (!notification.isRead) {
      markAsRead.mutate(notification.notificationId);
    }

    const route = resolveNotificationRoute(notification, role);
    if (route) {
      onNavigate(route);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted',
        !notification.isRead && 'bg-primary/5'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          notification.isRead ? 'bg-surface-muted text-text-muted' : 'bg-primary/10 text-primary'
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          {!notification.isRead && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          )}
          <span className={cn('truncate text-sm', notification.isRead ? 'font-medium text-text' : 'font-semibold text-text')}>
            {notification.title}
          </span>
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">{notification.message}</span>
        <span className="mt-1 block text-[11px] text-text-muted">{formatRelativeTime(notification.createdAt)}</span>
      </span>
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();

  const { data: unreadData } = useUnreadCount();
  const { data, isLoading, isError, refetch } = useNotifications({ page: 1, limit: 20 });
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = unreadData?.unreadCount ?? 0;
  const notifications = data?.notifications ?? [];
  const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount);

  function handleNavigate(route) {
    setOpen(false);
    navigate(route);
  }

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-100 hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
              {badgeLabel}
            </span>
          )}
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={4}
          className="z-50 flex max-h-[28rem] w-[22rem] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-md"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-text">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {markAllAsRead.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <CheckCheck className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                )}
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[0, 1, 2].map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 animate-shimmer rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 animate-shimmer rounded" />
                      <div className="h-3 w-full animate-shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <p className="text-sm text-text-muted">Unable to load notifications.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-xs font-medium text-primary hover:text-primary-hover"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                <Bell className="h-6 w-6 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-1 text-sm font-medium text-text">You&apos;re all caught up.</p>
                <p className="text-xs text-text-muted">No new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.notificationId}
                    notification={notification}
                    role={role}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
