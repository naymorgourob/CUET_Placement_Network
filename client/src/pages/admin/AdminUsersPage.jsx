import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/Table';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { UserStatusBadge } from '@/features/admin/components/UserStatusBadge';
import { useToast } from '@/hooks/useToast';
import { useAdminUsers, useSuspendUser, useReactivateUser } from '@/features/admin/adminQueries';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
];

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [userToReactivate, setUserToReactivate] = useState(null);

  const search = searchParams.get('search') ?? undefined;
  const role = searchParams.get('role') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isLoading, isFetching } = useAdminUsers({ page, limit: 10, search, role });
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const { showToast } = useToast();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!('page' in updates)) {
      next.set('page', '1');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParams({ search: searchInput });
  }

  function handleConfirmSuspend() {
    if (!userToSuspend) return;
    suspendUser.mutate(userToSuspend.userId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'User suspended.' });
        setUserToSuspend(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to suspend user.';
        showToast({ variant: 'danger', title: 'Suspend failed', description: message });
        setUserToSuspend(null);
      },
    });
  }

  function handleConfirmReactivate() {
    if (!userToReactivate || reactivateUser.isPending) return;
    reactivateUser.mutate(userToReactivate.userId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'User reactivated.' });
        setUserToReactivate(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to reactivate user.';
        showToast({ variant: 'danger', title: 'Reactivate failed', description: message });
        setUserToReactivate(null);
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h1 className="text-xl font-semibold text-text">User Management</h1>
        <p className="mt-1 text-sm text-text-muted">View and manage all platform users.</p>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </form>
        <div className="w-full sm:w-48">
          <Select
            placeholder="All roles"
            value={role ?? ''}
            onValueChange={(value) => updateParams({ role: value })}
            options={ROLE_OPTIONS}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columns={5} rows={5} />
          ) : users.length === 0 ? (
            <TableEmptyState colSpan={5} icon={Users} title="No users found" description="Try adjusting your search or filters." />
          ) : (
            users.map((targetUser) => (
              <TableRow key={targetUser.userId} className={isFetching ? 'opacity-60' : ''}>
                <TableCell className="font-medium text-text">{targetUser.fullName}</TableCell>
                <TableCell className="text-text-muted">{targetUser.email}</TableCell>
                <TableCell className="capitalize text-text-muted">{targetUser.role}</TableCell>
                <TableCell>
                  <UserStatusBadge isActive={targetUser.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  {targetUser.isActive ? (
                    <Button size="sm" variant="outline" leftIcon={UserX} onClick={() => setUserToSuspend(targetUser)}>
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" leftIcon={UserCheck} onClick={() => setUserToReactivate(targetUser)}>
                      Reactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}

      <ConfirmDialog
        open={Boolean(userToSuspend)}
        onOpenChange={(open) => !open && setUserToSuspend(null)}
        title="Suspend this user?"
        description="The user will be immediately signed out and unable to log in until reactivated. This action cannot be undone from the UI."
        confirmLabel="Suspend"
        variant="destructive"
        isLoading={suspendUser.isPending}
        onConfirm={handleConfirmSuspend}
      />

      <ConfirmDialog
        open={Boolean(userToReactivate)}
        onOpenChange={(open) => !open && !reactivateUser.isPending && setUserToReactivate(null)}
        title="Reactivate this user?"
        description="The user will immediately be able to log in again."
        confirmLabel="Reactivate"
        variant="primary"
        isLoading={reactivateUser.isPending}
        onConfirm={handleConfirmReactivate}
      />
    </div>
  );
}
