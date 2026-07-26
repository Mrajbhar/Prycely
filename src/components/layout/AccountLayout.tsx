import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

const NAV = [
  { to: '/account', label: 'Overview', end: true, icon: GridIcon },
  { to: '/account/orders', label: 'Orders', end: false, icon: BoxIcon },
  { to: '/account/addresses', label: 'Addresses', end: false, icon: PinIcon },
  { to: '/account/wishlist', label: 'Wishlist', end: false, icon: HeartIcon },
  { to: '/account/profile', label: 'Profile', end: false, icon: UserIcon },
];

const GUTTER = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20';

export function AccountLayout() {
  const { user } = useAuth();
  const initials = (user?.fullName ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`w-full py-6 ${GUTTER}`}>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* ---------- Sidebar ---------- */}
        <aside className="h-fit rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-tint text-sm font-bold text-accent">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.fullName ?? 'Account'}</p>
              <p className="truncate text-[11px] text-muted">{user?.email ?? ''}</p>
            </div>
          </div>

          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map(({ to, label, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-ink-soft hover:bg-brand-tint hover:text-ink'
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* ---------- Content ---------- */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ---------- icons ---------- */
function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}