import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useMyOrders } from '../features/orders/useOrders';
import { assetUrl } from '../lib/assetUrl';
import { formatPrice } from '../lib/format';
import type { OrderStatus } from '../types/order';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-subtle text-ink-soft',
  Confirmed: 'bg-accent-tint text-accent',
  Shipped: 'bg-accent-tint text-accent',
  Delivered: 'bg-success/10 text-success',
  Cancelled: 'bg-danger-tint text-danger',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`price rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const { data, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="No orders yet"
          description="When you place an order, it'll show up here."
          action={
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-subtle">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Your orders</h1>
          <p className="price mt-0.5 text-xs text-muted">
            {data.items.length} {data.items.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <ul className="space-y-3">
          {data.items.map((order) => (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-ink-soft sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="price text-sm font-bold text-ink">{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' · '}
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="price text-base font-bold text-accent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* item thumbnails */}
                <div className="mt-3 flex items-center gap-2">
                  {order.items.slice(0, 5).map((item) => (
                    <img
                      key={item.productId}
                      src={assetUrl(item.imageUrl ?? '')}
                      alt={item.productName}
                      className="size-12 rounded border border-line object-cover"
                    />
                  ))}
                  {order.items.length > 5 && (
                    <span className="price text-xs text-muted">
                      +{order.items.length - 5} more
                    </span>
                  )}
                  <span className="price ml-auto text-[11px] font-bold text-accent">
                    View details &rarr;
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}