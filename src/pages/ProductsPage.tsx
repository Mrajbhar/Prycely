import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { CategoryGlyph } from '../components/products/CategoryGlyph';
import { Pagination } from '../components/products/Pagination';
import { ProductFilters, type FilterState } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { useCategories } from '../features/categories/useCategories';
import { useProducts } from '../features/products/useProducts';

const SORT_OPTIONS = [
  { value: 'newest', label: "What's new" },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Customer rating' },
  { value: 'name', label: 'Name A–Z' },
];

const EMPTY_FILTERS: FilterState = {
  categorySlug: '',
  minPrice: '',
  maxPrice: '',
  inStockOnly: false,
};

const GUTTER = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: categories } = useCategories();

  const page = Number(searchParams.get('page') ?? 1);
  const sortBy = searchParams.get('sortBy') ?? 'newest';
  const search = searchParams.get('search') ?? '';
  const onSale = searchParams.get('onSale') === 'true';

  const filters: FilterState = {
    categorySlug: searchParams.get('category') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    inStockOnly: searchParams.get('inStockOnly') === 'true',
  };

  const { data, isLoading, isError } = useProducts({
    page,
    pageSize: 28,
    sortBy,
    search: search || undefined,
    categorySlug: filters.categorySlug || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    inStockOnly: filters.inStockOnly || undefined,
    onSale: onSale || undefined,
  });

  const applyFilters = (next: FilterState) => {
    const params = new URLSearchParams(searchParams);
    next.categorySlug ? params.set('category', next.categorySlug) : params.delete('category');
    next.minPrice ? params.set('minPrice', next.minPrice) : params.delete('minPrice');
    next.maxPrice ? params.set('maxPrice', next.maxPrice) : params.delete('maxPrice');
    next.inStockOnly ? params.set('inStockOnly', 'true') : params.delete('inStockOnly');
    params.delete('page');
    setSearchParams(params);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(nextPage));
    setSearchParams(params);
  };

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', value);
    params.delete('page');
    setSearchParams(params);
  };

  const clearOnSale = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('onSale');
    params.delete('page');
    setSearchParams(params);
  };

  const resetAll = () => {
    applyFilters(EMPTY_FILTERS);
    clearOnSale();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const products = data?.items ?? [];
  const activeCategory = categories?.find((c) => c.slug === filters.categorySlug);
  const hasActiveFilters =
    filters.categorySlug || filters.minPrice || filters.maxPrice || filters.inStockOnly || onSale;

  const heading = search
    ? `Results for “${search}”`
    : onSale
      ? 'On sale'
      : activeCategory
        ? activeCategory.name
        : 'All products';

  return (
    <>
      {/* header band */}
      <div className="border-b border-line bg-subtle">
        <div className={`flex w-full flex-wrap items-center gap-4 py-6 ${GUTTER}`}>
          {activeCategory && (
            <motion.span
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-tint"
            >
              <CategoryGlyph slug={activeCategory.slug} />
            </motion.span>
          )}

          <div>
            <h1 className="display text-2xl font-bold text-ink sm:text-3xl">{heading}</h1>
            {data && (
              <p className="price mt-0.5 text-xs text-muted">
                {data.totalCount} {data.totalCount === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          {onSale && (
            <button
              onClick={clearOnSale}
              className="price ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white"
            >
              ON SALE
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>

      {/* category chips */}
      <div className="border-b border-line bg-surface">
        <div className={`flex w-full gap-2 overflow-x-auto py-3 ${GUTTER}`}>
          <Chip label="All" active={!filters.categorySlug && !onSale} onClick={resetAll} />
          {categories?.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              active={filters.categorySlug === cat.slug}
              onClick={() => applyFilters({ ...filters, categorySlug: cat.slug })}
            />
          ))}
        </div>
      </div>

      {/* body */}
      <div className={`w-full py-6 ${GUTTER}`}>
        <div className="grid gap-8 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr]">
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters value={filters} onChange={applyFilters} onReset={resetAll} />
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                className="lg:hidden"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                {filtersOpen ? 'Hide filters' : 'Filters'}
              </Button>

              <div className="ml-auto w-52">
                <Select
                  label=""
                  aria-label="Sort products"
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={(e) => setSort(e.target.value)}
                />
              </div>
            </div>

            {isError && (
              <EmptyState
                title="Products couldn't load"
                description="The server didn't respond. Check that the API is running, then reload."
              />
            )}

            {!isError && !isLoading && products.length === 0 && (
              <EmptyState
                title={onSale ? 'Nothing on sale right now' : 'Nothing matches those filters'}
                description={
                  onSale
                    ? 'Check back soon — discounts change often.'
                    : 'Try widening the price range, or clear the filters to see everything.'
                }
                action={hasActiveFilters ? <Button onClick={resetAll}>Clear filters</Button> : undefined}
              />
            )}

            {!isError && (isLoading || products.length > 0) && (
              <ProductGrid products={products} isLoading={isLoading} />
            )}

            {data && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                hasPrevious={data.hasPrevious}
                hasNext={data.hasNext}
                onChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-surface text-ink-soft hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}