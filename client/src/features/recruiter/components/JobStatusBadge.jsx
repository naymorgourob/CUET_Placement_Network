import { Badge } from '@/components/ui/Badge';

const STATUS_VARIANT = {
  open: 'success',
  closed: 'default',
  removed: 'danger',
};

const STATUS_LABEL = {
  open: 'Open',
  closed: 'Closed',
  removed: 'Removed',
};

export function JobStatusBadge({ status }) {
  return <Badge variant={STATUS_VARIANT[status] ?? 'default'}>{STATUS_LABEL[status] ?? status}</Badge>;
}
