import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Users, Pencil, XCircle, Trash2 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { JobFormModal } from '@/features/recruiter/components/JobFormModal';
import { useToast } from '@/hooks/useToast';
import {
  useJobDetails,
  useUpdateJob,
  useCloseJob,
  useDeleteJob,
  useApplicantsForJob,
} from '@/features/recruiter/recruiterQueries';

export function RecruiterJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { showToast } = useToast();

  const { data: job, isLoading } = useJobDetails(jobId);
  const { data: applicantsData } = useApplicantsForJob(jobId, { page: 1, limit: 1 });
  const updateJob = useUpdateJob();
  const closeJob = useCloseJob();
  const deleteJob = useDeleteJob();

  const applicationCount = applicantsData?.pagination?.total ?? 0;

  function handleFormSubmit(payload) {
    updateJob.mutate(
      { jobId, payload },
      {
        onSuccess: () => {
          showToast({ variant: 'success', title: 'Job updated successfully.' });
          setEditOpen(false);
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to update job.';
          showToast({ variant: 'danger', title: 'Update failed', description: message });
        },
      }
    );
  }

  function handleConfirmClose() {
    closeJob.mutate(jobId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Job closed.' });
        setCloseOpen(false);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to close job.';
        showToast({ variant: 'danger', title: 'Close failed', description: message });
        setCloseOpen(false);
      },
    });
  }

  function handleConfirmDelete() {
    if (deleteJob.isPending) return;
    deleteJob.mutate(jobId, {
      onSuccess: (result) => {
        const wasSoftDeleted = result?.status === 'removed';
        showToast({
          variant: 'success',
          title: wasSoftDeleted ? 'Job removed.' : 'Job deleted.',
          description: wasSoftDeleted
            ? 'This job had existing applications, so it was marked as removed instead of being permanently deleted.'
            : undefined,
        });
        setDeleteOpen(false);
        navigate('/recruiter/jobs');
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to delete job.';
        showToast({ variant: 'danger', title: 'Delete failed', description: message });
        setDeleteOpen(false);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/recruiter/jobs" className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Back to Jobs
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Card>
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-text">{job.title}</h1>
                <p className="mt-1 text-sm text-text-muted">{job.Company?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <JobStatusBadge status={job.status} />
                {job.status === 'open' && (
                  <>
                    <Button variant="outline" size="sm" leftIcon={Pencil} onClick={() => setEditOpen(true)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" leftIcon={XCircle} onClick={() => setCloseOpen(true)}>
                      Close Job
                    </Button>
                  </>
                )}
                {job.status !== 'removed' && (
                  <Button variant="destructive" size="sm" leftIcon={Trash2} onClick={() => setDeleteOpen(true)}>
                    Delete Job
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'No deadline'}
              </span>
              <Link
                to={`/recruiter/jobs/${jobId}/applicants`}
                className="flex items-center gap-1.5 font-medium text-primary hover:text-primary-hover"
              >
                <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {applicationCount} {applicationCount === 1 ? 'applicant' : 'applicants'}
              </Link>
              <Badge variant="default">{job.jobType}</Badge>
            </div>

            <div className="border-t border-border pt-5">
              <h2 className="text-sm font-semibold text-text">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-semibold text-text">Requirements</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{job.requirements}</p>
              </div>
            )}

            <div className="border-t border-border pt-5">
              <Link to={`/recruiter/jobs/${jobId}/applicants`}>
                <Button variant="outline" leftIcon={Users}>
                  View Applicants
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <JobFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        job={job}
        onSubmit={handleFormSubmit}
        isSubmitting={updateJob.isPending}
      />

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close this job?"
        description="Students will no longer be able to apply once this job is closed. This cannot be undone."
        confirmLabel="Close Job"
        variant="destructive"
        isLoading={closeJob.isPending}
        onConfirm={handleConfirmClose}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => !deleteJob.isPending && setDeleteOpen(open)}
        title="Delete this job?"
        description="This job will no longer be visible to students and cannot be restored to an open state. If it already has applications, it will be marked as removed instead of permanently deleted, so existing applicants keep their history."
        confirmLabel="Delete Job"
        variant="destructive"
        isLoading={deleteJob.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
