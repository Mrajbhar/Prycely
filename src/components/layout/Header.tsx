import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useLogout } from '../../features/auth/useAuth';
import { useCart } from '../../features/cart/useCart';
import { useCategories } from '../../features/categories/useCategories';
import { CartDrawer } from '../cart/CartDrawer';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';


export function Header() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const logout = useLogout();
  const { data: cart } = useCart();
  const { data: categories } = useCategories();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const onSaleActive = searchParams.get('onSale') === 'true';

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [hidden, setHidden] = useState(false);

  const itemCount = cart?.totalItems ?? 0;

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 120);
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-30 border-b border-line bg-surface shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
      >
        <div className="flex h-14 w-full items-center gap-5 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          
           <Logo /> 

          {/* Inline uppercase categories — the dense retail pattern */}
          <nav className="hidden items-center gap-5 lg:flex">
            <CatLink to="/products" label="All" slug="" active={!activeCategory && !onSaleActive} />
            {categories?.map((cat) => (
              <CatLink
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                label={cat.name}
                slug={cat.slug}
                active={activeCategory === cat.slug}
              />
            ))}
            <Link
              to="/products?onSale=true"
              className={`relative py-[18px] text-[11px] font-extrabold uppercase tracking-wide transition-colors ${
                onSaleActive ? 'text-accent' : 'text-accent/80 hover:text-accent'
              }`}
            >
              Sale
              {onSaleActive && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />}
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={onSearch} className="hidden flex-1 md:block lg:max-w-xl xl:max-w-2xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                ⌕
              </span>
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for products, brands and more"
                aria-label="Search products"
                className="w-full rounded border border-line bg-subtle py-2 pl-9 pr-3 text-xs transition-colors focus:border-ink focus:bg-surface"
              />
            </div>
          </form>

          {/* Icon actions with labels */}
          <div className="ml-auto flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <AccountMenu name={user?.fullName} isAdmin={isAdmin} onLogout={() => void logout()} />

                <IconAction to="/wishlist" label="Wishlist">
                  <HeartIcon />
                </IconAction>

                <BagButton itemCount={itemCount} onClick={() => setCartOpen(true)} />
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded text-ink hover:bg-brand-tint lg:hidden"
            >
              <Hamburger open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-line lg:hidden"
            >
              <div className="w-full space-y-4 px-4 py-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
                <form onSubmit={onSearch}>
                  <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search products"
                    aria-label="Search products"
                    className="w-full rounded border border-line bg-subtle px-3 py-2.5 text-sm focus:border-ink focus:bg-surface"
                  />
                </form>

                <nav className="grid grid-cols-2 gap-2">
                  <MobileChip to="/products" label="All" onClick={() => setMenuOpen(false)} />
                  {categories?.map((cat) => (
                    <MobileChip
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      label={cat.name}
                      onClick={() => setMenuOpen(false)}
                    />
                  ))}
                  <MobileChip
                    to="/products?onSale=true"
                    label="Sale"
                    accent
                    onClick={() => setMenuOpen(false)}
                  />
                </nav>

                {isAuthenticated && (
                  <nav className="flex flex-col border-t border-line pt-3">
                    <MobileLink to="/account" label="My account" onClick={() => setMenuOpen(false)} />
                    <MobileLink to="/wishlist" label="Wishlist" onClick={() => setMenuOpen(false)} />
                    <MobileLink to="/orders" label="Orders" onClick={() => setMenuOpen(false)} />
                    {isAdmin && <MobileLink to="/admin" label="Admin" onClick={() => setMenuOpen(false)} />}
                  </nav>
                )}

                <div className="border-t border-line pt-4">
                  {isAuthenticated ? (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        setMenuOpen(false);
                        void logout();
                      }}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" onClick={() => setMenuOpen(false)}>
                        <Button variant="secondary" fullWidth>
                          Sign in
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)}>
                        <Button fullWidth>Sign up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

/* ---------- inline category link ---------- */
function CatLink({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  slug: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`relative py-[18px] text-[11px] font-extrabold uppercase tracking-wide transition-colors ${
        active ? 'text-ink' : 'text-ink-soft hover:text-ink'
      }`}
    >
      {label}
      {active && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />}
    </Link>
  );
}

/* ---------- icon action with label ---------- */
function IconAction({
  to,
  label,
  children,
}: {
  to: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="hidden w-14 flex-col items-center gap-0.5 rounded py-1.5 text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink sm:flex"
    >
      {children}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}

/* ---------- account dropdown ---------- */
function AccountMenu({
  name,
  isAdmin,
  onLogout,
}: {
  name?: string;
  isAdmin: boolean;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-14 flex-col items-center gap-0.5 rounded py-1.5 text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink"
      >
        <UserIcon />
        <span className="text-[10px] font-bold">Profile</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-line bg-surface shadow-xl"
          >
            {name && (
              <div className="border-b border-line bg-subtle px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Hello</p>
                <p className="truncate text-sm font-semibold text-ink">{name}</p>
              </div>
            )}
            <MenuItem to="/account" label="My account" onClick={() => setOpen(false)} />
            <MenuItem to="/account/orders" label="Orders" onClick={() => setOpen(false)} />
            <MenuItem to="/account/wishlist" label="Wishlist" onClick={() => setOpen(false)} />
            {isAdmin && <MenuItem to="/admin" label="Admin dashboard" onClick={() => setOpen(false)} />}
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full border-t border-line px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-accent hover:bg-accent-tint"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-brand-tint hover:text-ink"
    >
      {label}
    </Link>
  );
}

/* ---------- bag button ---------- */
function BagButton({ itemCount, onClick }: { itemCount: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      className="relative ml-1 inline-flex items-center gap-1.5 rounded bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover"
    >
      <BagIcon />
      <span className="hidden sm:inline">Bag</span>
      <AnimatePresence mode="popLayout">
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="price grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-accent"
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ---------- mobile bits ---------- */
function MobileChip({
  to,
  label,
  accent,
  onClick,
}: {
  to: string;
  label: string;
  accent?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded border px-3 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-wide transition-colors ${
        accent
          ? 'border-accent bg-accent-tint text-accent'
          : 'border-line bg-surface text-ink hover:border-ink'
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end
      className={({ isActive }) =>
        `rounded px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'bg-brand-tint text-ink' : 'text-ink-soft hover:bg-brand-tint hover:text-ink'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="relative size-5">
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 0 : -5 }}
        className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current"
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current"
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? 0 : 5 }}
        className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current"
      />
    </div>
  );
}

/* ---------- icons ---------- */
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}