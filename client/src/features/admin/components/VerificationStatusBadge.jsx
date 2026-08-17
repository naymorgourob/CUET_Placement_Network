import { Badge } from '@/components/ui/Badge';

export function VerificationStatusBadge({ isVerified }) {
  return isVerified ? (
    <Badge variant="success">Verified</Badge>
  ) : (
    <Badge variant="warning">Unverified</Badge>
  );
}
