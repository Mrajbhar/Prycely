import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartColors } from '../../../lib/chartTheme';
import type { TopProduct } from '../../../types/dashboard';

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  // Horizontal bars — product names read left-to-right, no rotated labels.
  const rows = data.map((p) => ({
    name: p.productName.length > 22 ? `${p.productName.slice(0, 22)}…` : p.productName,
    unitsSold: p.unitsSold,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={chartColors.line} />

        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: chartColors.muted, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: chartColors.inkSoft }}
          tickLine={false}
          axisLine={false}
          width={140}
        />

        <Tooltip
          cursor={{ fill: chartColors.brandTint }}
          contentStyle={{ borderRadius: 10, border: `1px solid ${chartColors.line}`, fontSize: 12 }}
          formatter={(value) => [value as number, 'Units sold']}
        />

        <Bar dataKey="unitsSold" fill={chartColors.brand} radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}