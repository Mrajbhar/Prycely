import { Link } from 'react-router-dom';
import { StatusBadge } from '../OrdersPage';
import { useAuth } from '../../features/auth/useAuth';
import { useMyOrders } from '../../features/orders/useOrders';
import { useWishlist } from '../../features/wishlist/useWishlist';
import { formatPrice } from '../../lib/format';

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders } = useMyOrders();
  const { data: wishlist } = useWishlist();

  const orderCount = orders?.totalCount ?? orders?.items.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const recentOrder = orders?.items[0];
  const firstName = (user?.fullName ?? '').split(' ')[0] || 'there';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Hello, {firstName}</h1>
        <p className="text-xs text-muted sm:text-sm">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Orders" value={orderCount} to="/account/orders" />
        <StatTile label="Wishlist" value={wishlistCount} to="/account/wishlist" />
        <StatTile label="Addresses" value={0} to="/account/addresses" />
      </div>

      {/* recent order */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink">Recent order</h2>
          <Link to="/account/orders" className="text-[11px] font-bold text-accent hover:underline">
            View all →
          </Link>
        </div>

        {recentOrder ? (
          <Link
            to={`/orders/${recentOrder.id}`}
            className="flex items-center justify-between rounded-lg border border-line bg-surface p-4 transition-colors hover:border-ink-soft"
          >
            <div>
              <p className="price text-sm font-bold text-ink">{recentOrder.orderNumber}</p>
              <p className="mt-0.5 text-xs text-muted">
                {new Date(recentOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {' · '}
                {recentOrder.items.length} {recentOrder.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={recentOrder.status} />
              <span className="price text-sm font-bold text-accent">
                {formatPrice(recentOrder.total)}
              </span>
            </div>
          </Link>
        ) : (
          <div className="rounded-lg border border-line bg-surface p-6 text-center">
            <p className="text-sm text-muted">No orders yet.</p>
            <Link to="/products" className="mt-2 inline-block text-xs font-bold text-accent hover:underline">
              Start shopping →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-ink-soft"
    >
      <p className="price text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="price mt-1 text-2xl font-bold text-ink">{value}</p>
    </Link>
  );
}