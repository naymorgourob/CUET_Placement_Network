import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </div>
  );
}

function ListWithIcon({ items, icon: Icon, iconClassName }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClassName}`} strokeWidth={1.75} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function scoreTier(score) {
  if (score >= 75) return { label: 'Strong Match', className: 'text-success' };
  if (score >= 50) return { label: 'Moderate Match', className: 'text-warning' };
  return { label: 'Limited Match', className: 'text-danger' };
}

function ScoreDisplay({ score }) {
  const tier = scoreTier(score);

  return (
    <div className="flex flex-col items-center gap-2 py-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">AI Match Score</p>
      <p className="font-display text-5xl font-semibold text-text">
        {score}
        <span className="text-2xl text-text-muted"> / 100</span>
      </p>
      <p className={cn('text-sm font-semibold', tier.className)}>{tier.label}</p>
      <div className="mt-1 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn('h-full rounded-full', score >= 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-danger')}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function JobMatchModal({ open, onOpenChange, match, isLoading, isError, needsAnalysis, onRetry }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg" title="AI Job Match">
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full" />
            <SkeletonText lines={4} />
          </div>
        ) : needsAnalysis ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-medium text-text">Analyze your resume to see how well you match this job.</p>
            <Link to="/student/resumes">
              <Button variant="outline" size="sm">
                Go to My Resumes
              </Button>
            </Link>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertTriangle className="h-8 w-8 text-danger" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-medium text-text">Couldn&apos;t check your match for this job.</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        ) : !match ? null : (
          <div className="flex flex-col gap-6">
            <ScoreDisplay score={match.matchScore} />

            {match.summary && (
              <Section title="Summary">
                <p className="text-sm leading-relaxed text-text">{match.summary}</p>
              </Section>
            )}

            {match.matchingSkills?.length > 0 && (
              <Section title="Matching Skills">
                <div className="flex flex-col gap-2">
                  {match.matchingSkills.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" strokeWidth={1.75} aria-hidden="true" />
                        <p className="text-sm font-medium text-text">{item.skill}</p>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {match.missingSkills?.length > 0 && (
              <Section title="Missing Skills">
                <div className="flex flex-col gap-2">
                  {match.missingSkills.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-4 w-4 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                        <p className="text-sm font-medium text-text">{item.skill}</p>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {match.matchingQualifications?.length > 0 && (
              <Section title="Matching Qualifications">
                <ListWithIcon items={match.matchingQualifications} icon={CheckCircle2} iconClassName="text-success" />
              </Section>
            )}

            {match.gaps?.length > 0 && (
              <Section title="Gaps">
                <ListWithIcon items={match.gaps} icon={AlertTriangle} iconClassName="text-warning" />
              </Section>
            )}

            {match.strengthsForThisJob?.length > 0 && (
              <Section title="Strengths for This Job">
                <ListWithIcon items={match.strengthsForThisJob} icon={Sparkles} iconClassName="text-primary" />
              </Section>
            )}

            {match.recommendations?.length > 0 && (
              <Section title="Recommendations">
                <ListWithIcon items={match.recommendations} icon={TrendingUp} iconClassName="text-info" />
              </Section>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
