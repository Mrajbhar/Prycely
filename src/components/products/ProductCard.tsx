import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { useAddToCart } from '../../features/cart/useCart';
import { assetUrl } from '../../lib/assetUrl';
import { discountPercent, formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import { ApiError } from '../../types/api';
import { useToast } from '../ui/Toast';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const toast = useToast();
  const navigate = useNavigate();

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${product.slug}` } });
      return;
    }
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => toast.show(`${product.name} added to bag`),
        onError: (err) =>
          toast.show(err instanceof ApiError ? err.message : 'Could not add to bag'),
      },
    );
  };

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-300 hover:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.2)]"
      >
        {/* 3:4 image — taller than square, the retail standard */}
        <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
          <img
            src={assetUrl(product.imageUrls[0])}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />

          {discount && (
            <span className="price absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
              {discount}% OFF
            </span>
          )}

          <div className="absolute right-2 top-2">
            <WishlistButton productId={product.id} slug={product.slug} />
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 grid place-items-center bg-surface/80">
              <span className="rounded bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Sold out
              </span>
            </div>
          )}

          {/* quick add slides up on hover */}
          {product.inStock && (
            <button
              onClick={quickAdd}
              disabled={addToCart.isPending}
              aria-label={`Add ${product.name} to bag`}
              className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/90 py-2.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur transition-transform duration-300 ease-out hover:bg-accent group-hover:translate-y-0"
            >
              {addToCart.isPending ? 'Adding…' : 'Add to bag'}
            </button>
          )}
        </div>

        {/* tight info block */}
        <div className="flex flex-1 flex-col gap-0.5 p-2.5">
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-muted">
            {product.categoryName}
          </p>
          <h3 className="line-clamp-1 text-xs font-semibold text-ink">{product.name}</h3>

          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <span className="price text-sm font-bold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="price text-[10px] text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="price text-[10px] font-bold text-success">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {product.reviewCount > 0 && (
            <p className="price mt-1 inline-flex w-fit items-center gap-1 rounded bg-subtle px-1.5 py-0.5 text-[10px] text-ink-soft">
              ★ {product.averageRating.toFixed(1)}
              <span className="text-muted">| {product.reviewCount}</span>
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
}