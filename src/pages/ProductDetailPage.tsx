import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { WishlistButton } from '../components/products/WishlistButton';
import { ReviewList } from '../components/reviews/ReviewList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Stars } from '../components/ui/Stars';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../features/auth/useAuth';
import { useAddToCart } from '../features/cart/useCart';
import { useCategories } from '../features/categories/useCategories';
import { useProduct, useSimilarProducts } from '../features/products/useProducts';
import { assetUrl } from '../lib/assetUrl';
import { discountPercent, formatPrice } from '../lib/format';
import { ApiError } from '../types/api';

const OFFERS = [
  'Free shipping on orders over ₹5,000',
  'Easy 7-day returns, no questions asked',
  'Secure payment — your details stay yours',
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');
  const { data: similar } = useSimilarProducts(product?.id);
  const { data: categories } = useCategories();

  const [imageIndex, setImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const toast = useToast();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Product not found"
          description="It may have been removed, or the link is wrong."
          action={
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  const categorySlug = categories?.find((c) => c.id === product.categoryId)?.slug ?? '';

  const handleAdd = () => {
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
    <>
      {/* ---------- Breadcrumb ---------- */}
      <div className="border-b border-line bg-subtle">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide sm:px-6 lg:px-10">
          <Link to="/products" className="shrink-0 text-muted hover:text-ink">
            All
          </Link>
          <span className="text-muted">/</span>
          {categorySlug ? (
            <Link
              to={`/products?category=${categorySlug}`}
              className="shrink-0 text-muted hover:text-ink"
            >
              {product.categoryName}
            </Link>
          ) : (
            <span className="shrink-0 text-muted">{product.categoryName}</span>
          )}
          <span className="text-muted">/</span>
          <span className="truncate text-ink">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
        {/* buy area capped narrower so the image + price stay close and readable */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* ---------- Gallery ---------- */}
          <div className="flex gap-3">
            {product.imageUrls.length > 1 && (
              <div className="flex shrink-0 flex-col gap-2">
                {product.imageUrls.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setImageIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`size-16 overflow-hidden rounded border-2 transition-colors ${
                      i === imageIndex ? 'border-ink' : 'border-line hover:border-muted'
                    }`}
                  >
                    <img src={assetUrl(url)} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <motion.div
              key={imageIndex}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative flex-1 overflow-hidden rounded-lg border border-line bg-subtle"
            >
              <img
                src={assetUrl(product.imageUrls[imageIndex])}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
              {discount && (
                <span className="price absolute left-3 top-3 rounded bg-accent px-2 py-1 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              )}
              <div className="absolute right-3 top-3">
                <WishlistButton productId={product.id} slug={product.slug} />
              </div>
            </motion.div>
          </div>

          {/* ---------- Buy block ---------- */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              {product.categoryName}
            </p>
            <h1 className="display mt-1 text-2xl font-bold leading-tight text-ink sm:text-3xl">
              {product.name}
            </h1>

            {product.reviewCount > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 rounded border border-line px-2 py-1">
                <Stars rating={product.averageRating} />
                <span className="price text-xs font-bold text-ink">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted">| {product.reviewCount} ratings</span>
              </div>
            )}

            {/* price */}
            <div className="mt-5 border-t border-line pt-4">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="price text-3xl font-bold text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="price text-base text-muted line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="price text-base font-bold text-success">{discount}% off</span>
                  </>
                )}
              </div>

              {savings > 0 && (
                <p className="price mt-1 text-xs font-bold text-success">
                  You save {formatPrice(savings)}
                </p>
              )}
              <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
            </div>

            {/* stock */}
            <div className="mt-4">
              {product.inStock ? (
                product.stock < 10 ? (
                  <p className="price text-xs font-bold text-accent">
                    Only {product.stock} left — order soon
                  </p>
                ) : (
                  <p className="price text-xs font-bold text-success">In stock</p>
                )
              ) : (
                <p className="price text-xs font-bold text-danger">Out of stock</p>
              )}
            </div>

            {/* add to bag */}
            <div className="mt-5">
              <button
                onClick={handleAdd}
                disabled={!product.inStock || addToCart.isPending}
                className="w-full rounded bg-accent py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-muted"
              >
                {addToCart.isPending ? 'Adding…' : product.inStock ? 'Add to bag' : 'Sold out'}
              </button>
            </div>

            {/* offers */}
            <div className="mt-6 rounded-lg border border-line bg-subtle p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink">
                Why buy from us
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {OFFERS.map((offer) => (
                  <li key={offer} className="flex gap-2 text-xs text-ink-soft">
                    <span className="text-success">✓</span>
                    {offer}
                  </li>
                ))}
              </ul>
            </div>

            {/* details */}
            <div className="mt-6 border-t border-line pt-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wide text-ink">
                Product details
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>

              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-muted">SKU</dt>
                <dd className="price text-ink">{product.sku}</dd>
                {Object.entries(product.attributes ?? {}).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-muted">{key}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* ---------- Reviews ---------- */}
        <ReviewList productId={product.id} />

        {/* ---------- Similar (full width of the shell) ---------- */}
        {similar && similar.length > 0 && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="text-lg font-bold uppercase tracking-tight text-ink">
              You may also like
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ---------- Sticky mobile buy bar ---------- */}
      <div className="sticky bottom-0 z-20 border-t border-line bg-surface p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="price text-lg font-bold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="price ml-2 text-xs text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock || addToCart.isPending}
            className="rounded bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wide text-white disabled:bg-muted"
          >
            {product.inStock ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </>
  );
}