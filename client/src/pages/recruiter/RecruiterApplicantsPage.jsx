import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, FileText } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableEmptyState, TableLoadingState } from '@/components/ui/Table';
import { Pagination } from '@/components/shared/Pagination';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { ApplicantMatchCell } from '@/features/recruiter/components/ApplicantMatchCell';
import { useJobDetails, useApplicantsForJob } from '@/features/recruiter/recruiterQueries';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'selected', label: 'Selected' },
];

export function RecruiterApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status') ?? undefined;

  const { data: job } = useJobDetails(jobId);
  const { data, isLoading } = useApplicantsForJob(jobId, { page, limit: 10, status });

  const applicants = data?.applicants ?? [];
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

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/recruiter/jobs/${jobId}`} className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Back to Job
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h1 className="text-xl font-semibold text-text">Applicants{job ? ` for ${job.title}` : ''}</h1>
        <p className="mt-1 text-sm text-text-muted">Review and manage candidates who applied to this job.</p>
      </motion.div>

      <div className="w-full sm:w-56">
        <Select
          placeholder="All statuses"
          value={status ?? ''}
          onValueChange={(value) => updateParams({ status: value })}
          options={STATUS_OPTIONS}
        />
      </div>

      <Table>
        <TableHeader>
          <TableHead>Candidate</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>AI Match</TableHead>
          <TableHead>Applied Date</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columns={6} rows={5} />
          ) : applicants.length === 0 ? (
            <TableEmptyState
              colSpan={6}
              icon={Users}
              title="No applicants yet"
              description="Candidates who apply to this job will show up here."
            />
          ) : (
            applicants.map((application) => (
              <TableRow
                key={application.applicationId}
                onClick={() => navigate(`/recruiter/applications/${application.applicationId}`)}
              >
                <TableCell>
                  <Link
                    to={`/recruiter/applications/${application.applicationId}`}
                    className="font-medium text-text hover:text-primary"
                  >
                    {application.StudentProfile?.User?.fullName}
                  </Link>
                  <p className="text-xs text-text-muted">{application.StudentProfile?.User?.email}</p>
                </TableCell>
                <TableCell className="text-text-muted">{application.StudentProfile?.department ?? '—'}</TableCell>
                <TableCell className="text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {application.Resume?.originalFileName ?? '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <ApplicationStatusBadge status={application.status} />
                </TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <ApplicantMatchCell applicationId={application.applicationId} />
                </TableCell>
                <TableCell className="text-text-muted">
                  {new Date(application.applied_at).toLocaleDateString()}
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
    </div>
  );
}
