import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useSemanticSearch } from '../features/search/useSearch';

const GUTTER = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20';
const GRID =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  const { data, isLoading, isError } = useSemanticSearch(query);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(draft.trim() ? { q: draft.trim() } : {});
  };

  return (
    <>
      {/* compact header band */}
      <div className="border-b border-line bg-subtle">
        <div className={`w-full py-4 ${GUTTER}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="display text-xl font-bold text-ink sm:text-2xl">
              {query ? `Results for “${query}”` : 'Search'}
            </h1>
            {!isLoading && !isError && query && data && (
              <span className="price text-xs text-muted">
                {data.length} {data.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>

          <form onSubmit={runSearch} className="mt-3 flex max-w-xl gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Describe it in plain words — “something to keep coffee warm”"
              aria-label="Search products"
              className="w-full rounded border border-line bg-surface px-3 py-2 text-sm focus:border-ink"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className={`w-full py-6 ${GUTTER}`}>
        {isLoading && (
          <div className={GRID}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            title="Search is unavailable"
            description="The AI search service isn't responding. You can still browse by category and keyword."
            action={
              <Link to="/products">
                <Button>Browse products</Button>
              </Link>
            }
          />
        )}

        {!isLoading && !isError && query && data && data.length === 0 && (
          <EmptyState
            title="No close matches"
            description="Try describing it differently, or browse the full catalogue."
            action={
              <Link to={`/products?search=${encodeURIComponent(query)}`}>
                <Button variant="secondary">Try a keyword search instead</Button>
              </Link>
            }
          />
        )}

        {!isLoading && data && data.length > 0 && (
          <div className={GRID}>
            {data.map(({ product, score }) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <span className="price absolute left-2 top-2 z-10 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {Math.round(score * 100)}% match
                </span>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && !query && (
          <p className="text-center text-sm text-muted">
            Type something above to search across all 130+ products.
          </p>
        )}
      </div>
    </>
  );
}