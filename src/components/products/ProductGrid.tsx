import { Skeleton } from '../ui/Skeleton';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/product';

const GRID =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7';

export function ProductGrid({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-line bg-surface">
            <Skeleton className="aspect-[3/4] rounded-none" />
            <div className="space-y-1.5 p-2.5">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={GRID}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}