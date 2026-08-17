import { FileText, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { useApplicationDetails } from '@/features/student/studentQueries';
import { env } from '@/utils/env';

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      {children}
    </div>
  );
}

export function ApplicationDetailsModal({ applicationId, open, onOpenChange }) {
  const { data: application, isLoading } = useApplicationDetails(open ? applicationId : null);

  const resumeUrl = application?.Resume?.filePath
    ? `${env.uploadBaseUrl}/${application.Resume.filePath.replace(/^\/?/, '')}`
    : null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Application Details" size="default">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-[var(--radius-control)]" />
            <div className="flex-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="mt-1.5 h-4 w-1/3" />
            </div>
          </div>
          <SkeletonText lines={4} />
        </div>
      ) : !application ? (
        <p className="py-8 text-center text-sm text-text-muted">Unable to load this application.</p>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <CompanyLogo name={application.Job?.Company?.name} logoPath={application.Job?.Company?.logoPath} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-text">{application.Job?.title}</p>
              <p className="truncate text-sm text-text-muted">{application.Job?.Company?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Row label="Applied">
              <p className="text-sm text-text">{new Date(application.applied_at).toLocaleDateString()}</p>
            </Row>
            <Row label="Status">
              <ApplicationStatusBadge status={application.status} />
            </Row>
            {application.updatedAt && (
              <Row label="Last Updated">
                <p className="text-sm text-text">{new Date(application.updatedAt).toLocaleDateString()}</p>
              </Row>
            )}
          </div>

          <Row label="Resume Used">
            {application.Resume ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-text">
                    {application.Resume.originalFileName}
                  </span>
                </div>
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="shrink-0">
                    <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                      View Resume
                    </Button>
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No resume on file</p>
            )}
          </Row>

          {application.coverLetter && (
            <Row label="Cover Letter">
              <p className="max-h-40 overflow-y-auto whitespace-pre-line rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-text-secondary">
                {application.coverLetter}
              </p>
            </Row>
          )}
        </div>
      )}
    </Modal>
  );
}
