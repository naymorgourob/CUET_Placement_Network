import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useApplicantMatch, useGenerateApplicantMatch } from '@/features/recruiter/recruiterQueries';

function scoreVariant(score) {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

// Deliberately on-demand: each row only performs a cheap GET (existing
// cached result or a safe 404) on mount — it never calls Gemini just
// because the recruiter opened the applicant list. A real AI call only
// happens when this recruiter explicitly clicks "Check Match" for this
// specific applicant. See docs/Feature08_AIJobMatchScore.md §11.
export function ApplicantMatchCell({ applicationId }) {
  const { data: match, isLoading, error } = useApplicantMatch(applicationId);
  const generateMatch = useGenerateApplicantMatch();

  const notAnalyzed = error?.response?.status === 409;
  const notYetChecked = error?.response?.status === 404;
  const result = match ?? generateMatch.data;

  function handleCheck(event) {
    event.stopPropagation();
    generateMatch.mutate(applicationId);
  }

  if (isLoading) {
    return <span className="text-xs text-text-muted">…</span>;
  }

  if (result) {
    return <Badge variant={scoreVariant(result.matchScore)}>{result.matchScore}%</Badge>;
  }

  if (notAnalyzed) {
    return <span className="text-xs text-text-muted">Not analyzed</span>;
  }

  if (notYetChecked || !match) {
    return (
      <button
        type="button"
        onClick={handleCheck}
        disabled={generateMatch.isPending}
        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generateMatch.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
        )}
        Check Match
      </button>
    );
  }

  return <span className="text-xs text-text-muted">—</span>;
}
