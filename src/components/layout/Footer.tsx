import { Link } from 'react-router-dom';
import { useCategories } from '../../features/categories/useCategories';
import { Logo } from '../ui/Logo';

const GUTTER = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20';

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & returns', to: '/shipping-returns' },
      { label: 'Your orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', to: '/terms' },
      { label: 'Privacy policy', to: '/privacy' },
    ],
  },
];

const TRUST = [
  { label: 'Free shipping', detail: 'On orders over ₹5,000' },
  { label: '7-day returns', detail: 'No questions asked' },
  { label: 'Secure payment', detail: 'Cards, UPI, netbanking' },
  { label: 'Priced plainly', detail: 'No fake discounts' },
];

export function Footer() {
  const { data: categories } = useCategories();

  return (
    <footer className="mt-auto">
      {/* trust strip */}
      <div className="border-y border-line bg-subtle">
        <div className={`grid w-full grid-cols-2 gap-6 py-6 sm:grid-cols-4 ${GUTTER}`}>
          {TRUST.map((t) => (
            <div key={t.label}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink">{t.label}</p>
              <p className="mt-0.5 text-[11px] text-muted">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* links */}
      <div className="bg-surface">
        <div className={`grid w-full gap-8 py-10 sm:grid-cols-2 lg:grid-cols-6 ${GUTTER}`}>
          {/* brand */}
          <div className="lg:col-span-2">
          <Logo className="[&_span:last-child]:text-xl" />
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
              Everyday goods — electronics, clothing, home and books — chosen carefully
              and priced plainly. No strike-through theatre.
            </p>
            <p className="price mt-4 text-[10px] uppercase tracking-[0.2em] text-muted">
              Est. 2026 — Mumbai
            </p>
          </div>

          {/* shop */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-ink">Shop</h3>
            <ul className="mt-3 space-y-2">
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="text-xs text-ink-soft transition-colors hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products?onSale=true"
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-ink">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-ink-soft transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* bottom bar */}
      <div className="bg-ink">
        <div
          className={`flex w-full flex-col items-center justify-between gap-2 py-4 sm:flex-row ${GUTTER}`}
        >
          <p className="text-[11px] text-white/50">
            © {new Date().getFullYear()} Prycely. All rights reserved.
          </p>
          <p className="price text-[10px] uppercase tracking-wide text-white/40">
            Made in Mumbai · Prices in ₹ INR
          </p>
        </div>
      </div>
    </footer>
  );
}