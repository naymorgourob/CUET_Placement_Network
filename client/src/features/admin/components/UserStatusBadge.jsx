import { Badge } from '@/components/ui/Badge';

export function UserStatusBadge({ isActive }) {
  return isActive ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="danger">Suspended</Badge>
  );
}
