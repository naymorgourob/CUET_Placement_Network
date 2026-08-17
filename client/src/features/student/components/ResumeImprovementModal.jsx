import { CheckCircle2, AlertTriangle, Lightbulb, Info, ListChecks } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

const PRIORITY_VARIANT = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

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

function hasMeaningfulContent(suggestions) {
  return (
    (suggestions.priorityImprovements?.length ?? 0) > 0 ||
    (suggestions.skillSuggestions?.length ?? 0) > 0 ||
    (suggestions.contentSuggestions?.length ?? 0) > 0 ||
    (suggestions.missingInformation?.length ?? 0) > 0 ||
    (suggestions.actionItems?.length ?? 0) > 0
  );
}

export function ResumeImprovementModal({ open, onOpenChange, suggestions, isLoading, isError, errorMessage, onRetry }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg" title="AI Resume Improvement">
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <SkeletonText lines={3} />
            <Skeleton className="h-6 w-full" />
            <SkeletonText lines={4} />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertTriangle className="h-8 w-8 text-danger" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-medium text-text">{errorMessage ?? "Couldn't load improvement suggestions."}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        ) : !suggestions ? null : !hasMeaningfulContent(suggestions) ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-medium text-text">Your resume is in good shape.</p>
            <p className="max-w-sm text-sm text-text-muted">No major improvements were identified.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {suggestions.overallAssessment && (
              <Section title="Overall Assessment">
                <p className="text-sm leading-relaxed text-text">{suggestions.overallAssessment}</p>
              </Section>
            )}

            {suggestions.priorityImprovements?.length > 0 && (
              <Section title="Priority Improvements">
                <div className="flex flex-col gap-2">
                  {suggestions.priorityImprovements.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={PRIORITY_VARIANT[item.priority] ?? 'default'}>{item.priority}</Badge>
                        <p className="text-sm font-medium text-text">{item.area}</p>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">
                        <span className="font-medium text-text-muted">Issue: </span>
                        {item.issue}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        <span className="font-medium text-text-muted">Suggestion: </span>
                        {item.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {suggestions.skillSuggestions?.length > 0 && (
              <Section title="Skill Suggestions">
                <div className="flex flex-col gap-2">
                  {suggestions.skillSuggestions.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                        <p className="text-sm font-medium text-text">{item.skill}</p>
                        <Badge variant="default" icon={null} className="ml-auto">
                          consider learning
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-text-secondary">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {suggestions.contentSuggestions?.length > 0 && (
              <Section title="Content Suggestions">
                <div className="flex flex-col gap-2">
                  {suggestions.contentSuggestions.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{item.section}</p>
                      <p className="mt-1 text-sm text-text-secondary">{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {suggestions.missingInformation?.length > 0 && (
              <Section title="Missing Information">
                <ListWithIcon items={suggestions.missingInformation} icon={Info} iconClassName="text-info" />
              </Section>
            )}

            {suggestions.actionItems?.length > 0 && (
              <Section title="Action Items">
                <ListWithIcon items={suggestions.actionItems} icon={ListChecks} iconClassName="text-success" />
              </Section>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
