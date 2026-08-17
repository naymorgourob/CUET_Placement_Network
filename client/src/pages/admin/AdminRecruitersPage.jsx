import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, ShieldX, Building2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
import { VerificationStatusBadge } from '@/features/admin/components/VerificationStatusBadge';
import { useToast } from '@/hooks/useToast';
import { useAdminRecruiters, useVerifyRecruiter, useRejectRecruiter } from '@/features/admin/adminQueries';

const STATUS_OPTIONS = [
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
];

const PAGE_SIZE = 10;

export function AdminRecruitersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const { data: recruiters, isLoading } = useAdminRecruiters(status || undefined);
  const verifyRecruiter = useVerifyRecruiter();
  const rejectRecruiter = useRejectRecruiter();
  const { showToast } = useToast();

  const filteredRecruiters = useMemo(() => {
    const all = recruiters ?? [];
    if (!search) return all;
    const term = search.toLowerCase();
    return all.filter(
      (recruiter) =>
        recruiter.User?.fullName?.toLowerCase().includes(term) ||
        recruiter.User?.email?.toLowerCase().includes(term) ||
        recruiter.Company?.name?.toLowerCase().includes(term)
    );
  }, [recruiters, search]);

  const totalPages = Math.ceil(filteredRecruiters.length / PAGE_SIZE) || 1;
  const pagedRecruiters = filteredRecruiters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  function handleConfirmAction() {
    if (!pendingAction) return;
    const { recruiter, action } = pendingAction;
    const mutation = action === 'verify' ? verifyRecruiter : rejectRecruiter;

    mutation.mutate(recruiter.recruiterProfileId, {
      onSuccess: () => {
        showToast({
          variant: 'success',
          title: action === 'verify' ? 'Recruiter verified.' : 'Recruiter rejected.',
        });
        setPendingAction(null);
        setSelectedRecruiter(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to update recruiter status.';
        showToast({ variant: 'danger', title: 'Update failed', description: message });
        setPendingAction(null);
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h1 className="text-xl font-semibold text-text">Recruiter Verification</h1>
        <p className="mt-1 text-sm text-text-muted">Review and verify recruiter accounts.</p>
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
              placeholder="Search by name, email, or company..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </form>
        <div className="w-full sm:w-48">
          <Select
            placeholder="All statuses"
            value={status}
            onValueChange={(value) => updateParams({ status: value })}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columns={4} rows={5} />
          ) : pagedRecruiters.length === 0 ? (
            <TableEmptyState
              colSpan={4}
              icon={ShieldCheck}
              title="No recruiters found"
              description="Try adjusting your search or filters."
            />
          ) : (
            pagedRecruiters.map((recruiter) => (
              <TableRow key={recruiter.recruiterProfileId} onClick={() => setSelectedRecruiter(recruiter)}>
                <TableCell>
                  <p className="font-medium text-text">{recruiter.User?.fullName}</p>
                  <p className="text-xs text-text-muted">{recruiter.User?.email}</p>
                </TableCell>
                <TableCell className="text-text-muted">{recruiter.Company?.name ?? '—'}</TableCell>
                <TableCell>
                  <VerificationStatusBadge isVerified={recruiter.isVerified} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    {!recruiter.isVerified && (
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={ShieldCheck}
                        onClick={() => setPendingAction({ recruiter, action: 'verify' })}
                      >
                        Verify
                      </Button>
                    )}
                    {recruiter.isVerified && (
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={ShieldX}
                        onClick={() => setPendingAction({ recruiter, action: 'reject' })}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {filteredRecruiters.length > 0 && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filteredRecruiters.length}
          limit={PAGE_SIZE}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}

      <Modal
        open={Boolean(selectedRecruiter)}
        onOpenChange={(open) => !open && setSelectedRecruiter(null)}
        title="Recruiter Details"
        size="default"
        footer={
          selectedRecruiter && (
            <>
              {selectedRecruiter.isVerified ? (
                <Button
                  variant="destructive"
                  leftIcon={ShieldX}
                  onClick={() => setPendingAction({ recruiter: selectedRecruiter, action: 'reject' })}
                >
                  Reject
                </Button>
              ) : (
                <Button
                  variant="primary"
                  leftIcon={ShieldCheck}
                  onClick={() => setPendingAction({ recruiter: selectedRecruiter, action: 'verify' })}
                >
                  Verify
                </Button>
              )}
            </>
          )
        }
      >
        {selectedRecruiter && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text">{selectedRecruiter.User?.fullName}</p>
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {selectedRecruiter.User?.email}
                </p>
              </div>
              <VerificationStatusBadge isVerified={selectedRecruiter.isVerified} />
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-4 text-sm">
              <Building2 className="h-4 w-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-text">
                {selectedRecruiter.Company?.name ?? 'No company yet'}
                {selectedRecruiter.Company?.industry ? ` · ${selectedRecruiter.Company.industry}` : ''}
              </span>
            </div>
            <div className="text-sm text-text-muted">
              Account status: {selectedRecruiter.User?.isActive ? 'Active' : 'Suspended'}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={pendingAction?.action === 'verify' ? 'Verify this recruiter?' : 'Reject this recruiter?'}
        description={
          pendingAction?.action === 'verify'
            ? 'This recruiter will be able to create a company profile and post jobs.'
            : 'This recruiter will lose access to posting jobs until re-verified.'
        }
        confirmLabel={pendingAction?.action === 'verify' ? 'Verify' : 'Reject'}
        variant={pendingAction?.action === 'verify' ? 'primary' : 'destructive'}
        isLoading={verifyRecruiter.isPending || rejectRecruiter.isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
