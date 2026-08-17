import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </div>
  );
}

function EntryCard({ heading, subheading, meta, description }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-sm font-medium text-text">{heading}</p>
        {meta && <p className="text-xs text-text-muted">{meta}</p>}
      </div>
      {subheading && <p className="text-xs text-text-muted">{subheading}</p>}
      {description && <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>}
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

export function ResumeAnalysisModal({ open, onOpenChange, analysis, isLoading, isError, onRetry }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg" title="AI Resume Analysis">
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
            <p className="text-sm font-medium text-text">Couldn&apos;t load this analysis.</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        ) : !analysis ? null : (
          <div className="flex flex-col gap-6">
            <Section title="Summary">
              <p className="text-sm leading-relaxed text-text">{analysis.summary}</p>
            </Section>

            {analysis.skills?.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.map((skill) => (
                    <Badge key={skill} variant="info" icon={null}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {analysis.education?.length > 0 && (
              <Section title="Education">
                <div className="flex flex-col gap-2">
                  {analysis.education.map((entry, index) => (
                    <EntryCard
                      key={index}
                      heading={entry.degree}
                      subheading={[entry.institution, entry.field].filter(Boolean).join(' · ')}
                      meta={[entry.startYear, entry.endYear].filter(Boolean).join(' – ')}
                    />
                  ))}
                </div>
              </Section>
            )}

            {analysis.experience?.length > 0 && (
              <Section title="Experience">
                <div className="flex flex-col gap-2">
                  {analysis.experience.map((entry, index) => (
                    <EntryCard
                      key={index}
                      heading={entry.title}
                      subheading={entry.company}
                      meta={entry.duration}
                      description={entry.description}
                    />
                  ))}
                </div>
              </Section>
            )}

            {analysis.projects?.length > 0 && (
              <Section title="Projects">
                <div className="flex flex-col gap-2">
                  {analysis.projects.map((entry, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-sm font-medium text-text">{entry.name}</p>
                      {entry.description && (
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{entry.description}</p>
                      )}
                      {entry.technologies?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {entry.technologies.map((tech) => (
                            <Badge key={tech} variant="default" icon={null}>
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {analysis.certifications?.length > 0 && (
              <Section title="Certifications">
                <ListWithIcon items={analysis.certifications} icon={Sparkles} iconClassName="text-primary" />
              </Section>
            )}

            {analysis.strengths?.length > 0 && (
              <Section title="Strengths">
                <ListWithIcon items={analysis.strengths} icon={CheckCircle2} iconClassName="text-success" />
              </Section>
            )}

            {analysis.weaknesses?.length > 0 && (
              <Section title="Areas to improve">
                <ListWithIcon items={analysis.weaknesses} icon={AlertTriangle} iconClassName="text-warning" />
              </Section>
            )}

            {analysis.missingInformation?.length > 0 && (
              <Section title="Missing information">
                <ListWithIcon items={analysis.missingInformation} icon={Info} iconClassName="text-info" />
              </Section>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
