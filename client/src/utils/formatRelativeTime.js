const UNITS = [
  { limit: 3600, divisor: 60, suffix: 'm ago' },
  { limit: 86400, divisor: 3600, suffix: 'h ago' },
  { limit: 604800, divisor: 86400, suffix: 'd ago' },
];

export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  for (const unit of UNITS) {
    if (seconds < unit.limit) {
      return `${Math.floor(seconds / unit.divisor)}${unit.suffix}`;
    }
  }

  return date.toLocaleDateString();
}
