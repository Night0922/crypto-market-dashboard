import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ChangeBadge from '../components/ChangeBadge';
import PriceChart from '../components/PriceChart';
import WatchlistButton from '../components/WatchlistButton';
import { useCoinDetail, usePriceHistory } from '../hooks/useCoins';
import { useWatchlist } from '../hooks/useWatchlist';
import {
  formatCompactNumber,
  formatCompactUsd,
  formatPercent,
  formatPrice,
} from '../utils/format';

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
];

/** CoinGecko descriptions contain HTML; render them as plain text. */
function toPlainText(html: string): string {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}

const card =
  'rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900';

export default function CoinDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [days, setDays] = useState(7);
  const [expanded, setExpanded] = useState(false);
  const { isWatched, toggleWatchlist } = useWatchlist();

  const detail = useCoinDetail(id);
  const history = usePriceHistory(id, days);

  const description = useMemo(
    () => toPlainText(detail.data?.description.en ?? ''),
    [detail.data]
  );

  // Go back when we came from the list so its filters/page are kept.
  const goBack = () =>
    location.key === 'default' ? navigate('/') : navigate(-1);

  const backButton = (
    <button
      type="button"
      onClick={goBack}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back to markets
    </button>
  );

  if (detail.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8" aria-label="Loading coin details">
        {backButton}
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-5 h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (detail.isError) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8">
        {backButton}
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">
            Unable to load this coin. It may not exist, or the API is rate limited.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => detail.refetch()}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Retry
            </button>
            <Link
              to="/"
              className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium dark:border-slate-700"
            >
              All coins
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coin = detail.data;
  const market = coin.market_data;
  const homepage = coin.links.homepage.find(Boolean);

  const stats = [
    { label: 'Market Cap', value: formatCompactUsd(market.market_cap.usd) },
    { label: 'Volume (24h)', value: formatCompactUsd(market.total_volume.usd) },
    { label: '24h High', value: formatPrice(market.high_24h.usd) },
    { label: '24h Low', value: formatPrice(market.low_24h.usd) },
    { label: '7d Change', value: formatPercent(market.price_change_percentage_7d, { signed: true }) },
    { label: '30d Change', value: formatPercent(market.price_change_percentage_30d, { signed: true }) },
    { label: 'All-time High', value: formatPrice(market.ath.usd) },
    { label: 'All-time Low', value: formatPrice(market.atl.usd) },
    { label: 'Circulating Supply', value: formatCompactNumber(market.circulating_supply) },
    { label: 'Max Supply', value: market.max_supply ? formatCompactNumber(market.max_supply) : '∞' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      {backButton}

      <section className={`${card} flex flex-wrap items-center justify-between gap-5`}>
        <div className="flex items-center gap-4">
          <img src={coin.image.large} alt="" className="h-14 w-14 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {coin.name}
              </h1>
              <span className="text-sm uppercase text-slate-500 dark:text-slate-400">
                {coin.symbol}
              </span>
              {coin.market_cap_rank && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Rank #{coin.market_cap_rank}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <p className="font-mono text-3xl font-semibold text-slate-900 dark:text-white">
                {formatPrice(market.current_price.usd)}
              </p>
              <ChangeBadge value={market.price_change_percentage_24h} />
              <span className="text-xs text-slate-500 dark:text-slate-400">24h</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WatchlistButton
            coinName={coin.name}
            watched={isWatched(coin.id)}
            onToggle={() => toggleWatchlist(coin.id)}
          />
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Website
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>

      <section className={`${card} mt-5`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900 dark:text-white">Price chart</h2>
          <div
            role="group"
            aria-label="Chart range"
            className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
          >
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                aria-pressed={days === range.days}
                onClick={() => setDays(range.days)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  days === range.days
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {history.isPending ? (
          <div className="h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ) : history.isError ? (
          <div role="alert" className="flex h-80 flex-col items-center justify-center gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              Unable to load price history.
            </p>
            <button
              type="button"
              onClick={() => history.refetch()}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <PriceChart data={history.data} days={days} />
        )}
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className={card}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {description && (
        <section className={`${card} mt-5`}>
          <h2 className="mb-2 font-semibold text-slate-900 dark:text-white">
            About {coin.name}
          </h2>
          <p
            className={`whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300 ${
              expanded ? '' : 'line-clamp-4'
            }`}
          >
            {description}
          </p>
          {description.length > 400 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-2 text-sm font-medium text-slate-900 underline dark:text-white"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
