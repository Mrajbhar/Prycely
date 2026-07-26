import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="border-b border-line pb-8"
      >
        {eyebrow && (
          <p className="price text-xs uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
        )}
        <h1 className="display mt-2 text-4xl font-bold leading-tight text-ink">{title}</h1>
        {intro && <p className="mt-4 text-base leading-relaxed text-ink-soft">{intro}</p>}
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Section heading used inside content pages. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-8 text-sm leading-relaxed text-ink-soft">{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="display text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}