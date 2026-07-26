import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/products/ProductCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useWishlist } from '../../features/wishlist/useWishlist';

export default function AccountWishlistPage() {
  const { data: products, isLoading } = useWishlist();

  return (
    <div className="space-y-4">
      <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Your wishlist</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart on anything you'd like to keep an eye on."
          action={
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}