import { Link } from 'react-router-dom';
import { CartLine } from '../components/cart/CartLine';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useCart } from '../features/cart/useCart';
import { formatPrice } from '../lib/format';

const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 99;

export default function CartPage() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Your cart is empty"
          description="Add something you'll want to keep."
          action={
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const shipping = cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = cart.subtotal + shipping;
  const hasStockIssue = cart.items.some((item) => item.quantity > item.availableStock);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="display text-3xl font-bold text-ink">Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line border-y border-line">
          {cart.items.map((item) => (
            <CartLine key={item.productId} item={item} />
          ))}
        </ul>

        <aside className="h-fit rounded-card border border-line bg-surface p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Summary
          </h2>

          <dl className="mt-4 space-y-2.5 border-b border-line pb-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="price text-ink">{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="price text-ink">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink">Total</span>
            <span className="price text-xl font-bold text-accent">{formatPrice(total)}</span>
          </div>

          {shipping > 0 && (
            <p className="mt-2 text-xs text-muted">
              Spend {formatPrice(FREE_SHIPPING_THRESHOLD - cart.subtotal)} more for free shipping.
            </p>
          )}

          {hasStockIssue && (
            <p className="mt-4 rounded-lg bg-danger-tint px-3 py-2 text-xs text-danger">
              Some items exceed available stock. Reduce quantities to continue.
            </p>
          )}

          <Link to="/checkout" className="mt-5 block">
            <Button fullWidth disabled={hasStockIssue}>
              Checkout
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}