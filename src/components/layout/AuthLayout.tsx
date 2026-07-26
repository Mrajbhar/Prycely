import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const PERKS = [
  'Free shipping over ₹5,000',
  'Easy 7-day returns',
  '130+ products, priced plainly',
  'Secure checkout',
];

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-2">
      {/* ---------- Form (first in DOM for keyboard order) ---------- */}
      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <h1 className="display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <p className="mt-7 text-center text-xs text-muted">{footer}</p>
        </motion.div>
      </div>

      {/* ---------- Brand panel ---------- */}
      <aside className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(140deg,#111_0%,#3a1e12_45%,#c2410c_100%)]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />

        <motion.div
          aria-hidden="true"
          initial={{ x: '-120%' }}
          animate={{ x: '320%' }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
  <span className="grid size-7 place-items-center rounded-md bg-white/15 text-white">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.3" fill="currentColor" />
    </svg>
  </span>
  <span className="display text-xl font-extrabold text-white">Prycely</span>
</Link>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="display max-w-sm text-4xl font-bold leading-tight text-white"
            >
              Everyday goods,
              <br />
              <span className="text-gold">priced plainly.</span>
            </motion.p>

            <ul className="mt-8 max-w-sm space-y-2.5">
              {PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-sm text-white/80"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-[10px] text-gold">
                    ✓
                  </span>
                  {perk}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="price text-[10px] uppercase tracking-[0.2em] text-white/40">
            Est. 2026 — Mumbai
          </p>
        </div>
      </aside>
    </div>
  );
}