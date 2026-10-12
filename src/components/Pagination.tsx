import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageItems } from '../utils/coins';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const baseButton =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const idleButton =
  'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800';
const activeButton =
  'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900';

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${baseButton} ${idleButton}`}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={`${baseButton} ${item === page ? activeButton : idleButton}`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${baseButton} ${idleButton}`}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
