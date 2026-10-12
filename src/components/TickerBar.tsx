import { Activity } from 'lucide-react';
import type { Coin } from '../types/coin';
import { formatPrice } from '../utils/format';
import ChangeBadge from './ChangeBadge';

interface TickerBarProps {
  coins: Coin[];
}

export default function TickerBar({ coins }: TickerBarProps) {
  const items = coins.slice(0, 12);

  const renderItems = (hidden: boolean) =>
    items.map((coin) => (
      <span
        key={coin.id}
        aria-hidden={hidden || undefined}
        className="inline-flex shrink-0 items-center gap-2 border-r border-slate-200 px-4 text-xs dark:border-slate-800"
      >
        <span className="font-semibold uppercase text-slate-700 dark:text-slate-200">
          {coin.symbol}
        </span>
        <span className="font-mono text-slate-600 dark:text-slate-300">
          {formatPrice(coin.current_price)}
        </span>
        <ChangeBadge value={coin.price_change_percentage_24h} />
      </span>
    ));

  return (
    <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-2.5 dark:border-slate-800 dark:bg-slate-900">
      <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
        <Activity size={16} aria-hidden="true" className="text-green-600 dark:text-green-400" />
        Markets open 24/7
      </span>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        {items.length > 0 && (
          // Content is duplicated so the -50% translate loops seamlessly.
          <div className="ticker-track flex w-max">
            {renderItems(false)}
            {renderItems(true)}
          </div>
        )}
      </div>
    </div>
  );
}
