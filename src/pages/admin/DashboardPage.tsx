import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  useLowStock,
  useOrderStatus,
  useRevenue,
  useStats,
  useTopProducts,
} from '../../features/dashboard/useDashboard';
import { assetUrl } from '../../lib/assetUrl';
import { formatPrice } from '../../lib/format';

/* ------------------------------------------------------------------ *
 * If your API uses different field names, change them ONLY here.
 * These match the type errors you saw (RevenuePoint, OrderStatusCount,
 * TopProduct). Adjust a name below and the whole page follows.
 * ------------------------------------------------------------------ */
type RevenuePoint = { date: string; revenue: number };
type OrderStatusCount = { status: string; count: number };
type TopProduct = { productId: string; productName: string; unitsSold: number };
type LowStockItem = { id: string; name: string; stock: number; imageUrls: string[] };

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: revenue } = useRevenue(30);
  const { data: orderStatus } = useOrderStatus();
  const { data: lowStock } = useLowStock(10);
  const { data: topProducts } = useTopProducts(5);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
        <p className="text-xs text-muted sm:text-sm">
          {new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* ---------- Stat cards ---------- */}
      {statsLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Revenue"
            value={formatPrice(stats?.totalRevenue ?? 0)}
            hint="all time"
            tone="accent"
          />
          <StatCard label="Orders" value={String(stats?.totalOrders ?? 0)} hint="all time" tone="ink" />
          <StatCard
            label="Products"
            value={String(stats?.totalProducts ?? 0)}
            hint={`${lowStock?.length ?? 0} low on stock`}
            tone="ink"
          />
          <StatCard
            label="Customers"
            value={String(stats?.totalCustomers ?? 0)}
            hint="registered"
            tone="ink"
          />
        </div>
      )}

      {/* ---------- Revenue + status ---------- */}
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Revenue (last 30 days)">
          {revenue && revenue.length > 0 ? (
            <RevenueChart points={revenue as RevenuePoint[]} />
          ) : (
            <p className="py-8 text-center text-xs text-muted">No revenue data yet.</p>
          )}
        </Card>

        <Card title="Orders by status">
          {orderStatus ? (
            <StatusBars status={orderStatus as OrderStatusCount[]} />
          ) : (
            <Skeleton className="h-32" />
          )}
        </Card>
      </div>

      {/* ---------- Top products + low stock ---------- */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Top products">
          <ul className="divide-y divide-line">
            {(topProducts as TopProduct[] | undefined)?.map((p, i) => (
              <li key={p.productId} className="flex items-center gap-3 py-2.5">
                <span className="price w-5 text-sm font-bold text-muted">{i + 1}</span>
                <span className="flex-1 truncate text-sm text-ink">{p.productName}</span>
                <span className="price text-xs font-bold text-ink">{p.unitsSold} sold</span>
              </li>
            ))}
            {(!topProducts || topProducts.length === 0) && (
              <li className="py-6 text-center text-xs text-muted">No sales yet.</li>
            )}
          </ul>
        </Card>

        <Card
          title="Low stock"
          action={
            <Link to="/admin/products" className="text-xs font-bold text-accent hover:underline">
              Manage →
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {(lowStock as LowStockItem[] | undefined)?.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <img
                  src={assetUrl(p.imageUrls?.[0] ?? '')}
                  alt=""
                  className="size-8 rounded border border-line object-cover"
                />
                <span className="flex-1 truncate text-sm text-ink">{p.name}</span>
                <span
                  className={`price rounded px-2 py-0.5 text-[11px] font-bold ${
                    p.stock === 0 ? 'bg-danger-tint text-danger' : 'bg-accent-tint text-accent'
                  }`}
                >
                  {p.stock} left
                </span>
              </li>
            ))}
            {(!lowStock || lowStock.length === 0) && (
              <li className="py-6 text-center text-xs text-muted">Everything&apos;s well stocked.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* pieces                                                             */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: 'accent' | 'ink';
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="price text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className={`price mt-1.5 text-2xl font-bold ${tone === 'accent' ? 'text-accent' : 'text-ink'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">{hint}</p>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function RevenueChart({ points }: { points: RevenuePoint[] }) {
  const width = 600;
  const height = 140;
  const max = Math.max(...points.map((p) => p.revenue), 1);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((p, i) => ({
    x: i * step,
    y: height - (p.revenue / max) * (height - 10) - 5,
  }));

  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 140 }}
      >
        <path d={area} fill="var(--color-accent)" opacity="0.07" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span className="price">{points[0]?.date}</span>
        <span className="price">{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function StatusBars({ status }: { status: OrderStatusCount[] }) {
  const COLORS: Record<string, string> = {
    Delivered: 'var(--color-success)',
    Shipped: 'var(--color-accent)',
    Confirmed: 'var(--color-accent)',
    Pending: 'var(--color-muted)',
    Cancelled: 'var(--color-danger)',
  };
  const total = status.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="space-y-2.5">
      {status.map((row) => (
        <div key={row.status}>
          <div className="flex justify-between text-xs">
            <span className="text-ink-soft">{row.status}</span>
            <span className="price font-bold text-ink">{row.count}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(row.count / total) * 100}%`,
                background: COLORS[row.status] ?? 'var(--color-ink)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}