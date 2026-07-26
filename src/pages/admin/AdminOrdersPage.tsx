import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../OrdersPage';
import { useAllOrders, useUpdateOrderStatus } from '../../features/orders/useAdminOrders';
import { formatPrice } from '../../lib/format';
import type { OrderStatus } from '../../types/order';
import { ApiError } from '../../types/api';

const FILTERS: Array<OrderStatus | 'All'> = [
  'All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled',
];

/** Mirrors the backend state machine. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
};

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllOrders(page, filter === 'All' ? undefined : filter);
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  const advance = (id: string, status: OrderStatus) =>
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.show(`Order marked ${status}.`),
        onError: (err) => toast.show(err instanceof ApiError ? err.message : 'Could not update.'),
      },
    );

  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold text-ink">Orders</h1>

      <div className="flex flex-wrap gap-1 rounded-lg border border-line p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? 'bg-brand text-white' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-3">
          {data?.items.map((order) => {
            const next = NEXT_STATUS[order.status] ?? [];
            return (
              <div key={order.id} className="rounded-card border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="price text-sm font-bold text-ink">{order.orderNumber}</p>
                    <p className="text-xs text-muted">
                      {order.userEmail} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="price text-sm font-bold text-price">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {next.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {next.map((status) => (
                      <Button
                        key={status}
                        variant={status === 'Cancelled' ? 'secondary' : 'primary'}
                        onClick={() => advance(order.id, status)}
                        disabled={updateStatus.isPending}
                        className="px-3 py-1.5 text-xs"
                      >
                        Mark {status}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {data && data.items.length === 0 && (
            <p className="py-12 text-center text-sm text-muted">No orders in this view.</p>
          )}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={!data.hasPrevious} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="price text-sm text-muted">{data.page} / {data.totalPages}</span>
          <Button variant="secondary" disabled={!data.hasNext} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}