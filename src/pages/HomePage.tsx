import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CategoryGlyph, TagGlyph } from '../components/products/CategoryGlyph';
import { ProductCard } from '../components/products/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { useCategories } from '../features/categories/useCategories';
import { useCountdown } from '../features/products/useCountdown';
import { useProducts } from '../features/products/useProducts';
import { assetUrl } from '../lib/assetUrl';
import { formatPrice } from '../lib/format';

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const TICKER = [
  'Free shipping over ₹5,000',
  'Easy 7-day returns',
  '130+ products',
  'New arrivals weekly',
  'Secure checkout',
];

/** Full-width shell with responsive gutters. */
function Shell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 ${className}`}>{children}</div>
  );
}

const PRODUCT_GRID =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8';

export default function HomePage() {
  const { data: categories } = useCategories();
  const countdown = useCountdown(24);

  const { data: dealsData, isLoading: dealsLoading } = useProducts({
    onSale: true,
    pageSize: 8,
    sortBy: 'discount',
  });

  const { data: popularData, isLoading: popularLoading, isError } = useProducts({
    pageSize: 8,
    sortBy: 'rating',
  });

  const deals = dealsData?.items ?? [];
  const popular = popularData?.items ?? [];
  const heroPicks = deals.slice(0, 4);

  return (
    <>
      {/* ==================== Sale banner ==================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute -right-32 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-accent/45 blur-[110px] sm:size-[620px]" />
        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-accent/15 blur-[90px]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />

        <motion.div
          aria-hidden="true"
          initial={{ x: '-120%' }}
          animate={{ x: '340%' }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <Shell className="relative">
          <div className="flex flex-col items-start gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-10">
            <div className="max-w-lg">
              <motion.span
                custom={0}
                initial="hidden"
                animate="show"
                variants={rise}
                className="price inline-block rounded bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink"
              >
                Season sale · ends Sunday
              </motion.span>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="show"
                variants={rise}
                className="display mt-2.5 text-3xl font-bold leading-none text-white sm:text-4xl lg:text-5xl"
              >
                Up to 40% off
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="show"
                variants={rise}
                className="mt-2.5 text-xs leading-relaxed text-white/70 sm:text-sm"
              >
                Across 130+ products. Priced plainly, discounted honestly.
              </motion.p>

              <motion.div custom={3} initial="hidden" animate="show" variants={rise} className="mt-4">
                <Link
                  to="/products?onSale=true"
                  className="inline-block rounded bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] sm:text-sm"
                >
                  Shop the sale
                </Link>
              </motion.div>
            </div>

            {/* 2 cards on md, 4 on xl — fills wide screens */}
            <div className="hidden shrink-0 gap-3 md:flex">
              {heroPicks.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.45 }}
                  className={i >= 2 ? 'hidden xl:block' : ''}
                >
                  <Link
                    to={`/products/${product.slug}`}
                    className="block w-36 rounded-lg bg-white p-2.5 shadow-2xl transition-transform hover:-translate-y-1 lg:w-40"
                  >
                    <img
                      src={assetUrl(product.imageUrls[0])}
                      alt={product.name}
                      className="aspect-[3/4] w-full rounded object-cover"
                    />
                    <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-ink">
                      {product.name}
                    </p>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="price text-xs font-bold text-ink">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="price text-[9px] text-muted line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Shell>
      </section>

      {/* ==================== Category circles ==================== */}
      <section className="border-b border-line bg-surface">
        <Shell>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex justify-start gap-6 overflow-x-auto py-5 sm:justify-center sm:gap-10 lg:gap-16"
          >
            {categories?.map((cat) => (
              <motion.div key={cat.id} variants={item} className="shrink-0">
                <Link to={`/products?category=${cat.slug}`} className="group block text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-tint transition-transform group-hover:scale-105 sm:size-16">
                    <CategoryGlyph slug={cat.slug} />
                  </span>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-ink sm:text-[11px]">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            ))}

            <motion.div variants={item} className="shrink-0">
              <Link to="/products?onSale=true" className="group block text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink transition-transform group-hover:scale-105 sm:size-16">
                  <TagGlyph />
                </span>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-ink sm:text-[11px]">
                  Deals
                </p>
              </Link>
            </motion.div>
          </motion.div>
        </Shell>
      </section>

      {/* ==================== Ticker ==================== */}
      <section className="overflow-hidden bg-ink py-2">
        <div className="flex w-max animate-[ticker_30s_linear_infinite] gap-8 whitespace-nowrap sm:gap-12">
          {[...TICKER, ...TICKER, ...TICKER].map((msg, i) => (
            <span key={i} className="price text-[11px] font-semibold text-white/75 sm:text-xs">
              {msg} <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ==================== Deals ==================== */}
      <Shell className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="text-base font-bold uppercase tracking-tight text-ink sm:text-lg">
              Deals of the day
            </h2>
            <span className="price rounded bg-accent-tint px-2 py-0.5 text-[11px] font-bold tabular-nums text-accent">
              Ends {countdown}
            </span>
          </div>
          <Link to="/products?onSale=true" className="text-[11px] font-bold text-accent hover:underline">
            VIEW ALL &rarr;
          </Link>
        </div>

        {dealsLoading ? (
          <div className={`mt-4 ${PRODUCT_GRID}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className={`mt-4 ${PRODUCT_GRID}`}
          >
            {deals.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="mt-5 text-sm text-muted">No discounts running right now.</p>
        )}
      </Shell>

      {/* ==================== Category blocks ==================== */}
      <Shell className="pb-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-3 sm:grid-cols-3"
        >
          <motion.div variants={item}>
            <Link
              to="/products?category=electronics"
              className="group relative block overflow-hidden rounded-card bg-ink p-5 sm:p-6"
            >
              <div className="absolute -right-6 -top-6 size-28 rounded-full bg-accent/50 blur-2xl transition-all duration-500 group-hover:bg-accent/70" />
              <div className="relative">
                <p className="price text-[10px] font-bold uppercase tracking-wide text-gold">
                  Electronics
                </p>
                <p className="display mt-1 text-xl font-bold text-white sm:text-2xl">
                  Up to 40% off
                </p>
                <p className="mt-3 text-[11px] font-bold text-white/70">SHOP &rarr;</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link
              to="/products?category=clothing"
              className="block rounded-card bg-accent-tint p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
            >
              <p className="price text-[10px] font-bold uppercase tracking-wide text-accent">
                Clothing
              </p>
              <p className="display mt-1 text-xl font-bold text-accent-hover sm:text-2xl">
                Min 30% off
              </p>
              <p className="mt-3 text-[11px] font-bold text-accent">SHOP &rarr;</p>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link
              to="/products"
              className="block rounded-card border border-line bg-subtle p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
            >
              <p className="price text-[10px] font-bold uppercase tracking-wide text-muted">
                Home &amp; Books
              </p>
              <p className="display mt-1 text-xl font-bold text-ink sm:text-2xl">From ₹299</p>
              <p className="mt-3 text-[11px] font-bold text-ink">SHOP &rarr;</p>
            </Link>
          </motion.div>
        </motion.div>
      </Shell>

      {/* ==================== Popular picks ==================== */}
      <section className="border-t border-line bg-subtle py-8 sm:py-10">
        <Shell>
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold uppercase tracking-tight text-ink sm:text-lg">
              Popular picks
            </h2>
            <Link to="/products" className="text-[11px] font-bold text-accent hover:underline">
              VIEW ALL &rarr;
            </Link>
          </div>

          {popularLoading ? (
            <div className={`mt-4 ${PRODUCT_GRID}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className={`mt-4 ${PRODUCT_GRID}`}
            >
              {popular.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {isError && (
            <p className="mt-5 text-center text-sm text-muted">
              Products couldn&apos;t load. Check that the API is running.
            </p>
          )}
        </Shell>
      </section>
    </>
  );
}