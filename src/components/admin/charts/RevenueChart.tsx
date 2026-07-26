import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartColors, compactCurrency, shortDate } from '../../../lib/chartTheme';
import { formatPrice } from '../../../lib/format';
import type { RevenuePoint } from '../../../types/dashboard';

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.brand} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chartColors.brand} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke={chartColors.line} />

        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={{ fontSize: 11, fill: chartColors.muted, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={{ stroke: chartColors.line }}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={compactCurrency}
          tick={{ fontSize: 11, fill: chartColors.muted, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          width={48}
        />

        <Tooltip
          cursor={{ stroke: chartColors.brand, strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${chartColors.line}`,
            fontSize: 12,
          }}
          labelFormatter={(label) => shortDate(String(label))}
          formatter={(value: number, name) => [
            name === 'revenue' ? formatPrice(value) : value,
            name === 'revenue' ? 'Revenue' : 'Orders',
          ]}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke={chartColors.brand}
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}