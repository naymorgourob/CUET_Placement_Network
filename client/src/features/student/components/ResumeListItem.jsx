import { FileText, CheckCircle2, MoreVertical, Star, Trash2, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/shared/DropdownMenu';

export function ResumeListItem({ resume, isCurrent, onSetCurrent, onDelete, onAnalyze, onImprove, isUpdating }) {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
            <FileText className="h-5 w-5 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">{resume.originalFileName}</p>
            <p className="text-xs text-text-muted">
              Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          {isCurrent && (
            <Badge variant="success" icon={CheckCircle2} className="shrink-0">
              Current
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Resume actions"
              disabled={isUpdating}
              className="shrink-0 rounded-lg p-2 text-text-muted hover:bg-surface-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onAnalyze(resume)}>
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
              Analyze Resume
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onImprove(resume)}>
              <TrendingUp className="h-4 w-4" strokeWidth={1.75} />
              Improve Resume
            </DropdownMenuItem>
            {!isCurrent && (
              <DropdownMenuItem onSelect={() => onSetCurrent(resume.resumeId)}>
                <Star className="h-4 w-4" strokeWidth={1.75} />
                Set as current
              </DropdownMenuItem>
            )}
            <DropdownMenuItem destructive onSelect={() => onDelete(resume)}>
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardBody>
    </Card>
  );
}
