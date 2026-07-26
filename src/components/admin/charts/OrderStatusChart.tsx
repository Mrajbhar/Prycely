import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { statusColors } from '../../../lib/chartTheme';
import type { OrderStatusCount } from '../../../types/dashboard';

export function OrderStatusChart({ data }: { data: OrderStatusCount[] }) {
  // Drop zero-count statuses so the donut isn't cluttered with empty slices.
  const slices = data.filter((d) => d.count > 0);

  if (slices.length === 0) {
    return <p className="grid h-full place-items-center text-sm text-muted">No orders yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={slices}
          dataKey="count"
          nameKey="status"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          stroke="none"
        >
          {slices.map((slice) => (
            <Cell key={slice.status} fill={statusColors[slice.status] ?? '#999'} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #e4e2ea', fontSize: 12 }}
          formatter={(value: number, name) => [value, name]}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}