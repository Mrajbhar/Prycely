import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { ReviewForm } from '../components/products/ReviewForm';
import { useCancelOrder, useOrder } from '../features/orders/useOrders';
import { assetUrl } from '../lib/assetUrl';
import { formatPrice } from '../lib/format';
import { ApiError } from '../types/api';
import { StatusBadge } from './OrdersPage';

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const toast = useToast();

  // Which product's review modal is open, if any.
  const [reviewFor, setReviewFor] = useState<{ id: string; name: string } | null>(null);

  if (isLoading) return <Skeleton className="mx-auto my-12 h-96 max-w-3xl" />;

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Order not found"
          description="This order doesn't exist, or it belongs to another account."
          action={
            <Link to="/orders">
              <Button>All orders</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Once it ships, cancellation is the courier's problem, not ours.
  const canCancel = order.status === 'Pending' || order.status === 'Confirmed';

  // Reviews only make sense once the item is in hand.
  const canReview = order.status === 'Delivered';

  const handleCancel = () => {
    cancelOrder.mutate(order.id, {
      onSuccess: () => toast.show('Order cancelled. Stock has been restored.'),
      onError: (error) =>
        toast.show(error instanceof ApiError ? error.message : 'Could not cancel the order'),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/orders" className="text-xs text-muted hover:text-ink">
        ← All orders
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="display text-3xl font-bold text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">
            Placed {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <span className="rounded-md bg-subtle px-2 py-1 text-xs text-ink-soft">
            Payment: {order.paymentStatus}
          </span>
        </div>
      </header>

      <ul className="divide-y divide-line border-b border-line">
        {order.items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4">
            <img
              src={assetUrl(item.imageUrl ?? '')}
              alt={item.productName}
              className="size-16 rounded-lg border border-line object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{item.productName}</p>
              <p className="price mt-0.5 text-xs text-muted">
                SKU {item.sku} · {formatPrice(item.unitPrice)} × {item.quantity}
              </p>

              {canReview && (
                <button
                  type="button"
                  onClick={() => setReviewFor({ id: item.productId, name: item.productName })}
                  className="mt-2 text-xs font-medium text-ink underline-offset-2 hover:underline"
                >
                  Write a review
                </button>
              )}
            </div>

            <span className="price shrink-0 text-sm font-bold text-accent">
              {formatPrice(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Shipping to
          </h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-ink-soft">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && (
              <>
                <br />
                {order.shippingAddress.line2}
              </>
            )}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
            <br />
            <span className="price">{order.shippingAddress.phone}</span>
          </address>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Total
          </h2>

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="price text-ink">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="price text-ink">
                {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="price text-lg font-bold text-accent">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {canCancel && (
        <div className="mt-10 border-t border-line pt-6">
          <Button variant="secondary" loading={cancelOrder.isPending} onClick={handleCancel}>
            Cancel order
          </Button>
          <p className="mt-2 text-xs text-muted">
            Cancelling returns every item to stock immediately.
          </p>
        </div>
      )}

      {/* Review modal — reuses the same ReviewForm from the product page. */}
      {reviewFor && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setReviewFor(null)}
        >
          <div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Reviewing: {reviewFor.name}
              </p>
              <button
                onClick={() => setReviewFor(null)}
                aria-label="Close"
                className="grid size-7 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>
            <ReviewForm productId={reviewFor.id} />
          </div>
        </div>
      )}
    </div>
  );
}