import { Badge } from '@/components/ui/Badge';

const STATUS_VARIANT = {
  applied: 'info',
  under_review: 'warning',
  shortlisted: 'success',
  rejected: 'danger',
  selected: 'success',
};

const STATUS_LABEL = {
  applied: 'Applied',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  selected: 'Selected',
};

export function ApplicationStatusBadge({ status }) {
  return <Badge variant={STATUS_VARIANT[status] ?? 'default'}>{STATUS_LABEL[status] ?? status}</Badge>;
}
