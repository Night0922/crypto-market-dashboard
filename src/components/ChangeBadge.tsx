import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { formatPercent } from '../utils/format';

interface ChangeBadgeProps {
  value: number | null | undefined;
  className?: string;
}

export default function ChangeBadge({ value, className = '' }: ChangeBadgeProps) {
  if (value === null || value === undefined) {
    return (
      <span className={`text-slate-500 dark:text-slate-400 ${className}`}>
        N/A
      </span>
    );
  }

  const positive = value >= 0;
  const Icon = positive ? CircleArrowUp : CircleArrowDown;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${
        positive
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
      } ${className}`}
    >
      <Icon size={14} aria-hidden="true" />
      {formatPercent(Math.abs(value))}
      <span className="sr-only">{positive ? 'up' : 'down'}</span>
    </span>
  );
}
