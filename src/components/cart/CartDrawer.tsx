import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../features/cart/useCart';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { CartLine } from './CartLine';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { data: cart, isLoading } = useCart();

  // Escape closes; body doesn't scroll behind the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const isEmpty = !isLoading && (cart?.items.length ?? 0) === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-surface"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="display text-lg font-bold text-ink">
                Cart{cart && cart.totalItems > 0 && ` (${cart.totalItems})`}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-canvas"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5">
              {isLoading && (
                <div className="space-y-4 py-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              )}

              {isEmpty && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="display text-lg font-bold text-ink">Your cart is empty</p>
                  <p className="mt-2 text-sm text-muted">Add something you&apos;ll want to keep.</p>
                  <Link to="/products" onClick={onClose} className="mt-6">
                    <Button>Browse products</Button>
                  </Link>
                </div>
              )}

              {!isEmpty && cart && (
                <ul className="divide-y divide-line">
                  {cart.items.map((item) => (
                    <CartLine key={item.productId} item={item} onNavigate={onClose} />
                  ))}
                </ul>
              )}
            </div>

            {!isEmpty && cart && (
              <footer className="border-t border-line px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Subtotal</span>
                  <span className="price text-lg font-bold text-price">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted">
                  Shipping calculated at checkout. Free over {formatPrice(5000)}.
                </p>

                <Link to="/checkout" onClick={onClose} className="mt-4 block">
                  <Button fullWidth>Checkout</Button>
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}