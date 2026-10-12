import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PricePoint } from '../types/coin';
import { formatCompactUsd, formatPrice } from '../utils/format';

interface PriceChartProps {
  data: PricePoint[];
  days: number;
}

function formatTick(time: number, days: number) {
  const date = new Date(time);
  return days <= 1
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: PricePoint }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-800">
      <p className="text-slate-500 dark:text-slate-400">
        {new Date(point.time).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </p>
      <p className="mt-0.5 font-mono font-semibold text-slate-900 dark:text-white">
        {formatPrice(point.price)}
      </p>
    </div>
  );
}

export default function PriceChart({ data, days }: PriceChartProps) {
  const gradientId = useId();
  const positive =
    data.length > 1 ? data[data.length - 1].price >= data[0].price : true;
  const color = positive ? '#16a34a' : '#dc2626';

  return (
    <div className="h-80 text-slate-500 dark:text-slate-400">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(time: number) => formatTick(time, days)}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            dataKey="price"
            domain={['auto', 'auto']}
            tickFormatter={(value: number) =>
              value < 1 ? formatPrice(value) : formatCompactUsd(value)
            }
            tick={{ fill: 'currentColor', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip content={ChartTooltip} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
