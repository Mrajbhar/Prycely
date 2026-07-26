import { Link } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useWishlist } from '../features/wishlist/useWishlist';

const GUTTER = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20';
const GRID =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8';

export default function WishlistPage() {
  const { data: products, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className={`w-full py-8 ${GUTTER}`}>
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart on anything you'd like to keep an eye on."
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
        <div className={`w-full py-6 ${GUTTER}`}>
          <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Your wishlist</h1>
          <p className="price mt-0.5 text-xs text-muted">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className={`w-full py-6 ${GUTTER}`}>
        <div className={GRID}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}