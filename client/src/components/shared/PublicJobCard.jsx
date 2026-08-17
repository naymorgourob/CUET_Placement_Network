import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { cn } from '@/utils/cn';

const JOB_TYPE_LABELS = {
  'full-time': 'Full-time',
  internship: 'Internship',
  'part-time': 'Part-time',
};

function isDeadlineSoon(deadline) {
  if (!deadline) return false;
  const daysLeft = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
  return daysLeft >= 0 && daysLeft <= 7;
}

export function PublicJobCard({ job, compact = false }) {
  const deadlineSoon = isDeadlineSoon(job.deadline);

  return (
    <Link to={`/jobs/${job.jobId}`} className="block h-full">
      <Card
        interactive
        className={cn(
          'group h-full border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30',
          compact && 'h-full'
        )}
      >
        <CardBody className={cn('flex h-full flex-col', compact ? 'p-5' : 'p-6')}>
          <div className="flex items-start gap-3">
            <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} size={compact ? 'sm' : 'default'} />
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'truncate font-semibold text-text transition-colors group-hover:text-primary',
                  compact ? 'text-sm' : 'text-base'
                )}
              >
                {job.title}
              </h3>
              <p className="mt-0.5 truncate text-sm text-text-muted">{job.Company?.name ?? 'Confidential company'}</p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>

          {!compact && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-text-muted">{job.description}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              {formatRelativeTime(job.createdAt)}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <Badge variant="info" icon={null}>
              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
            </Badge>
            {job.Company?.industry && (
              <Badge variant="default" icon={null}>
                {job.Company.industry}
              </Badge>
            )}
            {deadlineSoon && (
              <Badge variant="warning">Closing soon</Badge>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
