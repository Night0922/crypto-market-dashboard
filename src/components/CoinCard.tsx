import { Link } from 'react-router-dom';
import type { Coin } from '../types/coin';
import { formatCompactUsd, formatPercent, formatPrice } from '../utils/format';
import ChangeBadge from './ChangeBadge';
import Sparkline from './Sparkline';
import WatchlistButton from './WatchlistButton';

interface CoinCardProps {
  coin: Coin;
  watched: boolean;
  onToggleWatchlist: (id: string) => void;
}

export default function CoinCard({
  coin,
  watched,
  onToggleWatchlist,
}: CoinCardProps) {
  const change = coin.price_change_percentage_24h;
  const sparkline = coin.sparkline_in_7d?.price ?? [];
  const weekChange = coin.price_change_percentage_7d_in_currency;
  const trendPositive =
    sparkline.length > 1
      ? sparkline[sparkline.length - 1] >= sparkline[0]
      : (change ?? 0) >= 0;

  const stats = [
    { label: '7d Change', value: formatPercent(weekChange, { signed: true }) },
    { label: 'Market Cap', value: formatCompactUsd(coin.market_cap) },
    { label: 'Volume (24h)', value: formatCompactUsd(coin.total_volume) },
  ];

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={coin.image}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full"
            loading="lazy"
          />
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900 dark:text-white">
              {coin.name}
            </h2>
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
              {coin.symbol}
            </p>
          </div>
        </div>

        <WatchlistButton
          coinName={coin.name}
          watched={watched}
          onToggle={() => onToggleWatchlist(coin.id)}
        />
      </div>

      <hr className="my-4 border-slate-200 dark:border-slate-800" />

      <div className="flex items-end justify-between gap-4">
        <div className="shrink-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {coin.name} Price
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-slate-900 dark:text-white">
            {formatPrice(coin.current_price)}
          </p>
          <ChangeBadge value={change} className="mt-1 text-sm" />
        </div>

        <div className="h-16 w-1/2" aria-hidden="true">
          <Sparkline prices={sparkline} positive={trendPositive} />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 rounded-xl bg-slate-50 py-3 dark:bg-slate-800/50">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-3 ${
              index > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''
            }`}
          >
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {stat.label}
            </dt>
            <dd className="mt-1 font-mono text-sm font-medium text-slate-900 dark:text-white">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          to={`/coin/${coin.id}`}
          aria-label={`View ${coin.name} details`}
          className="rounded-full border border-slate-300 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
        >
          Details
        </Link>
        <a
          href={`https://www.coingecko.com/en/coins/${coin.id}#markets`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Buy ${coin.name} (opens exchange list on CoinGecko)`}
          className="rounded-full bg-slate-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Buy
        </a>
      </div>
    </article>
  );
}
