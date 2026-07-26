import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../features/auth/useAuth';
import { useCart } from '../features/cart/useCart';
import { orderApi } from '../features/orders/orderApi';
import { addressSchema, type AddressInput } from '../features/orders/orderSchemas';
import { useRazorpay } from '../features/payment/useRazorpay';
import { formatPrice } from '../lib/format';
import { ApiError } from '../types/api';
import type { Address, Order } from '../types/order';

const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 99;

export default function CheckoutPage() {
  const { data: cart, isLoading } = useCart();
  const { user } = useAuth();
  const { startPayment, isPending: paying } = useRazorpay();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India' },
  });

  const launchPayment = (order: Order) => {
    startPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: user?.fullName ?? '',
      customerEmail: user?.email ?? '',
      onSuccess: () => {
        queryClient.setQueryData(['cart'], { id: '', items: [], subtotal: 0, totalItems: 0 });
        void queryClient.invalidateQueries({ queryKey: ['cart'] });
        void queryClient.invalidateQueries({ queryKey: ['orders'] });
        toast.show('Payment successful. Order confirmed.');
        navigate(`/orders/${order.id}`, { replace: true });
      },
      onFailure: (message) => {
        toast.show(message);
        navigate(`/orders/${order.id}`, { replace: true });
      },
    });
  };

  const createOrder = useMutation({
    mutationFn: (address: Address) => orderApi.create(address),
    onSuccess: (order: Order) => {
      setPendingOrder(order);
      launchPayment(order);
    },
  });

  const onSubmit = (values: AddressInput) => {
    if (pendingOrder) launchPayment(pendingOrder);
    else createOrder.mutate(values);
  };

  if (isLoading) return <Skeleton className="mx-auto my-12 h-96 max-w-4xl" />;
  if ((!cart || cart.items.length === 0) && !pendingOrder) return <Navigate to="/cart" replace />;

  const items = cart?.items ?? [];
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.compareAtPrice ?? item.unitPrice) * item.quantity,
    0,
  );
  const subtotal = cart?.subtotal ?? pendingOrder?.subtotal ?? 0;
  const savings = mrpTotal - subtotal;
  const shipping = pendingOrder?.shippingCost ?? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING);
  const total = pendingOrder?.total ?? subtotal + shipping;

  const serverError = createOrder.error instanceof ApiError ? createOrder.error.message : null;
  const busy = createOrder.isPending || paying;

  return (
    <>
      <div className="border-b border-line bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="display text-2xl font-bold text-ink">Checkout</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {pendingOrder && (
          <div className="mb-5">
            <Alert
              variant="info"
              message={`Order ${pendingOrder.orderNumber} is awaiting payment. Tap Pay to complete it.`}
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-ink">
              Delivery address
            </h2>

            {serverError && <Alert message={serverError} />}

            <Input label="Full name" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} disabled={!!pendingOrder} />
            <Input label="Address" autoComplete="address-line1" error={errors.line1?.message} {...register('line1')} disabled={!!pendingOrder} />
            <Input label="Apartment, suite (optional)" autoComplete="address-line2" error={errors.line2?.message} {...register('line2')} disabled={!!pendingOrder} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" autoComplete="address-level2" error={errors.city?.message} {...register('city')} disabled={!!pendingOrder} />
              <Input label="State" autoComplete="address-level1" error={errors.state?.message} {...register('state')} disabled={!!pendingOrder} />
              <Input label="PIN code" autoComplete="postal-code" error={errors.postalCode?.message} {...register('postalCode')} disabled={!!pendingOrder} />
              <Input label="Country" autoComplete="country-name" error={errors.country?.message} {...register('country')} disabled={!!pendingOrder} />
            </div>

            <Input label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} disabled={!!pendingOrder} />
          </form>

          <aside className="h-fit lg:sticky lg:top-20">
            <div className="rounded-lg border border-line bg-surface p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wide text-ink">
                Price details
              </h2>

              {items.length > 0 && (
                <ul className="mt-3 space-y-2 border-b border-line pb-3">
                  {items.map((item) => (
                    <li key={item.productId} className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
                        {item.productName}
                        <span className="price ml-1 text-[10px] text-muted">×{item.quantity}</span>
                      </span>
                      <span className="price shrink-0 text-xs text-ink">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <dl className="mt-3 space-y-2.5 border-b border-line pb-4 text-xs">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Total MRP</dt>
                  <dd className="price text-ink">{formatPrice(mrpTotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Discount</dt>
                    <dd className="price font-bold text-success">−{formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className={`price ${shipping === 0 ? 'font-bold text-success' : 'text-ink'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-ink">Total amount</span>
                <span className="price text-lg font-bold text-ink">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={busy}
                className="mt-4 w-full rounded bg-accent py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover disabled:bg-muted"
              >
                {busy ? 'Processing…' : `Pay ${formatPrice(total)}`}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted">
                <LockIcon />
                Secure payment via Razorpay
              </p>
            </div>

            {savings > 0 && (
              <p className="price mt-3 text-center text-xs font-bold text-success">
                You&apos;re saving {formatPrice(savings)} on this order
              </p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}