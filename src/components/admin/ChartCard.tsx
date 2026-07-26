import type { ReactNode } from 'react';

/** A titled panel with a fixed-height body — ResponsiveContainer needs the height. */
export function ChartCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="mt-4 h-64">{children}</div>
    </section>
  );
}