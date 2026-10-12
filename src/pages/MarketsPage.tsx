import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import CoinCard from '../components/CoinCard';
import Pagination from '../components/Pagination';
import { useCoins } from '../hooks/useCoins';
import { useWatchlist } from '../hooks/useWatchlist';
import {
  filterAndSortCoins,
  paginate,
  type SortOption,
} from '../utils/coins';

export const PAGE_SIZE = 12;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rank', label: 'Market cap rank' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'change-desc', label: '24h Change: High to Low' },
  { value: 'change-asc', label: '24h Change: Low to High' },
];

type Tab = 'all' | 'watchlist';

function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export default function MarketsPage() {
  const { data: coins = [], isPending, isError, refetch, isRefetching } =
    useCoins();
  const { watchlist, isWatched, toggleWatchlist } = useWatchlist();

  // Filters live in the URL so "Back" from a coin page restores them.
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const sortParam = params.get('sort');
  const sort: SortOption = isSortOption(sortParam) ? sortParam : 'rank';
  const tab: Tab = params.get('tab') === 'watchlist' ? 'watchlist' : 'all';
  const requestedPage = Math.max(1, Number(params.get('page')) || 1);

  const updateParams = (changes: Record<string, string | null>) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === '') next.delete(key);
          else next.set(key, value);
        }
        return next;
      },
      { replace: true }
    );
  };

  const visibleCoins = useMemo(() => {
    const source =
      tab === 'watchlist'
        ? coins.filter((coin) => watchlist.includes(coin.id))
        : coins;
    return filterAndSortCoins(source, search, sort);
  }, [coins, watchlist, tab, search, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleCoins.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const pageCoins = paginate(visibleCoins, page, PAGE_SIZE);
  const firstShown = (page - 1) * PAGE_SIZE + 1;
  const lastShown = firstShown + pageCoins.length - 1;

  const goToPage = (next: number) => {
    updateParams({ page: next === 1 ? null : String(next) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabButton = (value: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === value}
      onClick={() =>
        updateParams({ tab: value === 'all' ? null : value, page: null })
      }
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${
        tab === value
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Markets
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Live prices for the top 100 cryptocurrencies by market cap
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Token list"
          className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
        >
          {tabButton('all', 'All Tokens')}
          {tabButton('watchlist', `Watchlist (${watchlist.length})`)}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative sm:w-80">
          <span className="sr-only">Search cryptocurrencies</span>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Find assets"
            value={search}
            onChange={(e) => updateParams({ q: e.target.value, page: null })}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Sort cryptocurrencies</span>
          <select
            value={sort}
            onChange={(e) =>
              updateParams({
                sort: e.target.value === 'rank' ? null : e.target.value,
                page: null,
              })
            }
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </label>
      </div>

      {isPending ? (
        <div
          aria-label="Loading market data"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">
            Unable to load market data. The API may be rate limited, so try
            again in a minute.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-slate-900"
          >
            {isRefetching ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      ) : visibleCoins.length === 0 ? (
        <p className="py-20 text-center text-slate-500 dark:text-slate-400">
          {tab === 'watchlist' && watchlist.length === 0
            ? 'Your watchlist is empty. Star a coin to add it here.'
            : 'No cryptocurrencies found.'}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pageCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                watched={isWatched(coin.id)}
                onToggleWatchlist={toggleWatchlist}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {firstShown}–{lastShown} of {visibleCoins.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
