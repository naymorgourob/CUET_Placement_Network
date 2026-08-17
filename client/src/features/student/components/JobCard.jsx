import { Link } from 'react-router-dom';
import { MapPin, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { parseJobSkills } from '@/utils/parseJobSkills';
import { cn } from '@/utils/cn';

const JOB_TYPE_LABEL = {
  'full-time': 'Full Time',
  internship: 'Internship',
  'part-time': 'Part Time',
};

function matchTier(score) {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

export function JobCard({ job, hasApplied, isSaved, onToggleSave, isSaveLoading, matchScore, savedAt }) {
  const skills = parseJobSkills(job.requirements);

  function handleSaveClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onToggleSave?.(job.jobId, isSaved);
  }

  return (
    <Card interactive className="h-full">
      <Link to={`/student/jobs/${job.jobId}`} className="block h-full">
        <CardBody className="flex h-full flex-col">
          <div className="flex items-start gap-3">
            <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-text">{job.title}</h3>
              <p className="mt-0.5 truncate text-sm text-text-muted">{job.Company?.name ?? 'Unknown company'}</p>
            </div>
            {hasApplied && (
              <Badge variant="success" icon={CheckCircle2} className="shrink-0">
                Applied
              </Badge>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {job.location}
              </span>
            )}
            <Badge variant="default" icon={null} className="text-[11px]">
              {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
            </Badge>
            {typeof matchScore === 'number' && (
              <Badge variant={matchTier(matchScore)} icon={null} className="text-[11px]">
                {matchScore}% Match
              </Badge>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
                  +{skills.length - 4}
                </span>
              )}
            </div>
          )}

          {savedAt && (
            <p className="mt-2 text-xs text-text-muted">Saved {new Date(savedAt).toLocaleDateString()}</p>
          )}

          <div className="mt-auto flex items-center justify-between pt-4">
            <p className="text-xs text-text-muted">{job.createdAt ? formatRelativeTime(job.createdAt) : ''}</p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isSaveLoading}
                aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
                aria-pressed={isSaved}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors duration-100 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50',
                  isSaved && 'text-danger'
                )}
              >
                <Heart className="h-4 w-4" strokeWidth={1.75} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>

              <span className="flex items-center gap-1 pl-1 text-sm font-medium text-primary">
                View Job
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
}
