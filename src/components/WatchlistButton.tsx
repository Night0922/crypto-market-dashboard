import { Star } from 'lucide-react';

interface WatchlistButtonProps {
  coinName: string;
  watched: boolean;
  onToggle: () => void;
}

export default function WatchlistButton({
  coinName,
  watched,
  onToggle,
}: WatchlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={watched}
      aria-label={`${watched ? 'Remove' : 'Add'} ${coinName} ${
        watched ? 'from' : 'to'
      } watchlist`}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Star
        size={14}
        aria-hidden="true"
        className={watched ? 'fill-amber-400 text-amber-400' : ''}
      />
      Watchlist
    </button>
  );
}
