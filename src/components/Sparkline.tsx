import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  prices: number[];
  positive: boolean;
}

export default function Sparkline({ prices, positive }: SparklineProps) {
  const gradientId = useId();

  if (prices.length < 2) return null;

  // 7 days of hourly points is ~168; every 4th point keeps the shape and stays light.
  const data = prices
    .filter((_, index) => index % 4 === 0 || index === prices.length - 1)
    .map((price, index) => ({ index, price }));

  const color = positive ? '#16a34a' : '#dc2626';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
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
  );
}
