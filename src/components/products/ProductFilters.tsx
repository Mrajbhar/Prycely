import { useEffect, useState } from 'react';
import { useCategories } from '../../features/categories/useCategories';

export interface FilterState {
  categorySlug: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

export function ProductFilters({ value, onChange, onReset }: ProductFiltersProps) {
  const { data: categories } = useCategories();

  // Local state for the price inputs so typing feels smooth;
  // we only push to the URL when the user finishes (blur / Enter).
  const [minPrice, setMinPrice] = useState(value.minPrice);
  const [maxPrice, setMaxPrice] = useState(value.maxPrice);

  // Keep local price inputs in sync if the URL changes elsewhere (e.g. reset).
  useEffect(() => {
    setMinPrice(value.minPrice);
    setMaxPrice(value.maxPrice);
  }, [value.minPrice, value.maxPrice]);

  const selectCategory = (slug: string) => {
    onChange({ ...value, categorySlug: slug });
  };

  const commitPrices = () => {
    // Only fire if something actually changed.
    if (minPrice !== value.minPrice || maxPrice !== value.maxPrice) {
      onChange({ ...value, minPrice, maxPrice });
    }
  };

  const toggleInStock = () => {
    onChange({ ...value, inStockOnly: !value.inStockOnly });
  };

  const hasAny =
    value.categorySlug || value.minPrice || value.maxPrice || value.inStockOnly;

  return (
    <div className="space-y-8">
      {/* Category */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Category
        </legend>

        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="radio"
              name="category"
              checked={value.categorySlug === ''}
              onChange={() => selectCategory('')}
              className="accent-ink"
            />
            <span className={value.categorySlug === '' ? 'text-ink' : 'text-ink-soft'}>
              All products
            </span>
          </label>

          {categories?.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="category"
                checked={value.categorySlug === cat.slug}
                onChange={() => selectCategory(cat.slug)}
                className="accent-ink"
              />
              <span className={value.categorySlug === cat.slug ? 'text-ink' : 'text-ink-soft'}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Price
        </legend>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={commitPrices}
            onKeyDown={(e) => e.key === 'Enter' && commitPrices()}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-ink"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={commitPrices}
            onKeyDown={(e) => e.key === 'Enter' && commitPrices()}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-ink"
          />
        </div>
      </fieldset>

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={value.inStockOnly}
          onChange={toggleInStock}
          className="accent-ink"
        />
        <span className={value.inStockOnly ? 'text-ink' : 'text-ink-soft'}>In stock only</span>
      </label>

      {/* Reset */}
      {hasAny && (
        <button
          onClick={onReset}
          className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}